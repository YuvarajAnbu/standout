import React, { useRef, useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SizeRemainingInputs from "./SizeRemainingInputs";

function StockBox({
  control,
  register,
  errors,
  images,
  setImages,
  getValues,
  item,
  field,
  colors,
  setValue,
  index,
  append,
  remove,
}) {
  const colorBox = useRef(null);
  const optionsBox = useRef(null);

  const [colorValue, setColorValue] = useState(
    colors.filter((el) => el[1] === field.color)[0]
  );

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
      <input
        name={`stock[${index}]._id`}
        ref={register()}
        defaultValue={typeof field._id === "string" ? field._id : field.id}
        type="hidden"
      />
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
                    typeof prev[field._id] === "undefined"
                      ? [reader.result]
                      : prev[field._id].concat(reader.result);

                  return {
                    ...prev,
                    [field._id]: arr,
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
          {typeof images[field._id] === "undefined" ? (
            <div className="upload__form__stocks-box__stocks-container__stock__drop-zone__upload-desc">
              <FontAwesomeIcon className="icon" icon="cloud-upload-alt" />
              <p>Drag & drop or click to upload</p>
            </div>
          ) : images[field._id].length < 1 ? (
            <div className="upload__form__stocks-box__stocks-container__stock__drop-zone__upload-desc">
              <FontAwesomeIcon className="icon" icon="cloud-upload-alt" />
              <p>Drag & drop or click to upload</p>
            </div>
          ) : (
            <div className="upload__form__stocks-box__stocks-container__stock__drop-zone__images-container">
              <div className="upload__form__stocks-box__stocks-container__stock__drop-zone__images-container__images">
                {images[field._id].map((el, l) => (
                  <div
                    key={l}
                    className="upload__form__stocks-box__stocks-container__stock__drop-zone__images-container__images__image"
                  >
                    <img
                      src={el}
                      alt="product"
                      onError={(e) => {
                        e.target.src = "/images/imgFailed.jpg";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImages((prev) => {
                          return {
                            ...prev,
                            [field._id]: prev[field._id].filter(
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
            onChange={(ev) => {
              for (var i = 0; i < ev.target.files.length; i++) {
                const reader = new FileReader();

                reader.onload = (e) => {
                  setImages((prev) => {
                    const arr =
                      typeof prev[field._id] === "undefined"
                        ? [reader.result]
                        : prev[field._id].concat(reader.result);

                    return {
                      ...prev,
                      [field._id]: arr,
                    };
                  });
                };
                reader.readAsDataURL(ev.target.files[i]);
              }
            }}
            name={`stock[${index}].images`}
            ref={register()}
            defaultValue={field.images}
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
                  colorBox.current.scrollTop = 0;
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
          <input
            name={`stock[${index}].color`}
            type="hidden"
            ref={register()}
            defaultValue={colorValue[1]}
          />
        </div>
      </div>
      <div>
        <SizeRemainingInputs
          stockIndex={index}
          {...{
            control,
            register,
            errors,
            getValues,
            item: item.stock[index],
          }}
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
              color: "",
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
