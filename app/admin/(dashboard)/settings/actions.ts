"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabaseClient } from "@/lib/supabase/server";

function splitList(value: FormDataEntryValue | null): string[] {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function uploadLogo(formData: FormData): Promise<{ url?: string; error?: string }> {
  const supabase = getServerSupabaseClient();
  if (!supabase) return { error: "Supabase isn't connected." };

  const file = formData.get("file") as File;
  if (!(file instanceof File) || file.size === 0) return { error: "No file provided." };

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `branding/logo-${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function saveSettings(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = getServerSupabaseClient();
  if (!supabase) return { error: "Supabase isn't connected." };

  const mobileMoneyAccounts = [
    {
      method: "mtn",
      label: "MTN Mobile Money",
      number: String(formData.get("mtnNumber") || ""),
      accountName: String(formData.get("mtnName") || ""),
    },
    {
      method: "telecel",
      label: "Telecel Cash",
      number: String(formData.get("telecelNumber") || ""),
      accountName: String(formData.get("telecelName") || ""),
    },
    {
      method: "airteltigo",
      label: "AirtelTigo Money",
      number: String(formData.get("airteltigoNumber") || ""),
      accountName: String(formData.get("airteltigoName") || ""),
    },
  ];

  const categoryNames = formData.getAll("categoryName") as string[];
  const categoryBlurbs = formData.getAll("categoryBlurb") as string[];
  const categories = categoryNames
    .map((name, i) => ({
      name: name.trim(),
      slug: name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      blurb: (categoryBlurbs[i] || "").trim(),
    }))
    .filter((c) => c.name);

  const payload = {
    id: 1,
    business_name: String(formData.get("businessName") || "Tiny Treasure Closet"),
    logo_url: String(formData.get("logoUrl") || "") || null,
    business_phone: String(formData.get("businessPhone") || ""),
    whatsapp_number: String(formData.get("whatsappNumber") || "").replace(/[^0-9]/g, ""),
    whatsapp_display: String(formData.get("whatsappDisplay") || ""),
    business_email: String(formData.get("businessEmail") || ""),
    business_address: String(formData.get("businessAddress") || ""),
    facebook_url: String(formData.get("facebookUrl") || ""),
    instagram_url: String(formData.get("instagramUrl") || ""),
    tiktok_url: String(formData.get("tiktokUrl") || ""),
    google_maps_embed: String(formData.get("googleMapsEmbed") || ""),
    homepage_banner_text: String(formData.get("homepageBannerText") || "") || null,
    shipping_fee: Number(formData.get("shippingFee") || 25),
    free_shipping_threshold: Number(formData.get("freeShippingThreshold") || 400),
    payment_instructions: String(formData.get("paymentInstructions") || ""),
    mobile_money_accounts: mobileMoneyAccounts,
    categories,
  };

  const { error } = await supabase.from("store_settings").upsert(payload);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
