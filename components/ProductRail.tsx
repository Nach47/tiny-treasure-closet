import Link from "next/link";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductRail({
  eyebrow,
  title,
  products,
  viewAllHref = "/shop",
}: {
  eyebrow: string;
  title: string;
  products: Product[];
  viewAllHref?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-2 text-3xl">{title}</h2>
        </div>
        <Link href={viewAllHref} className="hidden text-sm font-semibold text-sage-dark hover:underline sm:block">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
