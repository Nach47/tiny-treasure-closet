import { notFound } from "next/navigation";
import { adminGetOrderById } from "@/lib/admin/orders";
import { getStoreSettings } from "@/lib/settings";
import { formatCurrency } from "@/lib/format";
import PrintButton from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const [order, settings] = await Promise.all([adminGetOrderById(params.id), getStoreSettings()]);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-8 py-12 text-ink">
      <PrintButton />

      <div className="flex items-start justify-between border-b border-ink/15 pb-6">
        <div>
          <p className="font-display text-2xl">{settings.businessName}</p>
          <p className="mt-1 text-sm text-ink-soft">{settings.businessAddress}</p>
          <p className="text-sm text-ink-soft">{settings.businessPhone} · {settings.businessEmail}</p>
        </div>
        <div className="text-right">
          <p className="eyebrow">Invoice</p>
          <p className="mt-1 font-display text-xl">{order.orderNumber}</p>
          <p className="text-sm text-ink-soft">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="eyebrow">Bill To</p>
          <p className="mt-1 font-medium text-ink">{order.customer.name}</p>
          <p className="text-ink-soft">{order.customer.phone}</p>
          <p className="text-ink-soft">{order.customer.address}</p>
          <p className="text-ink-soft">{order.customer.city}, {order.customer.region}</p>
        </div>
        <div className="text-right">
          <p className="eyebrow">Payment</p>
          <p className="mt-1 capitalize text-ink">
            {order.paymentMethod === "mtn" ? "MTN Mobile Money" : order.paymentMethod === "telecel" ? "Telecel Cash" : "AirtelTigo Money"}
          </p>
          <p className="capitalize text-ink-soft">Status: {order.status}</p>
        </div>
      </div>

      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="border-b border-ink/15 text-left text-xs uppercase tracking-wide text-ink-soft">
            <th className="py-2">Item</th>
            <th className="py-2">Qty</th>
            <th className="py-2 text-right">Unit Price</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={`${item.productId}-${item.size}-${item.color}`} className="border-b border-ink/5">
              <td className="py-2.5">
                {item.name}
                <span className="block text-xs text-ink-soft">{item.size} · {item.color}</span>
              </td>
              <td className="py-2.5">{item.quantity}</td>
              <td className="py-2.5 text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="py-2.5 text-right">{formatCurrency(item.unitPrice * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <div className="w-56 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-soft">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Shipping</span>
            <span>{order.shippingFee === 0 ? "Free" : formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between border-t border-ink/15 pt-1.5 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <p className="mt-12 text-center text-xs text-ink-soft">Thank you for shopping with {settings.businessName}.</p>
    </div>
  );
}
