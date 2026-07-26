"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { bulkDeleteProducts, bulkUpdateStatus, deleteProduct, duplicateProduct, toggleProductStatus } from "@/app/admin/(dashboard)/products/actions";

const STATUS_FILTERS = ["all", "active", "hidden", "draft"] as const;

export default function ProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [products, query, statusFilter]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) => (prev.size === filtered.length ? new Set() : new Set(filtered.map((p) => p.id))));
  }

  function runBulk(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
      setSelected(new Set());
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or SKU…"
            className="input sm:max-w-xs"
          />
          <div className="flex gap-2">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                  statusFilter === s ? "border-sage-dark bg-sage-dark text-cream" : "border-ink/15 text-ink-soft hover:border-sage-dark"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <Link href="/admin/products/new" className="btn-primary whitespace-nowrap">
          + Add Product
        </Link>
      </div>

      {selected.size > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-sage-light/30 px-4 py-3 text-sm">
          <span className="font-medium text-ink">{selected.size} selected</span>
          <button
            disabled={isPending}
            onClick={() => runBulk(() => bulkUpdateStatus(Array.from(selected), "active"))}
            className="font-semibold text-sage-dark hover:underline disabled:opacity-50"
          >
            Set Active
          </button>
          <button
            disabled={isPending}
            onClick={() => runBulk(() => bulkUpdateStatus(Array.from(selected), "hidden"))}
            className="font-semibold text-ink-soft hover:underline disabled:opacity-50"
          >
            Hide
          </button>
          <button
            disabled={isPending}
            onClick={() => {
              if (confirm(`Delete ${selected.size} product(s)? This cannot be undone.`)) {
                runBulk(() => bulkDeleteProducts(Array.from(selected)));
              }
            }}
            className="font-semibold text-red-600 hover:underline disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-3xl border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selected.size === filtered.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded accent-sage-dark"
                />
              </th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-ink/5 last:border-0 hover:bg-beige/20">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    className="h-4 w-4 rounded accent-sage-dark"
                  />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.id}`} className="font-medium text-ink hover:text-sage-dark">
                    {p.name}
                  </Link>
                  <p className="text-xs text-ink-soft">{p.sku}</p>
                </td>
                <td className="px-4 py-3 text-ink-soft">{p.category}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {formatCurrency(p.discountPrice ?? p.price)}
                  {p.discountPrice != null && (
                    <span className="ml-1.5 text-xs line-through">{formatCurrency(p.price)}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={p.stock <= 5 ? "font-semibold text-red-600" : "text-ink-soft"}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      p.status === "active"
                        ? "bg-sage-light/40 text-sage-dark"
                        : p.status === "hidden"
                          ? "bg-beige text-ink-soft"
                          : "bg-gold/15 text-gold"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3 text-xs font-semibold">
                    <Link href={`/admin/products/${p.id}`} className="text-sage-dark hover:underline">
                      Edit
                    </Link>
                    <button
                      onClick={() => runBulk(() => duplicateProduct(p.id))}
                      className="text-ink-soft hover:underline"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => runBulk(() => toggleProductStatus(p.id, p.status === "active" ? "hidden" : "active"))}
                      className="text-ink-soft hover:underline"
                    >
                      {p.status === "active" ? "Hide" : "Unhide"}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${p.name}"? This cannot be undone.`)) {
                          runBulk(() => deleteProduct(p.id));
                        }
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-ink-soft">
                  No products match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
