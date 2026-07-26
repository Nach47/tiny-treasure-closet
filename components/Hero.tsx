import Link from "next/link";

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

        <div className="relative">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-5xl bg-gradient-to-br from-beige to-beige-dark shadow-soft">
            <div className="flex h-full w-full items-center justify-center">
              <svg width="30%" height="30%" viewBox="0 0 24 24" fill="none" className="opacity-60">
                <path
                  d="M12 2c1.1 0 2 .9 2 2 0 .74-.4 1.38-1 1.72V7h2a5 5 0 0 1 5 5v1h1a1 1 0 0 1 0 2h-1v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2H3a1 1 0 1 1 0-2h1v-1a5 5 0 0 1 5-5h2V5.72C10.4 5.38 10 4.74 10 4c0-1.1.9-2 2-2Z"
                  fill="#5F7355"
                />
              </svg>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-4xl bg-cream px-6 py-4 shadow-card sm:block">
            <p className="font-display text-2xl text-sage-dark">4.9★</p>
            <p className="text-xs text-ink-soft">from 800+ happy parents</p>
          </div>
        </div>
      </div>

      <div className="scallop-edge scallop-edge--cream" aria-hidden="true" />
    </section>
  );
}
