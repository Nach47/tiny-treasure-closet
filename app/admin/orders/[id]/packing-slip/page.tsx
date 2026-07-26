import { notFound } from "next/navigation";
import { adminGetOrderById } from "@/lib/admin/orders";
import { getStoreSettings } from "@/lib/settings";
import PrintButton from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

export default async function PackingSlipPage({ params }: { params: { id: string } }) {
  const [order, settings] = await Promise.all([adminGetOrderById(params.id), getStoreSettings()]);
  if (!order) notFound();

  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="mx-auto max-w-2xl px-8 py-12 text-ink">
      <PrintButton />

      <div className="flex items-start justify-between border-b border-ink/15 pb-6">
        <div>
          <p className="font-display text-2xl">{settings.businessName}</p>
          <p className="mt-1 text-sm text-ink-soft">Packing Slip</p>
        </div>
        <div className="text-right">
          <p className="font-display text-xl">{order.orderNumber}</p>
          <p className="text-sm text-ink-soft">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mt-6 text-sm">
        <p className="eyebrow">Ship To</p>
        <p className="mt-1 font-medium text-ink">{order.customer.name}</p>
        <p className="text-ink-soft">{order.customer.phone} · WhatsApp {order.customer.whatsapp}</p>
        <p className="text-ink-soft">{order.customer.address}</p>
        <p className="text-ink-soft">{order.customer.city}, {order.customer.region}</p>
        {order.customer.notes && (
          <p className="mt-3 rounded-xl border border-dashed border-ink/20 p-3 text-xs">
            <span className="font-semibold">Note: </span>
            {order.customer.notes}
          </p>
        )}
      </div>

      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="border-b border-ink/15 text-left text-xs uppercase tracking-wide text-ink-soft">
            <th className="py-2">Item</th>
            <th className="py-2">Size / Color</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Packed</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={`${item.productId}-${item.size}-${item.color}`} className="border-b border-ink/5">
              <td className="py-3">{item.name}</td>
              <td className="py-3 text-ink-soft">{item.size} / {item.color}</td>
              <td className="py-3 text-right">{item.quantity}</td>
              <td className="py-3 text-right">
                <span className="inline-block h-4 w-4 rounded border border-ink/30" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-6 text-sm text-ink-soft">Total items: {totalItems}</p>

      <p className="mt-16 text-center text-xs text-ink-soft">Packed with care by {settings.businessName}.</p>
    </div>
  );
}
