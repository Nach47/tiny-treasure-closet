import Link from "next/link";
import { StoreSettingsData } from "@/lib/settings";

export default function Footer({ settings }: { settings: StoreSettingsData }) {
  const shopLinks = settings.categories.slice(0, 4);

  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <p className="font-display text-xl">{settings.businessName}</p>
          <p className="mt-3 text-sm text-cream/70">
            Premium, thoughtfully made clothing for little ones aged 0–5 — designed to be worn,
            loved, and passed on.
          </p>
          <div className="mt-4 flex gap-3">
            <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-cream/70 hover:text-gold" aria-label="Facebook">
              Facebook
            </a>
            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-cream/70 hover:text-gold" aria-label="Instagram">
              Instagram
            </a>
            <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-cream/70 hover:text-gold" aria-label="TikTok">
              TikTok
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow text-cream/60">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            {shopLinks.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="hover:text-gold">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-cream/60">Company</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link href="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-gold">FAQ</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gold">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-cream/60">Get in touch</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>WhatsApp: {settings.whatsappDisplay}</li>
            <li>Email: {settings.businessEmail}</li>
            <li>{settings.businessAddress}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 px-6 py-6 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {settings.businessName}. All rights reserved.
      </div>
    </footer>
  );
}
