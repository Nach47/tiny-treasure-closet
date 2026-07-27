"use client";

import { useState, useTransition } from "react";
import { importSeedProducts } from "@/app/admin/(dashboard)/products/import-actions";

export default function ImportCatalogButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ imported: number; skipped: number; error?: string } | null>(null);

  function handleImport() {
    startTransition(async () => {
      const res = await importSeedProducts();
      setResult(res);
    });
  }

  if (result && !result.error) {
    return (
      <div className="rounded-2xl bg-sage-light/30 px-4 py-3 text-sm text-sage-dark">
        Done — added {result.imported} new product{result.imported === 1 ? "" : "s"}
        {result.skipped > 0 ? ` (${result.skipped} already existed and were skipped)` : ""}.
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleImport} disabled={isPending} className="btn-primary disabled:opacity-60">
        {isPending ? "Importing… this may take a minute" : "Import Starter Catalog (62 Products)"}
      </button>
      {result?.error && <p className="mt-2 text-sm text-red-600">{result.error}</p>}
      <p className="mt-2 text-xs text-ink-soft">
        Safe to click more than once — anything already added won&apos;t be duplicated.
      </p>
    </div>
  );
}
