import { getStoreSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="mx-auto max-w-3xl">
      <p className="eyebrow">Configuration</p>
      <h1 className="mt-1 text-2xl">Settings</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Changes here update the live storefront immediately after saving.
      </p>

      <div className="mt-8 rounded-4xl bg-white p-8 shadow-card">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
