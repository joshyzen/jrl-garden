"use client";
import { useState } from "react";
import Link from "next/link";

export default function Calculator() {
  const [lengthFt, setLengthFt] = useState<number | "">("");
  const [widthFt, setWidthFt] = useState<number | "">("");
  const [areaFt, setAreaFt] = useState<number | "">("");
  const [depthIn, setDepthIn] = useState<number>(3);
  const [material, setMaterial] = useState<string>("Rock");

  const area = (areaFt || 0) || (((lengthFt || 0) * (widthFt || 0)) || 0);
  const cubicFeet = area * (depthIn / 12);
  const yards = cubicFeet / 27;
  const bags = Math.ceil(yards * 13);
  const covPerYd = material === "Mulch" ? 160 : 100;
  const covAtDepth = material === "Mulch" ? 2 : 3;
  const coverage = covPerYd * (covAtDepth / Math.max(depthIn, 0.1));

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Material Calculator</h1>
        <Link href="/estimate" className="text-sm brand-btn px-3 py-1.5 rounded-md">
          Back to Estimate
        </Link>
      </div>

      <div className="brand-card p-4 space-y-4">
        <div className="space-y-2 text-sm">
          <div className="font-medium">Coverage per cubic yard</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Mulch: 1 yd³ covers ~160 sq ft at 2″</li>
            <li>Rock: 1 yd³ covers ~100 sq ft at 3″ (or ~80 sq ft at 4″)</li>
            <li>Topsoil: 1 yd³ covers ~100 sq ft at 3″</li>
          </ul>
          <div className="font-medium pt-2">Bags vs. Yards</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>1 cubic yard = 27 cubic feet. ≈ 14 big bags (2 cu ft each)</li>
            <li>Example: 14 bags × $3.50 ≈ $49 — 1 yd bulk = $40</li>
          </ul>
          <div className="font-medium pt-2">Recommended Depths</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Mulch: 2–3″ for beds, 3–4″ for weed control</li>
            <li>Rock: 3–4″ for full coverage</li>
            <li>Topsoil: 2–4″ for leveling or bed prep</li>
          </ul>
        </div>
      </div>

      <div className="brand-card p-4 space-y-3">
        <div className="font-semibold text-lg">Calculator</div>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Length (ft)</label>
              <input
                type="number"
                min={0}
                value={lengthFt}
                onChange={(e) => setLengthFt(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Length"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Width (ft)</label>
              <input
                type="number"
                min={0}
                value={widthFt}
                onChange={(e) => setWidthFt(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Width"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Or enter area directly (sq ft)</label>
            <input
              type="number"
              min={0}
              value={areaFt}
              onChange={(e) => setAreaFt(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="Area in square feet"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Depth (inches)</label>
              <input
                type="number"
                min={1}
                step={0.5}
                value={depthIn}
                onChange={(e) => setDepthIn(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Material</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option>Rock</option>
                <option>Mulch</option>
                <option>Topsoil</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="brand-card p-4 space-y-2 bg-[rgba(45,80,22,0.05)]">
        <div className="font-semibold text-lg">Results</div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Area used:</span>
            <span className="font-medium">{area || 0} sq ft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Depth:</span>
            <span className="font-medium">{depthIn}&quot;</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="font-semibold">You need approximately:</span>
            <span className="font-bold text-[#2d5016]">{yards.toFixed(2)} cubic yards</span>
          </div>
          <div className="flex justify-between text-sm opacity-80">
            <span>Equivalent bags (2 cu ft each):</span>
            <span>≈ {bags} bags</span>
          </div>
          <div className="flex justify-between text-sm opacity-80">
            <span>Coverage at {depthIn}&quot;:</span>
            <span>1 yd covers ≈ {Math.round(coverage)} sq ft</span>
          </div>
        </div>
      </div>

      <Link href="/estimate" className="brand-btn w-full text-center py-3 rounded-md font-semibold block">
        Back to Estimate Form
      </Link>
    </div>
  );
}

