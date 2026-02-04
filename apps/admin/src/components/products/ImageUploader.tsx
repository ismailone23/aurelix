"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export function ImageUploader({ images, setImages }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image");
      return null;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;

      const url = await uploadImage(file);
      if (url) {
        setImages((prev) => [...prev, url]);
      }
    }

    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Images</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        disabled={uploading}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all duration-300 flex flex-col items-center gap-3 disabled:opacity-50 group"
      >
        {uploading ? (
          <>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full animate-pulse">
              <Loader2 className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-spin" />
            </div>
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Uploading assets...</span>
          </>
        ) : (
          <>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors duration-300">
              <Upload className="w-6 h-6 text-gray-500 group-hover:text-purple-600 dark:text-gray-400 dark:group-hover:text-purple-400 transition-colors" />
            </div>
            <div className="text-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                Click to upload
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                SVG, PNG, JPG or GIF (max 5MB)
              </p>
            </div>
          </>
        )}
      </button>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
          {images.map((img, index) => (
            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="relative w-full h-20">
                <Image
                  src={img}
                  alt={`Preview ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded border"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
