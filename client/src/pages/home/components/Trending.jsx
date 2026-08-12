import "swiper/css";
import ProductCarousel from "@/pages/home/components/ProductCarousel";

export default function Trending() {
  return (
    <ProductCarousel
      collection="trending"
      title="Trending this month"
      showRatings={false}
      prioritizeImages
      seeMorePath="trending"
    />
  );
}
