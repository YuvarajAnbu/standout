import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function ShopItem({ el, stockIndex, index, setStockIndex }) {
  const [hideColors, setHideColors] = useState(true);

  const sizeArray = (arr) => {
    let str = "";
    arr.forEach((el, index) => {
      if (index === 0) {
        str = el.size;
      } else {
        str = str + " / " + el.size;
      }
    });
    return str;
  };

  return (
    <div
      className="shop__items-container__items__item"
      onMouseEnter={() => {
        setHideColors(false);
      }}
      onMouseLeave={() => {
        setHideColors(true);
      }}
    >
      <Link to={`/item/${el._id}`}>
        <div className="shop__items-container__items__item__image-container">
          <img
            src={el.stock[stockIndex[index]].images[0]}
            alt={el.name}
            onError={(e) => {
              e.target.src = "/images/imgFailed.jpg";
            }}
          />
        </div>
      </Link>
      <p className="shop__items-container__items__item__name">
        <Link to={`/item/${el._id}`}>{el.name}</Link>
      </p>
      <p className="shop__items-container__items__item__price">
        {`$${(el.price / 100).toFixed(2)}`}
      </p>
      {el.totalRatings >= 1 && (
        <div className="shop__items-container__items__item__rating-container">
          <div className="shop__items-container__items__item__rating-container__icons">
            {`${el.averageRating}`.split(".").map((el, index) => {
              if (index === 0) {
                const arr = [];
                for (var i = 0; i < Number(el); i++) {
                  arr.push(
                    <FontAwesomeIcon
                      key={i}
                      icon="star"
                      className="shop__items-container__items__item__rating-container__icons__icon"
                    />
                  );
                }
                return arr;
              } else {
                return (
                  <FontAwesomeIcon
                    key={9}
                    icon="star-half"
                    className="shop__items-container__items__item__rating-container__icons__icon"
                  />
                );
              }
            })}
          </div>
          <p className="shop__items-container__items__item__rating-container__rating">
            {el.averageRating.toFixed(1)}
          </p>
          <p className="shop__items-container__items__item__rating-container__people">
            {`(${el.totalRatings})`}
          </p>
        </div>
      )}

      {hideColors && (
        <p className="shop__items-container__items__item__colors--name">
          {el.stock.length} colors
        </p>
      )}

      {!hideColors && (
        <div className="shop__items-container__items__item__colors-container">
          <div className="shop__items-container__items__item__colors">
            {el.stock.map((ele, i) => (
              <div
                key={i}
                className={
                  stockIndex[index] === i
                    ? "shop__items-container__items__item__colors__color-box shop__items-container__items__item__colors__color-box--active"
                    : "shop__items-container__items__item__colors__color-box"
                }
                onMouseEnter={() => {
                  setStockIndex((prev) => {
                    return {
                      ...prev,
                      [index]: i,
                    };
                  });
                }}
                onMouseLeave={() => {
                  setStockIndex((prev) => {
                    return {
                      ...prev,
                      [index]: 0,
                    };
                  });
                }}
              >
                <div
                  style={{ backgroundColor: ele.color }}
                  className="shop__items-container__items__item__colors__color-box__color"
                ></div>
              </div>
            ))}
          </div>
          <p className="shop__items-container__items__item__sizes">
            {sizeArray(el.stock[stockIndex[index]].sizeRemaining)}
          </p>
        </div>
      )}
    </div>
  );
}

export default ShopItem;
