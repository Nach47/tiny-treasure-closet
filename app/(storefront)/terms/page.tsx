import type { Metadata } from "next";
import { BUSINESS_INFO } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms and conditions governing purchases from Tiny Treasure Closet.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Terms &amp; Conditions</h1>
      <p className="mt-3 text-xs text-ink-soft">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="font-display text-xl text-ink">1. Orders</h2>
          <p className="mt-2">
            Placing an order through our website sends your order details to our business
            WhatsApp for confirmation. An order is only confirmed once payment has been verified
            by our team.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">2. Pricing</h2>
          <p className="mt-2">
            All prices are listed in Ghanaian Cedis (GH₵) and include applicable taxes unless
            stated otherwise. Shipping fees are calculated at checkout and may be waived for
            orders above our free-shipping threshold.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">3. Payment</h2>
          <p className="mt-2">
            We accept MTN Mobile Money, Telecel Cash, and AirtelTigo Money. Orders are processed
            only after a valid payment screenshot is received and verified. We reserve the right
            to cancel and refund orders where payment cannot be verified.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">4. Stock Availability</h2>
          <p className="mt-2">
            We produce in small batches, so items can sell out. If an item you ordered becomes
            unavailable before we confirm your order, we will contact you on WhatsApp to offer an
            alternative or a full refund.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">5. Exchanges &amp; Returns</h2>
          <p className="mt-2">
            Unworn items with tags attached may be exchanged within 7 days of delivery. Contact us
            on WhatsApp with your order number to arrange an exchange. Items marked final sale are
            not eligible for exchange.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">6. Delivery</h2>
          <p className="mt-2">
            Delivery timeframes are estimates and may vary based on location and courier
            availability. We will notify you of any significant delays via WhatsApp.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">7. Contact</h2>
          <p className="mt-2">
            Questions about these terms can be directed to {BUSINESS_INFO.email} or via WhatsApp
            at {BUSINESS_INFO.whatsappDisplay}.
          </p>
        </section>
      </div>
    </div>
  );
}
