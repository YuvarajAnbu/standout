import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AddressBilling({
  usStates,
  addresses,
  billingDetails,
  setBillingDetails,
  setHidden,
  errors,
  register,
  showBillingForm,
  setShowBillingForm,
}) {
  return (
    <div className="billing__checkout__content__container__form--billing">
      <p className="billing__checkout__content__container__form__label">
        Billing address
        {addresses.length >= 1 && showBillingForm && (
          <span
            onClick={() => {
              setShowBillingForm(false);
              setBillingDetails((prev) => {
                delete prev.address.billing;
                return {
                  ...prev,
                };
              });
            }}
          >
            choose address
          </span>
        )}
      </p>
      {typeof errors.addressBilling !== "undefined" && (
        <p className="billing__checkout__content__container__form__input-container__error-msg">
          <FontAwesomeIcon icon="circle" className="icon" />{" "}
          {errors.addressBilling.message}
        </p>
      )}
      {showBillingForm ? (
        <div>
          <div className="billing__checkout__content__container__form__flex">
            <div className="billing__checkout__content__container__form__input-container">
              <label htmlFor="billing.firstName">
                first name <span>*</span>
              </label>
              <input
                name="billing.firstName"
                {...register("billing.firstName", {
                  pattern: {
                    value: /^[\w ]{0,}[\w]{2,}[\w ]{0,}$/,
                    message: "Should only be 2 or more than 2 letters",
                  },
                  required: "Required",
                })}
              />
              {typeof errors.billing !== "undefined" && (
                <p className="billing__checkout__content__container__form__input-container__error-msg">
                  {typeof errors.billing.firstName !== "undefined" && (
                    <span>
                      <FontAwesomeIcon icon="circle" className="icon" />{" "}
                      {errors.billing.firstName.message}
                    </span>
                  )}
                </p>
              )}
            </div>
            <div className="billing__checkout__content__container__form__input-container">
              <label htmlFor="billing.lastName">
                last name <span>*</span>
              </label>
              <input
                name="billing.lastName"
                {...register("billing.lastName", {
                  pattern: {
                    value: /^[\w ]{0,}[\w]{2,}[\w ]{0,}$/,
                    message: "Should only be 2 or more than 2 letters",
                  },
                  required: "Required",
                })}
              />
              {typeof errors.billing !== "undefined" && (
                <p className="billing__checkout__content__container__form__input-container__error-msg">
                  {typeof errors.billing.lastName !== "undefined" && (
                    <span>
                      <FontAwesomeIcon icon="circle" className="icon" />{" "}
                      {errors.billing.lastName.message}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="billing__checkout__content__container__form__input-container">
            <label htmlFor="billing.streetAddress">
              street address <span>*</span>
            </label>
            <input
              name="billing.streetAddress"
              {...register("billing.streetAddress", {
                pattern: {
                  value: /^[\w ]{0,}[\w/d]{2,}[\w ]{0,}$/,
                  message: "Should only be 2 or more than 2 numbers or letters",
                },
                required: "Required",
              })}
            />
            {typeof errors.billing !== "undefined" && (
              <p className="billing__checkout__content__container__form__input-container__error-msg">
                {typeof errors.billing.streetAddress !== "undefined" && (
                  <span>
                    <FontAwesomeIcon icon="circle" className="icon" />{" "}
                    {errors.billing.streetAddress.message}
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="billing__checkout__content__container__form__input-container">
            <label htmlFor="billing.extendedAddress">
              Apt #, Floor, etc. (optional)
            </label>
            <input
              name="billing.extendedAddress"
              {...register("billing.extendedAddress", {
                pattern: {
                  value: /^[\w ]{0,}[\w/d]{2,}[\w ]{0,}$/,
                  message: "Should only be 2 or more than 2 numbers or letters",
                },
              })}
            />
            {typeof errors.billing !== "undefined" && (
              <p className="billing__checkout__content__container__form__input-container__error-msg">
                {typeof errors.billing.extendedAddress !== "undefined" && (
                  <span>
                    <FontAwesomeIcon icon="circle" className="icon" />{" "}
                    {errors.billing.extendedAddress.message}
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="billing__checkout__content__container__form__flex">
            <div className="billing__checkout__content__container__form__input-container">
              <label htmlFor="billing.postalCode">
                postal code <span>*</span>
              </label>
              <input
                name="billing.postalCode"
                {...register("billing.postalCode", {
                  pattern: {
                    value: /^\d{5}([-]?\d{4})?$/,
                    message: "Invalid Postal Code",
                  },
                  required: "Required",
                })}
              />
              {typeof errors.billing !== "undefined" && (
                <p className="billing__checkout__content__container__form__input-container__error-msg">
                  {typeof errors.billing.postalCode !== "undefined" && (
                    <span>
                      <FontAwesomeIcon icon="circle" className="icon" />{" "}
                      {errors.billing.postalCode.message}
                    </span>
                  )}
                </p>
              )}
            </div>
            <div className="billing__checkout__content__container__form__input-container">
              <label htmlFor="billing.locaity">
                city <span>*</span>
              </label>
              <input
                name="billing.locality"
                {...register("billing.locality", {
                  pattern: {
                    value: /^[\w ]{0,}[\w/d]{2,}[\w ]{0,}$/,
                    message:
                      "Should only be 2 or more than 2 numbers or letters",
                  },
                  required: "Required",
                })}
              />
              {typeof errors.billing !== "undefined" && (
                <p className="billing__checkout__content__container__form__input-container__error-msg">
                  {typeof errors.billing.locality !== "undefined" && (
                    <span>
                      <FontAwesomeIcon icon="circle" className="icon" />{" "}
                      {errors.billing.locality.message}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="billing__checkout__content__container__form__input-container">
            <label htmlFor="billing.region">
              State / Province <span>*</span>
            </label>
            <div className="billing__checkout__content__container__form__input-container__select-container">
              <select
                name="billing.region"
                placeholder="State / Province"
                {...register("billing.region")}
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
              <input
                id="radio-button"
                type="radio"
                name="addressBilling"
                value={index}
                {...register("billing.region", {
                  required: "address cannot be empty",
                })}
                onClick={() => {
                  delete el._id;
                  setBillingDetails((prev) => {
                    return {
                      ...prev,
                      address: {
                        shipping: prev.address.shipping,
                        billing: el,
                      },
                    };
                  });
                  if (
                    typeof billingDetails.address.shipping.firstName !==
                    "undefined"
                  ) {
                    setHidden((prev) => {
                      return {
                        ...prev,
                        address: true,
                        card: false,
                      };
                    });
                  }
                }}
              />
              <div className="billing__checkout__content__container__address-container__address__icon"></div>

              <div className="billing__checkout__content__container__address-container__address__desc">
                <p className="billing__checkout__content__container__address-container__address__desc__name">
                  {`${el.firstName} ${el.lastName}`}
                </p>
                {el.extendedAddress !== "" && <p>{el.extendedAddress},</p>}

                <p>{el.streetAddress},</p>
                <p>{`${el.locality}, ${el.region} ${el.postalCode}`}</p>
              </div>
            </div>
          ))}
          <div
            className="billing__checkout__content__container__address-container__none"
            onClick={() => {
              setShowBillingForm(true);
              setBillingDetails((prev) => {
                return {
                  ...prev,
                  address: {
                    shipping: prev.address.shipping,
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

export default AddressBilling;
