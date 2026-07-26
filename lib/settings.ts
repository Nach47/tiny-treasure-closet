import { PaymentMethod } from "./types";

/**
 * Store-wide settings. These read from env vars for now so the storefront
 * works immediately after deployment. Once the Admin Dashboard's `settings`
 * table is built, replace this with a Supabase fetch (see supabase/schema.sql
 * for the suggested `store_settings` row) — the shape below is designed to
 * map onto that table directly.
 */

export interface MobileMoneyAccount {
  method: PaymentMethod;
  label: string;
  number: string;
  accountName: string;
}

export const MOBILE_MONEY_ACCOUNTS: MobileMoneyAccount[] = [
  {
    method: "mtn",
    label: "MTN Mobile Money",
    number: process.env.NEXT_PUBLIC_MTN_MOMO_NUMBER || "024 000 0000",
    accountName: process.env.NEXT_PUBLIC_MTN_MOMO_NAME || "Tiny Treasure Closet",
  },
  {
    method: "telecel",
    label: "Telecel Cash",
    number: process.env.NEXT_PUBLIC_TELECEL_CASH_NUMBER || "020 000 0000",
    accountName: process.env.NEXT_PUBLIC_TELECEL_CASH_NAME || "Tiny Treasure Closet",
  },
  {
    method: "airteltigo",
    label: "AirtelTigo Money",
    number: process.env.NEXT_PUBLIC_AIRTELTIGO_NUMBER || "027 000 0000",
    accountName: process.env.NEXT_PUBLIC_AIRTELTIGO_NAME || "Tiny Treasure Closet",
  },
];

export const PAYMENT_INSTRUCTIONS =
  process.env.NEXT_PUBLIC_PAYMENT_INSTRUCTIONS ||
  "Send the total amount to the number below, take a screenshot of the confirmation, and upload it here before placing your order.";

export interface StoreCategory {
  name: string;
  slug: string;
  blurb: string;
}

export const CATEGORIES: StoreCategory[] = [
  { name: "Newborn", slug: "newborn", blurb: "0–3 months" },
  { name: "Baby Girls", slug: "baby-girls", blurb: "Dresses & sets" },
  { name: "Baby Boys", slug: "baby-boys", blurb: "Shirts & shorts" },
  { name: "Toddlers", slug: "toddlers", blurb: "1–4 years" },
  { name: "Matching Sets", slug: "matching-sets", blurb: "Sibling-ready" },
  { name: "Dresses", slug: "dresses", blurb: "Occasion & everyday" },
  { name: "Shoes", slug: "shoes", blurb: "First steps" },
  { name: "Accessories", slug: "accessories", blurb: "Bows, hats & more" },
  { name: "Sale", slug: "sale", blurb: "Limited-time picks" },
];

export function getCategoryBySlug(slug: string): StoreCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Central",
  "Eastern",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Bono",
  "Bono East",
  "Ahafo",
  "Western North",
  "Oti",
  "Savannah",
  "North East",
];

export const DEFAULT_SHIPPING_FEE = Number(process.env.NEXT_PUBLIC_SHIPPING_FEE || 25);
export const FREE_SHIPPING_THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || 400);
export const BUSINESS_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export const BUSINESS_INFO = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME || "Tiny Treasure Closet",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+233 24 000 0000",
  whatsappDisplay: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || "+233 24 000 0000",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "hello@tinytreasurecloset.com",
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "East Legon, Accra, Ghana",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/tinytreasurecloset",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/tinytreasurecloset",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://tiktok.com/@tinytreasurecloset",
  hours: [
    { day: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
    { day: "Saturday", time: "10:00 AM – 4:00 PM" },
    { day: "Sunday", time: "Closed" },
  ],
  mapEmbedUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED ||
    "https://www.google.com/maps?q=East+Legon+Accra+Ghana&output=embed",
};

