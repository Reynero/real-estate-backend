import { useRef, useState } from "react";
import { propertyApi } from "../api/propertyApi";
import type { PropertyImageDto } from "../types";

interface ImageUploaderProps {
  propertyId: string;
  images: PropertyImageDto[];
  onImagesChanged: () => void; // parent re-fetches the property to get fresh IDs/order
}

export function ImageUploader({ propertyId, images, onImagesChanged }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const nextDisplayOrder = images.length; // append to the end
      await propertyApi.uploadImage(propertyId, file, nextDisplayOrder);
      // The upload endpoint only returns { imageUrl }, not the new image's id —
      // so we re-fetch the whole property to get the complete, id-tagged list.
      onImagesChanged();
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (imageId: string) => {
    await propertyApi.removeImage(propertyId, imageId);
    onImagesChanged();
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-ink">Photos</label>

      <div className="flex flex-wrap gap-3">
        {images.map((image) => (
          <div key={image.id} className="group relative h-24 w-32 overflow-hidden rounded-lg border border-line">
            <img src={image.imageUrl} alt="Property" className="h-full w-full object-cover" />
            <button
              onClick={() => handleDelete(image.id)}
              className="absolute right-1 top-1 rounded-full bg-ink/70 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex h-24 w-32 flex-col items-center justify-center rounded-lg border-2 border-dashed border-line text-xs text-mute hover:border-slate hover:text-slate disabled:opacity-60"
        >
          {isUploading ? "Uploading…" : "+ Add photo"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        className="hidden"
      />
    </div>
  );
}