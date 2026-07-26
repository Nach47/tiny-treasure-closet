import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ProductRail from "@/components/ProductRail";
import SpecialOffers from "@/components/SpecialOffers";
import WhyChooseUs from "@/components/WhyChooseUs";
import Reviews from "@/components/Reviews";
import InstagramGallery from "@/components/InstagramGallery";
import Newsletter from "@/components/Newsletter";
import { getFeaturedProducts, getNewArrivals, getBestSellers } from "@/lib/products";
import { getStoreSettings } from "@/lib/settings";

export default async function HomePage() {
  const [featured, newArrivals, bestSellers, settings] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getBestSellers(),
    getStoreSettings(),
  ]);

  return (
    <>
      <Hero />
      <CategoryGrid categories={settings.categories} />
      <ProductRail eyebrow="Handpicked" title="Featured Products" products={featured} />
      <SpecialOffers />
      <ProductRail
        eyebrow="Just In"
        title="New Arrivals"
        products={newArrivals}
        viewAllHref="/shop?sort=newest"
      />
      <ProductRail
        eyebrow="Customer Favorites"
        title="Best Sellers"
        products={bestSellers}
        viewAllHref="/shop?sort=bestsellers"
      />
      <WhyChooseUs />
      <Reviews />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
