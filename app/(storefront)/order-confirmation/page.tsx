import { getStoreSettings } from "@/lib/settings";
import OrderConfirmation from "@/components/OrderConfirmation";

export default async function OrderConfirmationPage() {
  const settings = await getStoreSettings();
  return <OrderConfirmation settings={settings} />;
}
