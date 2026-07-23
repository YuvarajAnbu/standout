import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppStore } from "../../../../../store/useAppStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { unlockPageScroll } from "../../../../../utils/pageScroll";

function NotSignedIn({ setIfHide, setBlackBox }) {
  let location = useLocation();

  const setPath = useAppStore((state) => state.setPath);

  const [orderId, setOrderId] = useState("");

  const [showInput, setShowInput] = useState(false);

  return (
    <div className="nav-bar__tools__user__content--not-signed-in">
      <p className="nav-bar__tools__user__content--not-signed-in__title">
        Explore thousands of varieties of design with top quality
      </p>
      <div className="nav-bar__tools__user__content--not-signed-in__buttons">
        <Link
          to="/signin"
          onClick={() => {
            if (
              location.pathname !== "/signup" &&
              location.pathname !== "/signin"
            ) {
              setPath(location.pathname + location.search);
            }
            setIfHide(true);
            setBlackBox(false);
            setTimeout(() => {
              unlockPageScroll();
            }, 300);
          }}
        >
          <button
            type="button"
            className="nav-bar__tools__user__content--not-signed-in__buttons__signin"
          >
            sign in
          </button>
        </Link>
        <Link
          to="/signup"
          onClick={() => {
            if (
              location.pathname !== "/signup" &&
              location.pathname !== "/signin"
            ) {
              setPath(location.pathname + location.search);
            }
            setIfHide(true);
            setBlackBox(false);
            setTimeout(() => {
              unlockPageScroll();
            }, 300);
          }}
        >
          <button
            type="button"
            className="nav-bar__tools__user__content--not-signed-in__buttons__signup"
          >
            sign up
          </button>
        </Link>
      </div>
      <ul className="nav-bar__tools__user__content__links">
        <li>
          <div className="nav-bar__tools__user__content__links__check-order">
            <p
              className="nav-bar__tools__user__content__links__check-order__p"
              onClick={() => {
                setShowInput((prev) => !prev);
              }}
              style={showInput ? { color: "black" } : {}}
            >
              check orders
            </p>
            {showInput && (
              <div className="nav-bar__tools__user__content__links__check-order__input-container">
                <FontAwesomeIcon icon="search" aria-hidden="true" />
                <form>
                  <input
                    placeholder="Order Id"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                  />
                  <Link
                    to={`/orders?q=${orderId}`}
                    onClick={() => {
                      setIfHide(true);
                      setBlackBox(false);
                      setOrderId("");
                      setTimeout(() => {
                        unlockPageScroll();
                      }, 300);
                    }}
                  >
                    <button type="submit" style={{ display: "none" }}>
                      search
                    </button>
                  </Link>
                </form>
              </div>
            )}
          </div>
        </li>
      </ul>
      <div className="nav-bar__tools__user__content__line"></div>
    </div>
  );
}

export default NotSignedIn;
