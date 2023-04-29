import React, { useEffect, useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SizeRemainingInputs from "./SizeRemainingInputs";

function StockBox({
  control,
  register,
  errors,
  images,
  setImages,
  getValues,
  colors,
  setValue,
  index,
  field,
  append,
  remove,
}) {
  const colorBox = useRef(null);
  const optionsBox = useRef(null);

  const [colorValue, setColorValue] = useState(colors[0]);

  const [hideColors, setHideColors] = useState(true);

  const hide = useCallback((e) => {
    setHideColors(true);
  }, []);

  useEffect(() => {
    if (colorBox.current) {
      window.addEventListener("click", hide);

      return () => {
        window.removeEventListener("click", hide);
      };
    }
  }, [colorBox, hide]);

  useEffect(() => {
    if (optionsBox) {
      optionsBox.current.scrollTop = "0";
    }
  }, [hideColors, optionsBox]);

  return (
    <div className="upload__form__stocks-box__stocks-container__stock">
      <div className="upload__form__input-container">
        <label htmlFor={`stock[${index}].images`}>
          image <span>*</span>
        </label>
        <div
          className="upload__form__stocks-box__stocks-container__stock__drop-zone"
          onDrop={(ev) => {
            ev.preventDefault();

            for (let i = 0; i < ev.dataTransfer.files.length; i++) {
              const reader = new FileReader();

              reader.onload = (e) => {
                setImages((prev) => {
                  const arr =
                    typeof prev[field.id] == "undefined"
                      ? [reader.result]
                      : prev[field.id].concat(reader.result);

                  return {
                    ...prev,
                    [field.id]: arr,
                  };
                });
              };
              reader.readAsDataURL(ev.dataTransfer.files[i]);
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          {typeof images[field.id] == "undefined" ? (
            <div className="upload__form__stocks-box__stocks-container__stock__drop-zone__upload-desc">
              <FontAwesomeIcon className="icon" icon="cloud-upload-alt" />
              <p>Drag & drop or click to upload</p>
            </div>
          ) : images[field.id].length < 1 ? (
            <div className="upload__form__stocks-box__stocks-container__stock__drop-zone__upload-desc">
              <FontAwesomeIcon className="icon" icon="cloud-upload-alt" />
              <p>Drag & drop or click to upload</p>
            </div>
          ) : (
            <div className="upload__form__stocks-box__stocks-container__stock__drop-zone__images-container">
              <div className="upload__form__stocks-box__stocks-container__stock__drop-zone__images-container__images">
                {images[field.id].map((el, z) => (
                  <div
                    className="upload__form__stocks-box__stocks-container__stock__drop-zone__images-container__images__image"
                    key={z}
                  >
                    <img src={el} alt="uploaded" />
                    <button
                      type="button"
                      onClick={(e) => {
                        setImages((prev) => {
                          return {
                            ...prev,
                            [field.id]: prev[field.id].filter(
                              (img) => img !== el
                            ),
                          };
                        });
                      }}
                    >
                      <FontAwesomeIcon icon="times" />
                    </button>
                  </div>
                ))}
              </div>
              <p>Hover on image and click X to delete images</p>
            </div>
          )}
          <input
            type="file"
            multiple
            onInput={(ev) => {
              for (var i = 0; i < ev.target.files.length; i++) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setImages((prev) => {
                    const arr =
                      typeof prev[field.id] == "undefined"
                        ? [reader.result]
                        : prev[field.id].concat(reader.result);

                    return {
                      ...prev,
                      [field.id]: arr,
                    };
                  });
                };
                reader.readAsDataURL(ev.target.files[i]);
              }
            }}
            onChange={(ev) => {
              for (var i = 0; i < ev.target.files.length; i++) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setImages((prev) => {
                    const arr =
                      typeof prev[field.id] == "undefined"
                        ? [reader.result]
                        : prev[field.id].concat(reader.result);

                    return {
                      ...prev,
                      [field.id]: arr,
                    };
                  });
                };
                reader.readAsDataURL(ev.target.files[i]);
              }
            }}
            name={`stock[${index}].images`}
            {...register(`stock[${index}].images`)}
          />
        </div>
      </div>
      <div className="upload__form__input-container">
        <label htmlFor={`stock[${index}].color`}>
          color <span>*</span>
        </label>
        <div
          className="upload__form__input-container__dropdown-container"
          ref={colorBox}
          tabIndex="0"
          onClick={(e) => {
            e.stopPropagation();
            setHideColors((prev) => !prev);
          }}
        >
          <div
            className={
              hideColors
                ? "upload__form__input-container__dropdown-container__box"
                : "upload__form__input-container__dropdown-container__box upload__form__input-container__dropdown-container__box--active"
            }
          >
            <p>{colorValue[0]}</p>
            <div
              className="upload__form__input-container__dropdown-container__color"
              style={{ backgroundColor: colorValue[1] }}
            ></div>
            <FontAwesomeIcon icon="chevron-right" className="icon" />
          </div>

          <div
            ref={optionsBox}
            className={
              hideColors
                ? "upload__form__input-container__dropdown-container__dropdown-options"
                : "upload__form__input-container__dropdown-container__dropdown-options upload__form__input-container__dropdown-container__dropdown-options--visible"
            }
          >
            {colors.map((el, n) => (
              <div
                key={n}
                style={{
                  paddingRight:
                    window.innerWidth - document.body.clientWidth === 0
                      ? "40px"
                      : "23px",
                }}
                className={
                  colorValue[0] === el[0]
                    ? "upload__form__input-container__dropdown-container__dropdown-options__box upload__form__input-container__dropdown-container__dropdown-options__box--active"
                    : "upload__form__input-container__dropdown-container__dropdown-options__box"
                }
                onClick={() => {
                  setColorValue(el);
                  setValue(`stock[${index}].color`, el[1]);
                }}
              >
                <p>{el[0]}</p>
                <div
                  className="upload__form__input-container__dropdown-container__color"
                  style={{ backgroundColor: el[1] }}
                ></div>
              </div>
            ))}
          </div>
        </div>
        <input
          name={`stock[${index}].color`}
          type="hidden"
          {...register(`stock[${index}].color`)}
          defaultValue={colorValue[1]}
        />
        {typeof errors.stock !== "undefined" && (
          <p className="upload__form__input-container__error-msg">
            {typeof errors.stock[index] !== "undefined" &&
              typeof errors.stock[index].color !== "undefined" && (
                <span>
                  <FontAwesomeIcon icon="circle" className="icon" />{" "}
                  {errors.stock[index].color.message}
                </span>
              )}
          </p>
        )}
      </div>
      <div>
        <SizeRemainingInputs
          stockIndex={index}
          {...{ control, register, errors, getValues }}
        />
      </div>
      <div className="upload__form__button-container">
        <button
          type="button"
          className="upload__form__button-container__delete-button"
          onClick={() => {
            const formObj = getValues();
            if (formObj.stock.length > 1) {
              remove(index);
              setImages((prev) => {
                delete prev[field.id];
                return prev;
              });
            }
          }}
        >
          <FontAwesomeIcon icon="trash" />
        </button>
        <button
          type="button"
          className="upload__form__button-container__add-button"
          onClick={() => {
            append({
              image: [],
              color: colors[0][1],
              sizeRemaining: [{ size: "", remaining: "" }],
            });
          }}
        >
          <FontAwesomeIcon icon="plus" />
        </button>
      </div>
    </div>
  );
}

export default StockBox;
