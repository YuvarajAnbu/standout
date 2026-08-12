import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NAME_PATTERN = /^(?=(?:.*\p{L}){2})[\p{L}\p{M} .'’-]+$/u;
const ADDRESS_PATTERN =
  /^(?=(?:.*[\p{L}\p{N}]){2})[\p{L}\p{M}\p{N} .,'’#&/()-]+$/u;
const POSTAL_CODE_PATTERN = /^\d{5}(?:-\d{4})?$/;

const fieldRules = {
  firstName: {
    pattern: NAME_PATTERN,
    message: "Should contain at least two letters",
    required: "Required",
  },
  lastName: {
    pattern: NAME_PATTERN,
    message: "Should contain at least two letters",
    required: "Required",
  },
  streetAddress: {
    pattern: ADDRESS_PATTERN,
    message: "Should contain at least two letters or numbers",
    required: "Required",
  },
  extendedAddress: {
    pattern: ADDRESS_PATTERN,
    message: "Should contain at least two letters or numbers",
  },
  postalCode: {
    pattern: POSTAL_CODE_PATTERN,
    message: "Invalid postal code. eg: 12345 or 12345-6789",
    required: "Required",
  },
  locality: {
    pattern: NAME_PATTERN,
    message: "Should contain at least two letters",
    required: "Required",
  },
};

function AddressInput({
  prefix,
  field,
  label,
  register,
  errors,
  defaultValue,
}) {
  const error = errors?.[prefix]?.[field];
  const rules = fieldRules[field];
  const id = `${prefix}-${field}`;

  return (
    <div className="billing__checkout__content__container__form__input-container">
      <label htmlFor={id}>
        {label} {rules.required && <span>*</span>}
      </label>
      <input
        id={id}
        defaultValue={defaultValue}
        {...register(`${prefix}.${field}`, {
          pattern: { value: rules.pattern, message: rules.message },
          required: rules.required,
        })}
      />
      {error && (
        <p className="billing__checkout__content__container__form__input-container__error-msg">
          <FontAwesomeIcon icon="circle" className="icon" /> {error.message}
        </p>
      )}
    </div>
  );
}

export default function AddressFields({
  prefix,
  register,
  errors,
  usStates,
  defaultAddress = {},
}) {
  return (
    <>
      <div className="billing__checkout__content__container__form__flex">
        <AddressInput
          prefix={prefix}
          field="firstName"
          label="first name"
          register={register}
          errors={errors}
          defaultValue={defaultAddress.firstName}
        />
        <AddressInput
          prefix={prefix}
          field="lastName"
          label="last name"
          register={register}
          errors={errors}
          defaultValue={defaultAddress.lastName}
        />
      </div>
      <AddressInput
        prefix={prefix}
        field="streetAddress"
        label="street address"
        register={register}
        errors={errors}
        defaultValue={defaultAddress.streetAddress}
      />
      <AddressInput
        prefix={prefix}
        field="extendedAddress"
        label="Apt #, Floor, etc. (optional)"
        register={register}
        errors={errors}
        defaultValue={defaultAddress.extendedAddress}
      />
      <div className="billing__checkout__content__container__form__flex">
        <AddressInput
          prefix={prefix}
          field="postalCode"
          label="postal code"
          register={register}
          errors={errors}
          defaultValue={defaultAddress.postalCode}
        />
        <AddressInput
          prefix={prefix}
          field="locality"
          label="city"
          register={register}
          errors={errors}
          defaultValue={defaultAddress.locality}
        />
      </div>
      <div className="billing__checkout__content__container__form__input-container">
        <label htmlFor={`${prefix}-region`}>
          State / Province <span>*</span>
        </label>
        <div className="billing__checkout__content__container__form__input-container__select-container">
          <select
            id={`${prefix}-region`}
            defaultValue={defaultAddress.region}
            {...register(`${prefix}.region`, { required: "Required" })}
          >
            <option value="">Select a state</option>
            {usStates.map((state) => (
              <option value={state.abbreviation} key={state.abbreviation}>
                {state.name}
              </option>
            ))}
          </select>
          <FontAwesomeIcon icon="chevron-right" className="icon" />
        </div>
      </div>
    </>
  );
}
