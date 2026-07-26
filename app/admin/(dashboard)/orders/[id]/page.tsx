import { notFound } from "next/navigation";
import { adminGetOrderById, adminGetPaymentScreenshotUrl } from "@/lib/admin/orders";
import OrderDetail from "@/components/admin/OrderDetail";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await adminGetOrderById(params.id);
  if (!order) notFound();

  const screenshotUrl = order.paymentScreenshotPath
    ? await adminGetPaymentScreenshotUrl(order.paymentScreenshotPath)
    : null;

  return <OrderDetail order={order} screenshotUrl={screenshotUrl} />;
}
