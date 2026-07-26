import Link from "next/link";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-beige/40 px-6">
        <div className="max-w-md rounded-4xl bg-white p-8 text-center shadow-card">
          <p className="eyebrow">Setup Needed</p>
          <h1 className="mt-2 text-2xl">Connect Supabase first</h1>
          <p className="mt-3 text-sm text-ink-soft">
            The Admin Dashboard needs a Supabase project to store products, orders, and settings.
            Add your project credentials to <code className="rounded bg-beige px-1.5 py-0.5 text-xs">.env.local</code>{" "}
            and run <code className="rounded bg-beige px-1.5 py-0.5 text-xs">supabase/schema.sql</code>, then reload
            this page. See the README for step-by-step instructions.
          </p>
          <Link href="/" className="btn-secondary mt-6 inline-flex">
            Back to Storefront
          </Link>
        </div>
      </div>
    );
  }

  const supabase = getServerSupabaseClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  return (
    <div className="flex min-h-screen bg-beige/30">
      <AdminSidebar email={user?.email} />
      <div className="flex-1 overflow-x-hidden px-8 py-8 lg:px-12">{children}</div>
    </div>
  );
}
