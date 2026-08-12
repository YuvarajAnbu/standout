import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "@/app/store/useAppStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiRequest } from "@/shared/api/client";
import { cachedGet, queryKeys } from "@/shared/api/queries";
import { queryClient } from "@/shared/api/queryClient";
import { loadScripts } from "@/shared/utils/loadScript";
import { reportError } from "@/shared/utils/logger";
import { upsertOrder } from "@/features/orders/utils/orders";

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
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders,
        }),
        queryClient.invalidateQueries({ queryKey: ["products"] }),
      ]),
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
    let active = true;
    let form;
    let submitHandler;
    let hostedFieldsInstanceRef;
    let teardownStarted = false;

    const teardownHostedFields = () => {
      if (!hostedFieldsInstanceRef || teardownStarted) return;

      teardownStarted = true;
      hostedFieldsInstanceRef.teardown((teardownError) => {
        if (
          teardownError &&
          teardownError.code !== "METHOD_CALLED_AFTER_TEARDOWN"
        ) {
          reportError(teardownError, { area: "card teardown" });
        }
      });
    };

    if (scriptLoaded) {
      cachedGet("/payment/client_token", { staleTime: 10 * 60_000 })
        .then((res) => {
          if (active && res.status === 200) {
            form = document.querySelector("#hosted-fields-form");
            const submit = document.querySelector("#payment-card-btn");

            if (!form || !submit) return;

            window.braintree.client.create(
              {
                // Insert your tokenization key here
                authorization: res.data,
              },
              function (clientErr, clientInstance) {
                if (!active) return;
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
                    if (!active) {
                      hostedFieldsInstance?.teardown?.(() => {});
                      return;
                    }
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
                      hostedFieldsInstance.tokenize(
                        function (tokenizeErr, payload) {
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

                          checkoutRef
                            .current(opt)
                            .then((response) => {
                              setLoading(false);
                              setPaymentSuccess(true);
                              const createdOrder = response?.order;
                              setOrders((prev) => {
                                const localOrderId =
                                  createdOrder?._id ?? prev.length + 1;
                                setOrderId(localOrderId);
                                return upsertOrder(prev, {
                                  ...(createdOrder || {}),
                                  _id: localOrderId,
                                  items: createdOrder?.items ?? currentCart,
                                  delivered: createdOrder?.delivered ?? false,
                                  customer:
                                    createdOrder?.customer ??
                                    currentBillingDetails.user,
                                  amount:
                                    createdOrder?.amount ??
                                    (
                                      Number(currentSubTotal() / 100) +
                                      Number((currentSubTotal() * 2) / 10000)
                                    ).toFixed(2),
                                  shippingAddress:
                                    createdOrder?.shippingAddress ??
                                    currentBillingDetails.address.shipping,
                                  billingAddress:
                                    createdOrder?.billingAddress ??
                                    currentBillingDetails.address.billing,
                                  date:
                                    createdOrder?.date ??
                                    new Date().toISOString(),
                                });
                              });
                            })
                            .catch((error) => {
                              reportError(error, { area: "card payment" });
                              setError(
                                "Something went wrong. Please try again",
                              );
                              setLoading(false);
                              setPaymentFailed(true);
                            });
                        },
                      );
                    };
                    form.addEventListener("submit", submitHandler, false);
                  },
                );
              },
            );
          }
        })

        .catch((error) => reportError(error, { area: "card initialization" }));
    }

    return () => {
      active = false;
      if (form && submitHandler) {
        form.removeEventListener("submit", submitHandler, false);
      }
      teardownHostedFields();
    };
  }, [
    scriptLoaded,
    setOrderId,
    setOrders,
    setPaymentFailed,
    setPaymentSuccess,
  ]);

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
