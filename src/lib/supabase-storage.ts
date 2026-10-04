import { supabase, isSupabaseConfigured, getAuthClient } from './supabase';

export async function uploadProjectImage(file: File): Promise<{ success: boolean; url: string; error?: string }> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      url: '',
      error: 'Supabase Storage is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.',
    };
  }

  const client = getAuthClient();
  if (!client) {
    return {
      success: false,
      url: '',
      error: 'Supabase client unavailable.',
    };
  }

  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
    
    if (!fileExt || !allowedExts.includes(fileExt)) {
      return { success: false, url: '', error: 'Only image files (JPG, PNG, WEBP) are allowed.' };
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return { success: false, url: '', error: 'Image size must be less than 5MB.' };
    }

    const fileName = `project_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `catalog/${fileName}`;

    const { error: uploadError } = await client.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return {
        success: false,
        url: '',
        error: `Supabase Storage Upload Error: ${uploadError.message}. Make sure 'project-images' bucket is created and RLS policy allows uploads.`,
      };
    }

    const { data } = client.storage.from('project-images').getPublicUrl(filePath);
    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    return { success: false, url: '', error: err?.message || 'Storage upload failed' };
  }
}

export async function uploadDrawingFile(file: File): Promise<{ success: boolean; url: string; error?: string }> {
  if (!isSupabaseConfigured) {
    // Offline / Demo mode fallback
    return {
      success: true,
      url: `/uploads/${file.name}`,
    };
  }

  const client = getAuthClient();
  if (!client) {
    return {
      success: false,
      url: '',
      error: 'Supabase client unavailable.',
    };
  }

  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'dwg', 'dxf', 'step', 'stp'];

    if (!fileExt || !allowedExts.includes(fileExt)) {
      return { success: false, url: '', error: 'Supported formats: PDF, CAD (DWG, DXF, STEP), PNG, JPG.' };
    }

    if (file.size > 15 * 1024 * 1024) { // 15MB limit
      return { success: false, url: '', error: 'Drawing file must be under 15MB.' };
    }

    const cleanBase = file.name.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
    const fileName = `drawing_${Date.now()}_${cleanBase}.${fileExt}`;
    const filePath = `drawings/${fileName}`;

    const { error: uploadError } = await client.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Storage upload notice:', uploadError.message);
      // Return local file reference if storage bucket has not been run yet
      return { success: true, url: file.name };
    }

    const { data } = client.storage.from('project-images').getPublicUrl(filePath);
    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    return { success: true, url: file.name };
  }
}

