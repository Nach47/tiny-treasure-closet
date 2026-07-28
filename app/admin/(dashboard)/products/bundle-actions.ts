"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { bundleProducts } from "@/lib/bundle-data";

export async function importBundleProducts(): Promise<{ imported: number; skipped: number; error?: string }> {
  const supabase = getServerSupabaseClient();
  if (!supabase) return { imported: 0, skipped: 0, error: "Supabase isn't connected." };

  let imported = 0;
  let skipped = 0;

  for (const b of bundleProducts) {
    const { data: existing } = await supabase.from("products").select("id").eq("slug", b.slug).maybeSingle();
    if (existing) {
      skipped++;
      continue;
    }

    const { error } = await supabase.from("products").insert({
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
      is_featured: true,
    });

    if (!error) imported++;
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");

  return { imported, skipped };
}
