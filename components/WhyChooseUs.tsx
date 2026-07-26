const POINTS = [
  {
    title: "Softly made, always",
    body: "Organic cotton, linen, and wool-blend fabrics chosen for delicate skin, not just for photos.",
  },
  {
    title: "Order on WhatsApp",
    body: "Every checkout hands off to WhatsApp with your full order, so you can ask questions before you pay.",
  },
  {
    title: "Mobile Money accepted",
    body: "Pay by MTN Mobile Money, Telecel Cash, or AirtelTigo Money — no card required.",
  },
  {
    title: "Small batches, real care",
    body: "We keep stock intentionally limited so every piece gets the attention it deserves.",
  },
];

const DELIVERY = [
  { title: "Accra & Tema", body: "1–2 business days" },
  { title: "Greater Accra Region", body: "2–3 business days" },
  { title: "Rest of Ghana", body: "3–5 business days" },
  { title: "Order Tracking", body: "Updates sent directly to your WhatsApp" },
];

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="grid gap-14 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Why Parents Choose Us</p>
          <h2 className="mt-2 text-3xl">Made for real life with little ones</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {POINTS.map((point) => (
              <div key={point.title}>
                <h3 className="font-display text-lg text-ink">{point.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{point.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-5xl bg-sage-dark p-8 text-cream sm:p-10">
          <p className="eyebrow text-gold-light">Delivery Information</p>
          <h3 className="mt-2 text-2xl">Where and when we deliver</h3>
          <dl className="mt-8 space-y-5">
            {DELIVERY.map((item) => (
              <div key={item.title} className="flex items-center justify-between border-b border-cream/15 pb-4">
                <dt className="text-sm text-cream/80">{item.title}</dt>
                <dd className="text-sm font-semibold text-gold-light">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
