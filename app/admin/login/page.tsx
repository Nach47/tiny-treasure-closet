"use client";

import { Suspense } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { signIn } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary flex w-full disabled:opacity-60">
      {pending ? "Signing in…" : "Sign In"}
    </button>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";
  const [state, formAction] = useFormState(signIn, undefined);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <label className="block text-sm">
        <span className="font-medium text-ink">Email</span>
        <input name="email" type="email" required className="input mt-1.5" placeholder="you@tinytreasurecloset.com" />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-ink">Password</span>
        <input name="password" type="password" required className="input mt-1.5" placeholder="••••••••" />
      </label>

      {state?.error && (
        <p className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-beige/40 px-6">
      <div className="w-full max-w-sm rounded-4xl bg-white p-8 shadow-card">
        <p className="eyebrow text-center">Tiny Treasure Closet</p>
        <h1 className="mt-2 text-center text-2xl">Admin Sign In</h1>
        <p className="mt-2 text-center text-xs text-ink-soft">
          Store owner and staff access only.
        </p>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-ink-soft">
          Don&apos;t have an account? Ask the store owner to add you in Supabase &gt;
          Authentication &gt; Users.
        </p>
      </div>
    </div>
  );
}
