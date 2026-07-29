import "swiper/css";
import ProductCarousel from "@/pages/home/components/ProductCarousel";

export default function BestSeller() {
  return (
    <ProductCarousel
      collection="best-seller"
      title="Best sellers"
      showRatings={true}
      prioritizeImages
      seeMorePath="best-sellers"
    />
  );
}
