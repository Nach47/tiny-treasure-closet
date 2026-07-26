import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/settings";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const settings = await getStoreSettings();
  return <CheckoutForm settings={settings} />;
}
