import React, { useEffect, useState, useContext } from "react";
import "./Item.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  CartContext,
  HideProductsContext,
  UserProductsContext,
  imgPrefixContext,
} from "../../App";
import Reviews from "./subComponents/Reviews";

function Item() {
  // const history = useHistory();
  const navigate = useNavigate();
  const [item, setItem] = useState({});
  const [stockIndex, setStockIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { id } = useParams();

  const { setCart } = useContext(CartContext);
  const { userProducts } = useContext(UserProductsContext);
  const { hideProducts } = useContext(HideProductsContext);
  const imgPrefix = useContext(imgPrefixContext);

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
    if (id.length < 20 || hideProducts.includes(id)) {
      const product = userProducts.filter((e) => e._id === id);

      if (product.length === 0) {
        // history.replace("/404");
        navigate("/404", { replace: true });
      } else {
        setItem(product[0]);
      }
    } else {
      axios
        .get(`/product/${id}`)
        .then((res) => {
          if (res.status !== 200) {
            throw new Error();
          }
          if (typeof res.data.name === "undefined") {
            // history.replace("/404");
            navigate("/404", { replace: true });
          } else {
            setItem(res.data);
          }
        })
        .catch((err) => {
          // history.replace("/404");
          navigate("/404", { replace: true });
          console.log(err);
        });
    }
  }, [id, userProducts, hideProducts, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAddedToCart(true);
    setCart((prev) => {
      const exist = prev.findIndex(
        (el) =>
          el._id === item._id &&
          el.size === item.stock[stockIndex].sizeRemaining[sizeIndex].size &&
          el.color === item.stock[stockIndex].color
      );

      if (exist === -1) {
        return [
          ...prev,
          {
            _id: item._id,
            image: item.stock[stockIndex].images[0],
            name: item.name,
            price: item.price,
            size: item.stock[stockIndex].sizeRemaining[sizeIndex].size,
            color: item.stock[stockIndex].color,
            quantity: quantity,
          },
        ];
      } else {
        const a = [...prev];

        a[exist] = {
          _id: item._id,
          image: item.stock[stockIndex].images[0],
          name: item.name,
          price: item.price,
          size: item.stock[stockIndex].sizeRemaining[sizeIndex].size,
          color: item.stock[stockIndex].color,
          quantity: quantity + a[exist].quantity,
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
        <Link to="/checkout">
          <button>go to cart</button>
        </Link>
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
                <div className="item-page__item__content__rating-container__icons">
                  {`${item.averageRating}`.split(".").map((el, index) => {
                    if (index === 0) {
                      const arr = [];
                      for (var i = 0; i < Number(el); i++) {
                        arr.push(
                          <FontAwesomeIcon
                            key={i}
                            icon="star"
                            className="item-page__item__content__rating-container__icons__icon"
                          />
                        );
                      }
                      return arr;
                    } else {
                      return (
                        <FontAwesomeIcon
                          key={9}
                          icon="star-half"
                          className="item-page__item__content__rating-container__icons__icon"
                        />
                      );
                    }
                  })}
                </div>
                <p className="item-page__item__content__rating-container__rating">
                  {item.averageRating.toFixed(1)}
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
              <div className="item-page__item__content__color-container__colors">
                {item.stock.map((el, index) => (
                  <div
                    key={index}
                    className={
                      stockIndex === index
                        ? "item-page__item__content__color-container__colors__color-box item-page__item__content__color-container__colors__color-box--active"
                        : "item-page__item__content__color-container__colors__color-box"
                    }
                    onClick={() => {
                      setStockIndex(index);
                      setSizeIndex(0);
                    }}
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
              <div className="item-page__item__content__size-container__sizes">
                {item.stock[stockIndex].sizeRemaining.map((el, index) => (
                  <p
                    key={index}
                    className={
                      index === sizeIndex
                        ? "item-page__item__content__size-container__sizes__size item-page__item__content__size-container__sizes__size--active"
                        : "item-page__item__content__size-container__sizes__size"
                    }
                    onClick={() => {
                      setSizeIndex(index);
                    }}
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
