"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlacedOrder } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { buildWhatsAppLink, buildWhatsAppOrderMessage } from "@/lib/whatsapp";
import type { StoreSettingsData } from "@/lib/settings";

export default function OrderConfirmation({ settings }: { settings: StoreSettingsData }) {
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("ttc_last_order");
      if (raw) setOrder(JSON.parse(raw));
      setScreenshot(sessionStorage.getItem("ttc_last_order_screenshot"));
    } catch {
      // sessionStorage unavailable
    } finally {
      setLoaded(true);
    }
  }, []);

  if (loaded && !order) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center lg:px-10">
        <p className="font-display text-2xl text-ink">No recent order found</p>
        <p className="mt-2 text-sm text-ink-soft">
          If you just placed an order, check your WhatsApp for the confirmation message.
        </p>
        <Link href="/shop" className="btn-primary mt-8 inline-flex">
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const reopenWhatsApp = () => {
    const message = buildWhatsAppOrderMessage(order);
    const link = buildWhatsAppLink(message, settings.whatsappNumber);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-light/40">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5F7355" strokeWidth="2.4">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="eyebrow mt-5">Order Received</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">Thank you, {order.customer.name.split(" ")[0]}!</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Order <span className="font-semibold text-ink">{order.orderNumber}</span> has been sent to our
          WhatsApp. We&apos;ll confirm your payment and get your order ready to ship.
        </p>
      </div>

      <div className="mt-10 rounded-4xl border border-gold/30 bg-gold/10 p-6 text-center">
        <p className="text-sm font-medium text-ink">
          One more step: reopen WhatsApp and attach your payment screenshot to the chat if it
          didn&apos;t send automatically.
        </p>
        <button onClick={reopenWhatsApp} className="btn-gold mt-4 inline-flex">
          Reopen WhatsApp Chat
        </button>
      </div>

      <div className="mt-10 rounded-4xl bg-beige/50 p-7">
        <h2 className="font-display text-xl">Order Details</h2>
        <ul className="mt-5 divide-y divide-ink/10">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between gap-3 py-3 text-sm">
              <span className="text-ink-soft">
                {item.name} × {item.quantity}
                <span className="block text-xs">{item.size} · {item.color}</span>
              </span>
              <span className="whitespace-nowrap font-medium text-ink">
                {formatCurrency(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Subtotal</dt>
            <dd className="text-ink">{formatCurrency(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Shipping</dt>
            <dd className="text-ink">{order.shippingFee === 0 ? "Free" : formatCurrency(order.shippingFee)}</dd>
          </div>
          <div className="flex justify-between text-base">
            <dt className="font-semibold text-ink">Total</dt>
            <dd className="font-semibold text-sage-dark">{formatCurrency(order.total)}</dd>
          </div>
        </dl>

        <div className="mt-6 grid gap-4 border-t border-ink/10 pt-5 sm:grid-cols-2">
          <div>
            <p className="eyebrow">Delivery To</p>
            <p className="mt-1 text-sm text-ink">{order.customer.address}</p>
            <p className="text-sm text-ink-soft">{order.customer.city}, {order.customer.region}</p>
          </div>
          <div>
            <p className="eyebrow">Contact</p>
            <p className="mt-1 text-sm text-ink">{order.customer.phone}</p>
            <p className="text-sm text-ink-soft">WhatsApp: {order.customer.whatsapp}</p>
          </div>
        </div>

        {screenshot && (
          <div className="mt-6 border-t border-ink/10 pt-5">
            <p className="eyebrow">Payment Screenshot</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={screenshot} alt="Payment screenshot" className="mt-2 max-h-56 rounded-2xl object-contain" />
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/shop" className="btn-secondary inline-flex">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
