"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function AdminLogin() {
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get("next") || "/admin";

  async function onSubmit(formData: FormData) {
    const pass = formData.get("password") as string;
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password: pass }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) router.replace(next);
    else alert("Invalid password");
  }

  return (
    <form action={onSubmit} className="max-w-sm mx-auto space-y-3">
      <h1 className="text-xl font-semibold">Admin Login</h1>
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full rounded-md border px-3 py-2"
      />
      <button className="brand-btn px-4 py-2 rounded-md font-semibold">Sign in</button>
    </form>
  );
}


