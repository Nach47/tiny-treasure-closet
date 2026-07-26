import Link from "next/link";

export default function SpecialOffers() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-5xl bg-gradient-to-br from-gold-light/40 via-beige to-sage-light/40 px-8 py-14 text-center shadow-soft sm:px-16">
        <p className="eyebrow">Limited Time</p>
        <h2 className="mt-3 text-3xl sm:text-4xl">Up to 20% off select favorites</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-ink-soft">
          Handpicked pieces from our matching sets and outerwear edit — while stock lasts, and
          stock is always small by design.
        </p>
        <Link href="/shop?category=Sale" className="btn-primary mt-8 inline-flex">
          Shop the Sale
        </Link>
      </div>
    </section>
  );
}
