import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Reach us on WhatsApp, phone, email, or social media — or visit our showroom.",
};

export default async function ContactPage() {
  const settings = await getStoreSettings();

  const channels = [
    {
      label: "WhatsApp",
      value: settings.whatsappDisplay,
      href: buildWhatsAppLink(`Hi ${settings.businessName}! I'd like to ask about your products.`, settings.whatsappNumber),
    },
    { label: "Phone", value: settings.businessPhone, href: `tel:${settings.businessPhone.replace(/\s/g, "")}` },
    { label: "Email", value: settings.businessEmail, href: `mailto:${settings.businessEmail}` },
    { label: "Facebook", value: "Visit page", href: settings.facebookUrl },
    { label: "Instagram", value: "Visit page", href: settings.instagramUrl },
    { label: "TikTok", value: "Visit page", href: settings.tiktokUrl },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
      <p className="eyebrow">We&apos;d Love to Hear From You</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Contact Us</h1>
      <p className="mt-4 max-w-xl text-sm text-ink-soft">
        Questions about sizing, an order, or a custom request? Reach us however is easiest for
        you — WhatsApp is usually the fastest.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {channels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="card-surface rounded-4xl p-5 transition-transform hover:-translate-y-0.5"
              >
                <p className="eyebrow">{channel.label}</p>
                <p className="mt-1.5 font-display text-lg text-ink">{channel.value}</p>
              </a>
            ))}
          </div>

          <div className="mt-8 rounded-4xl bg-beige/50 p-6">
            <p className="eyebrow">Business Hours</p>
            <dl className="mt-3 space-y-2">
              {settings.hours.map((h) => (
                <div key={h.day} className="flex justify-between text-sm">
                  <dt className="text-ink-soft">{h.day}</dt>
                  <dd className="font-medium text-ink">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div>
          <p className="eyebrow">Visit Our Showroom</p>
          <p className="mt-1.5 text-sm text-ink-soft">{settings.businessAddress}</p>
          <div className="mt-4 aspect-[4/3] overflow-hidden rounded-4xl shadow-card">
            <iframe
              src={settings.googleMapsEmbed}
              title="Store location on Google Maps"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
