import type { Metadata } from "next";
import { BUSINESS_INFO } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Tiny Treasure Closet collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Privacy Policy</h1>
      <p className="mt-3 text-xs text-ink-soft">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="prose-legal mt-10 space-y-8 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="font-display text-xl text-ink">1. Information We Collect</h2>
          <p className="mt-2">
            When you place an order, we collect the information you provide at checkout: your
            name, phone number, WhatsApp number, email address (if given), delivery address,
            region, city, and any notes you add. We also temporarily store the payment screenshot
            you upload so we can confirm your Mobile Money payment.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">2. How We Use Your Information</h2>
          <p className="mt-2">
            We use this information solely to process and deliver your order, confirm payment,
            communicate with you about your order status, and — if you opt in — send occasional
            updates about new arrivals. We do not sell or rent your personal information to third
            parties.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">3. WhatsApp Communication</h2>
          <p className="mt-2">
            Placing an order opens a WhatsApp conversation containing your order details, sent to
            our business WhatsApp number. This conversation is subject to WhatsApp&apos;s own
            privacy practices in addition to ours.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">4. Payment Information</h2>
          <p className="mt-2">
            We do not process or store Mobile Money PINs or account credentials. Payment
            screenshots are used only to confirm receipt of funds and are retained only as long as
            needed to resolve any payment queries.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">5. Cookies and Local Storage</h2>
          <p className="mt-2">
            Our website stores your shopping cart and wishlist locally in your browser so they
            persist between visits. This information stays on your device and is not transmitted
            to us until you complete checkout.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">6. Your Rights</h2>
          <p className="mt-2">
            You may request a copy of the personal information we hold about you, ask us to
            correct it, or request its deletion, by contacting us at {BUSINESS_INFO.email}.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">7. Contact Us</h2>
          <p className="mt-2">
            Questions about this policy can be sent to {BUSINESS_INFO.email} or via WhatsApp at{" "}
            {BUSINESS_INFO.whatsappDisplay}.
          </p>
        </section>
      </div>
    </div>
  );
}
