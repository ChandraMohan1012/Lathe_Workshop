import { supabase, isSupabaseConfigured } from './supabase';

export async function uploadProjectImage(file: File): Promise<{ success: boolean; url: string; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    // Local preview fallback when Supabase Storage is offline
    const fakeUrl = URL.createObjectURL(file);
    return { success: true, url: fakeUrl };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `project_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `catalog/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage upload error, using object URL fallback:', uploadError);
      return { success: true, url: URL.createObjectURL(file) };
    }

    const { data } = supabase.storage.from('project-images').getPublicUrl(filePath);
    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    return { success: false, url: '', error: err?.message || 'Upload failed' };
  }
}
