import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";
import { Link } from "react-router-dom";
import { imgPrefixContext } from "../../../App";

function Trending() {
  const imgPrefix = useContext(imgPrefixContext);
  const [items, setItems] = useState([]);
  const limit = 9;

  useEffect(() => {
    axios
      .get(
        `/product/trending/?page=${1}&limit=${limit}&sort=${""}&color=${[]}&size=${[]}`
      )
      .then((res) => {
        if (res.status !== 200) {
          throw new Error();
        }
        setItems(res.data.products);
      })
      .catch((err) => {
        console.log(err.message);
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
    <div className="home__trending">
      <h1>Trending this week</h1>
      {items.length > 0 && (
        <div className="home__trending__items-container">
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
                <div className="home__trending__items-container__item">
                  <div className="image-container">
                    <Link to={`/item/${el._id}`}>
                      <img
                        src={imgPrefix(200) + el.stock[0].images[0]}
                        style={{ opacity: 0 }}
                        onLoad={(e) => {
                          e.target.style.opacity = "1";
                        }}
                        alt={el.name}
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
                  <p className="price">${(el.price / 100).toFixed(2)}</p>
                </div>
              </SwiperSlide>
            ))}
            <SwiperSlide>
              <div className="link">
                <Link to="/trending">see more</Link>
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

export default Trending;
