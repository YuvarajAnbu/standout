import React, { useContext, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  CartContext,
  UserContext,
  OrdersContext,
  ColorsContext,
} from "../../App";
import "./Checkout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const { orders, setOrders } = useContext(OrdersContext);
  const colors = useContext(ColorsContext);

  const [scriptLoaded, setScriptLoaded] = useState(false);

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  const [orderId, setOrderId] = useState("");

  const [paypalLoading, setPaypalLoading] = useState(true);

  const [loading, setLoading] = useState(false);

  const subTotal = useCallback(() => {
    let a = 0;

    cart.forEach((el) => {
      a = a + Number(el.price * el.quantity);
    });
    return a;
  }, [cart]);

  useEffect(() => {
    document.title = "My Shopping Cart | Stand Out";
  }, []);

  useEffect(() => {
    if (!scriptLoaded) {
      const links = [
        "https://js.braintreegateway.com/web/3.65.0/js/client.min.js",
        "https://js.braintreegateway.com/web/3.65.0/js/paypal-checkout.min.js",
      ];

      links.forEach((link, index) => {
        const script = document.createElement("script");

        script.src = link;
        document.body.appendChild(script);
        if (links.length - 1 === index) {
          script.onload = () => {
            setScriptLoaded(true);
          };
        }
      });
    }
  }, [scriptLoaded]);

  useEffect(() => {
    if (scriptLoaded) {
      axios.get("/payment/client_token").then((token) => {
        if (token.status === 200) {
          window.braintree.client
            .create({
              authorization: token.data,
            })
            .then(function (clientInstance) {
              return window.braintree.paypalCheckout.create({
                client: clientInstance,
              });
            })
            .then(function (paypalCheckoutInstance) {
              return paypalCheckoutInstance.loadPayPalSDK({
                currency: "USD",
                intent: "capture",
              });
            })
            .then(function (paypalCheckoutInstance) {
              return window.paypal
                .Buttons({
                  fundingSource: window.paypal.FUNDING.PAYPAL,
                  createOrder: function () {
                    return paypalCheckoutInstance.createPayment({
                      flow: "checkout",
                      amount: (
                        Number(subTotal() / 100) +
                        Number((subTotal() * 2) / 10000)
                      ).toFixed(2),
                      currency: "USD",
                      intent: "capture",
                      enableShippingAddress: true,
                    });
                  },

                  onApprove: function (data, actions) {
                    return paypalCheckoutInstance
                      .tokenizePayment(data)
                      .then(function (payload) {
                        const opt = {
                          payload,
                          cart,
                        };
                        setLoading(true);
                        axios
                          .post("/payment/paypal", opt)
                          .then((res) => {
                            setLoading(false);
                            setPaymentSuccess(true);
                            let order = res.data.order;
                            setOrders((prev) => [
                              ...prev,
                              {
                                ...order,
                                _id: prev.length,
                                items: cart,
                                delivered: false,
                                date: new Date().toISOString(),
                              },
                            ]);
                            setOrderId(orders.length + 1);
                          })
                          .catch((err) => {
                            setLoading(false);
                            setPaymentFailed(true);
                          });
                      });
                  },

                  onCancel: function (data) {
                    console.log(
                      "PayPal payment cancelled",
                      JSON.stringify(data, 0, 2)
                    );
                  },

                  onError: function (err) {
                    console.error("PayPal error", err);
                    setLoading(false);
                    setPaymentFailed(true);
                  },
                })
                .render("#paypal-button");
            })
            .then(function () {
              setPaypalLoading(false);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
    }
  }, [scriptLoaded, cart, subTotal, orders, setOrders]);

  const noOfItems = () => {
    let a = 0;
    cart.forEach((el) => {
      a = a + el.quantity;
    });
    return a;
  };

  return cart.length < 1 ? (
    <div className="checkout__tool-tip-container">
      <div className="checkout__tool-tip-container__tool-tip">
        <p>
          No items in your cart. Go back to home page and add some items to
          purchase.
        </p>
        <Link to="/">
          <button>ok</button>
        </Link>
      </div>
      <Link to="/">
        <div
          className="checkout__tool-tip-container__black-box"
          onClick={() => {
            setCart([]);
          }}
        ></div>
      </Link>
    </div>
  ) : (
    <div className="checkout">
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
                ? "purchase successfull go to orders to see it."
                : `purchase successful. Your orderId is ${orderId}`}
            </p>
            <Link to={typeof user.name !== "undefined" ? "/your-orders" : "/"}>
              <button>ok</button>
            </Link>
          </div>
          <Link to={typeof user.name !== "undefined" ? "/your-orders" : "/"}>
            <div className="checkout__tool-tip-container__black-box"></div>
          </Link>
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
            <div className="checkout__items-container__items__item" key={index}>
              <div className="checkout__items-container__items__item__content">
                <div className="checkout__items-container__items__item__content__img">
                  <Link to={`/item/${el._id}`}>
                    <img
                      src={el.image}
                      alt={el.name}
                      onError={(e) => {
                        e.target.src = "/images/imgFailed.jpg";
                      }}
                    />
                  </Link>
                </div>
                <div className="checkout__items-container__items__item__content__desc">
                  <Link to={`/item/${el._id}`}>{el.name}</Link>
                  <p>color: {colors.filter((e) => e[1] === el.color)[0][0]}</p>
                  <p>size: {el.size}</p>
                  <div className="checkout__items-container__items__item__content__desc__select-container">
                    <label>QTY:</label>
                    <div className="checkout__items-container__items__item__content__desc__select-container__select">
                      <select
                        value={el.quantity}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCart((prev) => {
                            const a = [...prev];
                            a[index].quantity = Number(value);
                            return [...a];
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
              <p
                className="checkout__items-container__items__item__remove"
                onClick={() => {
                  setCart((prev) => {
                    const index = prev.findIndex(
                      (e) =>
                        e._id === el._id &&
                        e.size === el.size &&
                        e.color === el.color
                    );
                    const a = [...prev];
                    a.splice(index, 1);
                    return [...a];
                  });
                }}
              >
                remove
              </p>
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
          <Link to="/shipping-and-billing">
            <button
              type="button"
              className="checkout__billing-container__button-container__checkout"
            >
              checkout
            </button>
          </Link>
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
                ? "checkout__billing-container__button-container__paypal---hidden"
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
