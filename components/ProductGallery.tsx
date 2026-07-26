"use client";

import { useState } from "react";
import { ProductImage as ProductImageType } from "@/lib/types";
import ProductImage from "./ProductImage";

export default function ProductGallery({
  images,
  name,
  seed,
}: {
  images: ProductImageType[];
  name: string;
  seed: string;
}) {
  const gallery = images.length > 0 ? images : [{ url: "", alt: name }];
  const [active, setActive] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zooming, setZooming] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }

  return (
    <div>
      <div
        className="relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-5xl shadow-soft"
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <div
          className="h-full w-full transition-transform duration-200 ease-out"
          style={
            zooming
              ? { transform: "scale(1.8)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
              : undefined
          }
        >
          <ProductImage url={gallery[active].url} alt={gallery[active].alt || name} seed={`${seed}-${active}`} />
        </div>
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden rounded-2xl ring-2 transition-all ${
                active === i ? "ring-sage-dark" : "ring-transparent hover:ring-ink/15"
              }`}
              aria-label={`View image ${i + 1} of ${name}`}
            >
              <ProductImage url={img.url} alt={img.alt || name} seed={`${seed}-${i}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
