"use server";

import { redirect } from "next/navigation";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function signIn(_prevState: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirectTo") || "/admin");

  const supabase = getServerSupabaseClient();
  if (!supabase) {
    return { error: "Supabase isn't connected yet — add your credentials to .env.local first." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Incorrect email or password." };
  }

  redirect(redirectTo || "/admin");
}

export async function signOut() {
  const supabase = getServerSupabaseClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}
