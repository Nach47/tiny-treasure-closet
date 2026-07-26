"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar({ email }: { email?: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-ink/10 bg-white">
      <div className="border-b border-ink/10 px-6 py-6">
        <p className="font-display text-lg text-ink">Tiny Treasure Closet</p>
        <p className="text-xs text-ink-soft">Admin Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-sage-dark text-cream" : "text-ink-soft hover:bg-beige/60 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink/10 px-4 py-4">
        <Link href="/" className="block px-2 text-xs font-medium text-ink-soft hover:text-sage-dark">
          ← View storefront
        </Link>
        {email && <p className="mt-3 truncate px-2 text-xs text-ink-soft">{email}</p>}
        <a href="/admin/sign-out" className="mt-1 block px-2 text-xs font-semibold text-ink-soft hover:text-red-600">
          Sign Out
        </a>
      </div>
    </aside>
  );
}
