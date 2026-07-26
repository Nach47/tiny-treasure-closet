import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/settings";
import CartView from "@/components/CartView";

export const metadata: Metadata = {
  title: "Your Cart",
};

export default async function CartPage() {
  const settings = await getStoreSettings();
  return <CartView settings={settings} />;
}
