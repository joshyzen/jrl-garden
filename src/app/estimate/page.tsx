"use client";
import { useEffect, useMemo, useState, useTransition } from "react";

type ServiceItem = {
  id: string;
  section: string | null;
  category: string;
  name: string;
  unit: string;
  pricePerUnit: number;
};

export default function EstimateWizard() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/services");
      const data = await res.json();
      setItems(data.items);
      setLoading(false);
    })();
  }, []);

  const grouped = useMemo(() => {
    const bySection: Record<string, Record<string, ServiceItem[]>> = {};
    for (const it of items) {
      const sec = it.section || "Other";
      const cat = it.category || "Uncategorized";
      if (!bySection[sec]) bySection[sec] = {};
      if (!bySection[sec][cat]) bySection[sec][cat] = [];
      bySection[sec][cat].push(it);
    }
    return bySection;
  }, [items]);

  const total = useMemo(() => {
    let t = 0;
    for (const it of items) {
      const qty = cart[it.id] || 0;
      if (qty > 0) t += qty * it.pricePerUnit;
    }
    return t;
  }, [cart, items]);

  async function submitEstimate() {
    const payload = {
      clientName,
      phone,
      address,
      details,
      items: Object.entries(cart)
        .filter(([_, q]) => Number(q) > 0)
        .map(([id, qty]) => {
          const it = items.find((x) => x.id === id)!;
          return {
            id,
            name: it.name,
            qty: Number(qty),
            unit: it.unit,
            price: it.pricePerUnit,
            total: Number(qty) * it.pricePerUnit,
          };
        }),
      total,
    };
    startTransition(async () => {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        window.location.href = "/estimate/success";
      } else {
        alert("Failed to submit estimate");
      }
    });
  }

  if (loading) return <div>Loading…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Request an Estimate</h1>
      <div className="brand-card p-3 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Your name" className="border rounded px-2 py-1" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="border rounded px-2 py-1" />
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="border rounded px-2 py-1 sm:col-span-2" />
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe what you want to change / need done." className="border rounded px-2 py-1 sm:col-span-2" />
        </div>
      </div>

      {Object.keys(grouped).map((section) => (
        <section key={section} className="space-y-2">
          <h2 className="text-lg font-semibold">{section}</h2>
          {Object.keys(grouped[section]).map((category) => (
            <div key={category} className="brand-card p-3">
              {(() => {
                const itemsInCat = grouped[section][category];
                const uniqueUnits = Array.from(new Set(itemsInCat.map((i) => i.unit))).filter(Boolean);
                const unitLabel = uniqueUnits.length === 1 ? uniqueUnits[0] : "unit";
                return (
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr] sm:grid-cols-[1fr_10ch_6ch_11ch] gap-2 sm:gap-4 px-1 text-xs opacity-70 text-center items-center">
                    <div />
                    <div className="whitespace-nowrap">price / {unitLabel}</div>
                    <div className="whitespace-nowrap">qty</div>
                    <div className="whitespace-nowrap">subtotal</div>
                  </div>
                );
              })()}
              <div className="divide-y divide-[rgba(45,80,22,0.1)]">
                {grouped[section][category].map((s) => {
                  const qty = cart[s.id] ?? 0;
                  const subtotal = (qty || 0) * s.pricePerUnit;
                  return (
                    <div key={s.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] sm:grid-cols-[1fr_10ch_6ch_11ch] gap-2 sm:gap-4 items-center py-1 px-1 text-center">
                      <div className="text-sm text-left">{s.name}</div>
                      <div className="text-sm tabular-nums">${s.pricePerUnit.toFixed(2)}</div>
                      <input
                        type="number"
                        min={0}
                        step={s.unit.toLowerCase().includes("ft") ? 1 : 0.5}
                        value={qty}
                        onChange={(e) => setCart((prev) => ({ ...prev, [s.id]: Number(e.target.value) }))}
                        className="w-[6ch] border rounded px-2 py-1 text-sm text-center tabular-nums justify-self-center [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder={`qty (${s.unit})`}
                        aria-label={`Quantity (${s.unit})`}
                      />
                      <div className="text-sm tabular-nums">${subtotal.toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      ))}

      <div className="brand-card p-3 flex items-center justify-between">
        <div className="font-medium">Materials Total (Delivery and labor will be added)</div>
        <div className="font-semibold tabular-nums">${total.toFixed(2)}</div>
      </div>

      <button disabled={isPending} onClick={submitEstimate} className="brand-btn px-4 py-2 rounded-md font-semibold w-full">
        {isPending ? "Submitting…" : "Submit estimate"}
      </button>
    </div>
  );
}


