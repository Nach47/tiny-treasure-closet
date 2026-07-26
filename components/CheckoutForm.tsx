"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCurrency, generateOrderNumber } from "@/lib/format";
import { buildOrderFromCart, buildWhatsAppLink, buildWhatsAppOrderMessage } from "@/lib/whatsapp";
import { createOrder } from "@/lib/orders";
import { CheckoutDetails, PaymentMethod } from "@/lib/types";
import { GHANA_REGIONS } from "@/lib/settings";
import type { StoreSettingsData } from "@/lib/settings";

export default function CheckoutForm({ settings }: { settings: StoreSettingsData }) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<CheckoutDetails>({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    region: GHANA_REGIONS[0],
    city: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mtn");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const shippingFee = items.length === 0 || subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
  const total = subtotal + shippingFee;
  const activeAccount = settings.mobileMoneyAccounts.find((a) => a.method === paymentMethod)!;

  function updateField<K extends keyof CheckoutDetails>(key: K, value: CheckoutDetails[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFileChange(file: File | null) {
    setScreenshotFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setScreenshotPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setScreenshotPreview(null);
    }
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    if (!form.whatsapp.trim()) next.whatsapp = "WhatsApp number is required";
    if (!form.address.trim()) next.address = "Delivery address is required";
    if (!form.city.trim()) next.city = "City is required";
    if (!screenshotFile) next.screenshot = "Please upload your payment screenshot to continue";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const order = buildOrderFromCart({
      orderNumber: generateOrderNumber(),
      items,
      shippingFee,
      customer: form,
      paymentMethod,
      paymentScreenshotName: screenshotFile?.name,
    });

    try {
      sessionStorage.setItem("ttc_last_order", JSON.stringify(order));
      if (screenshotPreview) sessionStorage.setItem("ttc_last_order_screenshot", screenshotPreview);
    } catch {
      // sessionStorage unavailable — confirmation page will still show a generic summary
    }

    // Save the order to the database (if connected) so it shows up in the
    // Admin Dashboard's Orders pipeline, alongside the WhatsApp handoff.
    try {
      await createOrder(order, screenshotFile);
    } catch {
      // Non-fatal — the WhatsApp message below still carries every detail.
    }

    const message = buildWhatsAppOrderMessage(order);
    const link = buildWhatsAppLink(message, settings.whatsappNumber);
    window.open(link, "_blank", "noopener,noreferrer");

    clearCart();
    router.push("/order-confirmation");
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center lg:px-10">
        <p className="font-display text-2xl text-ink">Your cart is empty</p>
        <p className="mt-2 text-sm text-ink-soft">Add something lovely before checking out.</p>
        <Link href="/shop" className="btn-primary mt-8 inline-flex">
          Browse the Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
      <p className="eyebrow">Almost There</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-xl">Delivery Details</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Full Name" error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="input"
                  placeholder="Ama Owusu"
                />
              </Field>
              <Field label="Phone Number" error={errors.phone}>
                <input
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="input"
                  placeholder="024 123 4567"
                />
              </Field>
              <Field label="WhatsApp Number" error={errors.whatsapp}>
                <input
                  value={form.whatsapp}
                  onChange={(e) => updateField("whatsapp", e.target.value)}
                  className="input"
                  placeholder="024 123 4567"
                />
              </Field>
              <Field label="Email (Optional)">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="input"
                  placeholder="you@email.com"
                />
              </Field>
              <Field label="Delivery Address" error={errors.address} className="sm:col-span-2">
                <input
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="input"
                  placeholder="House number, street, landmark"
                />
              </Field>
              <Field label="Region">
                <select
                  value={form.region}
                  onChange={(e) => updateField("region", e.target.value)}
                  className="input"
                >
                  {GHANA_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="City / Town" error={errors.city}>
                <input
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="input"
                  placeholder="Accra"
                />
              </Field>
              <Field label="Notes (Optional)" className="sm:col-span-2">
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="input min-h-[90px] resize-none"
                  placeholder="Anything we should know about your order or delivery"
                />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl">Payment</h2>
            <p className="mt-2 text-sm text-ink-soft">{settings.paymentInstructions}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {settings.mobileMoneyAccounts.map((account) => (
                <button
                  type="button"
                  key={account.method}
                  onClick={() => setPaymentMethod(account.method)}
                  className={`rounded-3xl border px-4 py-4 text-left transition-colors ${
                    paymentMethod === account.method
                      ? "border-sage-dark bg-sage-light/20"
                      : "border-ink/15 hover:border-sage-dark"
                  }`}
                >
                  <p className="text-sm font-semibold text-ink">{account.label}</p>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-3xl bg-beige/50 p-5">
              <p className="text-sm text-ink-soft">Send payment to</p>
              <p className="mt-1 font-display text-2xl text-sage-dark">{activeAccount.number}</p>
              <p className="text-sm text-ink-soft">{activeAccount.accountName}</p>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-ink">Upload Payment Screenshot</p>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileChange(e.dataTransfer.files?.[0] || null);
                }}
                className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-ink/15 bg-white/50 px-6 py-8 text-center hover:border-sage-dark"
              >
                {screenshotPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={screenshotPreview} alt="Payment screenshot preview" className="max-h-48 rounded-2xl object-contain" />
                ) : (
                  <>
                    <p className="text-sm text-ink-soft">Drag and drop, or click to choose a screenshot</p>
                    <p className="text-xs text-ink-soft/70">PNG or JPG</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />
              </div>
              {errors.screenshot && <p className="mt-2 text-xs text-red-600">{errors.screenshot}</p>}
              <p className="mt-3 text-xs text-ink-soft">
                Since WhatsApp links can&apos;t attach files automatically, please re-attach this same
                screenshot in the WhatsApp chat that opens after you place your order.
              </p>
            </div>
          </section>
        </div>

        <div className="h-fit rounded-4xl bg-beige/50 p-7">
          <h2 className="font-display text-xl">Order Summary</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {items.map((item) => (
              <li key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between gap-3">
                <span className="text-ink-soft">
                  {item.name} × {item.quantity}
                  <span className="block text-xs">{item.size} · {item.color}</span>
                </span>
                <span className="whitespace-nowrap font-medium text-ink">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-ink/10 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="font-medium text-ink">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd className="font-medium text-ink">{shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}</dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-3 text-base">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="font-semibold text-sage-dark">{formatCurrency(total)}</dd>
            </div>
          </dl>

          <button type="submit" disabled={submitting} className="btn-primary mt-7 flex w-full disabled:opacity-60">
            {submitting ? "Placing Order…" : "Place Order via WhatsApp"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="font-medium text-ink">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
