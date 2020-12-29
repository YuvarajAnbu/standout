import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddressShipping from "./AddressShipping";
import AddressBilling from "./AddressBilling";
import { StateContext } from "../../../App";

function Address({
  hidden,
  setHidden,
  billingDetails,
  setBillingDetails,
  user,
}) {
  const usStates = useContext(StateContext);

  const [addresses, setAddresses] = useState([]);
  const [hideBillingAddress, setHideBillingAddress] = useState(true);
  const [showShippingForm, setShowShippingForm] = useState(true);
  const [showBillingForm, setShowBillingForm] = useState(true);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    if (typeof user.name !== "undefined") {
      setAddresses(user.addresses);
      setHidden((prev) => {
        return {
          ...prev,
          address: false,
        };
      });
      if (user.addresses.length > 0) {
        setShowShippingForm(false);
        setShowBillingForm(false);
      }
    }
  }, [setHidden, user.name, user.addresses]);

  useEffect(() => {
    if (!showShippingForm) {
      if (hideBillingAddress) {
        if (typeof billingDetails.address.shipping.firstName !== "undefined") {
          setBillingDetails((prev) => {
            return {
              ...prev,
              address: {
                shipping: prev.address.shipping,
                billing: prev.address.shipping,
              },
            };
          });
          setHidden((prev) => {
            return {
              ...prev,
              address: true,
              card: false,
            };
          });
        }
      }
    }
  }, [
    hideBillingAddress,
    billingDetails.address.shipping.firstName,
    setBillingDetails,
    setHidden,
    showShippingForm,
  ]);

  const { register, handleSubmit, errors, setValue } = useForm();

  const onSubmit = (data) => {
    if (typeof data.billing === "undefined") {
      data.billing = data.shipping;
    }

    if (!showShippingForm) {
      delete data.addressShipping;
      data.shipping = billingDetails.address.shipping;
    }

    if (!showBillingForm) {
      delete data.addressBilling;
      data.billing = billingDetails.address.billing;
    }

    let trimmedData = {};

    Object.keys(data).forEach((el) => {
      trimmedData[el] = {};
      Object.keys(data[el]).forEach((e) => {
        if (typeof data[el][e] === "string") {
          trimmedData[el][e] = data[el][e].trim();
          setValue(`${el}.${e}`, data[el][e].trim());
        } else {
          trimmedData[el][e] = data[el][e];
          setValue(`${el}.${e}`, data[el][e]);
        }
      });
    });

    setBillingDetails((prev) => {
      return {
        ...prev,
        address: trimmedData,
      };
    });

    if (!edited) {
      setHidden((prev) => {
        return {
          ...prev,
          address: true,
          card: false,
        };
      });
    } else {
      setHidden((prev) => {
        return {
          ...prev,
          address: true,
        };
      });
    }
  };

  return (
    <div className="billing__checkout__content__container">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={
          hidden.address
            ? "billing__checkout__content__container__form--hidden"
            : "billing__checkout__content__container__form"
        }
      >
        <AddressShipping
          {...{
            addresses,
            billingDetails,
            setBillingDetails,
            setHidden,
            errors,
            register,
            hideBillingAddress,
            setHideBillingAddress,
            showShippingForm,
            setShowShippingForm,
            usStates,
          }}
        />
        <div className="billing__checkout__content__container__form__checkbox">
          <div
            className="billing__checkout__content__container__form__checkbox__icons"
            onClick={() => {
              setHideBillingAddress((prev) => !prev);
              setBillingDetails((prev) => {
                delete prev.address.billing;
                return { ...prev };
              });
            }}
          >
            {hideBillingAddress ? (
              <FontAwesomeIcon icon="check-square" />
            ) : (
              <FontAwesomeIcon icon={["far", "square"]} />
            )}
          </div>
          <p>Billing Address is same as the Shipping Address</p>
        </div>
        {!hideBillingAddress && (
          <AddressBilling
            {...{
              addresses,
              billingDetails,
              setBillingDetails,
              setHidden,
              errors,
              register,
              showBillingForm,
              setShowBillingForm,
              usStates,
            }}
          />
        )}

        {(showShippingForm || showBillingForm) && (
          <button type="submit">continue</button>
        )}
      </form>
      {typeof billingDetails.address.shipping !== "undefined" &&
        typeof billingDetails.address.billing !== "undefined" && (
          <div
            className={
              !hidden.address
                ? "billing__checkout__content__container__desc billing__checkout__content__container__desc--hidden billing__checkout__content__container__desc billing__checkout__content__container__desc--address"
                : "billing__checkout__content__container__desc billing__checkout__content__container__desc--address"
            }
          >
            <div>
              <p className="billing__checkout__content__container__desc__label">
                shipping address
              </p>
              <p>{`${billingDetails.address.shipping.firstName} ${billingDetails.address.shipping.lastName}`}</p>
              <p>{billingDetails.address.shipping.streetAddress}</p>
              {billingDetails.address.shipping.extendedAddress !== "" && (
                <p>{billingDetails.address.shipping.extendedAddress}</p>
              )}
              <p>{`${billingDetails.address.shipping.locality}, ${billingDetails.address.shipping.region}, ${billingDetails.address.shipping.postalCode}`}</p>
            </div>

            <div>
              <p className="billing__checkout__content__container__desc__label">
                billing address
              </p>
              <p>{`${billingDetails.address.billing.firstName} ${billingDetails.address.billing.lastName}`}</p>
              <p>{billingDetails.address.billing.streetAddress}</p>
              {billingDetails.address.billing.extendedAddress !== "" && (
                <p>{billingDetails.address.billing.extendedAddress}</p>
              )}
              <p>{`${billingDetails.address.billing.locality}, ${billingDetails.address.billing.region}, ${billingDetails.address.billing.postalCode}`}</p>
            </div>

            <p
              className="billing__checkout__content__container__desc__edit"
              onClick={() => {
                setEdited(true);
                setHidden((prev) => {
                  return {
                    ...prev,
                    address: false,
                  };
                });
                if (addresses.length >= 1) {
                  const radioButtons = document.querySelectorAll(
                    "#radio-button"
                  );
                  radioButtons.forEach((el) => {
                    el.checked = false;
                  });
                }

                if (!showShippingForm) {
                  setBillingDetails((prev) => {
                    return {
                      ...prev,
                      address: {
                        shipping: {},
                        billing: prev.address.billing,
                      },
                    };
                  });
                }

                if (!showBillingForm) {
                  setBillingDetails((prev) => {
                    return {
                      ...prev,
                      address: {
                        shipping: prev.address.shipping,
                      },
                    };
                  });
                }
              }}
            >
              edit
            </p>
          </div>
        )}
    </div>
  );
}

export default Address;
