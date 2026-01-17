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
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            <span className="text-sm text-gray-500">Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-500">
              Click to upload images
            </span>
          </>
        )}
      </button>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-20">
                <Image
                  src={img}
                  alt={`Preview ${index + 1}`}
                  fill
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
