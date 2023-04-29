import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AddressShipping({
  usStates,
  setHidden,
  addresses,
  billingDetails,
  setBillingDetails,
  errors,
  register,
  hideBillingAddress,
  showShippingForm,
  setShowShippingForm,
}) {
  return (
    <div>
      <p className="billing__checkout__content__container__form__label">
        shipping address
        {addresses.length >= 1 && showShippingForm && (
          <span
            onClick={() => {
              setShowShippingForm(false);
              setBillingDetails((prev) => {
                return {
                  ...prev,
                  address: {
                    shipping: {},
                    billing: prev.address.billing,
                  },
                };
              });
            }}
          >
            choose address
          </span>
        )}
      </p>

      {typeof errors.addressShipping !== "undefined" && (
        <p className="billing__checkout__content__container__form__input-container__error-msg">
          <FontAwesomeIcon icon="circle" className="icon" />{" "}
          {errors.addressShipping.message}
        </p>
      )}
      {showShippingForm ? (
        <div>
          <div className="billing__checkout__content__container__form__flex">
            <div className="billing__checkout__content__container__form__input-container">
              <label htmlFor="shipping.firstName">
                first name <span>*</span>
              </label>
              <input
                name="shipping.firstName"
                {...register("shipping.firstName", {
                  pattern: {
                    value: /^[\w ]{0,}[\w]{2,}[\w ]{0,}$/,
                    message: "Should only be 2 or more than 2 letters",
                  },
                  required: "Required",
                })}
                defaultValue={billingDetails.address.shipping.firstName}
              />
              {typeof errors.shipping !== "undefined" && (
                <p className="billing__checkout__content__container__form__input-container__error-msg">
                  {typeof errors.shipping.firstName !== "undefined" && (
                    <span>
                      <FontAwesomeIcon icon="circle" className="icon" />{" "}
                      {errors.shipping.firstName.message}
                    </span>
                  )}
                </p>
              )}
            </div>
            <div className="billing__checkout__content__container__form__input-container">
              <label htmlFor="shipping.lastName">
                last name <span>*</span>
              </label>
              <input
                name="shipping.lastName"
                {...register("shipping.lastName", {
                  pattern: {
                    value: /^[\w ]{0,}[\w]{2,}[\w ]{0,}$/,
                    message: "Should only be 2 or more than 2 letters",
                  },
                  required: "Required",
                })}
                defaultValue={billingDetails.address.shipping.lastName}
              />
              {typeof errors.shipping !== "undefined" && (
                <p className="billing__checkout__content__container__form__input-container__error-msg">
                  {typeof errors.shipping.lastName !== "undefined" && (
                    <span>
                      <FontAwesomeIcon icon="circle" className="icon" />{" "}
                      {errors.shipping.lastName.message}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="billing__checkout__content__container__form__input-container">
            <label htmlFor="shipping.streetAddress">
              street address <span>*</span>
            </label>
            <input
              name="shipping.streetAddress"
              {...register("shipping.streetAddress", {
                pattern: {
                  value: /^[\w ]{0,}[\w/d]{2,}[\w ]{0,}$/,
                  message: "Should only be 2 or more than 2 numbers or letters",
                },
                required: "Required",
              })}
              defaultValue={billingDetails.address.shipping.streetAddress}
            />
            {typeof errors.shipping !== "undefined" && (
              <p className="billing__checkout__content__container__form__input-container__error-msg">
                {typeof errors.shipping.streetAddress !== "undefined" && (
                  <span>
                    <FontAwesomeIcon icon="circle" className="icon" />{" "}
                    {errors.shipping.streetAddress.message}
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="billing__checkout__content__container__form__input-container">
            <label htmlFor="shipping.extendedAddress">
              Apt #, Floor, etc. (optional)
            </label>
            <input
              name="shipping.extendedAddress"
              {...register("shipping.extendedAddress", {
                pattern: {
                  value: /^[\w ]{0,}[\w/d]{2,}[\w ]{0,}$/,
                  message: "Should only be 2 or more than 2 numbers or letters",
                },
              })}
              defaultValue={billingDetails.address.shipping.extendedAddress}
            />
            {typeof errors.shipping !== "undefined" && (
              <p className="billing__checkout__content__container__form__input-container__error-msg">
                {typeof errors.shipping.extendedAddress !== "undefined" && (
                  <span>
                    <FontAwesomeIcon icon="circle" className="icon" />{" "}
                    {errors.shipping.extendedAddress.message}
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="billing__checkout__content__container__form__flex">
            <div className="billing__checkout__content__container__form__input-container">
              <label htmlFor="shipping.postalCode">
                postal code <span>*</span>
              </label>
              <input
                name="shipping.postalCode"
                {...register("shipping.postalCode", {
                  pattern: {
                    value: /^\d{5}([-]?\d{4})?$/,
                    message: "Invalid Postal Code",
                  },
                  required: "Required",
                })}
                defaultValue={billingDetails.address.shipping.postalCode}
              />
              {typeof errors.shipping !== "undefined" && (
                <p className="billing__checkout__content__container__form__input-container__error-msg">
                  {typeof errors.shipping.postalCode !== "undefined" && (
                    <span>
                      <FontAwesomeIcon icon="circle" className="icon" />{" "}
                      {errors.shipping.postalCode.message}
                    </span>
                  )}
                </p>
              )}
            </div>
            <div className="billing__checkout__content__container__form__input-container">
              <label htmlFor="shipping.locality">
                city <span>*</span>
              </label>
              <input
                name="shipping.locality"
                {...register("shipping.locality", {
                  pattern: {
                    value: /^[\w ]{0,}[\w]{2,}[\w ]{0,}$/,
                    message:
                      "Should only be 2 or more than 2 numbers or letters",
                  },
                  required: "Required",
                })}
                defaultValue={billingDetails.address.shipping.locality}
              />
              {typeof errors.shipping !== "undefined" && (
                <p className="billing__checkout__content__container__form__input-container__error-msg">
                  {typeof errors.shipping.locality !== "undefined" && (
                    <span>
                      <FontAwesomeIcon icon="circle" className="icon" />{" "}
                      {errors.shipping.locality.message}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="billing__checkout__content__container__form__input-container">
            <label htmlFor="shipping.region">
              State / Province <span>*</span>
            </label>
            <div className="billing__checkout__content__container__form__input-container__select-container">
              <select
                name="shipping.region"
                {...register("shipping.region")}
                defaultValue={billingDetails.address.shipping.region}
              >
                {usStates.map((el, index) => (
                  <option value={el.abbreviation} key={index}>
                    {el.name}
                  </option>
                ))}
              </select>
              <FontAwesomeIcon icon="chevron-right" className="icon" />
            </div>
          </div>
        </div>
      ) : (
        <div className="billing__checkout__content__container__address-container">
          {addresses.map((el, index) => (
            <div
              className="billing__checkout__content__container__address-container__address"
              key={index}
            >
              {/* <div className="billing__checkout__content__container__address-container__address__input-container"> */}
              <input
                id="radio-button"
                type="radio"
                name="addressShipping"
                value={index}
                {...register("addressShipping", {
                  required: "Address cannot be empty",
                })}
                onClick={(e) => {
                  delete el._id;
                  if (hideBillingAddress) {
                    setBillingDetails((prev) => {
                      return {
                        ...prev,
                        address: {
                          shipping: el,
                          billing: el,
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
                  } else {
                    setBillingDetails((prev) => {
                      return {
                        ...prev,
                        address: {
                          shipping: el,
                          billing: prev.address.billing,
                        },
                      };
                    });

                    if (typeof billingDetails.address.billing !== "undefined") {
                      setHidden((prev) => {
                        return {
                          ...prev,
                          address: true,
                          card: false,
                        };
                      });
                    }
                  }
                }}
              />

              <div className="billing__checkout__content__container__address-container__address__icon"></div>
              {/* </div> */}
              <div className="billing__checkout__content__container__address-container__address__desc">
                <p>{`${el.firstName} ${el.lastName}`}</p>
                {el.extendedAddress !== "" && <p>{el.extendedAddress},</p>}

                <p>{el.streetAddress},</p>
                <p>{`${el.locality}, ${el.region} ${el.postalCode}`}</p>
              </div>
            </div>
          ))}
          <div
            className="billing__checkout__content__container__address-container__address billing__checkout__content__container__address-container__none"
            onClick={() => {
              setShowShippingForm(true);
              setBillingDetails((prev) => {
                return {
                  ...prev,
                  address: {
                    shipping: {},
                    billing: prev.address.billing,
                  },
                };
              });
            }}
          >
            <p>none of these</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressShipping;
