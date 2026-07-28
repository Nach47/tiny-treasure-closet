// Surprise Bundle products — sold as a curated mystery mix. The specific
// prints inside are hand-picked by the store owner at packing time, not
// reserved by the system, so these are just regular products with fixed
// contents ratios described in the copy.

export interface BundleProduct {
  slug: string;
  name: string;
  description: string;
  price: number;
  ageGroup: string;
  stock: number;
  sku: string;
  tags: string[];
  images: string[];
}

// A representative spread of images per bundle, just to show the range of
// styles a customer might receive — not a guarantee of exact contents.
const fiveShots = ["/seed-products/ttc-016.jpg", "/seed-products/ttc-021.jpg", "/seed-products/ttc-033.jpg", "/seed-products/ttc-055.jpg", "/seed-products/ttc-009.jpg"];
const tenShots = ["/seed-products/ttc-039.jpg", "/seed-products/ttc-044.jpg", "/seed-products/ttc-060.jpg", "/seed-products/ttc-011.jpg", "/seed-products/ttc-025.jpg"];

const fiveBlurb =
  "A hand-picked surprise mix of 5 pieces — 4 short-sleeve sets and 1 long-sleeve set — chosen by us from current stock for this age range. " +
  "You won't know the exact prints until it arrives, but every piece is a genuine Tiny Treasure Closet set. A fun, affordable way to stock up or gift.";

const tenBlurb =
  "A hand-picked surprise mix of 10 pieces — 8 short-sleeve sets and 2 long-sleeve sets — chosen by us from current stock for this age range. " +
  "You won't know the exact prints until it arrives, but every piece is a genuine Tiny Treasure Closet set. Our best value bundle for building out a full wardrobe.";

export const bundleProducts: BundleProduct[] = [
  { slug: "surprise-bundle-5-0-12-months", name: "5-Piece Surprise Bundle — 0-12 Months", description: fiveBlurb, price: 480, ageGroup: "0-12 months", stock: 10, sku: "TTC-BDL-501", tags: ["bundle", "surprise mix", "value pack"], images: fiveShots },
  { slug: "surprise-bundle-5-1-2-years", name: "5-Piece Surprise Bundle — 1-2 Years", description: fiveBlurb, price: 520, ageGroup: "1-2 years", stock: 10, sku: "TTC-BDL-502", tags: ["bundle", "surprise mix", "value pack"], images: fiveShots },
  { slug: "surprise-bundle-5-2-4-years", name: "5-Piece Surprise Bundle — 2-4 Years", description: fiveBlurb, price: 560, ageGroup: "2-4 years", stock: 10, sku: "TTC-BDL-503", tags: ["bundle", "surprise mix", "value pack"], images: fiveShots },
  { slug: "surprise-bundle-10-0-12-months", name: "10-Piece Surprise Bundle — 0-12 Months", description: tenBlurb, price: 850, ageGroup: "0-12 months", stock: 8, sku: "TTC-BDL-101", tags: ["bundle", "surprise mix", "value pack"], images: tenShots },
  { slug: "surprise-bundle-10-1-2-years", name: "10-Piece Surprise Bundle — 1-2 Years", description: tenBlurb, price: 920, ageGroup: "1-2 years", stock: 8, sku: "TTC-BDL-102", tags: ["bundle", "surprise mix", "value pack"], images: tenShots },
  { slug: "surprise-bundle-10-2-4-years", name: "10-Piece Surprise Bundle — 2-4 Years", description: tenBlurb, price: 980, ageGroup: "2-4 years", stock: 8, sku: "TTC-BDL-103", tags: ["bundle", "surprise mix", "value pack"], images: tenShots },
];
