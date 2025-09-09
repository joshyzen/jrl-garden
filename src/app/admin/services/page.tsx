"use client";
import { prisma } from "@/lib/prisma";
import { createServiceItem, deleteServiceItem, updateServiceItem, renameSection, renameCategory } from "../actions";
import type { ServiceItem } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";

export default function AdminServices() {
  // This page becomes a client component to support autosave and dynamic selects
  const [isPending, startTransition] = useTransition();
  const [sections, setSections] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newSection, setNewSection] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Load data on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/services-data");
      const data = await res.json();
      if (!cancelled) {
        setSections(data.sections);
        setCategories(data.categories);
        setItems(data.items);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped: Record<string, Record<string, ServiceItem[]>> = {};
  for (const it of items) {
    const sec = it.section || "Other";
    const cat = it.category || "Uncategorized";
    if (!grouped[sec]) grouped[sec] = {};
    if (!grouped[sec][cat]) grouped[sec][cat] = [];
    grouped[sec][cat].push(it);
  }
  async function refreshData() {
    const res = await fetch("/api/admin/services-data");
    const data = await res.json();
    setSections(data.sections);
    setCategories(data.categories);
    setItems(data.items);
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Services</h1>
      <form
        className="brand-card p-3 grid grid-cols-3 gap-2 relative"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const fd = new FormData(form);
          startTransition(async () => {
            await createServiceItem(fd);
            await refreshData();
            form.reset();
            setNewSection("");
            setNewCategory("");
          });
        }}
      >
        {/* Section select with Add New */}
        <select
          name="sectionSelect"
          className="border rounded px-2 py-1"
          onChange={(e) => {
            if (e.target.value === "__new__") {
              e.currentTarget.value = "";
              setShowSectionModal(true);
            }
          }}
        >
          <option value="">Select section…</option>
          <option value="__new__">+ Add new…</option>
          {sections.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input type="hidden" name="sectionNew" value={newSection} />

        {/* Category select with Add New */}
        <select
          name="categorySelect"
          className="border rounded px-2 py-1"
          onChange={(e) => {
            if (e.target.value === "__new__") {
              e.currentTarget.value = "";
              setShowCategoryModal(true);
            }
          }}
        >
          <option value="">Select category…</option>
          <option value="__new__">+ Add new…</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input type="hidden" name="categoryNew" value={newCategory} />
        <input name="name" placeholder="Name" className="border rounded px-2 py-1 col-span-2" />
        <input name="unit" placeholder="Unit (ft, yard, hour)" className="border rounded px-2 py-1" />
        <input name="pricePerUnit" placeholder="Price per unit" type="number" step="0.01" className="border rounded px-2 py-1" />
        <button className="brand-btn px-3 py-1.5 rounded-md font-semibold col-span-full">Add Service</button>
      </form>
      {/* Grouped view styled like the spreadsheet (no cell borders) */}
      <div className="space-y-6">
        {Object.keys(grouped)
          .sort((a, b) => (a === "Other" ? 1 : b === "Other" ? -1 : a.localeCompare(b)))
          .map((section) => (
            <section key={section} className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  defaultValue={section}
                  className="text-lg font-semibold bg-transparent outline-none border-b border-transparent focus:border-[rgba(45,80,22,0.3)]"
                  onBlur={(e) => {
                    const newVal = e.target.value.trim();
                    if (!newVal || newVal === section) return;
                    const fd = new FormData();
                    fd.append("oldSection", section);
                    fd.append("newSection", newVal);
                    // Optimistic update
                    setSections((prev) => Array.from(new Set(prev.map((s) => (s === section ? newVal : s)))));
                    setItems((prev) => prev.map((it) => (it.section === section ? { ...it, section: newVal } as ServiceItem : it)));
                    startTransition(async () => {
                      await renameSection(fd);
                    });
                  }}
                />
              </div>
              {Object.keys(grouped[section])
                .sort((a, b) => a.localeCompare(b))
                .map((category) => (
                  <div key={category} className="space-y-1">
                    {/* Category header row with price/unit on the right */}
                    {(() => {
                      const itemsInCat = grouped[section][category];
                      const uniqueUnits = Array.from(new Set(itemsInCat.map((i) => i.unit))).filter(Boolean);
                      const unitLabel = uniqueUnits.length === 1 ? uniqueUnits[0] : "unit";
                      return (
                        <div className="flex items-center justify-between px-1">
                          <input
                            defaultValue={category}
                            className="font-medium pl-2 bg-transparent outline-none border-b border-transparent focus:border-[rgba(45,80,22,0.3)]"
                            onBlur={(e) => {
                              const newVal = e.target.value.trim();
                              if (!newVal || newVal === category) return;
                              const fd = new FormData();
                              fd.append("section", section);
                              fd.append("oldCategory", category);
                              fd.append("newCategory", newVal);
                              // Optimistic update
                              setCategories((prev) => Array.from(new Set(prev.map((c) => (c === category ? newVal : c)))));
                              setItems((prev) => prev.map((it) => (it.section === section && it.category === category ? { ...it, category: newVal } as ServiceItem : it)));
                              startTransition(async () => {
                                await renameCategory(fd);
                              });
                            }}
                          />
                          <span className="text-xs opacity-70">price/ {unitLabel}</span>
                        </div>
                      );
                    })()}

                    {/* Items list: two columns name | price, no borders */}
                    <div className="divide-y divide-transparent">
                      {grouped[section][category].map((s) => (
                        <div key={s.id} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center py-1 px-1">
                          <input
                            defaultValue={s.name}
                            className="text-sm pl-5 bg-transparent outline-none border-b border-transparent focus:border-[rgba(45,80,22,0.3)]"
                            onBlur={(e) => {
                              const fd = new FormData();
                              fd.append("id", s.id);
                              fd.append("name", e.target.value);
                              setItems((prev) => prev.map((it) => (it.id === s.id ? { ...it, name: e.target.value } as ServiceItem : it)));
                              startTransition(async () => {
                                await updateServiceItem(fd);
                              });
                            }}
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-sm">$</span>
                            <input
                              defaultValue={s.pricePerUnit.toFixed(2)}
                              className="text-sm tabular-nums w-24 bg-transparent outline-none border-b border-transparent focus:border-[rgba(45,80,22,0.3)]"
                              onBlur={(e) => {
                                const fd = new FormData();
                                fd.append("id", s.id);
                                fd.append("pricePerUnit", e.target.value);
                                const n = Number(e.target.value);
                                if (!Number.isNaN(n)) {
                                  // Normalize display to two decimals
                                  e.currentTarget.value = n.toFixed(2);
                                }
                                setItems((prev) => prev.map((it) => (it.id === s.id ? { ...it, pricePerUnit: isNaN(n) ? it.pricePerUnit : n } as ServiceItem : it)));
                                startTransition(async () => {
                                  await updateServiceItem(fd);
                                });
                              }}
                            />
                          </div>
                          <button
                            className="justify-self-end text-xs text-red-700 underline"
                            onClick={(e) => {
                              e.preventDefault();
                              const fd = new FormData();
                              fd.append("id", s.id);
                              // Optimistic remove
                              setItems((prev) => prev.filter((it) => it.id !== s.id));
                              startTransition(async () => {
                                await deleteServiceItem(fd);
                              });
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </section>
          ))}
      </div>
      {/* New Section Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="brand-card w-full max-w-sm p-4">
            <h4 className="font-semibold mb-2">Add new section</h4>
            <input
              autoFocus
              className="w-full border rounded px-2 py-1"
              placeholder="Section name"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
            />
            <div className="mt-3 flex justify-end gap-2">
              <button className="px-3 py-1.5 border rounded" onClick={() => { setShowSectionModal(false); setNewSection(""); }}>Cancel</button>
              <button
                type="button"
                className="brand-btn px-3 py-1.5 rounded"
                onClick={() => {
                  const v = newSection.trim();
                  if (v) {
                    setSections((prev) => Array.from(new Set([...prev, v])));
                  }
                  setShowSectionModal(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="brand-card w-full max-w-sm p-4">
            <h4 className="font-semibold mb-2">Add new category</h4>
            <input
              autoFocus
              className="w-full border rounded px-2 py-1"
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <div className="mt-3 flex justify-end gap-2">
              <button className="px-3 py-1.5 border rounded" onClick={() => { setShowCategoryModal(false); setNewCategory(""); }}>Cancel</button>
              <button
                type="button"
                className="brand-btn px-3 py-1.5 rounded"
                onClick={() => {
                  const v = newCategory.trim();
                  if (v) {
                    setCategories((prev) => Array.from(new Set([...prev, v])));
                  }
                  setShowCategoryModal(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


