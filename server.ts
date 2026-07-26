import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "./client";

/**
 * A Supabase client for Server Components and Server Actions that reads and
 * writes the session via Next.js cookies. Use this anywhere you need to know
 * who is logged in (admin pages, server actions) — for plain public reads
 * (products, settings) the simpler client in ./client.ts is fine everywhere.
 */
export function getServerSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Called from a Server Component render (not an action/route
            // handler) — middleware.ts refreshes the session instead.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // See note above.
          }
        },
      },
    }
  );
}
