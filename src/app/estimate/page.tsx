"use client";
import { useEffect, useMemo, useState, useTransition } from "react";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { getFavorites } from "@/lib/favorites";
import Link from "next/link";

type ServiceItem = {
  id: string;
  section: string | null;
  category: string;
  name: string;
  unit: string;
  pricePerUnit: number;
};

type Plant = {
  id: string;
  name: string;
  category: string;
  isNative: boolean;
  lightNeeds: string;
  imageUrl: string | null;
  price: number;
  unit: string;
};

export default function EstimateWizard() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [plantCart, setPlantCart] = useState<Record<string, number>>({});
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");
  const [isPending, startTransition] = useTransition();
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const [servicesRes, plantsRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/plants/for-estimate")
      ]);
      const servicesData = await servicesRes.json();
      const plantsData = await plantsRes.json();
      
      setItems(servicesData.items);
      setPlants(plantsData.plants || []);
      setFavorites(getFavorites());
      setLoading(false);
    })();
  }, []);

  // Reload favorites when page becomes visible (user returns from plants page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setFavorites(getFavorites());
      }
    };

    const handleFocus = () => {
      setFavorites(getFavorites());
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (typeof window === 'undefined' || !window.google) return;
    
    const input = document.getElementById('address-autocomplete') as HTMLInputElement;
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'us' },
      fields: ['address_components', 'formatted_address'],
      types: ['address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setAddress(place.formatted_address);
        setAddressError("");
      }
    });
  }, [loading]);

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
    // Services total
    for (const it of items) {
      const qty = cart[it.id] || 0;
      if (qty > 0) t += qty * it.pricePerUnit;
    }
    // Plants total
    for (const plant of plants) {
      const qty = plantCart[plant.id] || 0;
      if (qty > 0) t += qty * plant.price;
    }
    return t;
  }, [cart, plantCart, items, plants]);

  async function submitEstimate() {
    // Reset all errors
    setNameError("");
    setPhoneError("");
    setAddressError("");
    setDetailsError("");
    
    let hasError = false;
    
    // Validate name
    if (!clientName.trim()) {
      setNameError("Name is required");
      hasError = true;
    }
    
    // Validate phone number
    const phoneRegex = /^[\d\s\-\(\)\+\.]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      hasError = true;
    } else if (!phoneRegex.test(phone) || digitsOnly.length < 10) {
      setPhoneError("Please enter a valid phone number (at least 10 digits)");
      hasError = true;
    }
    
    // Validate address
    if (!address.trim()) {
      setAddressError("Address is required");
      hasError = true;
    }
    
    // Validate details
    if (!details.trim()) {
      setDetailsError("Please describe what you need done");
      hasError = true;
    }
    
    if (hasError) {
      return;
    }

    const serviceItems = Object.entries(cart)
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
      });

    const plantItems = Object.entries(plantCart)
      .filter(([_, q]) => Number(q) > 0)
      .map(([id, qty]) => {
        const plant = plants.find((x) => x.id === id)!;
        return {
          id,
          name: plant.name,
          qty: Number(qty),
          unit: plant.unit,
          price: plant.price,
          total: Number(qty) * plant.price,
        };
      });

    const payload = {
      clientName,
      phone,
      address,
      details,
      items: [...serviceItems, ...plantItems],
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
        const data = await res.json();
        const errorMsg = data.error || "Failed to submit estimate";
        
        // Map backend errors to form fields
        if (errorMsg.toLowerCase().includes('name')) {
          setNameError(errorMsg);
        } else if (errorMsg.toLowerCase().includes('phone')) {
          setPhoneError(errorMsg);
        } else if (errorMsg.toLowerCase().includes('address')) {
          setAddressError(errorMsg);
        } else if (errorMsg.toLowerCase().includes('describe') || errorMsg.toLowerCase().includes('details')) {
          setDetailsError(errorMsg);
        } else {
          alert(errorMsg);
        }
      }
    });
  }

  // Helper functions for section calculations
  const getSectionTotal = (sectionItems: ServiceItem[]) => {
    return sectionItems.reduce((sum, item) => {
      const qty = cart[item.id] || 0;
      return sum + (qty * item.pricePerUnit);
    }, 0);
  };

  const getSectionItemCount = (sectionItems: ServiceItem[]) => {
    return sectionItems.filter(item => (cart[item.id] || 0) > 0).length;
  };

  const getPlantSectionTotal = () => {
    return plants.reduce((sum, plant) => {
      const qty = plantCart[plant.id] || 0;
      return sum + (qty * plant.price);
    }, 0);
  };

  const getPlantSectionItemCount = () => {
    return plants.filter(plant => (plantCart[plant.id] || 0) > 0).length;
  };

  const favoritePlants = plants.filter(plant => 
    favorites.includes(plant.id) && plant.price > 0 && plant.unit
  );
  const nonFavoritePlants = plants.filter(plant => 
    !favorites.includes(plant.id) && plant.price > 0 && plant.unit
  );

  if (loading) return <div>Loading…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Request an Estimate</h1>
      <div className="brand-card p-3 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="sm:col-span-1">
            <input 
              value={clientName} 
              onChange={(e) => {
                setClientName(e.target.value);
                setNameError("");
              }} 
              placeholder="Your name" 
              className={`border rounded px-2 py-1 w-full ${nameError ? 'border-red-500' : ''}`}
            />
            {nameError && <div className="text-red-600 text-xs mt-1">{nameError}</div>}
          </div>
          <div className="sm:col-span-1">
            <input 
              value={phone} 
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError("");
              }} 
              placeholder="Phone" 
              type="tel"
              className={`border rounded px-2 py-1 w-full ${phoneError ? 'border-red-500' : ''}`}
            />
            {phoneError && <div className="text-red-600 text-xs mt-1">{phoneError}</div>}
          </div>
          <div className="sm:col-span-2">
            <input 
              value={address} 
              onChange={(e) => {
                setAddress(e.target.value);
                setAddressError("");
              }} 
              placeholder="Address" 
              id="address-autocomplete"
              className={`border rounded px-2 py-1 w-full ${addressError ? 'border-red-500' : ''}`}
            />
            {addressError && <div className="text-red-600 text-xs mt-1">{addressError}</div>}
          </div>
          <div className="sm:col-span-2">
            <textarea 
              value={details} 
              onChange={(e) => {
                setDetails(e.target.value);
                setDetailsError("");
              }} 
              placeholder="Describe what you want to change / need done." 
              className={`border rounded px-2 py-1 w-full ${detailsError ? 'border-red-500' : ''}`}
            />
            {detailsError && <div className="text-red-600 text-xs mt-1">{detailsError}</div>}
          </div>
        </div>
      </div>

      {/* Calculating Quantities helper */}
      <div className="brand-card p-3 space-y-2">
        <div className="font-semibold">Calculating Quantities</div>
        <div className="text-sm">Quick tips for figuring out yards and bags. Use our calculator for exact numbers.</div>
        <Link href="/estimate/calculator" className="brand-btn px-3 py-1.5 rounded-md text-sm w-fit inline-block">
          Open Calculator
        </Link>
      </div>

      {/* Plants Section */}
      <CollapsibleSection
        title="Plants"
        itemCount={getPlantSectionItemCount()}
        total={getPlantSectionTotal()}
      >
        <div className="space-y-4">
          {plants.length === 0 && (
            <div className="text-sm opacity-70 text-center py-4">
              No plants with pricing available. Add prices to plants in the admin panel to include them in estimates.
            </div>
          )}
          
          {plants.length > 0 && (
            <>
              {favoritePlants.length > 0 && (
                <div className="space-y-2">
                  <div className="font-medium text-sm">⭐ Your Favorites</div>
                  <div className="space-y-2">
                    {favoritePlants.map((plant) => {
                      const qty = plantCart[plant.id] ?? 0;
                      const subtotal = qty * plant.price;
                      return (
                        <div key={plant.id} className="grid grid-cols-[1fr_10ch_6ch_11ch] gap-4 items-center py-2 border-b border-[rgba(45,80,22,0.1)]">
                          <div className="text-sm">
                            <div className="font-medium">{plant.name}</div>
                            <div className="text-xs opacity-70">{plant.category} • {plant.lightNeeds}</div>
                          </div>
                          <div className="text-sm tabular-nums">${plant.price.toFixed(2)}</div>
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={qty}
                            onChange={(e) => setPlantCart((prev) => ({ ...prev, [plant.id]: Number(e.target.value) }))}
                            className="w-[6ch] border rounded px-2 py-1 text-sm text-center tabular-nums [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="qty"
                          />
                          <div className="text-sm tabular-nums">${subtotal.toFixed(2)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {nonFavoritePlants.length > 0 && (
                <div className="space-y-2">
                  <div className="font-medium text-sm">All Plants</div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {nonFavoritePlants.map((plant) => {
                      const qty = plantCart[plant.id] ?? 0;
                      const subtotal = qty * plant.price;
                      return (
                        <div key={plant.id} className="grid grid-cols-[1fr_10ch_6ch_11ch] gap-4 items-center py-2 border-b border-[rgba(45,80,22,0.1)]">
                          <div className="text-sm">
                            <div className="font-medium">{plant.name}</div>
                            <div className="text-xs opacity-70">{plant.category} • {plant.lightNeeds}</div>
                          </div>
                          <div className="text-sm tabular-nums">${plant.price.toFixed(2)}</div>
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={qty}
                            onChange={(e) => setPlantCart((prev) => ({ ...prev, [plant.id]: Number(e.target.value) }))}
                            className="w-[6ch] border rounded px-2 py-1 text-sm text-center tabular-nums [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="qty"
                          />
                          <div className="text-sm tabular-nums">${subtotal.toFixed(2)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* Service Sections */}
      {Object.keys(grouped).map((section) => {
        const sectionItems = Object.values(grouped[section]).flat();
        return (
          <CollapsibleSection
            key={section}
            title={section}
            itemCount={getSectionItemCount(sectionItems)}
            total={getSectionTotal(sectionItems)}
          >
            <div className="space-y-3">
              {Object.keys(grouped[section]).map((category) => (
                <div key={category} className="space-y-2">
                  <div className="font-medium">{category}</div>
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
            </div>
          </CollapsibleSection>
        );
      })}

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


