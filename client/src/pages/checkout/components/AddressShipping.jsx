import AddressFields from "@/pages/checkout/components/AddressFields";

export default function AddressShipping({
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
  const selectAddress = (selectedAddress) => {
    const address = { ...selectedAddress };
    delete address._id;
    setBillingDetails((prev) => ({
      ...prev,
      address: {
        shipping: address,
        billing: hideBillingAddress ? address : prev.address.billing,
      },
    }));
    if (hideBillingAddress || billingDetails.address.billing?.firstName) {
      setHidden((prev) => ({ ...prev, address: true, card: false }));
    }
  };

  return (
    <div>
      <p className="billing__checkout__content__container__form__label">
        shipping address
        {addresses.length >= 1 && showShippingForm && (
          <button type="button" onClick={() => setShowShippingForm(false)} style={{ all: "unset", cursor: "pointer" }}>
            use saved address
          </button>
        )}
      </p>
      {errors.addressShipping && (
        <p className="billing__checkout__content__container__form__input-container__error-msg">
          {errors.addressShipping.message}
        </p>
      )}
      {showShippingForm ? (
        <AddressFields
          prefix="shipping"
          register={register}
          errors={errors}
          usStates={usStates}
          defaultAddress={billingDetails.address.shipping}
        />
      ) : (
        <div className="billing__checkout__content__container__address-container">
          {addresses.map((address, index) => (
            <label className="billing__checkout__content__container__address-container__address" key={address._id ?? index}>
              <input
                type="radio"
                value={index}
                {...register("addressShipping", { required: "Address cannot be empty" })}
                onChange={() => selectAddress(address)}
              />
              <span className="billing__checkout__content__container__address-container__address__icon" />
              <span className="billing__checkout__content__container__address-container__address__desc">
                <strong>{`${address.firstName} ${address.lastName}`}</strong>
                {address.extendedAddress && <span>{address.extendedAddress},</span>}
                <span>{address.streetAddress},</span>
                <span>{`${address.locality}, ${address.region} ${address.postalCode}`}</span>
              </span>
            </label>
          ))}
          <button
            type="button"
            className="billing__checkout__content__container__address-container__address billing__checkout__content__container__address-container__none"
            onClick={() => {
              setShowShippingForm(true);
              setBillingDetails((prev) => ({
                ...prev,
                address: { shipping: {}, billing: prev.address.billing },
              }));
            }}
          >
            use a different address
          </button>
        </div>
      )}
    </div>
  );
}
