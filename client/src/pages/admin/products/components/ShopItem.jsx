import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { imgPrefix } from "@/shared/utils/images";
import { apiRequest } from "@/shared/api/client";

function ShopItem({
  el,
  stockIndex,
  index,
  setStockIndex,
  setErrorMsgs,
  setSuccessMsgs,
  setUpdate,
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [hideColors, setHideColors] = useState(true);
  const [hideToolTip, setHideToolTip] = useState(true);
  const deleteProduct = useMutation({
    mutationFn: () =>
      apiRequest(`/product/${el._id}`, {
        method: "DELETE",
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["products"] }),
        queryClient.invalidateQueries({ queryKey: ["http"] }),
        queryClient.invalidateQueries({ queryKey: ["http-scope"] }),
      ]);
      setSuccessMsgs("Item deleted successfully");
      setHideToolTip(true);
      setUpdate((current) => current + 1);
    },
    onError: (error) =>
      setErrorMsgs(error.message || "Could not delete this product"),
  });

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
          loading="lazy"
          decoding="async"
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
                  deleteProduct.isPending
                    ? "shop__items-container__items__item__image-container__tool-tip__button-container__yes shop__items-container__items__item__image-container__tool-tip__button-container__yes--loading"
                    : "shop__items-container__items__item__image-container__tool-tip__button-container__yes"
                }
                disabled={deleteProduct.isPending}
                onClick={() => deleteProduct.mutate()}
              >
                {deleteProduct.isPending ? (
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
            <button type="button" onClick={() => navigate(`/edit-item/${el._id}`)}>
              edit
            </button>
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
