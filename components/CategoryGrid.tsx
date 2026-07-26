import Link from "next/link";
import { StoreCategory } from "@/lib/settings";

export default function CategoryGrid({ categories }: { categories: StoreCategory[] }) {
  const featured = categories.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow">Shop by Category</p>
          <h2 className="mt-2 text-3xl">Find their next favorite</h2>
        </div>
        <Link href="/shop" className="hidden text-sm font-semibold text-sage-dark hover:underline sm:block">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {featured.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group rounded-4xl bg-beige/60 p-5 text-center transition-colors hover:bg-sage-light/50"
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cream shadow-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2c1.1 0 2 .9 2 2 0 .74-.4 1.38-1 1.72V7h2a5 5 0 0 1 5 5v1h1a1 1 0 0 1 0 2h-1v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2H3a1 1 0 1 1 0-2h1v-1a5 5 0 0 1 5-5h2V5.72C10.4 5.38 10 4.74 10 4c0-1.1.9-2 2-2Z"
                  fill="#8FA283"
                />
              </svg>
            </div>
            <p className="font-display text-sm text-ink">{cat.name}</p>
            <p className="mt-0.5 text-xs text-ink-soft">{cat.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
