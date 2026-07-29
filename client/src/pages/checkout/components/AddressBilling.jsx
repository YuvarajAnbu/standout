import AddressFields from "@/pages/checkout/components/AddressFields";

export default function AddressBilling({
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
  const selectAddress = (selectedAddress) => {
    const address = { ...selectedAddress };
    delete address._id;
    setBillingDetails((prev) => ({
      ...prev,
      address: { shipping: prev.address.shipping, billing: address },
    }));
    if (billingDetails.address.shipping?.firstName) {
      setHidden((prev) => ({ ...prev, address: true, card: false }));
    }
  };

  return (
    <div className="billing__checkout__content__container__form--billing">
      <p className="billing__checkout__content__container__form__label">
        Billing address
        {addresses.length >= 1 && showBillingForm && (
          <button type="button" onClick={() => setShowBillingForm(false)} style={{ all: "unset", cursor: "pointer" }}>
            use saved address
          </button>
        )}
      </p>
      {errors.addressBilling && (
        <p className="billing__checkout__content__container__form__input-container__error-msg">
          {errors.addressBilling.message}
        </p>
      )}
      {showBillingForm ? (
        <AddressFields prefix="billing" register={register} errors={errors} usStates={usStates} />
      ) : (
        <div className="billing__checkout__content__container__address-container">
          {addresses.map((address, index) => (
            <label className="billing__checkout__content__container__address-container__address" key={address._id ?? index}>
              <input
                type="radio"
                value={index}
                {...register("addressBilling", { required: "Address cannot be empty" })}
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
            className="billing__checkout__content__container__address-container__none"
            onClick={() => {
              setShowBillingForm(true);
              setBillingDetails((prev) => ({
                ...prev,
                address: { shipping: prev.address.shipping },
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
