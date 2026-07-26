import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { getStoreSettings, CATEGORIES as DEFAULT_CATEGORIES } from "@/lib/settings";
import ProductCard from "@/components/ProductCard";

export async function generateStaticParams() {
  const settings = await getStoreSettings();
  return settings.categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const settings = await getStoreSettings();
  const category = settings.categories.find((c) => c.slug === params.slug);
  if (!category) return {};
  return {
    title: `${category.name} — Shop ${category.name}`,
    description: `Shop our ${category.name.toLowerCase()} collection: ${category.blurb.toLowerCase()}. Premium baby and toddler clothing.`,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const settings = await getStoreSettings();
  const category = settings.categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const allProducts = await getAllProducts();
  const products =
    category.name === "Sale"
      ? allProducts.filter((p) => p.discountPrice != null && p.discountPrice < p.price)
      : allProducts.filter((p) => p.category === category.name);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <p className="eyebrow">{category.blurb}</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">{category.name}</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {settings.categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              c.slug === category.slug
                ? "border-sage-dark bg-sage-dark text-cream"
                : "border-ink/15 text-ink-soft hover:border-sage-dark"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-ink-soft">
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>

      {products.length === 0 ? (
        <div className="mt-6 rounded-4xl bg-beige/50 px-8 py-16 text-center">
          <p className="font-display text-xl text-ink">No products in this category yet</p>
          <p className="mt-2 text-sm text-ink-soft">Check back soon — new pieces are added often.</p>
          <Link href="/shop" className="btn-primary mt-6 inline-flex">
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
