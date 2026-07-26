"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { StoreCategory } from "@/lib/settings";

const AGE_GROUPS = ["0–3 months", "0–24 months", "6–24 months", "9–24 months", "1–3 years", "1–4 years", "1–5 years"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "bestsellers", label: "Best Sellers" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function ShopFilters({
  colors,
  sizes,
  categories,
}: {
  colors: string[];
  sizes: string[];
  categories: StoreCategory[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "" || next.get(key) === value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    router.push(`${pathname}?${next.toString()}`);
  }

  const activeCategory = params.get("category") || "";
  const activeAge = params.get("age") || "";
  const activeColor = params.get("color") || "";
  const activeSize = params.get("size") || "";
  const activeSort = params.get("sort") || "newest";
  const maxPrice = params.get("maxPrice") || "";

  return (
    <aside className="space-y-8">
      <div>
        <label htmlFor="sort" className="eyebrow">
          Sort By
        </label>
        <select
          id="sort"
          value={activeSort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="mt-2 w-full rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-sage-dark focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="eyebrow">Category</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setParam("category", cat.name)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat.name
                  ? "border-sage-dark bg-sage-dark text-cream"
                  : "border-ink/15 text-ink-soft hover:border-sage-dark"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow">Max Price</p>
        <input
          type="range"
          min={50}
          max={300}
          step={10}
          value={maxPrice || 300}
          onChange={(e) => setParam("maxPrice", e.target.value)}
          className="mt-3 w-full accent-sage-dark"
        />
        <p className="mt-1 text-xs text-ink-soft">Up to GH₵{maxPrice || 300}</p>
      </div>

      <div>
        <p className="eyebrow">Age Group</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {AGE_GROUPS.map((age) => (
            <button
              key={age}
              onClick={() => setParam("age", age)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                activeAge === age
                  ? "border-sage-dark bg-sage-dark text-cream"
                  : "border-ink/15 text-ink-soft hover:border-sage-dark"
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {sizes.length > 0 && (
        <div>
          <p className="eyebrow">Size</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setParam("size", size)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  activeSize === size
                    ? "border-sage-dark bg-sage-dark text-cream"
                    : "border-ink/15 text-ink-soft hover:border-sage-dark"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <p className="eyebrow">Color</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setParam("color", color)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  activeColor === color
                    ? "border-sage-dark bg-sage-dark text-cream"
                    : "border-ink/15 text-ink-soft hover:border-sage-dark"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {(activeCategory || activeAge || activeColor || activeSize || maxPrice) && (
        <button
          onClick={() => router.push(pathname)}
          className="text-xs font-semibold text-sage-dark hover:underline"
        >
          Clear all filters
        </button>
      )}
    </aside>
  );
}
