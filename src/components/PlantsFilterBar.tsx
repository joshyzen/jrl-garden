"use client";
import { useEffect, useState } from "react";

type Filters = {
  q?: string;
  category?: string;
  lightNeeds?: string;
  matureSize?: string;
  isNative?: string; // "all" | "true" | "false"
};

export function PlantsFilterBar() {
  const [options, setOptions] = useState<{ categories: string[]; lightNeeds: string[]; matureSizes: string[] }>({ categories: [], lightNeeds: [], matureSizes: [] });
  const [open, setOpen] = useState(false);
  const [picker, setPicker] = useState<null | "category" | "light" | "size" | "native">(null);
  const [filters, setFilters] = useState<Filters>({ isNative: "all" });

  useEffect(() => {
    fetch("/api/plants/filters").then((r) => r.json()).then(setOptions);
  }, []);

  function apply() {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.category) params.set("category", filters.category);
    if (filters.lightNeeds) params.set("lightNeeds", filters.lightNeeds);
    if (filters.matureSize) params.set("matureSize", filters.matureSize);
    if (filters.isNative && filters.isNative !== "all") params.set("native", filters.isNative);
    const qs = params.toString();
    window.location.href = qs ? `/plants?${qs}` : "/plants";
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input value={filters.q || ""} onChange={(e) => setFilters({ ...filters, q: e.target.value })} placeholder="Search plants" className="border rounded px-3 py-2 w-full text-base" />
        <button onClick={() => setOpen(true)} className="brand-btn px-3 py-2 rounded-md text-base">Filters</button>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/50" onClick={() => setOpen(false)}>
          <div className="absolute left-0 right-0 bottom-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 bg-white text-black rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl sm:mx-auto sm:max-h-[70vh]" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 pt-3 pb-2 flex items-center justify-between">
              <div className="h-1.5 w-10 bg-black/20 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
              <div className="text-base font-semibold">Filters</div>
              <button onClick={() => setOpen(false)} className="text-sm opacity-70">Close</button>
            </div>
            <div className="px-4 pb-24 sm:pb-4 max-h-[80vh] overflow-y-auto space-y-4">
              <label className="block text-sm font-medium">Category</label>
              {/* Mobile picker button */}
              <button type="button" onClick={() => setPicker("category")} className="sm:hidden border rounded px-3 py-3 h-12 w-full text-lg text-left bg-white">
                {filters.category || "All categories"}
              </button>
              {/* Desktop native select */}
              <select value={filters.category || ""} onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })} className="hidden sm:block border rounded px-3 py-3 h-12 w-full text-base bg-white text-black">
                <option value="">All categories</option>
                {options.categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <label className="block text-sm font-medium">Light needs</label>
              <button type="button" onClick={() => setPicker("light")} className="sm:hidden border rounded px-3 py-3 h-12 w-full text-lg text-left bg-white">
                {filters.lightNeeds || "All light"}
              </button>
              <select value={filters.lightNeeds || ""} onChange={(e) => setFilters({ ...filters, lightNeeds: e.target.value || undefined })} className="hidden sm:block border rounded px-3 py-3 h-12 w-full text-base bg-white text-black">
                <option value="">All light</option>
                {options.lightNeeds.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <label className="block text-sm font-medium">Mature size</label>
              <button type="button" onClick={() => setPicker("size")} className="sm:hidden border rounded px-3 py-3 h-12 w-full text-lg text-left bg-white">
                {filters.matureSize || "All sizes"}
              </button>
              <select value={filters.matureSize || ""} onChange={(e) => setFilters({ ...filters, matureSize: e.target.value || undefined })} className="hidden sm:block border rounded px-3 py-3 h-12 w-full text-base bg-white text-black">
                <option value="">All sizes</option>
                {options.matureSizes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <label className="block text-sm font-medium">Native</label>
              <button type="button" onClick={() => setPicker("native")} className="sm:hidden border rounded px-3 py-3 h-12 w-full text-lg text-left bg-white">
                {filters.isNative === "true" ? "Native" : filters.isNative === "false" ? "Non-native" : "Native & Non-native"}
              </button>
              <select value={filters.isNative || "all"} onChange={(e) => setFilters({ ...filters, isNative: e.target.value })} className="hidden sm:block border rounded px-3 py-3 h-12 w-full text-base bg-white text-black">
                <option value="all">Native & Non-native</option>
                <option value="true">Native</option>
                <option value="false">Non-native</option>
              </select>
            </div>
            <div className="sticky bottom-0 px-4 py-3 bg-white border-t flex justify-end gap-2 rounded-b-2xl">
              <button className="px-4 py-2 rounded border text-base" onClick={() => setOpen(false)}>Cancel</button>
              <button className="brand-btn px-4 py-2 rounded text-base" onClick={apply}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile full-screen simple pickers */}
      {picker && (
        <div className="fixed inset-0 z-40 bg-black/50 sm:hidden" onClick={() => setPicker(null)}>
          <div className="absolute inset-0 bg-white text-black" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 flex items-center justify-between border-b">
              <div className="text-base font-semibold capitalize">{picker}</div>
              <button className="text-sm opacity-70" onClick={() => setPicker(null)}>Close</button>
            </div>
            <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-112px)]">
              {(picker === "category" ? ["", ...options.categories] : picker === "light" ? ["", ...options.lightNeeds] : picker === "size" ? ["", ...options.matureSizes] : ["all", "true", "false"]).map((opt) => {
                const label = picker === "native" ? (opt === "all" ? "Native & Non-native" : opt === "true" ? "Native" : "Non-native") : opt || (picker === "category" ? "All categories" : picker === "light" ? "All light" : "All sizes");
                return (
                  <button key={String(opt)} className="w-full text-left px-3 py-3 rounded border" onClick={() => {
                    if (picker === "category") setFilters((f) => ({ ...f, category: opt || undefined }));
                    if (picker === "light") setFilters((f) => ({ ...f, lightNeeds: opt || undefined }));
                    if (picker === "size") setFilters((f) => ({ ...f, matureSize: opt || undefined }));
                    if (picker === "native") setFilters((f) => ({ ...f, isNative: opt }));
                    setPicker(null);
                  }}>{label}</button>
                );
              })}
            </div>
            <div className="px-4 py-3 border-t flex justify-end">
              <button className="brand-btn px-4 py-2 rounded" onClick={() => { setPicker(null); apply(); }}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


