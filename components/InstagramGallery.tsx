import ProductImage from "./ProductImage";

const HANDLE = "@tinytreasurecloset";

export default function InstagramGallery() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="mb-10 text-center">
        <p className="eyebrow">Follow Along</p>
        <h2 className="mt-2 text-3xl">{HANDLE} on Instagram</h2>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <a
            key={i}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square overflow-hidden rounded-3xl transition-opacity hover:opacity-90"
            aria-label={`View post ${i + 1} on Instagram`}
          >
            <ProductImage seed={`ig-${i}`} alt={`Instagram post ${i + 1}`} />
          </a>
        ))}
      </div>
    </section>
  );
}
