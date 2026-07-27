import { adminGetAllProducts } from "@/lib/admin/products";
import ProductsTable from "@/components/admin/ProductsTable";
import ImportCatalogButton from "@/components/admin/ImportCatalogButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await adminGetAllProducts();

  return (
    <div>
      <p className="eyebrow">Catalog</p>
      <h1 className="mt-1 text-2xl">Products</h1>
      <p className="mt-1 text-sm text-ink-soft">{products.length} total</p>

      <div className="mt-4">
        <ImportCatalogButton />
      </div>

      <div className="mt-6">
        <ProductsTable products={products} />
      </div>
    </div>
  );
}
