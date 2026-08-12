import React, { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { imgPrefix } from "@/shared/utils/images";
import { apiRequest } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queries";
import RatingStars from "@/shared/components/ui/RatingStars";

function ProductCarousel({
  collection = "best-seller",
  title = "Best sellers",
  showRatings = true,
  prioritizeImages = false,
  seeMorePath = "best-sellers",
}) {
  const limit = 9;
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.products({ collection, limit }),
    queryFn: ({ signal }) =>
      apiRequest(
        `/product/${collection}/?page=1&limit=${limit}&includeFilters=false`,
        { signal },
      ),
    staleTime: 5 * 60_000,
  });
  const items = data?.products || [];
  const swiperRef = useRef(null);
  const [navigation, setNavigation] = useState({
    atBeginning: true,
    atEnd: false,
  });

  const updateNavigation = useCallback((swiper) => {
    swiperRef.current = swiper;
    setNavigation({
      atBeginning: swiper.isBeginning,
      atEnd: swiper.isEnd,
    });
  }, []);

  const moveCarousel = (direction) => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    if (direction === "previous") swiper.slidePrev();
    else swiper.slideNext();
  };

  const placeholders = Array.from({ length: limit }, (_, index) => index);

  return (
    <div className={`home__${collection}`}>
      <h1>{title}</h1>
      {items.length > 0 && (
        <div className={`home__${collection}__items-container`}>
          <div className="product-carousel">
            <button
              type="button"
              className="product-carousel__control product-carousel__control--previous"
              aria-label={`Previous ${title.toLowerCase()} products`}
              disabled={navigation.atBeginning}
              onClick={() => moveCarousel("previous")}
            >
              <FontAwesomeIcon icon="chevron-right" rotation={180} />
            </button>
            <Swiper
              spaceBetween={13}
              slidesPerView={1.5}
              grabCursor
              autoHeight
              onSwiper={updateNavigation}
              onSlideChange={updateNavigation}
              onResize={updateNavigation}
              onBreakpoint={updateNavigation}
              breakpoints={{
                1900: {
                  spaceBetween: 39,
                  slidesPerView: 8.5,
                },
                1800: {
                  spaceBetween: 36.4,
                  slidesPerView: 7.5,
                },
                1600: {
                  spaceBetween: 33.8,
                  slidesPerView: 6.5,
                },
                1400: {
                  spaceBetween: 28.6,
                  slidesPerView: 6.5,
                },
                1200: {
                  spaceBetween: 23.4,
                  slidesPerView: 5.5,
                },
                1100: {
                  spaceBetween: 18.2,
                  slidesPerView: 3.5,
                },
                800: {
                  spaceBetween: 13,
                  slidesPerView: 3.5,
                },
                700: {
                  slidesPerView: 3.5,
                },
                600: {
                  slidesPerView: 2.5,
                },
                500: {
                  slidesPerView: 1.5,
                },
                400: {
                  slidesPerView: 1.5,
                },
              }}
            >
              {items.map((el, index) => (
                <SwiperSlide key={el._id}>
                  <Link to={`/item/${el._id}`}>
                    <div
                      className={`home__${collection}__items-container__item`}
                    >
                      <div className="image-container">
                        <img
                          src={imgPrefix(200) + el.stock[0].images[0]}
                          alt={el.name}
                          loading={
                            prioritizeImages && index < 3 ? "eager" : "lazy"
                          }
                          fetchPriority={
                            prioritizeImages && index === 0 ? "high" : "auto"
                          }
                          decoding="async"
                          style={{ opacity: 0 }}
                          onLoad={(e) => {
                            e.target.style.opacity = "1";
                          }}
                          onError={(e) => {
                            e.target.src = "/images/imgFailed.jpg";
                          }}
                        />
                      </div>
                      <p className="name truncate" title={el.name}>
                        {el.name}
                      </p>
                      <p
                        className={
                          showRatings && el.totalRatings >= 1
                            ? "price"
                            : "price margin"
                        }
                      >
                        $ {(el.price / 100).toFixed(2)}
                      </p>
                      {showRatings && el.totalRatings >= 1 && (
                        <div className="rating-container">
                          <RatingStars
                            rating={el.averageRating}
                            className="rating-container__icons"
                          />
                          <p className="rating-container__rating">
                            {el.averageRating.toFixed(1)}
                          </p>
                          <p className="rating-container__people">
                            {`(${el.totalRatings})`}
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
              <SwiperSlide>
                <div className="link">
                  <Link to={`/${seeMorePath}`}>see more</Link>
                </div>
              </SwiperSlide>
            </Swiper>
            <button
              type="button"
              className="product-carousel__control product-carousel__control--next"
              aria-label={`Next ${title.toLowerCase()} products`}
              disabled={navigation.atEnd}
              onClick={() => moveCarousel("next")}
            >
              <FontAwesomeIcon icon="chevron-right" />
            </button>
          </div>
        </div>
      )}

      {isPending && (
        <div className="home__loading__items-container">
          <Swiper
            spaceBetween={13}
            slidesPerView={2.5}
            grabCursor
            autoHeight
            breakpoints={{
              1900: {
                spaceBetween: 39,
                slidesPerView: 7.5,
              },
              1800: {
                spaceBetween: 36.4,
                slidesPerView: 7.5,
              },
              1600: {
                spaceBetween: 33.8,
                slidesPerView: 6.5,
              },
              1400: {
                spaceBetween: 28.6,
                slidesPerView: 6.5,
              },
              1200: {
                spaceBetween: 23.4,
                slidesPerView: 5.5,
              },
              1100: {
                spaceBetween: 18.2,
                slidesPerView: 3.5,
              },
              800: {
                spaceBetween: 13,
                slidesPerView: 3.5,
              },
              700: {
                slidesPerView: 3.5,
              },
              600: {
                slidesPerView: 2.5,
              },
              500: {
                slidesPerView: 1.5,
              },
              400: {
                slidesPerView: 1.5,
              },
            }}
          >
            {placeholders.map((index) => (
              <SwiperSlide key={index}>
                <div className="home__loading__items-container__item">
                  <div className="home__loading__items-container__item__img"></div>
                  <div className="home__loading__items-container__item__text"></div>
                  <div className="home__loading__items-container__item__text"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      {!isPending && items.length < 1 && (
        <p role={isError ? "alert" : undefined}>
          {isError
            ? "Products could not be loaded. Please try again."
            : "No products are available right now."}
        </p>
      )}
    </div>
  );
}

export default ProductCarousel;
