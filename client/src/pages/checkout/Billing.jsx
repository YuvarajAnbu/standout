import React, { useEffect, useState } from "react";
import "@/pages/checkout/Billing.scss";
import { useAppStore } from "@/app/store/useAppStore";
import colors from "@/features/catalog/data/colors";
import { imgPrefix } from "@/shared/utils/images";
import { getCartItemCount, getCartSubtotal } from "@/features/cart/utils/cart";
import { getColorName } from "@/features/catalog/utils/colors";
import { Link, useNavigate } from "react-router-dom";
import User from "@/pages/checkout/components/User";
import Address from "@/pages/checkout/components/Address";
import Card from "@/pages/checkout/components/Card";

function Billing() {
  const navigate = useNavigate();
  const cart = useAppStore((state) => state.cart);
  const setCart = useAppStore((state) => state.setCart);
  const user = useAppStore((state) => state.user);

  const [billingDetails, setBillingDetails] = useState({
    user: {},
    address: { shipping: {} },
  });

  const [hidden, setHidden] = useState({
    user: false,
    address: true,
    card: true,
  });

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (typeof user.name !== "undefined") {
      setHidden((prev) => {
        return {
          ...prev,
          user: true,
        };
      });
      const [firstName, lastName] = user.name.split(" ");
      setBillingDetails((prev) => {
        return {
          ...prev,
          user: {
            firstName,
            lastName,
            email: user.email,
          },
        };
      });
    }
  }, [user]);

  const subTotal = () => {
    return getCartSubtotal(cart);
  };

  const noOfItems = () => {
    return getCartItemCount(cart);
  };

  return cart.length < 1 ? (
    <div className="billing__tool-tip-container">
      <title>Checkout | Stand Out</title>
      <div className="billing__tool-tip-container__tool-tip">
        <p>
          No items in your cart. Go back to home page and add some items to
          purchase.
        </p>
        <button type="button" onClick={() => navigate("/")}>ok</button>
      </div>
      <Link to="/">
        <div className="billing__tool-tip-container__black-box"></div>
      </Link>
    </div>
  ) : (
    <div className="billing">
      <title>Checkout | Stand Out</title>
      {paymentSuccess && (
        <div className="billing__tool-tip-container">
          <div className="billing__tool-tip-container__tool-tip">
            <p>
              {typeof user.name !== "undefined"
                ? "Purchase successful. Go to your orders to see it."
                : `purchase successful. Your orderId is ${orderId}`}
            </p>
            <button
              type="button"
              onClick={() => {
                setCart([]);
                navigate(typeof user.name !== "undefined" ? "/your-orders" : "/");
              }}
            >
              ok
            </button>
          </div>
          <div
            className="billing__tool-tip-container__black-box"
            onClick={() => {
              setCart([]);
              navigate(typeof user.name !== "undefined" ? "/your-orders" : "/");
            }}
          ></div>
        </div>
      )}
      {paymentFailed && (
        <div className="billing__tool-tip-container">
          <div className="billing__tool-tip-container__tool-tip">
            <p>payment failed please try again.</p>
            <button
              onClick={() => {
                setPaymentFailed(false);
              }}
            >
              ok
            </button>
          </div>
          <div
            className="billing__tool-tip-container__black-box"
            onClick={() => {
              setPaymentFailed(false);
            }}
          ></div>
        </div>
      )}
      <div className="billing__checkout">
        <h2 className="billing__checkout__label">checkout</h2>
        <div className="billing__checkout__content">
          <p
            className={
              hidden.user
                ? "billing__checkout__content__label billing__checkout__content__label--active"
                : "billing__checkout__content__label"
            }
          >
            1. contact information
          </p>
          <User
            hidden={hidden}
            setHidden={setHidden}
            billingDetails={billingDetails}
            setBillingDetails={setBillingDetails}
          />
        </div>
        <div className="billing__checkout__content">
          <p
            className={
              hidden.address
                ? "billing__checkout__content__label billing__checkout__content__label--active"
                : "billing__checkout__content__label"
            }
          >
            2. shipping & billing address
          </p>
          <Address
            hidden={hidden}
            setHidden={setHidden}
            billingDetails={billingDetails}
            setBillingDetails={setBillingDetails}
            user={user}
          />
        </div>
        <div className="billing__checkout__content">
          <p
            className={
              hidden.card
                ? "billing__checkout__content__label billing__checkout__content__label--active"
                : "billing__checkout__content__label"
            }
          >
            3. payment
          </p>
          {!hidden.card && (
            <Card
              {...{
                cart,
                billingDetails,
                user,
                setPaymentSuccess,
                setPaymentFailed,
                setOrderId,
                setCart,
                subTotal,
              }}
            />
          )}
        </div>
      </div>
      <div className="billing__cart">
        <div className="billing__cart__summary">
          <p className="billing__cart__summary__label">cart summary</p>
          <div className="billing__cart__summary__desc">
            <p>Merchandise Subtotal</p>
            <p>{`$ ${(subTotal() / 100).toFixed(2)}`}</p>
          </div>
          <div className="billing__cart__summary__desc">
            <p>Shipping Charges</p>
            <p>FREE</p>
          </div>
          <div className="billing__cart__summary__desc">
            <p>Estimated Tax</p>
            <p>{`$ ${((subTotal() * 2) / 10000).toFixed(2)}`}</p>
          </div>
          <div className="billing__cart__summary__total">
            <p>Estimated Total (usd) :</p>
            <p>{`$${(
              Number(subTotal() / 100) + Number((subTotal() * 2) / 10000)
            ).toFixed(2)}`}</p>
          </div>
        </div>

        <div className="billing__cart__items">
          <h3 className="billing__cart__items__label">
            cart <span>({noOfItems()} Items)</span>
          </h3>
          {cart.map((el) => (
            <div className="billing__cart__items__item" key={`${el._id}-${el.color}-${el.size}`}>
              <div className="billing__cart__items__item__content">
                <div className="billing__cart__items__item__content__img">
                  <Link to={`/item/${el._id}`}>
                    <img
                      src={imgPrefix(100) + el.image}
                      alt={el.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.src = "/images/imgFailed.jpg";
                      }}
                    />
                  </Link>
                </div>
                <div className="billing__cart__items__item__content__desc">
                  <Link to={`/item/${el._id}`}>
                    <p className="billing__cart__items__item__content__desc__name">
                      {el.name}
                    </p>
                  </Link>
                  <p>{`$ ${((el.price * el.quantity) / 100).toFixed(2)}`}</p>
                  <p>color: {getColorName(colors, el.color)}</p>
                  <p>size: {el.size}</p>
                  <p>{`Qty: ${el.quantity}`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Billing;
