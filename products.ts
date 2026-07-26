import { getSupabaseClient, isSupabaseConfigured } from "./supabase/client";
import { sampleProducts, getSampleProductBySlug } from "./sample-data";
import { Product } from "./types";

// Maps a Supabase `products` row (see supabase/schema.sql) to the Product
// shape the UI uses. Column names use snake_case in Postgres by convention.
export function mapRow(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    price: Number(row.price),
    discountPrice: row.discount_price ? Number(row.discount_price) : null,
    category: row.category,
    subcategory: row.subcategory ?? undefined,
    ageGroup: row.age_group ?? "",
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    stock: row.stock_quantity ?? 0,
    sku: row.sku ?? "",
    status: row.status ?? "active",
    weightGrams: row.weight_grams ?? undefined,
    images: (row.images ?? []).map((url: string) => ({ url })),
    tags: row.tags ?? [],
    isFeatured: Boolean(row.is_featured),
    isNewArrival: Boolean(row.is_new_arrival),
    isBestSeller: Boolean(row.is_best_seller),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return sampleProducts;
  const supabase = getSupabaseClient()!;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (error || !data) return sampleProducts;
  return data.map(mapRow);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured) return getSampleProductBySlug(slug);
  const supabase = getSupabaseClient()!;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  if (error || !data) return getSampleProductBySlug(slug);
  return mapRow(data);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getAllProducts();
  return all
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.isFeatured);
}

export async function getNewArrivals(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.isNewArrival);
}

export async function getBestSellers(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.isBestSeller);
}
