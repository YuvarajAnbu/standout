import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Address({
  userAddresses,
  usStates,
  errors,
  register,
  watch,
  setValue,
  trigger,
  field,
  index,
  remove,
}) {
  const [showAddressForm, setShowAddressForm] = useState(
    typeof field._id === "undefined"
  );

  return (
    <div className="personal-info__container__info">
      <label>address {index + 1}</label>
      <div className="personal-info__container__info__address">
        <p className="personal-info__container__info__address__name">
          {`${watch(`addresses[${index}].firstName`)} ${watch(
            `addresses[${index}].lastName`
          )}`}
        </p>
        {watch(`addresses[${index}].extendedAddress`) !== "" && (
          <p>{watch(`addresses[${index}].extendedAddress`)},</p>
        )}

        <p>{watch(`addresses[${index}].streetAddress`)},</p>
        <p>{`${watch(`addresses[${index}].locality`)}, ${watch(
          `addresses[${index}].region`
        )} ${watch(`addresses[${index}].postalCode`)}`}</p>
      </div>
      <div className="personal-info__container__info__icon-container">
        <FontAwesomeIcon
          className="personal-info__container__info__icon"
          icon="pen"
          onClick={() => {
            setShowAddressForm(true);
          }}
        />
        <FontAwesomeIcon
          className="personal-info__container__info__icon"
          icon="trash"
          onClick={() => {
            remove(index);
          }}
        />
      </div>
      {showAddressForm && (
        <div
          className="personal-info__black-box"
          onClick={() => {
            const addressIndex = userAddresses.findIndex(
              (el) => el._id === field._id
            );

            if (addressIndex !== -1) {
              setValue(`addresses[${index}]`, userAddresses[addressIndex]);
              setShowAddressForm(false);
            } else {
              remove(index);
            }
          }}
        ></div>
      )}
      <div
        className={
          showAddressForm
            ? "personal-info__container__info__pop-up"
            : "personal-info__container__info__pop-up personal-info__container__info__pop-up--hidden"
        }
      >
        <input
          type="hidden"
          name={`addresses[${index}]._id`}
          {...register(`addresses[${index}]._id`)}
          defaultValue={field._id}
        />

        <div className="personal-info__container__info__pop-up__flex">
          <div className="personal-info__container__info__pop-up__input-container">
            <label htmlFor={`addresses[${index}].firstName`}>
              first name <span>*</span>
            </label>
            <input
              name={`addresses[${index}].firstName`}
              {...register(`addresses[${index}].firstName`, {
                pattern: {
                  value: /^\w{2,}$/,
                  message: "Should be 2 or more than 2 letters",
                },
                required: "Required",
              })}
              defaultValue={field.firstName}
            />
            {typeof errors.addresses !== "undefined" && (
              <p className="personal-info__container__info__pop-up__input-container__error-msg">
                {typeof errors.addresses[index] !== "undefined" && (
                  <span>
                    {typeof errors.addresses[index].firstName !==
                      "undefined" && (
                      <span>
                        <FontAwesomeIcon icon="circle" className="icon" />{" "}
                        {errors.addresses[index].firstName.message}
                      </span>
                    )}
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="personal-info__container__info__pop-up__input-container">
            <label htmlFor={`addresses[${index}].lastName`}>
              last name <span>*</span>
            </label>
            <input
              name={`addresses[${index}].lastName`}
              {...register(`addresses[${index}].lastName`, {
                pattern: {
                  value: /^\w{2,}$/,
                  message: "Should be 2 or more than 2 letters",
                },
                required: "Required",
              })}
              defaultValue={field.lastName}
            />
            {typeof errors.addresses !== "undefined" && (
              <p className="personal-info__container__info__pop-up__input-container__error-msg">
                {typeof errors.addresses[index] !== "undefined" && (
                  <span>
                    {typeof errors.addresses[index].lastName !==
                      "undefined" && (
                      <span>
                        <FontAwesomeIcon icon="circle" className="icon" />{" "}
                        {errors.addresses[index].lastName.message}
                      </span>
                    )}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
        <div className="personal-info__container__info__pop-up__input-container">
          <label htmlFor={`addresses[${index}].streetAddress`}>
            street address <span>*</span>
          </label>
          <input
            name={`addresses[${index}].streetAddress`}
            {...register(`addresses[${index}].streetAddress`, {
              minLength: {
                value: 2,
                message: "Should be 2 or more than 2 letters",
              },
              required: "Required",
            })}
            defaultValue={field.streetAddress}
          />
          {typeof errors.addresses !== "undefined" && (
            <p className="personal-info__container__info__pop-up__input-container__error-msg">
              {typeof errors.addresses[index] !== "undefined" && (
                <span>
                  {typeof errors.addresses[index].streetAddress !==
                    "undefined" && (
                    <span>
                      <FontAwesomeIcon icon="circle" className="icon" />{" "}
                      {errors.addresses[index].streetAddress.message}
                    </span>
                  )}
                </span>
              )}
            </p>
          )}
        </div>
        <div className="personal-info__container__info__pop-up__input-container">
          <label htmlFor={`addresses[${index}].extendedAddress`}>
            Apt #, Floor, etc. (optional)
          </label>
          <input
            name={`addresses[${index}].extendedAddress`}
            {...register(`addresses[${index}].extendedAddress`, {
              minLength: {
                value: 2,
                message: "Should be 2 or more than 2 letters",
              },
            })}
            defaultValue={field.extendedAddress}
          />
          {typeof errors.addresses !== "undefined" && (
            <p className="personal-info__container__info__pop-up__input-container__error-msg">
              {typeof errors.addresses[index] !== "undefined" && (
                <span>
                  {typeof errors.addresses[index].extendedAddress !==
                    "undefined" && (
                    <span>
                      <FontAwesomeIcon icon="circle" className="icon" />{" "}
                      {errors.addresses[index].extendedAddress.message}
                    </span>
                  )}
                </span>
              )}
            </p>
          )}
        </div>
        <div className="personal-info__container__info__pop-up__flex">
          <div className="personal-info__container__info__pop-up__input-container">
            <label htmlFor={`addresses[${index}].postalCode`}>
              postal code <span>*</span>
            </label>
            <input
              name={`addresses[${index}].postalCode`}
              {...register(`addresses[${index}].postalCode`, {
                pattern: {
                  value: /^\d{5}([-]?\d{4})?$/,
                  message: "Invalid Postal Code",
                },
                required: "Required",
              })}
              defaultValue={field.postalCode}
            />
            {typeof errors.addresses !== "undefined" && (
              <p className="personal-info__container__info__pop-up__input-container__error-msg">
                {typeof errors.addresses[index] !== "undefined" && (
                  <span>
                    {typeof errors.addresses[index].postalCode !==
                      "undefined" && (
                      <span>
                        <FontAwesomeIcon icon="circle" className="icon" />{" "}
                        {errors.addresses[index].postalCode.message}
                      </span>
                    )}
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="personal-info__container__info__pop-up__input-container">
            <label htmlFor={`addresses[${index}].locality`}>
              city <span>*</span>
            </label>
            <input
              name={`addresses[${index}].locality`}
              {...register(`addresses[${index}].locality`, {
                minLength: {
                  value: 2,
                  message: "Should be 2 or more than 2 letters",
                },
                required: "Required",
              })}
              defaultValue={field.locality}
            />
            {typeof errors.addresses !== "undefined" && (
              <p className="personal-info__container__info__pop-up__input-container__error-msg">
                {typeof errors.addresses[index] !== "undefined" && (
                  <span>
                    {typeof errors.addresses[index].locality !==
                      "undefined" && (
                      <span>
                        <FontAwesomeIcon icon="circle" className="icon" />{" "}
                        {errors.addresses[index].locality.message}
                      </span>
                    )}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
        <div className="personal-info__container__info__pop-up__input-container">
          <label htmlFor={`addresses[${index}].region`}>
            State / Province <span>*</span>
          </label>
          <div className="personal-info__container__info__pop-up__select-container">
            <select
              name={`addresses[${index}].region`}
              {...register(`addresses[${index}].region`)}
              defaultValue={field.region}
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

        <div className="personal-info__container__info__pop-up__button-container">
          <button
            type="button"
            className="personal-info__container__info__pop-up__button-container__cancel"
            onClick={() => {
              const addressIndex = userAddresses.findIndex(
                (el) => el._id === field._id
              );

              if (addressIndex !== -1) {
                setValue(`addresses[${index}]`, userAddresses[addressIndex]);
                setShowAddressForm(false);
              } else {
                remove(index);
              }
            }}
          >
            cancel
          </button>
          <button
            type="button"
            className="personal-info__container__info__pop-up__button-container__ok"
            onClick={async () => {
              await trigger([
                `addresses[${index}].firstName`,
                `addresses[${index}].lastName`,
                `addresses[${index}].streetAddress`,
                `addresses[${index}].extendedAddress`,
                `addresses[${index}].locality`,
                `addresses[${index}].postalCode`,
              ]);

              if (typeof errors.addresses === "undefined") {
                setShowAddressForm(false);
              } else {
                if (typeof errors.addresses[index] === "undefined") {
                  setShowAddressForm(false);
                }
              }
            }}
          >
            ok
          </button>
        </div>
      </div>
    </div>
  );
}

export default Address;
