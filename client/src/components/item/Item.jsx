import React, { useEffect, useState } from "react";
import "./Item.css";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "../../store/useAppStore";
import { imgPrefix } from "../../utils/images";
import { apiRequest } from "../../api/client";
import { queryKeys } from "../../api/queries";
import Reviews from "./subComponents/Reviews";
import RatingStars from "../common/RatingStars";
import { handleKeyboardActivation } from "../../utils/accessibility";

const isValidProduct = (product) =>
  product &&
  typeof product.name === "string" &&
  Array.isArray(product.stock) &&
  product.stock.some(
    (stock) =>
      Array.isArray(stock.images) &&
      stock.images.length > 0 &&
      Array.isArray(stock.sizeRemaining) &&
      stock.sizeRemaining.length > 0
  );

function Item() {
  // const history = useHistory();
  const navigate = useNavigate();
  const [item, setItem] = useState({});
  const [stockIndex, setStockIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { id } = useParams();

  const setCart = useAppStore((state) => state.setCart);
  const userProducts = useAppStore((state) => state.userProducts);
  const hideProducts = useAppStore((state) => state.hideProducts);
  const isLocalProduct = id.length < 20 || hideProducts.includes(id);
  const productQuery = useQuery({
    queryKey: queryKeys.product(id),
    queryFn: ({ signal }) => apiRequest(`/product/${id}`, { signal }),
    enabled: !isLocalProduct,
    staleTime: 60_000,
  });

  const toTitleCase = (str) =>
    `${str}`.replace(
      /(^\w|\s\w)(\S*)/g,
      (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
    );

  useEffect(() => {
    if (typeof item._id !== "undefined") {
      document.title = `${toTitleCase(item.name)} | Stand Out`;
    }
  }, [item]);

  useEffect(() => {
    if (addedToCart) {
      const a = setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
      return () => clearTimeout(a);
    }
  }, [addedToCart]);

  useEffect(() => {
    if (isLocalProduct) {
      const product = userProducts.find((entry) => entry._id === id);

      if (!isValidProduct(product)) {
        // history.replace("/404");
        navigate("/404", { replace: true });
      } else {
        setItem(product);
      }
    } else if (productQuery.data) {
      if (!isValidProduct(productQuery.data)) {
        navigate("/404", { replace: true });
      } else {
        setItem(productQuery.data);
      }
    } else if (productQuery.isError) {
      navigate("/404", { replace: true });
    }
  }, [
    id,
    isLocalProduct,
    userProducts,
    productQuery.data,
    productQuery.isError,
    navigate,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedStock = item.stock?.[stockIndex];
    const selectedSize = selectedStock?.sizeRemaining?.[sizeIndex];
    if (!selectedStock || !selectedSize) return;

    setAddedToCart(true);
    setCart((prev) => {
      const exist = prev.findIndex(
        (el) =>
          el._id === item._id &&
          el.size === selectedSize.size && el.color === selectedStock.color
      );

      if (exist === -1) {
        return [
          ...prev,
          {
            _id: item._id,
            image: selectedStock.images[0],
            name: item.name,
            price: item.price,
            size: selectedSize.size,
            color: selectedStock.color,
            quantity: Math.min(quantity, Number(selectedSize.remaining)),
          },
        ];
      } else {
        const a = [...prev];

        a[exist] = {
          _id: item._id,
          image: selectedStock.images[0],
          name: item.name,
          price: item.price,
          size: selectedSize.size,
          color: selectedStock.color,
          quantity: Math.min(
            quantity + a[exist].quantity,
            Number(selectedSize.remaining)
          ),
        };
        return [...a];
      }
    });
  };

  return (
    <div className="item-page">
      <div
        className={
          addedToCart
            ? "item-page__added item-page__added--visible"
            : "item-page__added"
        }
      >
        <p>Added to Cart</p>
        <button type="button" onClick={() => navigate("/checkout")}>
          go to cart
        </button>
      </div>

      {typeof item._id === "undefined" ? (
        <div className="item-page__loading__container item-page__loading__container--flexbox">
          <div className="item-page__loading__container__img"></div>
          <div className="item-page__loading__container__content">
            <div className="item-page__loading__container__text"></div>
            <div className="item-page__loading__container__text item-page__loading__container__text--price"></div>
            <div className="item-page__loading__container__text item-page__loading__container__text--ratings"></div>
            <div className="item-page__loading__container__box"></div>
            <div className="item-page__loading__container__box"></div>
            <div className="item-page__loading__container__small-box"></div>
          </div>
        </div>
      ) : (
        <div className="item-page__item">
          <div className="item-page__item__image">
            <img
              src={imgPrefix(500) + item.stock[stockIndex].images[0]}
              alt={item.name}
              fetchPriority="high"
              decoding="async"
              onError={(e) => {
                e.target.src = "/images/imgFailed.jpg";
              }}
            />
          </div>

          <form className="item-page__item__content" onSubmit={handleSubmit}>
            <p className="item-page__item__content__name">{item.name}</p>
            <p className="item-page__item__content__price">{`$${(
              item.price / 100
            ).toFixed(2)}`}</p>

            {item.averageRating && (
              <div className="item-page__item__content__rating-container">
                <RatingStars
                  rating={item.averageRating}
                  className="item-page__item__content__rating-container__icons"
                />
                <p className="item-page__item__content__rating-container__rating">
                  {Number(item.averageRating).toFixed(1)}
                </p>
                <p className="item-page__item__content__rating-container__people">
                  {`(${item.totalRatings})`}
                </p>
              </div>
            )}

            <div className="item-page__item__content__color-container">
              <p className="item-page__item__content__color-container__label">
                color :
              </p>
              <div
                className="item-page__item__content__color-container__colors"
                role="radiogroup"
                aria-label="Color"
              >
                {item.stock.map((el, index) => (
                  <div
                    key={el._id ?? el.color}
                    className={
                      stockIndex === index
                        ? "item-page__item__content__color-container__colors__color-box item-page__item__content__color-container__colors__color-box--active"
                        : "item-page__item__content__color-container__colors__color-box"
                    }
                    onClick={() => {
                      setStockIndex(index);
                      setSizeIndex(0);
                    }}
                    onKeyDown={(event) =>
                      handleKeyboardActivation(event, () => {
                        setStockIndex(index);
                        setSizeIndex(0);
                      })
                    }
                    role="radio"
                    tabIndex={0}
                    aria-checked={stockIndex === index}
                    aria-label={`Color ${el.color}`}
                  >
                    <div
                      style={{ backgroundColor: el.color }}
                      className="item-page__item__content__color-container__colors__color-box__color"
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="item-page__item__content__size-container">
              <p className="item-page__item__content__size-container__label">
                size :
              </p>
              <div
                className="item-page__item__content__size-container__sizes"
                role="radiogroup"
                aria-label="Size"
              >
                {item.stock[stockIndex].sizeRemaining.map((el, index) => (
                  <p
                    key={el.size}
                    className={
                      index === sizeIndex
                        ? "item-page__item__content__size-container__sizes__size item-page__item__content__size-container__sizes__size--active"
                        : "item-page__item__content__size-container__sizes__size"
                    }
                    onClick={() => {
                      setSizeIndex(index);
                    }}
                    onKeyDown={(event) =>
                      handleKeyboardActivation(event, () => setSizeIndex(index))
                    }
                    role="radio"
                    tabIndex={0}
                    aria-checked={index === sizeIndex}
                  >
                    {el.size}
                  </p>
                ))}
              </div>
              {item.stock[stockIndex].sizeRemaining[sizeIndex].remaining <
                51 && (
                <p className="item-page__item__content__size-container__remaining">
                  {item.stock[stockIndex].sizeRemaining[sizeIndex].remaining}{" "}
                  items left
                </p>
              )}
            </div>
            <div className="item-page__item__content__quantity-container">
              <p className="item-page__item__content__quantity-container__label">
                quantity :
              </p>
              <input
                type="number"
                value={quantity.toString()}
                min={1}
                max={item.stock[stockIndex].sizeRemaining[sizeIndex].remaining}
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                }}
              />
            </div>
            <button
              className="item-page__item__content__cart-button"
              style={
                !(
                  quantity > 0 &&
                  quantity <=
                    item.stock[stockIndex].sizeRemaining[sizeIndex].remaining
                )
                  ? { opacity: 0.7, cursor: "default" }
                  : {}
              }
              type="submit"
            >
              add to cart
            </button>
          </form>
        </div>
      )}

      <Reviews id={id} totalRatings={item.totalRatings} setItem={setItem} />
    </div>
  );
}

export default Item;
