import { CartItem, CheckoutDetails, PaymentMethod, PlacedOrder } from "./types";
import { formatCurrency } from "./format";

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  mtn: "MTN Mobile Money",
  telecel: "Telecel Cash",
  airteltigo: "AirtelTigo Money",
};

/**
 * Builds the pre-filled order message sent to the business WhatsApp number.
 * Every field the checkout collects is included so the order can be
 * fulfilled entirely from WhatsApp if needed.
 */
export function buildWhatsAppOrderMessage(order: PlacedOrder): string {
  const lines: string[] = [];

  lines.push(`*New Order — ${order.orderNumber}*`);
  lines.push("");
  lines.push(`*Customer:* ${order.customer.name}`);
  lines.push(`*Phone:* ${order.customer.phone}`);
  lines.push(`*WhatsApp:* ${order.customer.whatsapp}`);
  if (order.customer.email) lines.push(`*Email:* ${order.customer.email}`);
  lines.push(`*Delivery Address:* ${order.customer.address}`);
  lines.push(`*City / Region:* ${order.customer.city}, ${order.customer.region}`);
  if (order.customer.notes) lines.push(`*Notes:* ${order.customer.notes}`);
  lines.push("");
  lines.push("*Items:*");
  order.items.forEach((item, i) => {
    lines.push(
      `${i + 1}. ${item.name} (Size: ${item.size}, Color: ${item.color}) x${item.quantity} — ${formatCurrency(
        item.unitPrice * item.quantity
      )}`
    );
  });
  lines.push("");
  lines.push(`*Subtotal:* ${formatCurrency(order.subtotal)}`);
  lines.push(`*Shipping:* ${formatCurrency(order.shippingFee)}`);
  lines.push(`*Grand Total:* ${formatCurrency(order.total)}`);
  lines.push("");
  lines.push(`*Payment Method:* ${PAYMENT_LABELS[order.paymentMethod]}`);
  lines.push(
    `*Payment Status:* ${order.paymentScreenshotName ? "Screenshot attached — pending confirmation" : "Not yet uploaded"}`
  );
  if (order.paymentScreenshotName) {
    lines.push(`*Payment Screenshot:* ${order.paymentScreenshotName} (see attachment sent separately)`);
  }

  return lines.join("\n");
}

/**
 * Builds a wa.me deep link. The business number is read from
 * NEXT_PUBLIC_WHATSAPP_NUMBER (editable in the Admin Dashboard once the
 * settings table is wired up) and must be in international format with no
 * leading + or spaces, e.g. 233241234567.
 */
export function buildWhatsAppLink(message: string, businessNumber?: string): string {
  const number = businessNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

export function buildOrderFromCart(args: {
  orderNumber: string;
  items: CartItem[];
  shippingFee: number;
  customer: CheckoutDetails;
  paymentMethod: PaymentMethod;
  paymentScreenshotName?: string;
}): PlacedOrder {
  const subtotal = args.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return {
    orderNumber: args.orderNumber,
    items: args.items,
    subtotal,
    shippingFee: args.shippingFee,
    total: subtotal + args.shippingFee,
    customer: args.customer,
    paymentMethod: args.paymentMethod,
    paymentScreenshotName: args.paymentScreenshotName,
    createdAt: new Date().toISOString(),
  };
}
