import Link from "next/link";
import ProductImage from "./ProductImage";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-sage-dark">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div className="animate-fadeUp">
          <p className="eyebrow text-gold-light">New Season Arrivals</p>
          <h1 className="mt-4 text-4xl font-medium leading-[1.1] text-cream sm:text-5xl lg:text-6xl">
            Little clothes,
            <br />
            made to be <span className="italic text-gold-light">treasured.</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-cream/80">
            Softly tailored pieces in organic cotton and linen, designed for the first five years
            of the little moments that matter most.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/shop" className="btn-gold">
              Shop the Collection
            </Link>
            <Link href="/shop?sort=newest" className="btn-secondary border-cream/30 text-cream hover:border-gold hover:text-gold-light">
              See New Arrivals
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-5xl shadow-soft">
            <ProductImage url="/seed-products/ttc-030.jpg" alt="Unicorn Star two-piece set" seed="hero-main" />
          </div>

          <div className="absolute -right-4 -top-6 hidden aspect-square w-32 overflow-hidden rounded-4xl border-4 border-cream shadow-card sm:block sm:w-40 lg:-right-8">
            <ProductImage url="/seed-products/ttc-017.jpg" alt="Truck two-piece set" seed="hero-secondary" />
          </div>

          <div className="absolute -bottom-6 -left-4 rounded-4xl bg-cream px-5 py-3.5 shadow-card sm:-left-6 sm:px-6 sm:py-4">
            <p className="font-display text-xl text-sage-dark sm:text-2xl">4.9★</p>
            <p className="text-xs text-ink-soft">from happy parents</p>
          </div>
        </div>
      </div>

      <div className="scallop-edge scallop-edge--cream" aria-hidden="true" />
    </section>
  );
}
