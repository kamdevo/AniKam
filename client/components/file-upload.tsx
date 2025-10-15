import { useState, useRef } from 'react';
import { Upload, Image, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUpload: (file: File) => Promise<{ url: string | null; error: string | null }>;
  isUploading?: boolean;
  uploadProgress?: number;
  accept?: string[];
  maxSize?: number; // en MB
  className?: string;
  variant?: 'avatar' | 'banner' | 'general';
  currentImageUrl?: string;
}

export function FileUpload({
  onFileSelect,
  onUpload,
  isUploading = false,
  uploadProgress = 0,
  accept = ['image/jpeg', 'image/png', 'image/webp'],
  maxSize = 5,
  className,
  variant = 'general',
  currentImageUrl
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar archivo
      if (!accept.includes(file.type)) {
        alert(`Tipo de archivo no permitido. Tipos permitidos: ${accept.join(', ')}`);
        return;
      }
      
      if (file.size > maxSize * 1024 * 1024) {
        alert(`El archivo es demasiado grande. Tamaño máximo: ${maxSize}MB`);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const result = await onUpload(selectedFile);
    if (result.url) {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'avatar':
        return {
          container: 'w-32 h-32 rounded-full',
          preview: 'w-full h-full rounded-full object-cover'
        };
      case 'banner':
        return {
          container: 'w-full h-48 rounded-lg',
          preview: 'w-full h-full rounded-lg object-cover'
        };
      default:
        return {
          container: 'w-full h-64 rounded-lg',
          preview: 'w-full h-full rounded-lg object-cover'
        };
    }
  };

  const styles = getVariantStyles();
  const displayImage = previewUrl || currentImageUrl;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Área de selección */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed border-gray-300 dark:border-gray-600 transition-colors cursor-pointer',
          'hover:border-purple-400 dark:hover:border-purple-500',
          styles.container,
          'flex items-center justify-center relative overflow-hidden'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {displayImage ? (
          <div className="relative w-full h-full">
            <img
              src={displayImage}
              alt="Preview"
              className={styles.preview}
            />
            {selectedFile && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Nuevo archivo seleccionado</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                Haz clic para seleccionar una imagen
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Máximo {maxSize}MB • {accept.map(type => type.replace('image/', '')).join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Información del archivo seleccionado */}
      {selectedFile && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium truncate">
                {selectedFile.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 mb-3">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </div>

          {/* Progress bar */}
          {isUploading && (
            <div className="mb-3">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                Subiendo... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              size="sm"
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Subir
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={clearSelection}
              disabled={isUploading}
              size="sm"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
