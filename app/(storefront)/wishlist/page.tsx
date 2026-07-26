"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { getAllProducts } from "@/lib/products";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { productIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts().then((all) => {
      setProducts(all.filter((p) => productIds.includes(p.id)));
      setLoading(false);
    });
  }, [productIds]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <p className="eyebrow">Saved for Later</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Your Wishlist</h1>

      {!loading && products.length === 0 && (
        <div className="mt-10 rounded-4xl bg-beige/50 px-8 py-16 text-center">
          <p className="font-display text-xl text-ink">Your wishlist is empty</p>
          <p className="mt-2 text-sm text-ink-soft">
            Tap the heart on any product to save it here for later.
          </p>
          <Link href="/shop" className="btn-primary mt-6 inline-flex">
            Browse the Shop
          </Link>
        </div>
      )}

      {products.length > 0 && (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
