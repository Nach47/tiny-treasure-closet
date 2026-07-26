"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { exportOrdersToCsv, exportOrdersToExcel } from "@/lib/export";

const STATUS_TABS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-gold/15 text-gold",
  paid: "bg-sage-light/40 text-sage-dark",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [statusTab, setStatusTab] = useState<OrderStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusTab === "all" || o.status === statusTab;
      const matchesQuery =
        !query ||
        o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.phone.includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [orders, statusTab, query]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: orders.length };
    orders.forEach((o) => {
      map[o.status] = (map[o.status] || 0) + 1;
    });
    return map;
  }, [orders]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusTab(tab.value)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              statusTab === tab.value ? "border-sage-dark bg-sage-dark text-cream" : "border-ink/15 text-ink-soft hover:border-sage-dark"
            }`}
          >
            {tab.label} {counts[tab.value] ? `(${counts[tab.value]})` : ""}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order #, customer, or phone…"
          className="input sm:max-w-xs"
        />
        <div className="flex gap-2">
          <button onClick={() => exportOrdersToCsv(filtered)} className="btn-secondary py-2 text-xs">
            Export CSV
          </button>
          <button onClick={() => exportOrdersToExcel(filtered)} className="btn-secondary py-2 text-xs">
            Export Excel
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-3xl border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Placed</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-ink/5 last:border-0 hover:bg-beige/20">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-ink hover:text-sage-dark">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {order.customer.name}
                  <span className="block text-xs">{order.customer.phone}</span>
                </td>
                <td className="px-4 py-3 text-ink-soft">{order.items.length} item{order.items.length === 1 ? "" : "s"}</td>
                <td className="px-4 py-3 font-medium text-ink">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-soft">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-soft">
                  No orders match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
