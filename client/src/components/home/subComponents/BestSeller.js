import React, { useEffect, useState } from "react";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

SwiperCore.use([Navigation]);

function BestSeller() {
  const [items, setItems] = useState([]);

  const limit = 9;

  useEffect(() => {
    axios
      .get(
        `/product/best-seller/?page=${1}&limit=${limit}&sort=${""}&color=${[]}&size=${[]}`
      )
      .then((res) => {
        if (res.status !== 200) {
          throw new Error();
        }
        setItems(res.data.products);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [limit]);

  const limitArr = () => {
    let arr = [];
    for (var i = 0; i < limit; i++) {
      arr.push(i);
    }
    return arr;
  };

  return (
    <div className="home__best-seller">
      <h1>Best sellers</h1>
      {items.length > 0 && (
        <div className="home__best-seller__items-container">
          <Swiper
            spaceBetween={13}
            slidesPerView={2.5}
            grabCursor
            autoHeight
            breakpoints={{
              1900: {
                spaceBetween: 39,
                slidesPerView: 8.5,
              },
              1800: {
                spaceBetween: 36.4,
                slidesPerView: 8.5,
              },
              1600: {
                spaceBetween: 33.8,
                slidesPerView: 7.5,
              },
              1400: {
                spaceBetween: 28.6,
                slidesPerView: 7.5,
              },
              1200: {
                spaceBetween: 23.4,
                slidesPerView: 6.5,
              },
              1100: {
                spaceBetween: 18.2,
                slidesPerView: 6.5,
              },
              800: {
                spaceBetween: 13,
                slidesPerView: 5.5,
              },
              700: {
                slidesPerView: 4.5,
              },
              600: {
                slidesPerView: 3.5,
              },
              500: {
                slidesPerView: 3,
              },
              400: {
                slidesPerView: 2.5,
              },
            }}
          >
            {items.map((el, index) => (
              <SwiperSlide key={index}>
                <div className="home__best-seller__items-container__item">
                  <div className="image-container">
                    <Link to={`/item/${el._id}`}>
                      <img
                        src={el.stock[0].images[0]}
                        alt={el.name}
                        style={{ opacity: 0 }}
                        onLoad={(e) => {
                          e.target.style.opacity = "1";
                        }}
                        onError={(e) => {
                          e.target.src = "/images/imgFailed.jpg";
                        }}
                      />
                    </Link>
                  </div>
                  <Link to={`/item/${el._id}`}>
                    <p className="name">
                      {el.name.length > 15
                        ? el.name.slice(0, 12) + "..."
                        : el.name}
                    </p>
                  </Link>
                  <p
                    className={el.totalRatings >= 1 ? "price" : "price margin"}
                  >
                    $ {(el.price / 100).toFixed(2)}
                  </p>
                  {el.totalRatings >= 1 && (
                    <div className="rating-container">
                      <div className="rating-container__icons">
                        {`${el.averageRating}`.split(".").map((el, index) => {
                          if (index === 0) {
                            const arr = [];
                            for (var i = 0; i < Number(el); i++) {
                              arr.push(
                                <FontAwesomeIcon
                                  key={i}
                                  icon="star"
                                  className="rating-container__icons__icon"
                                />
                              );
                            }
                            return arr;
                          } else {
                            return (
                              <FontAwesomeIcon
                                key={9}
                                icon="star-half"
                                className="rating-container__icons__icon"
                              />
                            );
                          }
                        })}
                      </div>
                      <p className="rating-container__rating">
                        {el.averageRating.toFixed(1)}
                      </p>
                      <p className="rating-container__people">
                        {`(${el.totalRatings})`}
                      </p>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
            <SwiperSlide>
              <div className="link">
                <Link to="/best-sellers">see more</Link>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      )}

      {items.length < 1 && (
        <div className="home__loading__items-container">
          <Swiper
            spaceBetween={13}
            slidesPerView={2.5}
            grabCursor
            autoHeight
            breakpoints={{
              1900: {
                spaceBetween: 39,
                slidesPerView: 8.5,
              },
              1800: {
                spaceBetween: 36.4,
                slidesPerView: 8.5,
              },
              1600: {
                spaceBetween: 33.8,
                slidesPerView: 7.5,
              },
              1400: {
                spaceBetween: 28.6,
                slidesPerView: 7.5,
              },
              1200: {
                spaceBetween: 23.4,
                slidesPerView: 6.5,
              },
              1100: {
                spaceBetween: 18.2,
                slidesPerView: 6.5,
              },
              800: {
                spaceBetween: 13,
                slidesPerView: 5.5,
              },
              700: {
                slidesPerView: 4.5,
              },
              600: {
                slidesPerView: 3.5,
              },
              500: {
                slidesPerView: 3,
              },
              400: {
                slidesPerView: 2.5,
              },
            }}
          >
            {limitArr().map((index) => (
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
    </div>
  );
}

export default BestSeller;
