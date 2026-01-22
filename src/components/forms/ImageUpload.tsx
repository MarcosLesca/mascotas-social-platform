"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PetImage } from "@/types";

interface ImageUploadProps {
  images: Omit<PetImage, 'id' | 'uploadedAt'>[];
  onChange: (images: Omit<PetImage, 'id' | 'uploadedAt'>[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export function ImageUpload({ 
  images, 
  onChange, 
  maxImages = 5, 
  maxSizeMB = 5 
}: ImageUploadProps) {
  const [error, setError] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError("");

    // Validar cantidad de imágenes
    if (images.length + acceptedFiles.length > maxImages) {
      setError(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    // Procesar archivos aceptados
    const newImages = acceptedFiles.map((file) => {
      const url = URL.createObjectURL(file);
      return {
        url,
        alt: file.name,
        size: file.size,
      };
    });

    onChange([...images, ...newImages]);
  }, [images, onChange, maxImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: maxSizeMB * 1024 * 1024,
    maxFiles: maxImages - images.length,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Liberar URL.createObjectURL para evitar memory leaks
    URL.revokeObjectURL(images[index].url);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50",
          isDragActive && "border-blue-400 bg-blue-50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600">Suelta las imágenes aquí...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Arrastra imágenes aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, JPEG, WebP hasta {maxSizeMB}MB (máx {maxImages} imágenes)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                {image.alt}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-2" />
          <p className="text-gray-500">No hay imágenes seleccionadas</p>
        </div>
      )}
    </div>
  );
}