/**
 * ── Dynamic settings ────────────────────────────────────────────────────
 * Everything above this line is the *default* configuration, sourced from
 * environment variables so the storefront works before any database is
 * connected. getStoreSettings() overlays a single editable row from the
 * Supabase `store_settings` table (see supabase/schema.sql) on top of those
 * defaults — this is what the Admin Dashboard's Settings page writes to.
 * Call this from Server Components (it's a plain public read, safe
 * anywhere) rather than importing the static constants directly wherever
 * the value might be admin-edited.
 */
export interface StoreSettingsData {
  businessName: string;
  logoUrl: string | null;
  businessPhone: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  businessEmail: string;
  businessAddress: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  googleMapsEmbed: string;
  homepageBannerText: string | null;
  shippingFee: number;
  freeShippingThreshold: number;
  paymentInstructions: string;
  mobileMoneyAccounts: MobileMoneyAccount[];
  categories: StoreCategory[];
  hours: { day: string; time: string }[];
}

function buildDefaultSettings(): StoreSettingsData {
  return {
    businessName: BUSINESS_INFO.name,
    logoUrl: null,
    businessPhone: BUSINESS_INFO.phone,
    whatsappNumber: BUSINESS_WHATSAPP_NUMBER,
    whatsappDisplay: BUSINESS_INFO.whatsappDisplay,
    businessEmail: BUSINESS_INFO.email,
    businessAddress: BUSINESS_INFO.address,
    facebookUrl: BUSINESS_INFO.facebook,
    instagramUrl: BUSINESS_INFO.instagram,
    tiktokUrl: BUSINESS_INFO.tiktok,
    googleMapsEmbed: BUSINESS_INFO.mapEmbedUrl,
    homepageBannerText: null,
    shippingFee: DEFAULT_SHIPPING_FEE,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    paymentInstructions: PAYMENT_INSTRUCTIONS,
    mobileMoneyAccounts: MOBILE_MONEY_ACCOUNTS,
    categories: CATEGORIES,
    hours: BUSINESS_INFO.hours,
  };
}

function mapSettingsRow(row: any, defaults: StoreSettingsData): StoreSettingsData {
  return {
    businessName: row.business_name || defaults.businessName,
    logoUrl: row.logo_url || defaults.logoUrl,
    businessPhone: row.business_phone || defaults.businessPhone,
    whatsappNumber: row.whatsapp_number || defaults.whatsappNumber,
    whatsappDisplay: row.whatsapp_display || defaults.whatsappDisplay,
    businessEmail: row.business_email || defaults.businessEmail,
    businessAddress: row.business_address || defaults.businessAddress,
    facebookUrl: row.facebook_url || defaults.facebookUrl,
    instagramUrl: row.instagram_url || defaults.instagramUrl,
    tiktokUrl: row.tiktok_url || defaults.tiktokUrl,
    googleMapsEmbed: row.google_maps_embed || defaults.googleMapsEmbed,
    homepageBannerText: row.homepage_banner_text || defaults.homepageBannerText,
    shippingFee: row.shipping_fee != null ? Number(row.shipping_fee) : defaults.shippingFee,
    freeShippingThreshold:
      row.free_shipping_threshold != null ? Number(row.free_shipping_threshold) : defaults.freeShippingThreshold,
    paymentInstructions: row.payment_instructions || defaults.paymentInstructions,
    mobileMoneyAccounts:
      Array.isArray(row.mobile_money_accounts) && row.mobile_money_accounts.length > 0
        ? row.mobile_money_accounts
        : defaults.mobileMoneyAccounts,
    categories: Array.isArray(row.categories) && row.categories.length > 0 ? row.categories : defaults.categories,
    hours: defaults.hours,
  };
}

export async function getStoreSettings(): Promise<StoreSettingsData> {
  // Imported lazily (function-scope) to avoid a circular import between
  // settings.ts and supabase/client.ts at module-init time.
  const { getSupabaseClient, isSupabaseConfigured } = await import("./supabase/client");
  const defaults = buildDefaultSettings();
  if (!isSupabaseConfigured) return defaults;

  const supabase = getSupabaseClient()!;
  const { data, error } = await supabase.from("store_settings").select("*").eq("id", 1).single();
  if (error || !data) return defaults;
  return mapSettingsRow(data, defaults);
}
