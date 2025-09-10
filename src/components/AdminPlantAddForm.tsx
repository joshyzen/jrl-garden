"use client";
import { useState } from "react";
import { createPlant } from "@/app/admin/actions";

type Props = {
  categories: string[];
  lightNeeds: string[];
};

export function AdminPlantAddForm({ categories, lightNeeds }: Props) {
  const [picker, setPicker] = useState<null | "category" | "light">(null);
  const [category, setCategory] = useState<string>("");
  const [light, setLight] = useState<string>("");

  return (
    <form action={createPlant} className="brand-card p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
      <input name="name" placeholder="Name" className="border rounded px-2 py-1" />
      <input name="scientificName" placeholder="Scientific name (optional)" className="border rounded px-2 py-1" />

      {/* Mobile-friendly picker buttons */}
      <div className="sm:hidden">
        <input type="hidden" name="category" value={category} />
        <button type="button" onClick={() => setPicker("category")} className="w-full border rounded px-3 py-2 text-left">
          {category || "Select category…"}
        </button>
      </div>
      <div className="hidden sm:block">
        <select name="category" className="border rounded px-2 py-1 w-full">
          <option value="">Select category…</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="sm:hidden">
        <input type="hidden" name="lightNeeds" value={light} />
        <button type="button" onClick={() => setPicker("light")} className="w-full border rounded px-3 py-2 text-left">
          {light || "Select light needs…"}
        </button>
      </div>
      <div className="hidden sm:block">
        <select name="lightNeeds" className="border rounded px-2 py-1 w-full">
          <option value="">Select light needs…</option>
          {lightNeeds.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <input name="matureSize" placeholder="Mature size" className="border rounded px-2 py-1" />
      <input name="imageUrl" placeholder="Image URL (https://) optional" className="border rounded px-2 py-1 sm:col-span-2" />
      <textarea name="description" placeholder="Description" className="border rounded px-2 py-1 sm:col-span-2" />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isNative" /> Native</label>
      <button className="brand-btn px-3 py-1.5 rounded-md font-semibold">Add Plant</button>

      {/* Full-screen pickers on mobile */}
      {picker && (
        <div className="fixed inset-0 z-40 bg-black/50 sm:hidden" onClick={() => setPicker(null)}>
          <div className="absolute inset-0 bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 flex items-center justify-between border-b">
              <div className="font-semibold">{picker === "category" ? "Select category" : "Select light needs"}</div>
              <button className="text-sm opacity-70" onClick={() => setPicker(null)}>Close</button>
            </div>
            <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-112px)]">
              {(picker === "category" ? ["", ...categories] : ["", ...lightNeeds]).map((opt) => (
                <button key={opt || "__all"} className="w-full text-left px-3 py-3 rounded border" onClick={() => {
                  if (picker === "category") setCategory(opt);
                  if (picker === "light") setLight(opt);
                  setPicker(null);
                }}>{opt || (picker === "category" ? "(none)" : "(none)")}</button>
              ))}
            </div>
            <div className="px-4 py-3 border-t flex justify-end">
              <button className="brand-btn px-4 py-2 rounded" onClick={() => setPicker(null)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}


