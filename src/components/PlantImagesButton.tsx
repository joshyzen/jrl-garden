"use client";
import { useState } from "react";
import { PlantImagesModal } from "./PlantImagesModal";

export function PlantImagesButton({ plantId, className }: { plantId: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className || "brand-btn px-3 py-1.5 rounded-md text-sm"}>
        Photos
      </button>
      {open && <PlantImagesModal plantId={plantId} onClose={() => setOpen(false)} />}
    </>
  );
}


