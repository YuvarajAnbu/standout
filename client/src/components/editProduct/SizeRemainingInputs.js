import React, { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SizeRemainingInputs({
  stockIndex,
  control,
  register,
  errors,
  getValues,
  item,
}) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `stock[${stockIndex}].sizeRemaining`,
  });

  useEffect(() => {
    if (fields.length < 1) {
      if (typeof item !== "undefined") {
        item.sizeRemaining.forEach((el) => {
          setTimeout(() => {
            append({ size: el.size, remaining: el.remaining }, false);
          }, 1);
        });
      } else {
        append({ size: "" }, false);
      }
    }
  }, [append, fields.length, item]);

  return (
    <div>
      {fields.map((field, index) => (
        <div className="upload__form__flex" key={field.id}>
          <div className="upload__form__input-container">
            <label
              htmlFor={`stock[${stockIndex}].sizeRemaining[${index}].size`}
            >
              size <span>*</span>
            </label>
            <input
              name={`stock[${stockIndex}].sizeRemaining[${index}].size`}
              className="upload__form__input-container__size"
              placeholder="XL or 8 or 7.5"
              ref={register({
                required: "required",
              })}
              defaultValue={field.size}
            />
            {typeof errors.stock !== "undefined" && (
              <p className="upload__form__input-container__error-msg">
                {typeof errors.stock[stockIndex] !== "undefined" &&
                  typeof errors.stock[stockIndex].sizeRemaining !==
                    "undefined" &&
                  typeof errors.stock[stockIndex].sizeRemaining[index] !==
                    "undefined" &&
                  typeof errors.stock[stockIndex].sizeRemaining[index].size !==
                    "undefined" && (
                    <span>
                      <FontAwesomeIcon icon="circle" className="icon" />{" "}
                      {
                        errors.stock[stockIndex].sizeRemaining[index].size
                          .message
                      }
                    </span>
                  )}
              </p>
            )}
          </div>
          <div className="upload__form__input-container">
            <label
              htmlFor={`stock[${stockIndex}].sizeRemaining[${index}].remaining`}
            >
              remaining <span>*</span>
            </label>
            <input
              name={`stock[${stockIndex}].sizeRemaining[${index}].remaining`}
              placeholder="76"
              className="upload__form__input-container__remaining"
              ref={register({
                pattern: {
                  value: /^\d+$/,
                  message: "Should be number",
                },
                required: "required",
              })}
              defaultValue={field.remaining}
            />
            {typeof errors.stock !== "undefined" && (
              <p className="upload__form__input-container__error-msg">
                {typeof errors.stock[stockIndex] !== "undefined" &&
                  typeof errors.stock[stockIndex].sizeRemaining !==
                    "undefined" &&
                  typeof errors.stock[stockIndex].sizeRemaining[index] !==
                    "undefined" &&
                  typeof errors.stock[stockIndex].sizeRemaining[index]
                    .remaining !== "undefined" && (
                    <span>
                      <FontAwesomeIcon icon="circle" className="icon" />{" "}
                      {
                        errors.stock[stockIndex].sizeRemaining[index].remaining
                          .message
                      }
                    </span>
                  )}
              </p>
            )}
          </div>

          <div className="upload__form__flex__button-container">
            <button
              type="button"
              className="upload__form__flex__button-container__remove-button"
              onClick={() => {
                const formObj = getValues();
                if (formObj.stock[stockIndex].sizeRemaining.length > 1) {
                  remove(index);
                }
              }}
            >
              <FontAwesomeIcon icon="minus" />
            </button>
            <button
              type="button"
              className="upload__form__flex__button-container__add-button"
              onClick={() => append({ size: "", remaining: "" })}
            >
              <FontAwesomeIcon icon="plus" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SizeRemainingInputs;
