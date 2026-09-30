import { supabase, isSupabaseConfigured } from './supabase';

export async function uploadProjectImage(file: File): Promise<{ success: boolean; url: string; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      url: '',
      error: 'Supabase Storage is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.',
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

    const { error: uploadError } = await supabase.storage
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

    const { data } = supabase.storage.from('project-images').getPublicUrl(filePath);
    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    return { success: false, url: '', error: err?.message || 'Storage upload failed' };
  }
}
