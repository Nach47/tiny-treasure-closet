import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about sizing, shipping, payment, and returns at Tiny Treasure Closet.",
};

const FAQS = [
  {
    question: "How do I know what size to order?",
    answer:
      "Each product page lists the available sizes and the recommended age range. Because babies grow at different rates, we recommend sizing up if your little one is between sizes — most of our pieces are cut with a little room to grow.",
  },
  {
    question: "How does WhatsApp ordering work?",
    answer:
      "Add items to your cart and complete checkout as normal. Once you place your order, we automatically open WhatsApp with your order details pre-filled and sent to our business number, so you can confirm details or ask questions directly with our team.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We currently accept MTN Mobile Money, Telecel Cash, and AirtelTigo Money. During checkout, you'll see the account details for your chosen method and be asked to upload a screenshot of your payment confirmation.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Accra and Tema orders typically arrive within 1–2 business days, the rest of Greater Accra within 2–3 days, and other regions within 3–5 business days. You'll receive delivery updates on WhatsApp.",
  },
  {
    question: "Can I return or exchange an item?",
    answer:
      "Yes — unworn items with tags attached can be exchanged within 7 days of delivery. Message us on WhatsApp with your order number to start an exchange. See our Terms & Conditions for full details.",
  },
  {
    question: "Do you offer matching sets for siblings?",
    answer:
      "We do — our Matching Sets category includes coordinating pieces designed to be mixed and worn together across siblings of different ages.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
      <p className="eyebrow">Need to Know</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Frequently Asked Questions</h1>
      <p className="mt-4 text-sm text-ink-soft">
        Can&apos;t find what you&apos;re looking for? Reach out on WhatsApp and we&apos;ll help directly.
      </p>

      <div className="mt-10">
        <FaqAccordion items={FAQS} />
      </div>
    </div>
  );
}
