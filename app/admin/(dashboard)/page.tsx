import Link from "next/link";
import { adminGetAllOrders } from "@/lib/admin/orders";
import { adminGetAllProducts } from "@/lib/admin/products";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function isSameMonth(a: Date, b: Date) {
  return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

export default async function AdminDashboardPage() {
  const [orders, products] = await Promise.all([adminGetAllOrders(), adminGetAllProducts()]);

  const now = new Date();
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0);
  const todaySales = orders
    .filter((o) => o.status !== "cancelled" && isSameDay(new Date(o.createdAt), now))
    .reduce((sum, o) => sum + o.total, 0);
  const monthSales = orders
    .filter((o) => o.status !== "cancelled" && isSameMonth(new Date(o.createdAt), now))
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock <= 0).length;
  const recentOrders = orders.slice(0, 6);
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = products.filter((p) => p.stock <= 0 && p.status !== "draft");

  const stats = [
    { label: "Total Orders", value: orders.length },
    { label: "Total Products", value: products.length },
    { label: "Revenue", value: formatCurrency(revenue) },
    { label: "Pending Orders", value: pendingOrders },
    { label: "Low Stock", value: lowStock + outOfStock, hint: `${outOfStock} out of stock` },
    { label: "Today's Sales", value: formatCurrency(todaySales) },
    { label: "Monthly Sales", value: formatCurrency(monthSales) },
  ];

  return (
    <div>
      <p className="eyebrow">Overview</p>
      <h1 className="mt-1 text-2xl">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl bg-white p-5 shadow-card">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{stat.label}</p>
            <p className="mt-2 font-display text-2xl text-ink">{stat.value}</p>
            {stat.hint && <p className="mt-1 text-xs text-ink-soft">{stat.hint}</p>}
          </div>
        ))}
      </div>

      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="mt-8 rounded-4xl border border-gold/30 bg-gold/10 p-6">
          <h2 className="font-display text-lg text-ink">Stock Alerts</h2>
          <div className="mt-3 space-y-2 text-sm">
            {outOfStockProducts.map((p) => (
              <Link key={p.id} href={`/admin/products/${p.id}`} className="flex items-center justify-between hover:underline">
                <span className="text-ink">{p.name}</span>
                <span className="font-semibold text-red-600">Out of stock</span>
              </Link>
            ))}
            {lowStockProducts.map((p) => (
              <Link key={p.id} href={`/admin/products/${p.id}`} className="flex items-center justify-between hover:underline">
                <span className="text-ink">{p.name}</span>
                <span className="font-semibold text-gold">{p.stock} left</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-4xl bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-sage-dark hover:underline">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-ink-soft">No orders yet.</p>
        ) : (
          <div className="mt-4 divide-y divide-ink/10">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between py-3 text-sm hover:text-sage-dark"
              >
                <div>
                  <p className="font-medium text-ink">{order.orderNumber}</p>
                  <p className="text-xs text-ink-soft">{order.customer.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-ink">{formatCurrency(order.total)}</p>
                  <p className="text-xs capitalize text-ink-soft">{order.status}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
