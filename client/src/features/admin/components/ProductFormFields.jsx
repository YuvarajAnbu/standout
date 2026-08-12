import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProductFormFields({
  register,
  errors,
  category,
  setCategory,
  setValue,
  uploadOptions,
  defaultProduct = {},
  fields,
  StockBoxComponent,
  stockBoxProps,
  loading,
  submitLabel,
}) {
  const categoryRegistration = register("catagory");

  return (
    <>
      <div className="upload__form__input-container">
        <label htmlFor="product-name">
          name <span>*</span>
        </label>
        <input
          id="product-name"
          autoFocus
          placeholder="e.g. button-down shirt"
          defaultValue={defaultProduct.name}
          {...register("name", {
            pattern: {
              value: /^[\w\d ]{0,}[\w\d-]{2,}[\w\d -]{0,}$/,
              message: "Should contain at least two letters or numbers",
            },
            required: "Required",
          })}
        />
        {errors.name && (
          <p className="upload__form__input-container__error-msg">
            <FontAwesomeIcon icon="circle" className="icon" /> {errors.name.message}
          </p>
        )}
      </div>

      <div className="upload__form__input-container">
        <label htmlFor="product-price">
          price <span>*</span>
        </label>
        <input
          id="product-price"
          className="upload__form__input-container__price"
          placeholder="20 or 20.55 (USD)"
          defaultValue={
            defaultProduct.price == null ? undefined : defaultProduct.price / 100
          }
          {...register("price", {
            required: "Required",
            pattern: {
              value: /^(\d+)(\.\d{1,2})?$/,
              message: "Use a number with up to two decimal places",
            },
          })}
        />
        {errors.price && (
          <p className="upload__form__input-container__error-msg">
            <FontAwesomeIcon icon="circle" className="icon" /> {errors.price.message}
          </p>
        )}
      </div>

      <div className="upload__form__flex">
        <div className="upload__form__input-container">
          <label htmlFor="product-category">
            category <span>*</span>
          </label>
          <div className="upload__form__input-container__select-container">
            <select
              id="product-category"
              defaultValue={defaultProduct.catagory || category}
              {...categoryRegistration}
              onChange={(event) => {
                categoryRegistration.onChange(event);
                setCategory(event.target.value);
                setValue("type", uploadOptions[event.target.value][0].toLowerCase());
              }}
            >
              <option value="women">women</option>
              <option value="men">men</option>
              <option value="both">both</option>
            </select>
            <FontAwesomeIcon icon="chevron-right" className="icon" />
          </div>
        </div>
        <div className="upload__form__input-container">
          <label htmlFor="product-type">
            type <span>*</span>
          </label>
          <div className="upload__form__input-container__select-container">
            <select
              id="product-type"
              defaultValue={defaultProduct.type}
              {...register("type", { required: "Required" })}
            >
              {uploadOptions[category].map((type) => (
                <option value={type.toLowerCase()} key={type}>
                  {type}
                </option>
              ))}
            </select>
            <FontAwesomeIcon icon="chevron-right" className="icon" />
          </div>
        </div>
      </div>

      <div className="upload__form__input-container upload__form__stocks-box">
        <p className="upload__form__label">
          stock <span>*</span>
        </p>
        <div className="upload__form__stocks-box__stocks-container">
          {fields.map((field, index) => (
            <StockBoxComponent
              key={field.id}
              {...stockBoxProps}
              field={field}
              index={index}
            />
          ))}
        </div>
      </div>

      <button
        className={
          loading
            ? "upload__form__submit-button upload__form__submit-button--loading"
            : "upload__form__submit-button"
        }
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <span className="upload__form__submit-button__loader" />
        ) : (
          submitLabel
        )}
      </button>
    </>
  );
}
