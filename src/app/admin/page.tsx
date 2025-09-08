import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/admin/plants" className="brand-card p-4">Plants</Link>
        <Link href="/admin/services" className="brand-card p-4">Services</Link>
        <Link href="/admin/estimates" className="brand-card p-4">Estimates</Link>
      </div>
    </div>
  );
}


