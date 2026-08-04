import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "@/app/store/useAppStore";
import colors from "@/features/catalog/data/colors";
import { imgPrefix } from "@/shared/utils/images";
import "@/pages/cart/Checkout.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiRequest } from "@/shared/api/client";
import { cachedGet } from "@/shared/api/queries";
import { queryClient } from "@/shared/api/queryClient";
import { loadScripts } from "@/shared/utils/loadScript";
import { getCartItemCount, getCartSubtotal } from "@/features/cart/utils/cart";
import { getColorName } from "@/features/catalog/utils/colors";

function Checkout() {
  const navigate = useNavigate();
  const cart = useAppStore((state) => state.cart);
  const setCart = useAppStore((state) => state.setCart);
  const user = useAppStore((state) => state.user);
  const setOrders = useAppStore((state) => state.setOrders);
  const { mutateAsync: payWithPaypal } = useMutation({
    mutationFn: (payment) =>
      apiRequest("/payment/paypal", { method: "POST", body: payment }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["http", "/user/orders"] }),
  });

  const [scriptLoaded, setScriptLoaded] = useState(false);

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  const [orderId, setOrderId] = useState("");

  const [paypalLoading, setPaypalLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const checkoutStateRef = useRef({ cart, subTotal: 0 });
  const payWithPaypalRef = useRef(payWithPaypal);

  const subTotal = useCallback(() => {
    return getCartSubtotal(cart);
  }, [cart]);

  useEffect(() => {
    checkoutStateRef.current = { cart, subTotal: subTotal() };
    payWithPaypalRef.current = payWithPaypal;
  }, [cart, payWithPaypal, subTotal]);

  useEffect(() => {
    let active = true;
    loadScripts([
        "https://js.braintreegateway.com/web/3.92.1/js/client.min.js",
        "https://js.braintreegateway.com/web/3.92.1/js/paypal-checkout.min.js",
      ])
      .then(() => active && setScriptLoaded(true))
      .catch(() => active && setPaymentFailed(true));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!scriptLoaded) return undefined;

    let active = true;
    let paypalButtons;
    let paypalCheckoutInstance;

    cachedGet("/payment/client_token", { staleTime: 10 * 60_000 })
      .then((token) =>
        window.braintree.client.create({ authorization: token.data })
      )
      .then((clientInstance) =>
        window.braintree.paypalCheckout.create({ client: clientInstance })
      )
      .then((instance) => {
        paypalCheckoutInstance = instance;
        return instance.loadPayPalSDK({ currency: "USD", intent: "capture" });
      })
      .then((instance) => {
        if (!active) return undefined;
        paypalButtons = window.paypal.Buttons({
                  fundingSource: window.paypal.FUNDING.PAYPAL,
                  createOrder: () => {
                    const { subTotal: currentSubtotal } = checkoutStateRef.current;
                    return instance.createPayment({
                      flow: "checkout",
                      amount: (
                        Number(currentSubtotal / 100) +
                        Number((currentSubtotal * 2) / 10000)
                      ).toFixed(2),
                      currency: "USD",
                      intent: "capture",
                      enableShippingAddress: true,
                    });
                  },

                  onApprove: (data) => {
                    return instance
                      .tokenizePayment(data)
                      .then((payload) => {
                        const currentCart = checkoutStateRef.current.cart;
                        const opt = {
                          payload,
                          cart: currentCart,
                        };
                        setLoading(true);
                        return payWithPaypalRef.current(opt)
                          .then((res) => {
                            setLoading(false);
                            setPaymentSuccess(true);
                            const order = res.order;
                            setOrders((prev) => {
                              const localOrderId = order?._id ?? prev.length + 1;
                              setOrderId(localOrderId);
                              return [...prev, {
                                ...order,
                                _id: localOrderId,
                                items: currentCart,
                                delivered: false,
                                date: new Date().toISOString(),
                              }];
                            });
                          })
                          .catch(() => {
                            setLoading(false);
                            setPaymentFailed(true);
                          });
                      });
                  },

                  onCancel: () => setLoading(false),

                  onError: function (err) {
                    console.error("PayPal error", err);
                    setLoading(false);
                    setPaymentFailed(true);
                  },
                });
        return paypalButtons.render("#paypal-button");
      })
      .then(() => active && setPaypalLoading(false))
      .catch((err) => {
        if (active) {
          console.error(err);
          setPaymentFailed(true);
        }
      });

    return () => {
      active = false;
      paypalButtons?.close?.();
      paypalCheckoutInstance?.teardown?.();
    };
  }, [scriptLoaded, setOrders]);

  const noOfItems = () => {
    return getCartItemCount(cart);
  };

  return cart.length < 1 ? (
    <div className="checkout__tool-tip-container">
      <title>My Shopping Cart | Stand Out</title>
      <div className="checkout__tool-tip-container__tool-tip">
        <p>
          No items in your cart. Go back to home page and add some items to
          purchase.
        </p>
        <button type="button" onClick={() => navigate("/")}>ok</button>
      </div>
      <Link to="/">
        <div className="checkout__tool-tip-container__black-box"></div>
      </Link>
    </div>
  ) : (
    <div className="checkout">
      <title>My Shopping Cart | Stand Out</title>
      {loading && (
        <div className="checkout__loader-container">
          <div className="checkout__loader-container__loader"></div>
        </div>
      )}

      {paymentSuccess && (
        <div className="checkout__tool-tip-container">
          <div className="checkout__tool-tip-container__tool-tip">
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
            className="checkout__tool-tip-container__black-box"
            onClick={() => {
              setCart([]);
              navigate(typeof user.name !== "undefined" ? "/your-orders" : "/");
            }}
          ></div>
        </div>
      )}
      {paymentFailed && (
        <div className="checkout__tool-tip-container">
          <div className="checkout__tool-tip-container__tool-tip">
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
            className="checkout__tool-tip-container__black-box"
            onClick={() => {
              setPaymentFailed(false);
            }}
          ></div>
        </div>
      )}
      <div className="checkout__items-container">
        <h1>
          cart <span>({noOfItems()} Items)</span>
        </h1>
        <div className="checkout__items-container__label">
          <p>Items</p>
          <p>Price</p>
        </div>
        <div className="checkout__items-container__items">
          {cart.map((el, index) => (
            <div className="checkout__items-container__items__item" key={`${el._id}-${el.color}-${el.size}`}>
              <div className="checkout__items-container__items__item__content">
                <div className="checkout__items-container__items__item__content__img">
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
                <div className="checkout__items-container__items__item__content__desc">
                  <Link to={`/item/${el._id}`}>{el.name}</Link>
                  <p>color: {getColorName(colors, el.color)}</p>
                  <p>size: {el.size}</p>
                  <div className="checkout__items-container__items__item__content__desc__select-container">
                    <label>QTY:</label>
                    <div className="checkout__items-container__items__item__content__desc__select-container__select">
                      <select
                        value={el.quantity}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCart((prev) => {
                            return prev.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, quantity: Number(value) }
                                : item
                            );
                          });
                        }}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        {el.quantity > 13 && (
                          <option value={el.quantity}>{el.quantity}</option>
                        )}
                      </select>
                      <FontAwesomeIcon icon="chevron-right" className="icon" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="checkout__items-container__items__item__price">
                {`$${((el.price * el.quantity) / 100).toFixed(2)}`}
              </p>
              <button
                type="button"
                className="checkout__items-container__items__item__remove"
                onClick={() => {
                  setCart((current) =>
                    current.filter(
                      (item) =>
                        item._id !== el._id ||
                        item.size !== el.size ||
                        item.color !== el.color,
                    ),
                  );
                }}
              >
                remove
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="checkout__billing-container">
        <div className="checkout__billing-container__billing">
          <p className="checkout__billing-container__billing__label">
            cart summary
          </p>
          <div className="checkout__billing-container__billing__desc">
            <p>Merchandise Subtotal</p>
            <p>{`$${subTotal() / 100}`}</p>
          </div>
          <div className="checkout__billing-container__billing__desc">
            <p>Shipping Charges</p>
            <p>FREE</p>
          </div>
          <div className="checkout__billing-container__billing__desc">
            <p>Estimated Tax</p>
            <p>{`$${((subTotal() * 2) / 10000).toFixed(2)}`}</p>
          </div>
          <div className="checkout__billing-container__billing__total">
            <p>Estimated Total (usd) :</p>
            <p>{`$${(
              Number(subTotal() / 100) + Number((subTotal() * 2) / 10000)
            ).toFixed(2)}`}</p>
          </div>
        </div>
        <div className="checkout__billing-container__button-container">
          <button
            type="button"
            className="checkout__billing-container__button-container__checkout"
            onClick={() => navigate("/shipping-and-billing")}
          >
            checkout
          </button>
          {paypalLoading && (
            <div className="checkout__billing-container__button-container__loading-button">
              <div className="checkout__billing-container__button-container__loading-button__loader"></div>
            </div>
          )}

          <div
            id="paypal-button"
            style={{
              visibility: paypalLoading ? "hidden" : "visible",
              position: paypalLoading ? "absolute" : "static",
            }}
            className={
              paypalLoading
                ? "checkout__billing-container__button-container__paypal--hidden"
                : ""
            }
          ></div>
        </div>
        <div className="checkout__billing-container__features">
          <div className="checkout__billing-container__features__feature">
            <h3>Secure Shopping</h3>
            <p>No worries - all transactions are safe and secure.</p>
          </div>
          <div className="checkout__billing-container__features__feature">
            <h3>Return in online for up to 60 days.</h3>
            <p>Return in store or online for up to 60 days.</p>
          </div>
          <div className="checkout__billing-container__features__feature">
            <h3>Call us anytime at (123) 123-1234.</h3>
            <p>Call us anytime at (123) 123-1234.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
