import { createClient } from '@supabase/supabase-js';
import { Project, LiveJob, Enquiry, WorkshopSettings } from '@/types';
import { mockProjects, mockLiveJobs, mockEnquiries, initialSettings } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// 1. PROJECTS CRUD
// ==========================================
export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured || !supabase) return mockProjects;
  try {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch error, using local fallback:', error.message);
      return mockProjects;
    }
    if (!data || data.length === 0) return mockProjects;
    return data as Project[];
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
  const newProject = { ...projectData, id: newId };

  if (!isSupabaseConfigured || !supabase) {
    mockProjects.unshift(newProject);
    return { success: true, id: newId };
  }

  try {
    const { data, error } = await supabase.from('projects').insert([projectData]).select();
    if (error) {
      return { success: false, id: '', error: `Database Error: ${error.message}` };
    }
    mockProjects.unshift(data?.[0] as Project || newProject);
    return { success: true, id: data?.[0]?.id || newId };
  } catch (err: any) {
    return { success: false, id: '', error: err?.message || 'Database insert failed' };
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<{ success: boolean; error?: string }> {
  const idx = mockProjects.findIndex((p) => p.id === id);
  if (idx !== -1) {
    mockProjects[idx] = { ...mockProjects[idx], ...updates };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('projects').update(updates).eq('id', id);
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

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
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
    if (error || !data || data.length === 0) return mockLiveJobs;
    return data as LiveJob[];
  } catch (err) {
    return mockLiveJobs;
  }
}

export async function updateLiveJobStatus(id: string, progress: number, status: LiveJob['status']): Promise<{ success: boolean; error?: string }> {
  const job = mockLiveJobs.find((j) => j.id === id);
  if (job) {
    job.progress = progress;
    job.status = status;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('live_jobs').update({ progress, status }).eq('id', id);
      if (error) return { success: false, error: error.message };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Update failed' };
    }
  }
  return { success: true };
}

// ==========================================
// 3. ENQUIRIES CRUD
// ==========================================
export async function getEnquiries(): Promise<Enquiry[]> {
  if (!isSupabaseConfigured || !supabase) return mockEnquiries;
  try {
    const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return mockEnquiries;
    return data as Enquiry[];
  } catch (err) {
    return mockEnquiries;
  }
}

export async function createEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; id: string; error?: string }> {
  const newId = `enq-${Date.now()}`;
  if (!isSupabaseConfigured || !supabase) {
    mockEnquiries.unshift({
      ...enquiry,
      id: newId,
      status: 'New',
      createdAt: new Date().toLocaleString(),
    });
    return { success: true, id: newId };
  }

  try {
    const { data, error } = await supabase.from('enquiries').insert([
      {
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        company: enquiry.company,
        service_type: enquiry.serviceType,
        message: enquiry.message,
        status: 'New',
      },
    ]).select();

    if (error) {
      return { success: false, id: '', error: `RFQ Submission Error: ${error.message}` };
    }

    return { success: true, id: data?.[0]?.id || newId };
  } catch (err: any) {
    return { success: false, id: '', error: err?.message || 'RFQ Submission failed' };
  }
}

export async function updateEnquiryStatus(id: string, status: Enquiry['status']): Promise<{ success: boolean; error?: string }> {
  const enq = mockEnquiries.find((e) => e.id === id);
  if (enq) {
    enq.status = status;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
      if (error) return { success: false, error: error.message };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Update failed' };
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
    return data as WorkshopSettings;
  } catch (err) {
    return initialSettings;
  }
}

export async function updateWorkshopSettings(settings: Partial<WorkshopSettings>): Promise<{ success: boolean; error?: string }> {
  Object.assign(initialSettings, settings);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('workshop_settings').update(settings).eq('id', 1);
      if (error) return { success: false, error: error.message };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Settings update failed' };
    }
  }
  return { success: true };
}
