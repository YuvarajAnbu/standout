import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { imgPrefixContext } from "../../../App";
// import axios from "axios";

function Order({ el, setOrders, setSuccessMsgs, setHideOrders, colors }) {
  const imgPrefix = useContext(imgPrefixContext);
  const [showAddress, setShowAddress] = useState(false);

  const [loadingButton, setLoadingButton] = useState(false);

  const returnOrder = (orderId) => {
    setLoadingButton(true);
    setHideOrders((prev) => [...prev, orderId]);

    setOrders((prev) => prev.filter((el) => el._id !== orderId));
    setSuccessMsgs(
      "order returned successfully. your payment will be refunfed within a week"
    );
    setLoadingButton(false);

    // axios
    //   .delete(`/payment/return?orderId=${orderId}`)
    //   .then((res) => {
    //     if (res.status !== 200) {
    //       throw new Error();
    //     }
    //     setOrders((prev) => prev.filter((el) => el._id !== orderId));
    //     setSuccessMsgs(
    //       "order returned successfully. your payment will be refunfed within a week"
    //     );
    //     setLoadingButton(false);
    //   })
    //   .catch((err) => {
    //     setErrorMsgs("something went wrong. please try again");
    //     console.log(err);
    //     setLoadingButton(false);
    //   });
  };

  return (
    <div className="your-orders__orders-container__order">
      <div className="your-orders__orders-container__order__header-bar">
        <div className="your-orders__orders-container__order__header-bar__details">
          <div className="your-orders__orders-container__order__header-bar__details__detail">
            <p className="your-orders__orders-container__order__header-bar__details__detail__label">
              orders placed
            </p>
            <p>{new Date(el.date).toUTCString().slice(5, 16)}</p>
          </div>
          <div className="your-orders__orders-container__order__header-bar__details__detail">
            <p className="your-orders__orders-container__order__header-bar__details__detail__label">
              total
            </p>
            <p>$ {Number(el.amount).toFixed(2)}</p>
          </div>
          <div className="your-orders__orders-container__order__header-bar__details__detail your-orders__orders-container__order__header-bar__details__detail--address">
            <p className="your-orders__orders-container__order__header-bar__details__detail__label">
              ship to
            </p>
            <div className="your-orders__orders-container__order__header-bar__details__detail__address-container">
              <p
                className="your-orders__orders-container__order__header-bar__details__detail__address-container__link"
                onTouchEnd={() => {
                  setShowAddress(true);
                }}
              >
                {el.shippingAddress.firstName} {el.shippingAddress.lastName}
              </p>
              <div
                className={
                  showAddress
                    ? "your-orders__orders-container__order__header-bar__details__detail__address-container__address--visible your-orders__orders-container__order__header-bar__details__detail__address-container__address"
                    : "your-orders__orders-container__order__header-bar__details__detail__address-container__address"
                }
              >
                <p>{el.shippingAddress.streetAddress},</p>
                {el.shippingAddress.extendedAddress && (
                  <p>{`${el.shippingAddress.extendedAddress},`}</p>
                )}
                <p>{`${el.shippingAddress.locality}, ${el.shippingAddress.region} ${el.shippingAddress.postalCode}`}</p>
              </div>
            </div>
          </div>
          <div className="your-orders__orders-container__order__header-bar__details__detail your-orders__orders-container__order__header-bar__details__detail--order-id">
            <p className="your-orders__orders-container__order__header-bar__details__detail__label">
              Order id
            </p>
            <p>{el._id}</p>
          </div>
        </div>
      </div>
      <div className="your-orders__orders-container__order__products-container">
        {el.delivered ? (
          <div className="your-orders__orders-container__order__products-container__title-container">
            <div>
              <h3 className="your-orders__orders-container__order__products-container__deliveres">
                delivered
              </h3>
              <p>Package was handed directly to the customer.</p>
              {new Date(
                new Date(el.date).setDate(new Date(el.date).getDate() + 10)
              ) > new Date() && (
                <p>
                  returned untill{" "}
                  {new Date(
                    new Date(el.date).setDate(new Date(el.date).getDate() + 10)
                  )
                    .toUTCString()
                    .slice(5, 16)}
                </p>
              )}
            </div>
            <div className="your-orders__orders-container__order__products-container__title-container__button-container">
              {new Date(
                new Date(el.date).setDate(new Date(el.date).getDate() + 10)
              ) > new Date() && (
                <button
                  type="button"
                  onClick={() => {
                    returnOrder(el._id);
                  }}
                >
                  return
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="your-orders__orders-container__order__products-container__title-container">
            <div>
              <h3 className="your-orders__orders-container__order__products-container__deliveres">
                not delivered
              </h3>
              <p>on the way</p>
              <p>
                returned untill{" "}
                {new Date(
                  new Date(el.date).setDate(new Date(el.date).getDate() + 10)
                )
                  .toUTCString()
                  .slice(5, 16)}
              </p>
            </div>
            <div className="your-orders__orders-container__order__products-container__title-container__button-container">
              {loadingButton ? (
                <button
                  type="button"
                  className="your-orders__orders-container__order__products-container__title-container__button-container__button your-orders__orders-container__order__products-container__title-container__button-container__button--loding"
                >
                  <div className="your-orders__orders-container__order__products-container__title-container__button-container__button__loading"></div>
                </button>
              ) : (
                <button
                  type="button"
                  className="your-orders__orders-container__order__products-container__title-container__button-container__button"
                  onClick={() => {
                    returnOrder(el._id);
                    // if (
                    //   new Date(el.date).getTime() + 86400000 <
                    //   new Date().getTime()
                    // ) {
                    //   returnOrder(el._id);
                    // } else {
                    //   setErrorMsgs(
                    //     "you cannot return for 24 hours untill the date of purchase"
                    //   );
                    // }
                  }}
                >
                  return
                </button>
              )}
            </div>
          </div>
        )}
        {el.items.map((e, i) => (
          <div
            key={i}
            className="your-orders__orders-container__order__products-container__product-container"
          >
            <div className="your-orders__orders-container__order__products-container__product-container__product">
              <div className="your-orders__orders-container__order__products-container__product-container__product__img">
                <Link to={`/item/${e._id}`}>
                  <img
                    src={imgPrefix(100) + e.image}
                    alt={e.name}
                    onError={(e) => {
                      e.target.src = "/images/imgFailed.jpg";
                    }}
                  />
                </Link>
              </div>
              <div className="your-orders__orders-container__order__products-container__product-container__product__content">
                <Link to={`/item/${e._id}`}>{e.name}</Link>
                <p className="your-orders__orders-container__order__products-container__product-container__product__content__price">
                  $ {(e.price / 100).toFixed(2)}
                </p>
                <p>Color: {colors.filter((z) => z[1] === e.color)[0][0]}</p>
                <p>size: {e.size}</p>
                <p>quantity: {e.quantity}</p>
              </div>
            </div>
            <div className="your-orders__orders-container__order__products-container__product-container__button-container">
              <Link to={`/item/${e._id}`}>
                <button type="button">buy again</button>
              </Link>
              <Link to={`/item/${e._id}`}>
                <button type="button">write a product review</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Order;
