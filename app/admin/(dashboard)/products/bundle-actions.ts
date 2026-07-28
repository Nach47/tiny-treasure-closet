"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { bundleProducts } from "@/lib/bundle-data";

export async function importBundleProducts(): Promise<{ imported: number; updated: number; error?: string }> {
  const supabase = getServerSupabaseClient();
  if (!supabase) return { imported: 0, updated: 0, error: "Supabase isn't connected." };

  let imported = 0;
  let updated = 0;

  for (const b of bundleProducts) {
    const { data: existing } = await supabase.from("products").select("id").eq("slug", b.slug).maybeSingle();

    const payload = {
      slug: b.slug,
      name: b.name,
      description: b.description,
      price: b.price,
      category: "Surprise Bundles",
      age_group: b.ageGroup,
      sizes: [],
      colors: [],
      stock_quantity: b.stock,
      sku: b.sku,
      status: "active",
      images: b.images,
      tags: b.tags,
      is_featured: b.featured,
    };

    if (existing) {
      const { error } = await supabase.from("products").update(payload).eq("id", existing.id);
      if (!error) updated++;
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (!error) imported++;
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");

  return { imported, updated };
}
