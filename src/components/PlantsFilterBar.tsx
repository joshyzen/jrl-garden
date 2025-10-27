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
    
    // Load current search params from URL
    const params = new URLSearchParams(window.location.search);
    const currentFilters: Filters = { isNative: "all" };
    if (params.get("q")) currentFilters.q = params.get("q")!;
    if (params.get("category")) currentFilters.category = params.get("category")!;
    if (params.get("lightNeeds")) currentFilters.lightNeeds = params.get("lightNeeds")!;
    if (params.get("matureSize")) currentFilters.matureSize = params.get("matureSize")!;
    if (params.get("native")) currentFilters.isNative = params.get("native")!;
    setFilters(currentFilters);
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

  function clearFilter(filterKey: keyof Filters) {
    const newFilters = { ...filters };
    if (filterKey === "isNative") {
      newFilters.isNative = "all";
    } else {
      delete newFilters[filterKey];
    }
    setFilters(newFilters);
    
    // Auto-apply the cleared filter
    const params = new URLSearchParams();
    if (newFilters.q) params.set("q", newFilters.q);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.lightNeeds) params.set("lightNeeds", newFilters.lightNeeds);
    if (newFilters.matureSize) params.set("matureSize", newFilters.matureSize);
    if (newFilters.isNative && newFilters.isNative !== "all") params.set("native", newFilters.isNative);
    const qs = params.toString();
    window.location.href = qs ? `/plants?${qs}` : "/plants";
  }

  function clearAllFilters() {
    setFilters({ isNative: "all" });
    window.location.href = "/plants";
  }

  const hasActiveFilters = filters.q || filters.category || filters.lightNeeds || filters.matureSize || (filters.isNative && filters.isNative !== "all");

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative w-full">
          <input 
            value={filters.q || ""} 
            onChange={(e) => setFilters({ ...filters, q: e.target.value })} 
            onKeyDown={(e) => e.key === "Enter" && apply()}
            placeholder="Search plants" 
            className="border rounded px-3 py-2 pr-10 w-full text-base" 
          />
          {filters.q && (
            <button
              onClick={() => {
                setFilters({ ...filters, q: "" });
                // Auto-apply when clearing to immediately show all results
                const params = new URLSearchParams();
                if (filters.category) params.set("category", filters.category);
                if (filters.lightNeeds) params.set("lightNeeds", filters.lightNeeds);
                if (filters.matureSize) params.set("matureSize", filters.matureSize);
                if (filters.isNative && filters.isNative !== "all") params.set("native", filters.isNative);
                const qs = params.toString();
                window.location.href = qs ? `/plants?${qs}` : "/plants";
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              type="button"
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 hover:text-gray-600">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button onClick={apply} className="brand-btn px-3 py-2 rounded-md text-base">Search</button>
        <button onClick={() => setOpen(true)} className="brand-btn px-3 py-2 rounded-md text-base">Filters</button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-600">Active filters:</span>
          
          {filters.category && (
            <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              <span>Category: {filters.category}</span>
              <button
                onClick={() => clearFilter("category")}
                className="hover:bg-blue-200 rounded-full p-0.5"
                aria-label="Clear category filter"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {filters.lightNeeds && (
            <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              <span>Light: {filters.lightNeeds}</span>
              <button
                onClick={() => clearFilter("lightNeeds")}
                className="hover:bg-green-200 rounded-full p-0.5"
                aria-label="Clear light needs filter"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {filters.matureSize && (
            <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
              <span>Size: {filters.matureSize}</span>
              <button
                onClick={() => clearFilter("matureSize")}
                className="hover:bg-purple-200 rounded-full p-0.5"
                aria-label="Clear mature size filter"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {filters.isNative && filters.isNative !== "all" && (
            <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
              <span>Native: {filters.isNative === "true" ? "Yes" : "No"}</span>
              <button
                onClick={() => clearFilter("isNative")}
                className="hover:bg-orange-200 rounded-full p-0.5"
                aria-label="Clear native filter"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <button
            onClick={clearAllFilters}
            className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

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


