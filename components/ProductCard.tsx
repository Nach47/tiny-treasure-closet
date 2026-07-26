import Link from "next/link";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const onSale = product.discountPrice != null && product.discountPrice < product.price;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-4xl shadow-card">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <ProductImage url={product.images[0]?.url} alt={product.name} seed={product.id} />
        </div>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="rounded-full bg-cream/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sage-dark">
              New
            </span>
          )}
          {onSale && (
            <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink">
              Sale
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-base text-ink group-hover:text-sage-dark">
            {product.name}
          </h3>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-ink-soft">{product.category}</p>
        </div>
        <div className="text-right">
          {onSale ? (
            <>
              <p className="text-sm font-semibold text-sage-dark">
                {formatCurrency(product.discountPrice as number)}
              </p>
              <p className="text-xs text-ink-soft line-through">{formatCurrency(product.price)}</p>
            </>
          ) : (
            <p className="text-sm font-semibold text-ink">{formatCurrency(product.price)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
