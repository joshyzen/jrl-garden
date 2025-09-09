import { prisma } from "@/lib/prisma";
import { formatEstimateText } from "@/lib/estimateText";
import { markEstimateStatus } from "../actions";

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
            <button
              className="px-3 py-1.5 rounded-md text-sm border"
              onClick={async () => {
                await navigator.clipboard.writeText(formatEstimateText(e));
                alert("Copied to clipboard");
              }}
            >
              Copy Text
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}


