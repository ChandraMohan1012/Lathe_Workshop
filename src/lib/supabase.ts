import { createClient } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from './supabase-browser';
import { Project, LiveJob, Enquiry, WorkshopSettings } from '@/types';
import { mockProjects, mockLiveJobs, mockEnquiries, initialSettings } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Public read-only client with zero-caching for real-time freshness
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            cache: 'no-store',
          });
        },
      },
    })
  : null;


// Helper: Get authenticated Supabase client for client-side write calls
export function getAuthClient() {
  if (typeof window !== 'undefined' && isSupabaseConfigured) {
    return createSupabaseBrowserClient();
  }
  return supabase;
}

// ==========================================
// DB MAPPERS (camelCase <-> snake_case)
// ==========================================
function mapProjectFromDb(row: any): Project {
  return {
    id: String(row.id),
    slug: row.slug ?? `project-${row.id}`,
    title: row.title ?? '',
    category: row.category ?? 'Precision Turning',
    material: row.material ?? '',
    tolerance: row.tolerance ?? '±0.005mm',
    quantity: row.quantity ?? '',
    completionDate: row.completion_date ?? row.completionDate ?? new Date().toISOString().split('T')[0],
    clientIndustry: row.client_industry ?? row.clientIndustry ?? 'General Engineering',
    image: row.image ?? '/images/brass-components.png',
    description: row.description ?? '',
    specs: Array.isArray(row.specs) ? row.specs : [],
    challenge: row.challenge ?? undefined,
    solution: row.solution ?? undefined,
    featured: Boolean(row.featured),
  };
}

function mapProjectToDb(p: Partial<Project>): Record<string, any> {
  const dbRow: Record<string, any> = {};
  if (p.slug !== undefined) dbRow.slug = p.slug;
  if (p.title !== undefined) dbRow.title = p.title;
  if (p.category !== undefined) dbRow.category = p.category;
  if (p.material !== undefined) dbRow.material = p.material;
  if (p.tolerance !== undefined) dbRow.tolerance = p.tolerance;
  if (p.quantity !== undefined) dbRow.quantity = p.quantity;
  if (p.completionDate !== undefined) dbRow.completion_date = p.completionDate;
  if (p.clientIndustry !== undefined) dbRow.client_industry = p.clientIndustry;
  if (p.image !== undefined) dbRow.image = p.image;
  if (p.description !== undefined) dbRow.description = p.description;
  if (p.specs !== undefined) dbRow.specs = p.specs;
  if (p.challenge !== undefined) dbRow.challenge = p.challenge;
  if (p.solution !== undefined) dbRow.solution = p.solution;
  if (p.featured !== undefined) dbRow.featured = p.featured;
  dbRow.updated_at = new Date().toISOString();
  return dbRow;
}

function mapLiveJobFromDb(row: any): LiveJob {
  return {
    id: String(row.id),
    bayNumber: row.bay_number ?? row.bayNumber ?? '',
    jobTitle: row.job_title ?? row.jobTitle ?? '',
    material: row.material ?? '',
    tolerance: row.tolerance ?? '',
    progress: Number(row.progress ?? 0),
    status: row.status ?? 'In Progress',
    startedTime: row.started_time ?? row.startedTime ?? '',
    estimatedCompletion: row.estimated_completion ?? row.estimatedCompletion ?? '',
    technician: row.technician ?? '',
    partReference: row.part_reference ?? row.partReference ?? '',
  };
}

function mapEnquiryFromDb(row: any): Enquiry {
  return {
    id: String(row.id),
    name: row.name ?? '',
    email: row.email ?? '',
    phone: row.phone ?? '',
    company: row.company ?? undefined,
    serviceType: row.service_type ?? row.serviceType ?? 'General Machining',
    message: row.message ?? '',
    drawingUrl: row.drawing_url ?? row.drawingUrl ?? undefined,
    status: row.status ?? 'New',
    createdAt: row.created_at ? new Date(row.created_at).toLocaleString() : new Date().toLocaleString(),
  };
}

