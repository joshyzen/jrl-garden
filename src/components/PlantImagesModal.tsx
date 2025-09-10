"use client";
import { useEffect, useState } from "react";
import { PlantPhotoUploader } from "./PlantPhotoUploader";

type Props = { plantId: string; onClose: () => void };

type Img = { id: string; url: string; alt?: string | null; primary: boolean };

export function PlantImagesModal({ plantId, onClose }: Props) {
  const [images, setImages] = useState<Img[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/plants/images?plantId=${encodeURIComponent(plantId)}`);
    const data = await res.json();
    setImages(data.images || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [plantId]);

  return (
    <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose}>
      <div className="absolute inset-x-0 bottom-0 sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto bg-white rounded-t-2xl sm:rounded-2xl p-3 max-w-2xl mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="font-semibold text-black">Plant photos</div>
          <button className="text-sm text-black border rounded px-2 py-1" onClick={onClose}>Close</button>
        </div>
        <div className="grid grid-cols-3 gap-2 py-3 min-h-[100px]">
          {loading ? (
            <div className="col-span-3 text-center text-sm opacity-70">Loading…</div>
          ) : images.length === 0 ? (
            <div className="col-span-3 text-center text-sm opacity-70">No photos yet</div>
          ) : (
            images.map((img) => (
              <div key={img.id} className="relative">
                <img src={img.url} className={`h-24 w-full object-cover rounded ${img.primary ? "ring-2 ring-[var(--foreground)]" : ""}`} />
                <button
                  title="Make primary"
                  aria-label="Make primary"
                  onClick={async () => {
                    await fetch("/api/plants/images/primary", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ plantId, imageId: img.id }),
                    });
                    load();
                  }}
                  className={`absolute top-1 right-1 h-8 w-8 rounded-full flex items-center justify-center shadow-md border-2 ${
                    img.primary
                      ? "bg-white text-[#2D5016] border-[#2D5016]"
                      : "bg-[var(--foreground)] text-white border-[var(--foreground)]"
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </button>
                <button title="Delete" onClick={async () => { await fetch("/api/plants/images", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageId: img.id, plantId }) }); load(); }} className="absolute top-1 left-1 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center">×</button>
              </div>
            ))
          )}
        </div>
        <div className="flex items-center gap-2">
          <PlantPhotoUploader plantId={plantId} onSaved={() => load()} />
        </div>
      </div>
    </div>
  );
}


