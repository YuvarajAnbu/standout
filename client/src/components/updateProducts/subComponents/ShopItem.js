import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { imgPrefixContext } from "../../../App";
// import axios from "axios";

function ShopItem({
  el,
  stockIndex,
  index,
  setStockIndex,
  // setErrorMsgs,
  setSuccessMsgs,
  setItems,
  setUpdate,
  // userProducts,
  setUserProducts,
  setHideProducts,
}) {
  const imgPrefix = useContext(imgPrefixContext);
  const [hideColors, setHideColors] = useState(true);

  const [loadingButton, setLoadingButton] = useState(false);

  const [hideToolTip, setHideToolTip] = useState(true);

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
      <div className="shop__items-container__items__item__image-container">
        <img
          src={imgPrefix(300) + el.stock[stockIndex[index]].images[0]}
          alt={el.name}
          onError={(e) => {
            e.target.src = "/images/imgFailed.jpg";
          }}
        />
        {!hideToolTip ? (
          <div className="shop__items-container__items__item__image-container__tool-tip">
            <p>Are you sure you want to delete this item?</p>
            <div className="shop__items-container__items__item__image-container__tool-tip__button-container">
              <button
                onClick={() => {
                  setHideToolTip(true);
                }}
              >
                no
              </button>
              <button
                className={
                  loadingButton
                    ? "shop__items-container__items__item__image-container__tool-tip__button-container__yes shop__items-container__items__item__image-container__tool-tip__button-container__yes--loading"
                    : "shop__items-container__items__item__image-container__tool-tip__button-container__yes"
                }
                onClick={() => {
                  if (!loadingButton) {
                    setLoadingButton(true);
                    setUserProducts((prev) =>
                      prev.filter((e) => e._id !== el._id)
                    );
                    setLoadingButton(false);
                    setSuccessMsgs("item deleted successfully");
                    setItems((prev) => prev.filter((k) => k._id !== el._id));

                    if (el._id.length >= 10)
                      setHideProducts((prev) => [...prev, el._id]);

                    setHideToolTip(true);
                    setUpdate((prev) => prev + 1);
                    // axios
                    //   .delete(`/product/delete/${el._id}`)
                    //   .then((res) => {
                    //     if (res.status !== 200) {
                    //       throw new Error();
                    //     }
                    //     setLoadingButton(false);
                    //     setSuccessMsgs("item deleted successfully");
                    //     setItems((prev) =>
                    //       prev.filter((k) => k._id !== el._id)
                    //     );
                    //   })
                    //   .catch((err) => {
                    //     console.log(err);
                    //     setErrorMsgs("something went wrong");
                    //     setLoadingButton(false);
                    //   });
                  }
                }}
              >
                {loadingButton ? (
                  <div className="shop__items-container__items__item__image-container__tool-tip__button-container__yes__loading"></div>
                ) : (
                  "yes"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="shop__items-container__items__item__image-container__button-container">
            <button
              onClick={() => {
                setHideToolTip(false);
              }}
            >
              delete
            </button>
            <Link to={`/edit-item/${el._id}`}>
              <button>edit</button>
            </Link>
          </div>
        )}
      </div>

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
