import { getSupabaseClient, isSupabaseConfigured } from "./supabase/client";
import { CartItem, Order, OrderStatus, PlacedOrder } from "./types";

export function mapOrderRow(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    items: (row.items ?? []) as CartItem[],
    subtotal: Number(row.subtotal),
    shippingFee: Number(row.shipping_fee),
    total: Number(row.total),
    customer: {
      name: row.customer_name,
      phone: row.customer_phone,
      whatsapp: row.customer_whatsapp,
      email: row.customer_email ?? undefined,
      address: row.delivery_address,
      region: row.region ?? "",
      city: row.city,
      notes: row.notes ?? undefined,
    },
    paymentMethod: row.payment_method,
    paymentScreenshotPath: row.payment_screenshot_path,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Persists a placed order to Supabase (customer-facing, uses the public
 * anon key — RLS only allows INSERT, never read/update/delete, from this
 * context). If Supabase isn't configured yet, this quietly no-ops so the
 * WhatsApp-only flow from the core storefront phase still works.
 */
export async function createOrder(
  order: PlacedOrder,
  screenshotFile?: File | null
): Promise<{ success: boolean; screenshotPath?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  const supabase = getSupabaseClient()!;
  let screenshotPath: string | undefined;

  if (screenshotFile) {
    const safeName = screenshotFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${order.orderNumber}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("payment-screenshots")
      .upload(path, screenshotFile, { upsert: false });
    if (!uploadError) screenshotPath = path;
  }

  const { error } = await supabase.from("orders").insert({
    order_number: order.orderNumber,
    status: "pending",
    items: order.items,
    subtotal: order.subtotal,
    shipping_fee: order.shippingFee,
    total: order.total,
    customer_name: order.customer.name,
    customer_phone: order.customer.phone,
    customer_whatsapp: order.customer.whatsapp,
    customer_email: order.customer.email || null,
    delivery_address: order.customer.address,
    region: order.customer.region,
    city: order.customer.city,
    notes: order.customer.notes || null,
    payment_method: order.paymentMethod,
    payment_screenshot_path: screenshotPath || null,
  });

  return { success: !error, screenshotPath };
}
