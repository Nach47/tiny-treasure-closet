import { adminGetAllOrders } from "@/lib/admin/orders";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await adminGetAllOrders();

  return (
    <div>
      <p className="eyebrow">Fulfillment</p>
      <h1 className="mt-1 text-2xl">Orders</h1>
      <p className="mt-1 text-sm text-ink-soft">{orders.length} total</p>

      <div className="mt-6">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
