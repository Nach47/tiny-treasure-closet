import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { getStoreSettings } from "@/lib/settings";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";
import ShopSearchBar from "@/components/ShopSearchBar";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse premium baby and toddler clothing — rompers, dresses, matching sets, shoes and accessories for ages 0–5.",
};

function applyFilters(products: Product[], params: { [key: string]: string | undefined }): Product[] {
  let result = [...products];

  if (params.category) {
    result = result.filter((p) => p.category === params.category || p.tags.includes("sale") && params.category === "Sale");
  }
  if (params.age) {
    result = result.filter((p) => p.ageGroup === params.age);
  }
  if (params.color) {
    result = result.filter((p) => p.colors.includes(params.color as string));
  }
  if (params.size) {
    result = result.filter((p) => p.sizes.includes(params.size as string));
  }
  if (params.maxPrice) {
    const max = Number(params.maxPrice);
    result = result.filter((p) => (p.discountPrice ?? p.price) <= max);
  }
  if (params.q) {
    const q = params.q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  switch (params.sort) {
    case "price-asc":
      result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
      break;
    case "price-desc":
      result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
      break;
    case "bestsellers":
      result.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
      break;
    default:
      result.sort((a, b) => Number(b.isNewArrival) - Number(a.isNewArrival));
  }

  return result;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const allProducts = await getAllProducts();
  const settings = await getStoreSettings();
  const filtered = applyFilters(allProducts, searchParams);

  const colors = Array.from(new Set(allProducts.flatMap((p) => p.colors))).sort();
  const sizes = Array.from(new Set(allProducts.flatMap((p) => p.sizes)));

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">The Full Collection</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Shop All</h1>
        </div>
        <Suspense>
          <ShopSearchBar />
        </Suspense>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <Suspense>
          <ShopFilters colors={colors} sizes={sizes} categories={settings.categories} />
        </Suspense>

        <div>
          <p className="mb-6 text-sm text-ink-soft">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-4xl bg-beige/50 px-8 py-16 text-center">
              <p className="font-display text-xl text-ink">No products match those filters</p>
              <p className="mt-2 text-sm text-ink-soft">
                Try clearing a filter or searching a different term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
