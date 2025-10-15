import { useState } from 'react';
import { toast } from 'sonner';

interface UploadResult {
  url: string | null;
  error: string | null;
}

// Fallback usando un servicio gratuito de imágenes
export function useImageUploadFallback() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadToImgBB = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Convertir archivo a base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remover el prefijo data:image/...;base64,
        };
        reader.readAsDataURL(file);
      });

      setUploadProgress(50);

      // Subir a ImgBB (servicio gratuito)
      const formData = new FormData();
      formData.append('image', base64);
      
      // API key pública de ImgBB (puedes registrarte para obtener una propia)
      const response = await fetch('https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY', {
        method: 'POST',
        body: formData
      });

      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Error al subir imagen');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Imagen subida correctamente');
        return { url: data.data.url, error: null };
      } else {
        throw new Error('Error en la respuesta del servidor');
      }

    } catch (error) {
      console.error('❌ Upload error:', error);
      toast.error('Error al subir imagen');
      return { url: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Alternativa usando solo base64 (almacenamiento local)
  const convertToBase64 = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setUploadProgress(100);
      toast.success('Imagen procesada correctamente');
      
      return { url: base64, error: null };

    } catch (error) {
      console.error('❌ Base64 conversion error:', error);
      toast.error('Error al procesar imagen');
      return { url: null, error: error instanceof Error ? error.message : 'Error desconocido' };
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return {
    uploadToImgBB,
    convertToBase64,
    isUploading,
    uploadProgress
  };
}
