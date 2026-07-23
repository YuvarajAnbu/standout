import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "../../../store/useAppStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiRequest } from "../../../api/client";
import { cachedGet } from "../../../api/queries";
import { queryClient } from "../../../api/queryClient";
import { loadScripts } from "../../../utils/loadScript";
import { reportError } from "../../../utils/logger";

function Card({
  cart,
  billingDetails,
  setPaymentSuccess,
  setPaymentFailed,
  setOrderId,
  subTotal,
}) {
  const setOrders = useAppStore((state) => state.setOrders);
  const { mutateAsync: checkout } = useMutation({
    mutationFn: (payment) =>
      apiRequest("/payment/checkout", { method: "POST", body: payment }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["http", "/user/orders"] }),
  });
  const paymentStateRef = useRef({ cart, billingDetails, subTotal });
  const checkoutRef = useRef(checkout);

  useEffect(() => {
    paymentStateRef.current = { cart, billingDetails, subTotal };
    checkoutRef.current = checkout;
  }, [billingDetails, cart, checkout, subTotal]);

  const [scriptLoaded, setScriptLoaded] = useState(false);

  const [hide, setHide] = useState(true);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    loadScripts([
        "https://js.braintreegateway.com/web/3.92.1/js/client.min.js",
        "https://js.braintreegateway.com/web/3.92.1/js/hosted-fields.min.js",
      ])
      .then(() => active && setScriptLoaded(true))
      .catch(() => active && setError("Unable to load payment form"));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let form;
    let submitHandler;
    let hostedFieldsInstanceRef;

    if (scriptLoaded) {
      cachedGet("/payment/client_token", { staleTime: 10 * 60_000 })
        .then((res) => {
          if (res.status === 200) {
            form = document.querySelector("#hosted-fields-form");
            const submit = document.querySelector("#payment-card-btn");

            window.braintree.client.create(
              {
                // Insert your tokenization key here
                authorization: res.data,
              },
              function (clientErr, clientInstance) {
                if (clientErr) {
                  console.error(clientErr);
                  return;
                }

                window.braintree.hostedFields.create(
                  {
                    client: clientInstance,
                    styles: {
                      input: {
                        "font-size": "13px",
                      },
                    },
                    fields: {
                      number: {
                        selector: "#card-number",
                        placeholder: "4111 1111 1111 1111",
                        prefill: "4111 1111 1111 1111",
                      },
                      cvv: {
                        selector: "#cvv",
                        placeholder: "123",
                        prefill: "123",
                      },
                      expirationDate: {
                        selector: "#expiration-date",
                        placeholder: "10/30",
                        prefill: "10/30",
                      },
                    },
                  },
                  function (hostedFieldsErr, hostedFieldsInstance) {
                    if (hostedFieldsErr) {
                      console.error(hostedFieldsErr);
                      return;
                    }

                    hostedFieldsInstanceRef = hostedFieldsInstance;

                    submit.removeAttribute("disabled");
                    setHide(false);

                    submitHandler = function (event) {
                        event.preventDefault();
                        setLoading(true);
                        hostedFieldsInstance.tokenize(function (
                          tokenizeErr,
                          payload
                        ) {
                          if (tokenizeErr) {
                            setError("Invalid card Details");
                            console.error(tokenizeErr);
                            setLoading(false);
                            return;
                          }

                          const {
                            cart: currentCart,
                            billingDetails: currentBillingDetails,
                            subTotal: currentSubTotal,
                          } = paymentStateRef.current;
                          const opt = {
                            payload,
                            cart: currentCart,
                            billingDetails: currentBillingDetails,
                          };

                          checkoutRef.current(opt)
                            .then((response) => {
                              hostedFieldsInstance.teardown(function (
                                teardownErr
                              ) {
                                if (teardownErr) {
                                  console.error(
                                    "Could not tear down the Hosted Fields form!"
                                  );
                                } else {
                                  console.info(
                                    "Hosted Fields form has been torn down!"
                                  );
                                }
                              });
                              setLoading(false);
                              setPaymentSuccess(true);
                              const createdOrder = response?.order;
                              setOrders((prev) => [
                                ...prev,
                                {
                                  ...(createdOrder || {}),
                                  _id: createdOrder?._id ?? prev.length + 1,
                                  items: createdOrder?.items ?? currentCart,
                                  delivered: createdOrder?.delivered ?? false,
                                  customer: createdOrder?.customer ?? currentBillingDetails.user,
                                  amount: createdOrder?.amount ?? (
                                    Number(currentSubTotal() / 100) +
                                    Number((currentSubTotal() * 2) / 10000)
                                  ).toFixed(2),
                                  shippingAddress: createdOrder?.shippingAddress ??
                                    currentBillingDetails.address.shipping,
                                  billingAddress: createdOrder?.billingAddress ??
                                    currentBillingDetails.address.billing,
                                  date: createdOrder?.date ?? new Date().toISOString(),
                                },
                              ]);
                              setOrderId(
                                createdOrder?._id ?? useAppStore.getState().orders.length
                              );
                            })
                            .catch((error) => {
                              reportError(error, { area: "card payment" });
                              setError("Something went wrong. Please try again");
                              setLoading(false);
                              setPaymentFailed(true);
                            });
                        });
                      };
                    form.addEventListener("submit", submitHandler, false);
                  }
                );
              }
            );
          }
        })

        .catch((error) => reportError(error, { area: "card initialization" }));
    }

    return () => {
      if (form && submitHandler) {
        form.removeEventListener("submit", submitHandler, false);
      }
      hostedFieldsInstanceRef?.teardown?.(() => {});
    };
  }, [scriptLoaded, setOrderId, setOrders, setPaymentFailed, setPaymentSuccess]);

  return scriptLoaded ? (
    <div className="billing__checkout__content__container__form">
      {hide && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}

      <form
        action="/payment/checkout"
        method="post"
        className={
          hide
            ? "billing__checkout__content__container__form__card billing__checkout__content__container__form__card--hidden"
            : "billing__checkout__content__container__form__card"
        }
        id="hosted-fields-form"
      >
        <p
          style={{ marginTop: "10px" }}
          className="billing__checkout__content__container__form__input-container__error-msg"
        >
          {error && (
            <span>
              <FontAwesomeIcon icon="circle" className="icon" /> {error}
            </span>
          )}
        </p>
        <div className="billing__checkout__content__container__form__input-container">
          <label htmlFor="card-number">
            card number <span>*</span>
          </label>
          <div id="card-number" className="hosted-field"></div>
        </div>
        <div className="billing__checkout__content__container__form__flex billing__checkout__content__container__form__flex--card">
          <div className="billing__checkout__content__container__form__input-container">
            <label htmlFor="cvv">
              cvv <span>*</span>
            </label>
            <div id="cvv" className="hosted-field"></div>
          </div>
          <div className="billing__checkout__content__container__form__input-container">
            <label htmlFor="expiration-date">
              Expiration date <span>*</span>
            </label>
            <div id="expiration-date" className="hosted-field"></div>
          </div>
        </div>
        {loading ? (
          <button
            type="button"
            className="payment-card-btn payment-card-btn--loading"
            disabled
          >
            <div className="payment-card-btn__loading"></div>
          </button>
        ) : (
          <button type="submit" disabled id="payment-card-btn">
            place order
          </button>
        )}
      </form>
    </div>
  ) : (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
}

export default Card;
