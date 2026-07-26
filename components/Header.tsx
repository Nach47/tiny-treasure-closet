"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { StoreSettingsData } from "@/lib/settings";

export default function Header({ settings }: { settings: StoreSettingsData }) {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [open, setOpen] = useState(false);

  const featuredSlugs = ["newborn", "toddlers", "sale"];
  const navCategories = featuredSlugs
    .map((slug) => settings.categories.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const navLinks = [
    { href: "/shop", label: "Shop" },
    ...navCategories.map((c) => ({ href: `/categories/${c.slug}`, label: c.name })),
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const [firstWord, ...restWords] = settings.businessName.split(" ");

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-2">
          {settings.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoUrl} alt={settings.businessName} className="h-9 w-auto" />
          ) : (
            <span className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-semibold tracking-tight text-sage-dark">
                {firstWord}
              </span>
              {restWords.length > 0 && (
                <span className="font-display text-2xl text-gold">{restWords.join(" ")}</span>
              )}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-sage-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/wishlist"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/60 transition-colors hover:border-sage-dark sm:flex"
            aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? "" : "s"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path
                d="M12 20.5s-7.5-4.6-9.7-9.2C.7 8 2.4 4.8 5.6 4.1c2-.4 4 .5 5.1 2.2a1 1 0 0 0 1.6 0C13.4 4.6 15.4 3.7 17.4 4.1c3.2.7 4.9 3.9 3.3 7.2C18.5 15.9 12 20.5 12 20.5Z"
                strokeLinejoin="round"
              />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-semibold text-ink">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/60 transition-colors hover:border-sage-dark"
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6h15l-1.5 9h-12z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6 5 3H2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-semibold text-ink">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-ink/10 px-6 py-3 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-beige/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
