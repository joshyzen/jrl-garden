import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { formatEstimateText } from "@/lib/estimateText";
import { markEstimateStatus, updateEstimateLabor } from "../actions";
import { CopyButton } from "@/components/CopyButton";

export default async function AdminEstimates() {
  const estimates = await prisma.estimate.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Estimates</h1>
      {estimates.map((e) => (
        <div key={e.id} className="brand-card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">{e.clientName}</div>
            <div className="text-xs opacity-70">{new Date(e.createdAt).toLocaleString()}</div>
          </div>
          <pre className="text-xs whitespace-pre-wrap bg-[rgba(45,80,22,0.05)] p-2 rounded">{formatEstimateText(e)}</pre>
          <form action={updateEstimateLabor} className="flex items-center gap-2 text-sm">
            <input type="hidden" name="id" value={e.id} />
            <label className="opacity-70">Labor</label>
            <div className="flex items-center gap-1">
              <span className="opacity-70">$</span>
              <input
                name="labor"
                type="number"
                step="1"
                min="0"
                defaultValue={Number(e.labor || 0).toFixed(0)}
                className="w-[10ch] border rounded px-2 py-1 text-right tabular-nums [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <button className="brand-btn px-3 py-1.5 rounded-md">Save labor</button>
          </form>
          <div className="flex items-center gap-2">
            <form action={markEstimateStatus} className="flex items-center gap-2">
              <input type="hidden" name="id" value={e.id} />
              <select name="status" defaultValue={e.status} className="border rounded px-2 py-1 text-sm">
                <option value="pending">pending</option>
                <option value="sent">sent</option>
                <option value="completed">completed</option>
              </select>
              <button className="brand-btn px-3 py-1.5 rounded-md text-sm">Update</button>
            </form>
            <CopyButton text={formatEstimateText(e)} />
          </div>
        </div>
      ))}
    </div>
  );
}


