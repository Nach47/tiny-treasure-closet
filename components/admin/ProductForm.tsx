"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/settings";
import { saveProduct, uploadProductImages } from "@/app/admin/(dashboard)/products/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? "Saving…" : "Save Product"}
    </button>
  );
}

export default function ProductForm({ product }: { product?: Product }) {
  const [images, setImages] = useState<string[]>(product?.images.map((i) => i.url) ?? []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    const result = await uploadProductImages(fd);
    if (result.error) setError(result.error);
    setImages((prev) => [...prev, ...result.urls]);
    setUploading(false);
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await saveProduct(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={handleSubmit} className="space-y-10">
      {product && <input type="hidden" name="id" value={product.id} />}

      <section className="grid gap-5 sm:grid-cols-2">
        <Field label="Product Name" required>
          <input name="name" defaultValue={product?.name} required className="input" />
        </Field>
        <Field label="URL Slug" hint="Leave blank to auto-generate from the name">
          <input name="slug" defaultValue={product?.slug} className="input" placeholder="cloud-knit-romper" />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <textarea name="description" defaultValue={product?.description} className="input min-h-[110px] resize-y" />
        </Field>
        <Field label="Price (GH₵)" required>
          <input name="price" type="number" step="0.01" min="0" defaultValue={product?.price} required className="input" />
        </Field>
        <Field label="Discount Price (GH₵)" hint="Optional — leave blank if not on sale">
          <input name="discountPrice" type="number" step="0.01" min="0" defaultValue={product?.discountPrice ?? ""} className="input" />
        </Field>
        <Field label="Category" required>
          <select name="category" defaultValue={product?.category || CATEGORIES[0].name} className="input" required>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Subcategory">
          <input name="subcategory" defaultValue={product?.subcategory} className="input" placeholder="e.g. Rompers" />
        </Field>
        <Field label="Age Group">
          <input name="ageGroup" defaultValue={product?.ageGroup} className="input" placeholder="0–3 months" />
        </Field>
        <Field label="Weight (grams)">
          <input name="weightGrams" type="number" min="0" defaultValue={product?.weightGrams} className="input" />
        </Field>
        <Field label="Sizes" hint="Comma-separated, e.g. Newborn, 0-3M, 3-6M">
          <input name="sizes" defaultValue={product?.sizes.join(", ")} className="input" />
        </Field>
        <Field label="Colors" hint="Comma-separated, e.g. Sage, Cream, Blush">
          <input name="colors" defaultValue={product?.colors.join(", ")} className="input" />
        </Field>
        <Field label="Stock Quantity" required>
          <input name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} required className="input" />
        </Field>
        <Field label="SKU">
          <input name="sku" defaultValue={product?.sku} className="input" placeholder="TTC-NB-001" />
        </Field>
        <Field label="Tags" hint="Comma-separated, used for search">
          <input name="tags" defaultValue={product?.tags.join(", ")} className="input" />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={product?.status || "active"} className="input">
            <option value="active">Active (visible to customers)</option>
            <option value="hidden">Hidden</option>
            <option value="draft">Draft</option>
          </select>
        </Field>
      </section>

      <section className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} className="h-4 w-4 rounded accent-sage-dark" />
          Featured Product
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isNewArrival" defaultChecked={product?.isNewArrival} className="h-4 w-4 rounded accent-sage-dark" />
          New Arrival
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isBestSeller" defaultChecked={product?.isBestSeller} className="h-4 w-4 rounded accent-sage-dark" />
          Best Seller
        </label>
      </section>

      <section>
        <p className="text-sm font-medium text-ink">Product Images</p>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-3xl border-2 border-dashed border-ink/15 bg-beige/30 px-6 py-8 text-center hover:border-sage-dark"
        >
          <p className="text-sm text-ink-soft">
            {uploading ? "Uploading…" : "Drag and drop images, or click to choose files"}
          </p>
          <p className="text-xs text-ink-soft/70">Upload from your phone or computer — multiple files allowed</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {images.map((url) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-2xl bg-beige/50">
                <input type="hidden" name="images" value={url} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-xs text-cream opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <SubmitButton />
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="font-medium text-ink">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}
