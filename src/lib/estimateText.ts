import type { Estimate } from "@prisma/client";

export function formatEstimateText(estimate: Estimate): string {
  const lines: string[] = [];
  lines.push("JRL Garden - Josh Race Landscaping");
  lines.push(`Estimate for ${estimate.clientName}:`);
  lines.push("");

  const items: Array<{ name: string; qty?: number; unit?: string; price?: number; total?: number }> = Array.isArray(estimate.items)
    ? (estimate.items as any)
    : [];
  for (const item of items) {
    const qtyLabel = item.qty && item.unit ? ` (${item.qty} ${item.unit})` : "";
    const priceLabel = typeof item.total === "number" ? `$${Math.round(item.total).toLocaleString()}` : "";
    lines.push(`${item.name}${qtyLabel}: ${priceLabel}`.trim());
  }
  lines.push("");
  lines.push(`Total: $${Math.round(estimate.total).toLocaleString()}`);
  lines.push("");
  lines.push("Call/text: 904-640-9088");
  return lines.join("\n");
}


