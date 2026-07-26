import type { Metadata } from "next";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind Tiny Treasure Closet — premium, thoughtfully made baby and toddler clothing.",
};

const VALUES = [
  {
    title: "Fabric first",
    body: "Every piece starts with fabric gentle enough for newborn skin — organic cotton, linen, and soft wool blends, never anything scratchy or synthetic against the skin.",
  },
  {
    title: "Small batches",
    body: "We produce in limited runs rather than mass quantities, so quality control stays personal and nothing feels disposable.",
  },
  {
    title: "Built to last (and pass on)",
    body: "Reinforced seams and timeless cuts mean these pieces survive tummy time, spit-up, and a second or third little one.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <p className="eyebrow">Our Story</p>
        <h1 className="mt-2 max-w-2xl text-3xl sm:text-4xl">
          Clothing made the way we&apos;d want it for our own children
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Tiny Treasure Closet began with a simple frustration: it was hard to find baby clothing
          that felt as considered as the moments it was made for. So we started sourcing fabrics
          gentle enough for newborn skin, working with small ateliers who finish every piece by
          hand, and building a collection sized for the real range of the first five years — from
          preemie to size 5.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Today, every order still gets packed by our small team in Accra, and every customer
          question still gets answered by a real person on WhatsApp — not a chatbot.
        </p>
      </div>

      <div className="aspect-[21/9] w-full overflow-hidden">
        <ProductImage seed="about-hero" alt="Tiny Treasure Closet atelier" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <p className="eyebrow">What We Stand For</p>
        <h2 className="mt-2 text-3xl">Our values</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {VALUES.map((value) => (
            <div key={value.title}>
              <h3 className="font-display text-lg text-ink">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{value.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-5xl bg-sage-dark p-10 text-center text-cream sm:p-14">
          <h2 className="text-2xl sm:text-3xl">Come find their next favorite piece</h2>
          <Link href="/shop" className="btn-gold mt-6 inline-flex">
            Shop the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
