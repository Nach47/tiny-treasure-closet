"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductOptions({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [size, setSize] = useState(product.sizes[0] || "");
  const [color, setColor] = useState(product.colors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const onSale = product.discountPrice != null && product.discountPrice < product.price;
  const activePrice = onSale ? (product.discountPrice as number) : product.price;
  const outOfStock = product.stock <= 0;
  const wishlisted = isWishlisted(product.id);

  const productUrl =
    typeof window !== "undefined" ? window.location.href : `https://tinytreasurecloset.com/product/${product.slug}`;

  function buildCartLine() {
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url || "",
      unitPrice: activePrice,
      size,
      color,
      quantity,
      stock: product.stock,
    };
  }

  function handleAddToCart() {
    addItem(buildCartLine());
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function handleBuyNow() {
    addItem(buildCartLine());
    router.push("/checkout");
  }

  const shareLinks = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} on Tiny Treasure Closet: ${productUrl}`)}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    },
    {
      label: "Copy Link",
      href: "#copy",
    },
  ];

  async function handleShareClick(e: React.MouseEvent, href: string) {
    if (href === "#copy") {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(productUrl);
        setShareOpen(false);
      } catch {
        // clipboard unavailable — link still visible for manual copy
      }
    }
  }

  return (
    <div>
      <p className="eyebrow">{product.category}</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">{product.name}</h1>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-2xl font-semibold text-sage-dark">{formatCurrency(activePrice)}</span>
        {onSale && <span className="text-base text-ink-soft line-through">{formatCurrency(product.price)}</span>}
      </div>

      <p className="mt-6 max-w-lg text-sm leading-relaxed text-ink-soft">{product.description}</p>

      <p className={`mt-5 text-sm font-medium ${outOfStock ? "text-red-600" : "text-sage-dark"}`}>
        {outOfStock ? "Out of stock" : product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}
      </p>

      {product.sizes.length > 0 && (
        <div className="mt-6">
          <p className="eyebrow">Size</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  size === s ? "border-sage-dark bg-sage-dark text-cream" : "border-ink/15 text-ink-soft hover:border-sage-dark"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors.length > 0 && (
        <div className="mt-6">
          <p className="eyebrow">Color</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  color === c ? "border-sage-dark bg-sage-dark text-cream" : "border-ink/15 text-ink-soft hover:border-sage-dark"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="eyebrow">Quantity</p>
        <div className="mt-3 inline-flex items-center rounded-full border border-ink/15">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center text-lg text-ink-soft hover:text-sage-dark"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
            className="flex h-10 w-10 items-center justify-center text-lg text-ink-soft hover:text-sage-dark"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={handleAddToCart} disabled={outOfStock} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40">
          {justAdded ? "Added ✓" : "Add to Cart"}
        </button>
        <button onClick={handleBuyNow} disabled={outOfStock} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">
          Buy Now
        </button>
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`flex h-[52px] w-[52px] items-center justify-center rounded-full border transition-colors ${
            wishlisted ? "border-gold bg-gold/10 text-gold" : "border-ink/15 text-ink-soft hover:border-gold hover:text-gold"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
            <path
              d="M12 20.5s-7.5-4.6-9.7-9.2C.7 8 2.4 4.8 5.6 4.1c2-.4 4 .5 5.1 2.2a1 1 0 0 0 1.6 0C13.4 4.6 15.4 3.7 17.4 4.1c3.2.7 4.9 3.9 3.3 7.2C18.5 15.9 12 20.5 12 20.5Z"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="relative">
          <button
            onClick={() => setShareOpen((o) => !o)}
            aria-label="Share this product"
            aria-expanded={shareOpen}
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:border-sage-dark hover:text-sage-dark"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="18" cy="5" r="2.5" />
              <circle cx="6" cy="12" r="2.5" />
              <circle cx="18" cy="19" r="2.5" />
              <path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" />
            </svg>
          </button>
          {shareOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-2xl border border-ink/10 bg-white py-2 shadow-soft">
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={(e) => handleShareClick(e, link.href)}
                  className="block px-4 py-2 text-sm text-ink-soft hover:bg-beige/50 hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {product.sku && <p className="mt-8 text-xs text-ink-soft">SKU: {product.sku}</p>}
    </div>
  );
}
