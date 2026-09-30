import { createClient } from '@supabase/supabase-js';
import { Project, LiveJob, Enquiry } from '@/types';
import { mockProjects, mockLiveJobs, mockEnquiries } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper: Fetch Projects
export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockProjects;
  }
  try {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return mockProjects;
    return data as Project[];
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to mock projects:', err);
    return mockProjects;
  }
}

// Helper: Fetch Project by Slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

// Helper: Fetch Live Jobs
export async function getLiveJobs(): Promise<LiveJob[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockLiveJobs;
  }
  try {
    const { data, error } = await supabase.from('live_jobs').select('*');
    if (error || !data || data.length === 0) return mockLiveJobs;
    return data as LiveJob[];
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to mock live jobs:', err);
    return mockLiveJobs;
  }
}

// Helper: Fetch Enquiries (Admin)
export async function getEnquiries(): Promise<Enquiry[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockEnquiries;
  }
  try {
    const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return mockEnquiries;
    return data as Enquiry[];
  } catch (err) {
    return mockEnquiries;
  }
}

// Helper: Submit Enquiry Form
export async function createEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; id: string }> {
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
    if (error) throw error;
    return { success: true, id: data?.[0]?.id || newId };
  } catch (err) {
    console.error('Error saving enquiry to Supabase:', err);
    mockEnquiries.unshift({
      ...enquiry,
      id: newId,
      status: 'New',
      createdAt: new Date().toLocaleString(),
    });
    return { success: true, id: newId };
  }
}
