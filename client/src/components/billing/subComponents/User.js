import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

function User({ hidden, setHidden, billingDetails, setBillingDetails }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [edited, setEdited] = useState(false);

  const onSubmit = (data) => {
    setBillingDetails((prev) => {
      return {
        ...prev,
        user: data,
      };
    });
    if (!edited) {
      setHidden((prev) => {
        return {
          ...prev,
          user: true,
          address: false,
        };
      });
    } else {
      setHidden((prev) => {
        return {
          ...prev,
          user: true,
        };
      });
    }
  };

  return (
    <div className="billing__checkout__content__container">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={
          hidden.user
            ? "billing__checkout__content__container__form billing__checkout__content__container__form--hidden"
            : "billing__checkout__content__container__form"
        }
      >
        <div className="billing__checkout__content__container__form__flex">
          <div className="billing__checkout__content__container__form__input-container">
            <label htmlFor="firstName">
              first name <span>*</span>
            </label>
            <input
              name="firstName"
              {...register("firstName", {
                pattern: {
                  value: /^\w{2,}$/,
                  message: "Should be 2 or more than 2 letters",
                },
                required: "Required",
              })}
              defaultValue={billingDetails.user.firstName}
            />
            {typeof errors.firstName !== "undefined" && (
              <p className="billing__checkout__content__container__form__input-container__error-msg">
                <FontAwesomeIcon icon="circle" className="icon" />{" "}
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="billing__checkout__content__container__form__input-container">
            <label htmlFor="lastName">
              last name <span>*</span>
            </label>
            <input
              name="lastName"
              {...register("lastName", {
                pattern: {
                  value: /^\w{2,}$/,
                  message: "Should be 2 or more than 2 letters",
                },
                required: "Required",
              })}
              defaultValue={billingDetails.user.lastName}
            />
            {typeof errors.lastName !== "undefined" && (
              <p className="billing__checkout__content__container__form__input-container__error-msg">
                <FontAwesomeIcon icon="circle" className="icon" />{" "}
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        <div className="billing__checkout__content__container__form__input-container">
          <label htmlFor="email">
            email address <span>*</span>
          </label>
          <input
            name="email"
            type="text"
            {...register("email", {
              pattern: {
                value: /^\w{2,}@\w{2,}\.\w{2,}(\.\w{2,})?$/,
                message: "Invalid Email Address",
              },
              required: "Required",
            })}
            defaultValue={billingDetails.user.email}
          />
          {typeof errors.email !== "undefined" && (
            <p className="billing__checkout__content__container__form__input-container__error-msg">
              <FontAwesomeIcon icon="circle" className="icon" />{" "}
              {errors.email.message}
            </p>
          )}
        </div>

        <button type="submit">continue</button>
      </form>
      {typeof billingDetails.user !== "undefined" && (
        <div
          className={
            !hidden.user
              ? "billing__checkout__content__container__desc billing__checkout__content__container__desc--hidden"
              : "billing__checkout__content__container__desc"
          }
        >
          <p>{`${billingDetails.user.firstName} ${billingDetails.user.lastName}`}</p>
          <p>{billingDetails.user.email}</p>
          <p
            className="billing__checkout__content__container__desc__edit"
            onClick={() => {
              setEdited(true);
              setHidden((prev) => {
                return {
                  ...prev,
                  user: false,
                };
              });
            }}
          >
            edit
          </p>
        </div>
      )}
    </div>
  );
}

export default User;
