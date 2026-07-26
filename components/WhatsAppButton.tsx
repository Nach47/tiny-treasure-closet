import { buildWhatsAppLink } from "@/lib/whatsapp";
import { StoreSettingsData } from "@/lib/settings";

export default function WhatsAppButton({ settings }: { settings: StoreSettingsData }) {
  const link = buildWhatsAppLink(
    `Hi ${settings.businessName}! I have a question about your products.`,
    settings.whatsappNumber
  );

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-soft transition-transform hover:scale-105 active:scale-95"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.45 1.33 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.8 14.14c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.8-.11a15.6 15.6 0 0 1-1.62-.6c-2.85-1.23-4.7-4.1-4.84-4.29-.14-.19-1.16-1.55-1.16-2.96s.72-2.1.98-2.39c.26-.28.56-.35.75-.35h.53c.17 0 .4-.03.62.48.24.56.8 1.96.87 2.1.07.15.11.32.02.5-.08.19-.13.3-.26.46-.13.16-.27.35-.39.47-.13.13-.27.27-.11.53.15.27.68 1.13 1.47 1.83 1.01.9 1.86 1.19 2.13 1.32.27.13.42.11.58-.07.16-.18.68-.79.86-1.06.18-.27.36-.22.6-.13.24.08 1.53.72 1.79.86.26.13.44.2.5.31.07.12.07.68-.17 1.36Z" />
      </svg>
    </a>
  );
}