// ==========================================
// 1. PROJECTS CRUD
// ==========================================
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured || !supabase) return mockProjects;
  try {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) return mockProjects;

    // Sort newest first
    const sorted = [...(data || [])].sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
    const dbProjects = sorted.map(mapProjectFromDb);

    // In demo mode: fill empty DB with mocks for a full showcase
    if (isDemoMode) {
      if (dbProjects.length === 0) return mockProjects;
      const existingSlugs = new Set(dbProjects.map((p) => p.slug));
      const existingIds = new Set(dbProjects.map((p) => p.id));
      const remainingMock = mockProjects.filter((m) => !existingSlugs.has(m.slug) && !existingIds.has(m.id));
      return [...dbProjects, ...remainingMock];
    }

    // Production: return only real DB data; fall back to mocks only if DB is completely empty
    return dbProjects.length > 0 ? dbProjects : mockProjects;
  } catch (err) {
    return mockProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id) || null;
}

export async function createProject(projectData: Omit<Project, 'id'>): Promise<{ success: boolean; id: string; error?: string }> {
  const newId = `proj-${Date.now()}`;
  const dbPayload = mapProjectToDb(projectData);

  if (!isSupabaseConfigured) {
    // Demo / offline: persist in-memory only
    const newProject = { ...projectData, id: newId };
    mockProjects.unshift(newProject);
    return { success: true, id: newId };
  }

  try {
    const client = getAuthClient();
    if (!client) throw new Error('Supabase client uninitialized');

    const { data, error } = await client.from('projects').insert([dbPayload]).select();
    if (error) {
      return { success: false, id: '', error: `Database Error: ${error.message}` };
    }
    const createdProj = mapProjectFromDb(data?.[0] || { ...projectData, id: newId });
    // Do NOT push into mockProjects when Supabase is configured — DB is the source of truth
    return { success: true, id: createdProj.id };
  } catch (err: any) {
    return { success: false, id: '', error: err?.message || 'Database insert failed' };
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<{ success: boolean; error?: string }> {
  const idx = mockProjects.findIndex((p) => p.id === id);
  if (idx !== -1) {
    mockProjects[idx] = { ...mockProjects[idx], ...updates };
  }

  if (isSupabaseConfigured) {
    try {
      const client = getAuthClient();
      if (!client) throw new Error('Supabase client uninitialized');

      const dbPayload = mapProjectToDb(updates);
      const { error } = await client.from('projects').update(dbPayload).eq('id', id);
      if (error) {
        return { success: false, error: `Database Update Error: ${error.message}` };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Update failed' };
    }
  }
  return { success: true };
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  const idx = mockProjects.findIndex((p) => p.id === id);
  if (idx !== -1) {
    mockProjects.splice(idx, 1);
  }

  if (isSupabaseConfigured) {
    try {
      const client = getAuthClient();
      if (!client) throw new Error('Supabase client uninitialized');

      const { error } = await client.from('projects').delete().eq('id', id);
      if (error) {
        return { success: false, error: `Database Delete Error: ${error.message}` };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Delete failed' };
    }
  }
  return { success: true };
}

// ==========================================
// 2. LIVE JOBS / TELEMETRY
// ==========================================
export async function getLiveJobs(): Promise<LiveJob[]> {
  if (!isSupabaseConfigured || !supabase) return mockLiveJobs;
  try {
    const { data, error } = await supabase.from('live_jobs').select('*');
    if (error) return mockLiveJobs;
    const dbJobs = (data || []).map(mapLiveJobFromDb);

    if (isDemoMode) {
      if (dbJobs.length === 0) return mockLiveJobs;
      const dbBays = new Set(dbJobs.map((j) => j.bayNumber || j.id));
      const remainingMocks = mockLiveJobs.filter((m) => !dbBays.has(m.bayNumber) && !dbBays.has(m.id));
      return [...dbJobs, ...remainingMocks];
    }

    return dbJobs.length > 0 ? dbJobs : mockLiveJobs;
  } catch (err) {
    return mockLiveJobs;
  }
}

export async function updateLiveJobStatus(
  id: string,
  progress: number,
  status: LiveJob['status']
): Promise<{ success: boolean; error?: string }> {
  const job = mockLiveJobs.find((j) => j.id === id || j.bayNumber === id);
  if (job) {
    job.progress = progress;
    job.status = status;
  }

  if (isSupabaseConfigured) {
    try {
      const client = getAuthClient();
      if (!client) throw new Error('Supabase client uninitialized');

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      if (isUuid) {
        const { error } = await client
          .from('live_jobs')
          .update({ progress, status, updated_at: new Date().toISOString() })
          .eq('id', id);
        if (error) return { success: false, error: error.message };
      } else {
        const bayNum = job?.bayNumber || id;
        const { data: existing } = await client
          .from('live_jobs')
          .select('id')
          .eq('bay_number', bayNum)
          .maybeSingle();

        if (existing?.id) {
          const { error } = await client
            .from('live_jobs')
            .update({ progress, status, updated_at: new Date().toISOString() })
            .eq('id', existing.id);
          if (error) return { success: false, error: error.message };
        } else if (job) {
          const { error } = await client.from('live_jobs').insert([
            {
              bay_number: job.bayNumber,
              job_title: job.jobTitle,
              material: job.material,
              tolerance: job.tolerance,
              progress,
              status,
              started_time: job.startedTime,
              estimated_completion: job.estimatedCompletion,
              technician: job.technician,
              part_reference: job.partReference,
            },
          ]);
          if (error) return { success: false, error: error.message };
        }
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Update failed' };
    }
  }
  return { success: true };
}

// ==========================================
// 3. ENQUIRIES CRUD & LOCAL PERSISTENCE
// ==========================================
const LOCAL_ENQUIRIES_KEY = 'lathe_workshop_local_enquiries';

function getLocalEnquiries(): Enquiry[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(LOCAL_ENQUIRIES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalEnquiry(enquiry: Enquiry) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalEnquiries();
    const updated = [enquiry, ...current.filter((e) => e.id !== enquiry.id)];
    window.localStorage.setItem(LOCAL_ENQUIRIES_KEY, JSON.stringify(updated.slice(0, 100)));
  } catch (e) {
    console.warn('Failed to save enquiry to local storage', e);
  }
}

function updateLocalEnquiry(id: string, status: Enquiry['status']) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalEnquiries();
    const updated = current.map((e) => (e.id === id ? { ...e, status } : e));
    window.localStorage.setItem(LOCAL_ENQUIRIES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to update enquiry in local storage', e);
  }
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const localEnquiries = getLocalEnquiries();

  if (!isSupabaseConfigured || !supabase) {
    const seenIds = new Set(localEnquiries.map((e) => e.id));
    const remainingMocks = mockEnquiries.filter((m) => !seenIds.has(m.id));
    return [...localEnquiries, ...remainingMocks];
  }

  try {
    const client = getAuthClient() || supabase;
    const { data, error } = await client.from('enquiries').select('*').order('created_at', { ascending: false });

    if (error) {
      console.warn('getEnquiries Supabase notice:', error.message);
    }

    const dbEnquiries = data && Array.isArray(data) ? data.map(mapEnquiryFromDb) : [];

    // Merge local (optimistic) enquiries with DB records, DB wins on conflict
    const enquiriesMap = new Map<string, Enquiry>();
    for (const le of localEnquiries) enquiriesMap.set(le.id, le);
    for (const de of dbEnquiries) enquiriesMap.set(de.id, de);

    // In demo mode only: fill with mock enquiries if nothing real exists
    if (isDemoMode) {
      for (const me of mockEnquiries) {
        if (!enquiriesMap.has(me.id)) enquiriesMap.set(me.id, me);
      }
    }

    const sorted = Array.from(enquiriesMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    return sorted;
  } catch (err) {
    const seenIds = new Set(localEnquiries.map((e) => e.id));
    const remainingMocks = mockEnquiries.filter((m) => !seenIds.has(m.id));
    return [...localEnquiries, ...remainingMocks];
  }
}

export async function createEnquiry(
  enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>
): Promise<{ success: boolean; id: string; error?: string }> {
  const newId = `enq-${Date.now()}`;
  const now = new Date().toLocaleString();

  const newEnquiryObj: Enquiry = {
    ...enquiry,
    id: newId,
    status: 'New',
    createdAt: now,
  };

  // 1. Update in-memory mock state
  mockEnquiries.unshift(newEnquiryObj);

  // 2. Save in browser localStorage so Admin views immediately see it
  saveLocalEnquiry(newEnquiryObj);

  if (!isSupabaseConfigured || !supabase) {
    return { success: true, id: newId };
  }

  try {
    const { error } = await supabase.from('enquiries').insert([
      {
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        company: enquiry.company || null,
        service_type: enquiry.serviceType,
        message: enquiry.message,
        status: 'New',
      },
    ]);

    if (error) {
      console.warn('Supabase enquiry insert notice:', error.message);
    }

    return { success: true, id: newId };
  } catch (err: any) {
    console.warn('createEnquiry exception:', err?.message);
    return { success: true, id: newId };
  }
}

export async function updateEnquiryStatus(id: string, status: Enquiry['status']): Promise<{ success: boolean; error?: string }> {
  // Update mock in-memory
  const enq = mockEnquiries.find((e) => e.id === id);
  if (enq) {
    enq.status = status;
  }

  // Update local storage
  updateLocalEnquiry(id, status);

  // Update Supabase
  if (isSupabaseConfigured) {
    try {
      const client = getAuthClient() || supabase;
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUuid && client) {
        const { error } = await client.from('enquiries').update({ status }).eq('id', id);
        if (error) console.warn('Supabase status update notice:', error.message);
      }
    } catch (err: any) {
      console.warn('updateEnquiryStatus exception:', err?.message);
    }
  }

  return { success: true };
}

// ==========================================
// 4. WORKSHOP SETTINGS
// ==========================================
export async function getWorkshopSettings(): Promise<WorkshopSettings> {
  if (!isSupabaseConfigured || !supabase) return initialSettings;
  try {
    const { data, error } = await supabase.from('workshop_settings').select('*').single();
    if (error || !data) return initialSettings;
    return {
      workshopName: data.workshop_name ?? data.workshopName ?? initialSettings.workshopName,
      tagline: data.tagline ?? initialSettings.tagline,
      phone: data.phone ?? initialSettings.phone,
      whatsapp: data.whatsapp ?? initialSettings.whatsapp,
      email: data.email ?? initialSettings.email,
      address: data.address ?? initialSettings.address,
      workingHours: data.working_hours ?? data.workingHours ?? initialSettings.workingHours,
      activeBays: Number(data.active_bays ?? data.activeBays ?? initialSettings.activeBays),
      totalBays: Number(data.total_bays ?? data.totalBays ?? initialSettings.totalBays),
      isoCertified: Boolean(data.iso_certified ?? data.isoCertified ?? initialSettings.isoCertified),
      standardTolerance: data.standard_tolerance ?? data.standardTolerance ?? initialSettings.standardTolerance,
    };
  } catch (err) {
    return initialSettings;
  }
}

export async function updateWorkshopSettings(settings: Partial<WorkshopSettings>): Promise<{ success: boolean; error?: string }> {
  Object.assign(initialSettings, settings);

  if (isSupabaseConfigured) {
    try {
      const client = getAuthClient();
      if (!client) throw new Error('Supabase client uninitialized');

      const dbPayload: Record<string, any> = {};
      if (settings.workshopName !== undefined) dbPayload.workshop_name = settings.workshopName;
      if (settings.tagline !== undefined) dbPayload.tagline = settings.tagline;
      if (settings.phone !== undefined) dbPayload.phone = settings.phone;
      if (settings.whatsapp !== undefined) dbPayload.whatsapp = settings.whatsapp;
      if (settings.email !== undefined) dbPayload.email = settings.email;
      if (settings.address !== undefined) dbPayload.address = settings.address;
      if (settings.workingHours !== undefined) dbPayload.working_hours = settings.workingHours;
      if (settings.activeBays !== undefined) dbPayload.active_bays = Number(settings.activeBays);
      if (settings.totalBays !== undefined) dbPayload.total_bays = Number(settings.totalBays);
      if (settings.isoCertified !== undefined) dbPayload.iso_certified = Boolean(settings.isoCertified);
      if (settings.standardTolerance !== undefined) dbPayload.standard_tolerance = settings.standardTolerance;
      dbPayload.updated_at = new Date().toISOString();

      const { error } = await client.from('workshop_settings').update(dbPayload).eq('id', 1);
      if (error) return { success: false, error: error.message };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Settings update failed' };
    }
  }
  return { success: true };
}

