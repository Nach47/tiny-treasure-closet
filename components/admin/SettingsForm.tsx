"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { StoreSettingsData, StoreCategory } from "@/lib/settings";
import { saveSettings, uploadLogo } from "@/app/admin/(dashboard)/settings/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? "Saving…" : "Save Settings"}
    </button>
  );
}

export default function SettingsForm({ settings }: { settings: StoreSettingsData }) {
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || "");
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<StoreCategory[]>(settings.categories);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mtn = settings.mobileMoneyAccounts.find((a) => a.method === "mtn");
  const telecel = settings.mobileMoneyAccounts.find((a) => a.method === "telecel");
  const airteltigo = settings.mobileMoneyAccounts.find((a) => a.method === "airteltigo");

  async function handleLogoChange(file: File | null) {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadLogo(fd);
    if (result.url) setLogoUrl(result.url);
    setUploading(false);
  }

  function addCategory() {
    setCategories((prev) => [...prev, { name: "", slug: "", blurb: "" }]);
  }

  function updateCategory(index: number, field: "name" | "blurb", value: string) {
    setCategories((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  function removeCategory(index: number) {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(formData: FormData) {
    setStatus("idle");
    const result = await saveSettings(formData);
    if (result.error) {
      setErrorMsg(result.error);
      setStatus("error");
    } else {
      setStatus("saved");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-10">
      <input type="hidden" name="logoUrl" value={logoUrl} />

      <section>
        <h2 className="font-display text-lg">Business Info</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Business Name">
            <input name="businessName" defaultValue={settings.businessName} className="input" />
          </Field>
          <Field label="Logo">
            <div className="flex items-center gap-3">
              {logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" className="h-10 w-auto rounded bg-beige/50 p-1" />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary py-2 text-xs"
              >
                {uploading ? "Uploading…" : logoUrl ? "Change Logo" : "Upload Logo"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleLogoChange(e.target.files?.[0] || null)}
              />
            </div>
          </Field>
          <Field label="Business Phone">
            <input name="businessPhone" defaultValue={settings.businessPhone} className="input" />
          </Field>
          <Field label="Business Email">
            <input name="businessEmail" type="email" defaultValue={settings.businessEmail} className="input" />
          </Field>
          <Field label="Business Address" className="sm:col-span-2">
            <input name="businessAddress" defaultValue={settings.businessAddress} className="input" />
          </Field>
          <Field label="Google Maps Embed URL" className="sm:col-span-2" hint="Google Maps > Share > Embed a map > copy the src value">
            <input name="googleMapsEmbed" defaultValue={settings.googleMapsEmbed} className="input" />
          </Field>
          <Field label="Homepage Banner Text" className="sm:col-span-2" hint="Optional — shown in the hero if set">
            <input name="homepageBannerText" defaultValue={settings.homepageBannerText || ""} className="input" />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg">WhatsApp &amp; Social</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="WhatsApp Number" hint="Digits only, international format e.g. 233241234567">
            <input name="whatsappNumber" defaultValue={settings.whatsappNumber} className="input" />
          </Field>
          <Field label="WhatsApp Display" hint="How it's shown to customers, e.g. +233 24 123 4567">
            <input name="whatsappDisplay" defaultValue={settings.whatsappDisplay} className="input" />
          </Field>
          <Field label="Facebook URL">
            <input name="facebookUrl" defaultValue={settings.facebookUrl} className="input" />
          </Field>
          <Field label="Instagram URL">
            <input name="instagramUrl" defaultValue={settings.instagramUrl} className="input" />
          </Field>
          <Field label="TikTok URL">
            <input name="tiktokUrl" defaultValue={settings.tiktokUrl} className="input" />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg">Shipping</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Shipping Fee (GH₵)">
            <input name="shippingFee" type="number" step="0.01" min="0" defaultValue={settings.shippingFee} className="input" />
          </Field>
          <Field label="Free Shipping Threshold (GH₵)">
            <input name="freeShippingThreshold" type="number" step="0.01" min="0" defaultValue={settings.freeShippingThreshold} className="input" />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg">Mobile Money Accounts</h2>
        <p className="mt-1 text-sm text-ink-soft">Shown to customers at checkout.</p>
        <div className="mt-4 space-y-4">
          {[
            { prefix: "mtn", label: "MTN Mobile Money", account: mtn },
            { prefix: "telecel", label: "Telecel Cash", account: telecel },
            { prefix: "airteltigo", label: "AirtelTigo Money", account: airteltigo },
          ].map(({ prefix, label, account }) => (
            <div key={prefix} className="grid gap-4 rounded-3xl bg-beige/40 p-5 sm:grid-cols-3">
              <p className="self-center text-sm font-semibold text-ink">{label}</p>
              <Field label="Number">
                <input name={`${prefix}Number`} defaultValue={account?.number} className="input" />
              </Field>
              <Field label="Account Name">
                <input name={`${prefix}Name`} defaultValue={account?.accountName} className="input" />
              </Field>
            </div>
          ))}
          <Field label="Payment Instructions">
            <textarea name="paymentInstructions" defaultValue={settings.paymentInstructions} className="input min-h-[80px] resize-y" />
          </Field>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">Categories</h2>
          <button type="button" onClick={addCategory} className="text-xs font-semibold text-sage-dark hover:underline">
            + Add Category
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                name="categoryName"
                value={cat.name}
                onChange={(e) => updateCategory(i, "name", e.target.value)}
                placeholder="Category name"
                className="input"
              />
              <input
                name="categoryBlurb"
                value={cat.blurb}
                onChange={(e) => updateCategory(i, "blurb", e.target.value)}
                placeholder="Short blurb"
                className="input"
              />
              <button
                type="button"
                onClick={() => removeCategory(i)}
                className="shrink-0 text-xs font-semibold text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      {status === "saved" && <p className="rounded-2xl bg-sage-light/30 px-4 py-2.5 text-sm text-sage-dark">Settings saved.</p>}
      {status === "error" && <p className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{errorMsg}</p>}

      <SubmitButton />
    </form>
  );
}

function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="font-medium text-ink">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}
