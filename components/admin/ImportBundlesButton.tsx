"use client";

import { useState, useTransition } from "react";
import { importBundleProducts } from "@/app/admin/(dashboard)/products/bundle-actions";

export default function ImportBundlesButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ imported: number; updated: number; error?: string } | null>(null);

  function handleImport() {
    startTransition(async () => {
      const res = await importBundleProducts();
      setResult(res);
    });
  }

  if (result && !result.error) {
    return (
      <div className="rounded-2xl bg-sage-light/30 px-4 py-3 text-sm text-sage-dark">
        Done — {result.imported > 0 ? `added ${result.imported} new` : ""}
        {result.imported > 0 && result.updated > 0 ? " and " : ""}
        {result.updated > 0 ? `refreshed ${result.updated} existing` : ""} bundle{(result.imported + result.updated) === 1 ? "" : "s"}.
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleImport} disabled={isPending} className="btn-secondary disabled:opacity-60">
        {isPending ? "Importing…" : "Add / Refresh Surprise Bundles (6 Products)"}
      </button>
      {result?.error && <p className="mt-2 text-sm text-red-600">{result.error}</p>}
      <p className="mt-2 text-xs text-ink-soft">
        Safe to click anytime — updates the 6 bundle products to the latest photos, prices, and descriptions.
      </p>
    </div>
  );
}
