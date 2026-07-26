import "server-only";

import { getServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { mapOrderRow } from "@/lib/orders";
import { Order, OrderStatus } from "@/lib/types";

export async function adminGetAllOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = getServerSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapOrderRow);
}

export async function adminGetOrderById(id: string): Promise<Order | undefined> {
  if (!isSupabaseConfigured) return undefined;
  const supabase = getServerSupabaseClient();
  if (!supabase) return undefined;
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
  if (error || !data) return undefined;
  return mapOrderRow(data);
}

export async function adminUpdateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const supabase = getServerSupabaseClient();
  if (!supabase) return false;
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  return !error;
}

export async function adminGetPaymentScreenshotUrl(path: string): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = getServerSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.storage.from("payment-screenshots").createSignedUrl(path, 60 * 10);
  if (error || !data) return null;
  return data.signedUrl;
}
