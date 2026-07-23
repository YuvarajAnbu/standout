import "swiper/css";
import ProductCarousel from "./ProductCarousel";

export default function Trending() {
  return (
    <ProductCarousel
      collection="trending"
      title="Trending this week"
      showRatings={false}
      prioritizeImages
      seeMorePath="trending"
    />
  );
}
