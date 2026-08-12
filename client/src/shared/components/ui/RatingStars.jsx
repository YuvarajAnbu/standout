import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function RatingStars({ rating, className = "" }) {
  const numericRating = Math.max(0, Math.min(5, Number(rating) || 0));
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating - fullStars >= 0.25;

  return (
    <span className={className} aria-label={`${numericRating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: fullStars }, (_, index) => (
        <FontAwesomeIcon key={`full-${index}`} icon="star" aria-hidden="true" />
      ))}
      {hasHalfStar && (
        <FontAwesomeIcon icon="star-half" aria-hidden="true" />
      )}
    </span>
  );
}
