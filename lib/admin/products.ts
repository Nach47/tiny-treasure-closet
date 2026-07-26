import "server-only";

import { getServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { mapRow } from "@/lib/products";
import { sampleProducts } from "@/lib/sample-data";
import { Product } from "@/lib/types";

export async function adminGetAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return sampleProducts;
  const supabase = getServerSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapRow);
}

export async function adminGetProductById(id: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured) return sampleProducts.find((p) => p.id === id);
  const supabase = getServerSupabaseClient();
  if (!supabase) return undefined;
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error || !data) return undefined;
  return mapRow(data);
}
