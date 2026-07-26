"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/format";
import ProductImage from "@/components/ProductImage";
import type { StoreSettingsData } from "@/lib/settings";

export default function CartView({ settings }: { settings: StoreSettingsData }) {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  const shippingFee = items.length === 0 || subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center lg:px-10">
        <p className="font-display text-2xl text-ink">Your cart is empty</p>
        <p className="mt-2 text-sm text-ink-soft">
          Add a few treasures from the shop and they&apos;ll show up here.
        </p>
        <Link href="/shop" className="btn-primary mt-8 inline-flex">
          Browse the Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
      <p className="eyebrow">Your Selections</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Shopping Cart</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-ink/10">
          {items.map((item) => (
            <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-5 py-6">
              <div className="h-28 w-24 shrink-0 overflow-hidden rounded-3xl">
                <ProductImage url={item.image} alt={item.name} seed={item.productId} />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-display text-base text-ink hover:text-sage-dark">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">
                      {item.size} · {item.color}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-semibold text-ink">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center rounded-full border border-ink/15">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center text-ink-soft hover:text-sage-dark"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center text-ink-soft hover:text-sage-dark"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="text-xs font-semibold text-ink-soft hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-4xl bg-beige/50 p-7">
          <h2 className="font-display text-xl">Order Summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="font-medium text-ink">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd className="font-medium text-ink">
                {shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}
              </dd>
            </div>
            {shippingFee > 0 && (
              <p className="text-xs text-ink-soft">
                Free shipping on orders over {formatCurrency(settings.freeShippingThreshold)}
              </p>
            )}
            <div className="flex justify-between border-t border-ink/10 pt-3 text-base">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="font-semibold text-sage-dark">{formatCurrency(total)}</dd>
            </div>
          </dl>

          <Link href="/checkout" className="btn-primary mt-7 flex w-full">
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="mt-4 block text-center text-xs font-semibold text-ink-soft hover:text-sage-dark">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
