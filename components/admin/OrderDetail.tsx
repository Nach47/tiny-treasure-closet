"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { updateOrderStatus } from "@/app/admin/(dashboard)/orders/actions";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function OrderDetail({ order, screenshotUrl }: { order: Order; screenshotUrl: string | null }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/orders" className="text-xs font-semibold text-ink-soft hover:text-sage-dark">
            ← Back to Orders
          </Link>
          <h1 className="mt-2 text-2xl">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-ink-soft">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={order.status}
            disabled={isPending}
            onChange={(e) => startTransition(() => updateOrderStatus(order.id, e.target.value as OrderStatus))}
            className="input w-auto capitalize"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <a href={`/admin/orders/${order.id}/invoice`} target="_blank" rel="noopener noreferrer" className="btn-secondary py-2 text-xs">
            Print Invoice
          </a>
          <a href={`/admin/orders/${order.id}/packing-slip`} target="_blank" rel="noopener noreferrer" className="btn-secondary py-2 text-xs">
            Print Packing Slip
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-4xl bg-white p-7 shadow-card">
          <h2 className="font-display text-lg">Items</h2>
          <ul className="mt-4 divide-y divide-ink/10">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between gap-3 py-3 text-sm">
                <span className="text-ink-soft">
                  {item.name} × {item.quantity}
                  <span className="block text-xs">{item.size} · {item.color}</span>
                </span>
                <span className="whitespace-nowrap font-medium text-ink">{formatCurrency(item.unitPrice * item.quantity)}</span>
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

          {screenshotUrl && (
            <div className="mt-6 border-t border-ink/10 pt-5">
              <p className="eyebrow">Payment Screenshot</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={screenshotUrl} alt="Payment screenshot" className="mt-2 max-h-72 rounded-2xl object-contain" />
              <p className="mt-1 text-xs text-ink-soft">Link expires after a few minutes — reopen this page to refresh it.</p>
            </div>
          )}
          {!screenshotUrl && (
            <p className="mt-6 border-t border-ink/10 pt-5 text-sm text-ink-soft">
              No payment screenshot on file for this order.
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl bg-white p-6 shadow-card">
            <p className="eyebrow">Customer</p>
            <p className="mt-2 font-display text-lg text-ink">{order.customer.name}</p>
            <p className="mt-1 text-sm text-ink-soft">{order.customer.phone}</p>
            <p className="text-sm text-ink-soft">WhatsApp: {order.customer.whatsapp}</p>
            {order.customer.email && <p className="text-sm text-ink-soft">{order.customer.email}</p>}
          </div>

          <div className="rounded-4xl bg-white p-6 shadow-card">
            <p className="eyebrow">Delivery</p>
            <p className="mt-2 text-sm text-ink">{order.customer.address}</p>
            <p className="text-sm text-ink-soft">{order.customer.city}, {order.customer.region}</p>
            {order.customer.notes && (
              <p className="mt-3 rounded-2xl bg-beige/50 p-3 text-xs text-ink-soft">{order.customer.notes}</p>
            )}
          </div>

          <div className="rounded-4xl bg-white p-6 shadow-card">
            <p className="eyebrow">Payment</p>
            <p className="mt-2 text-sm capitalize text-ink">{order.paymentMethod === "mtn" ? "MTN Mobile Money" : order.paymentMethod === "telecel" ? "Telecel Cash" : "AirtelTigo Money"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
