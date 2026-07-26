"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSupabaseClient } from "@/lib/supabase/server";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function splitList(value: FormDataEntryValue | null): string[] {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Uploads one or more image files to the product-images bucket and returns their public URLs. */
export async function uploadProductImages(formData: FormData): Promise<{ urls: string[]; error?: string }> {
  const supabase = getServerSupabaseClient();
  if (!supabase) return { urls: [], error: "Supabase isn't connected." };

  const files = formData.getAll("files") as File[];
  const urls: string[] = [];

  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue;
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
    if (error) continue;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return { urls };
}

/** Creates a new product or updates an existing one (an `id` field means update). */
export async function saveProduct(formData: FormData): Promise<{ error?: string }> {
  const supabase = getServerSupabaseClient();
  if (!supabase) return { error: "Supabase isn't connected." };

  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Product name is required." };

  let slug = String(formData.get("slug") || "").trim() || slugify(name);
  slug = slugify(slug);

  const payload = {
    slug,
    name,
    description: String(formData.get("description") || ""),
    price: Number(formData.get("price") || 0),
    discount_price: formData.get("discountPrice") ? Number(formData.get("discountPrice")) : null,
    category: String(formData.get("category") || ""),
    subcategory: String(formData.get("subcategory") || "") || null,
    age_group: String(formData.get("ageGroup") || ""),
    sizes: splitList(formData.get("sizes")),
    colors: splitList(formData.get("colors")),
    stock_quantity: Number(formData.get("stock") || 0),
    sku: String(formData.get("sku") || "") || null,
    status: String(formData.get("status") || "active"),
    weight_grams: formData.get("weightGrams") ? Number(formData.get("weightGrams")) : null,
    images: (formData.getAll("images") as string[]).filter(Boolean),
    tags: splitList(formData.get("tags")),
    is_featured: formData.get("isFeatured") === "on",
    is_new_arrival: formData.get("isNewArrival") === "on",
    is_best_seller: formData.get("isBestSeller") === "on",
  };

  const { error } = id
    ? await supabase.from("products").update(payload).eq("id", id)
    : await supabase.from("products").insert(payload);

  if (error) {
    return { error: error.message.includes("duplicate") ? "That SKU or URL slug is already in use." : error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = getServerSupabaseClient();
  if (!supabase) return;
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function duplicateProduct(id: string): Promise<void> {
  const supabase = getServerSupabaseClient();
  if (!supabase) return;
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  if (!data) return;

  const { id: _oldId, created_at, updated_at, ...rest } = data;
  await supabase.from("products").insert({
    ...rest,
    name: `${rest.name} (Copy)`,
    slug: `${rest.slug}-copy-${Date.now().toString(36)}`,
    sku: rest.sku ? `${rest.sku}-COPY` : null,
    status: "draft",
  });

  revalidatePath("/admin/products");
}

export async function toggleProductStatus(id: string, status: "active" | "hidden"): Promise<void> {
  const supabase = getServerSupabaseClient();
  if (!supabase) return;
  await supabase.from("products").update({ status }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function bulkUpdateStatus(ids: string[], status: "active" | "hidden" | "draft"): Promise<void> {
  const supabase = getServerSupabaseClient();
  if (!supabase || ids.length === 0) return;
  await supabase.from("products").update({ status }).in("id", ids);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function bulkDeleteProducts(ids: string[]): Promise<void> {
  const supabase = getServerSupabaseClient();
  if (!supabase || ids.length === 0) return;
  await supabase.from("products").delete().in("id", ids);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
