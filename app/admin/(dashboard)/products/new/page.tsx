import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/products" className="text-xs font-semibold text-ink-soft hover:text-sage-dark">
        ← Back to Products
      </Link>
      <h1 className="mt-3 text-2xl">Add Product</h1>
      <div className="mt-8 rounded-4xl bg-white p-8 shadow-card">
        <ProductForm />
      </div>
    </div>
  );
}
