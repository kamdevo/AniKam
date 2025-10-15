import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UseFileUploadOptions {
  bucket: string;
  folder?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

interface UploadResult {
  url: string | null;
  error: string | null;
}

export function useFileUpload(options: UseFileUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    bucket,
    folder = '',
    maxSizeInMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  } = options;

  const validateFile = (file: File): string | null => {
    // Verificar tipo de archivo
    if (!allowedTypes.includes(file.type)) {
      return `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`;
    }

    // Verificar tamaño
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return `El archivo es demasiado grande. Tamaño máximo: ${maxSizeInMB}MB`;
    }

    return null;
  };

  const uploadFile = async (file: File, customFileName?: string): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validar archivo
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        return { url: null, error: validationError };
      }

      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = customFileName || `${Date.now()}-${Math.random().toString(36).substring(2)}`;
      const filePath = folder ? `${folder}/${fileName}.${fileExt}` : `${fileName}.${fileExt}`;

      console.log('📤 Uploading file:', { fileName, filePath, size: file.size });

      // Subir archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('❌ Upload error:', error);
        
        // Error específico para bucket no encontrado
        if (error.message.includes('Bucket not found')) {
          toast.error('Storage no configurado. Contacta al administrador.');
          return { url: null, error: 'Storage no configurado. Los buckets no existen.' };
        }
        
        toast.error('Error al subir el archivo: ' + error.message);
        return { url: null, error: error.message };
      }

      console.log('✅ File uploaded successfully:', data);

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('🔗 Public URL:', publicUrl);

      setUploadProgress(100);
      toast.success('Archivo subido correctamente');

      return { url: publicUrl, error: null };

    } catch (error) {
      console.error('❌ Unexpected upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error('Error inesperado al subir el archivo');
      return { url: null, error: errorMessage };
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting file:', filePath);

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('❌ Delete error:', error);
        toast.error('Error al eliminar el archivo');
        return false;
      }

      console.log('✅ File deleted successfully');
      toast.success('Archivo eliminado correctamente');
      return true;

    } catch (error) {
      console.error('❌ Unexpected delete error:', error);
      toast.error('Error inesperado al eliminar el archivo');
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    isUploading,
    uploadProgress,
    validateFile
  };
}

// Hook específico para avatars
export function useAvatarUpload() {
  return useFileUpload({
    bucket: 'avatars',
    folder: 'user-avatars',
    maxSizeInMB: 2,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
}

// Hook específico para banners
export function useBannerUpload() {
  return useFileUpload({
    bucket: 'banners',
    folder: 'user-banners',
    maxSizeInMB: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
}
