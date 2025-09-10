"use client";
import { useState } from "react";
import { compressImageFile } from "@/lib/imageCompress";

type Props = {
  plantId: string;
  onSaved?: (url: string) => void;
  makePrimary?: boolean;
};

export function PlantPhotoUploader({ plantId, onSaved, makePrimary }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      // Compress/resize large files to stay under 10MB
      const optimized = await compressImageFile(file, { maxWidth: 2400, maxHeight: 2400, quality: 0.82, mimeType: "image/jpeg" });
      const sigRes = await fetch("/api/cloudinary/signature");
      const { signature, timestamp, apiKey, cloudName, folder } = await sigRes.json();

      const form = new FormData();
      form.append("file", optimized);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);
      form.append("folder", folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: form,
      });
      const data = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(data.error?.message || "Upload failed");

      const saveRes = await fetch("/api/plants/set-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: plantId, url: data.secure_url, primary: Boolean(makePrimary) }),
      });
      if (!saveRes.ok) throw new Error("Failed to save image URL");
      onSaved?.(data.secure_url);
    } catch (e: any) {
      setError(e.message || "Upload error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="inline-flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
        disabled={uploading}
        className="hidden"
      />
      <span className="brand-btn px-3 py-1.5 rounded-md text-sm cursor-pointer select-none">{uploading ? "Uploading…" : "Add Photo"}</span>
      {error && <span className="text-red-700 text-xs">{error}</span>}
    </label>
  );
}


