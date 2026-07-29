import React from "react";
import { Link } from "react-router-dom";
import { imgPrefix } from "@/shared/utils/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getColorName } from "@/features/catalog/utils/colors";
import { unlockPageScroll } from "@/shared/utils/pageScroll";

function CartItem({ item, setCart, setIfHide, setBlackBox, colors }) {
  return (
    <div className="nav-bar__tools__cart__items-container__items__item">
      <div className="nav-bar__tools__cart__items-container__items__item__img">
        <Link to={`/item/${item._id}`}>
          <img
            src={imgPrefix(100) + item.image}
            alt={item.name}
            loading="lazy"
            decoding="async"
            onClick={() => {
              setIfHide(true);
              setBlackBox(false);
              setTimeout(() => {
                unlockPageScroll();
              }, 300);
            }}
            onError={(e) => {
              e.target.src = "/images/imgFailed.jpg";
            }}
          />
        </Link>
      </div>
      <div className="nav-bar__tools__cart__items-container__items__item__info">
        <Link
          className="nav-bar__tools__cart__items-container__items__item__info__name"
          to={`/item/${item._id}`}
          onClick={() => {
            setIfHide(true);
            setBlackBox(false);
            setTimeout(() => {
              unlockPageScroll();
            }, 300);
          }}
        >
          {item.name.length > 20 ? item.name.slice(0, 18) + "..." : item.name}
        </Link>
        <p className="nav-bar__tools__cart__items-container__items__item__info__price">
          {`$${((item.price * item.quantity) / 100).toFixed(2)}`}
        </p>
        <p>Size: {item.size}</p>
        <p>Color: {getColorName(colors, item.color)}</p>
        <p>QTY: {item.quantity}</p>
      </div>
      <div className="nav-bar__tools__cart__items-container__items__item__buttons">
        <button
          type="button"
          onClick={() => {
            setCart((prev) => {
              const index = prev.findIndex(
                (el) =>
                  el._id === item._id &&
                  el.size === item.size &&
                  el.color === item.color
              );
              const a = [...prev];
              a.splice(index, 1);
              return [...a];
            });
          }}
        >
          <FontAwesomeIcon icon="trash" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
