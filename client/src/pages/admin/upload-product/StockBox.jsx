import React, { useEffect, useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SizeRemainingInputs from "@/pages/admin/upload-product/SizeRemainingInputs";
import { readImagesAsDataUrls } from "@/shared/utils/files";

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
  const imageInput = register(`stock[${index}].images`);

  const addImages = useCallback(
    async (files) => {
      const urls = await readImagesAsDataUrls(files);
      if (urls.length === 0) return;
      setImages((prev) => ({
        ...prev,
        [field.id]: [...(prev[field.id] || []), ...urls].slice(0, 8),
      }));
    },
    [field.id, setImages]
  );

  const hide = useCallback(() => {
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
    if (optionsBox.current) {
      optionsBox.current.scrollTop = "0";
    }
  }, [hideColors]);

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

            addImages(ev.dataTransfer.files);
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
                {images[field.id].map((el) => (
                  <div
                    className="upload__form__stocks-box__stocks-container__stock__drop-zone__images-container__images__image"
                    key={el}
                  >
                    <img src={el} alt="Uploaded product preview" decoding="async" />
                    <button
                      type="button"
                      onClick={() => {
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
            accept="image/jpeg,image/png,image/webp,image/avif"
            id={`stock[${index}].images`}
            {...imageInput}
            onChange={(ev) => {
              imageInput.onChange(ev);
              addImages(ev.target.files);
            }}
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
                const next = { ...prev };
                delete next[field.id];
                return next;
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
