"use client";

import { useState } from "react";

export default function Newsletter() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Wire this up to a Supabase `subscribers` table or an email provider
    // once the admin dashboard's settings page is connected.
    setStatus("submitted");
  }

  return (
    <section className="bg-ink py-20">
      <div className="mx-auto max-w-2xl px-6 text-center lg:px-10">
        <p className="eyebrow text-gold-light">Stay in the Loop</p>
        <h2 className="mt-2 text-3xl text-cream">Get first access to new arrivals</h2>
        <p className="mt-3 text-sm text-cream/70">
          Occasional notes on new drops and small-batch restocks. No spam, ever.
        </p>

        {status === "submitted" ? (
          <p className="mt-8 font-display text-lg text-gold-light">
            You&apos;re on the list — thank you!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@email.com"
              className="w-full rounded-full border border-cream/20 bg-cream/5 px-5 py-3.5 text-sm text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none sm:w-72"
            />
            <button type="submit" className="btn-gold">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
