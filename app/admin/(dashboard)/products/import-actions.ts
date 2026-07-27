"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { seedProducts } from "@/lib/seed-data";

export async function importSeedProducts(): Promise<{ imported: number; skipped: number; error?: string }> {
  const supabase = getServerSupabaseClient();
  if (!supabase) return { imported: 0, skipped: 0, error: "Supabase isn't connected." };

  let imported = 0;
  let skipped = 0;

  for (const p of seedProducts) {
    const { data: existing } = await supabase.from("products").select("id").eq("slug", p.slug).maybeSingle();
    if (existing) {
      skipped++;
      continue;
    }

    const { error } = await supabase.from("products").insert({
      slug: p.slug,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      age_group: p.ageGroup,
      sizes: p.sizes,
      colors: p.colors,
      stock_quantity: p.stock,
      sku: p.sku,
      status: "active",
      images: [p.image],
      tags: p.tags,
    });

    if (!error) imported++;
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");

  return { imported, skipped };
}
