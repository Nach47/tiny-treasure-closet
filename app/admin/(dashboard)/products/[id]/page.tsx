import Link from "next/link";
import { notFound } from "next/navigation";
import { adminGetProductById } from "@/lib/admin/products";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await adminGetProductById(params.id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/products" className="text-xs font-semibold text-ink-soft hover:text-sage-dark">
        ← Back to Products
      </Link>
      <h1 className="mt-3 text-2xl">Edit Product</h1>
      <div className="mt-8 rounded-4xl bg-white p-8 shadow-card">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
