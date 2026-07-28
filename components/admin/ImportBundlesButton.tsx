"use client";

import { useState, useTransition } from "react";
import { importBundleProducts } from "@/app/admin/(dashboard)/products/bundle-actions";

export default function ImportBundlesButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ imported: number; skipped: number; error?: string } | null>(null);

  function handleImport() {
    startTransition(async () => {
      const res = await importBundleProducts();
      setResult(res);
    });
  }

  if (result && !result.error) {
    return (
      <div className="rounded-2xl bg-sage-light/30 px-4 py-3 text-sm text-sage-dark">
        Done — added {result.imported} bundle{result.imported === 1 ? "" : "s"}
        {result.skipped > 0 ? ` (${result.skipped} already existed and were skipped)` : ""}.
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleImport} disabled={isPending} className="btn-secondary disabled:opacity-60">
        {isPending ? "Importing…" : "Add Surprise Bundles (6 Products)"}
      </button>
      {result?.error && <p className="mt-2 text-sm text-red-600">{result.error}</p>}
      <p className="mt-2 text-xs text-ink-soft">
        Adds 3 sizes of the 5-piece bundle and 3 sizes of the 10-piece bundle. Edit prices or descriptions anytime from the product list below.
      </p>
    </div>
  );
}
