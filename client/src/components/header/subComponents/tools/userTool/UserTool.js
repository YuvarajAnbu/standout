import React, { useState, useEffect, useContext, useCallback } from "react";
import SignedIn from "./SignedIn";
import NotSignedIn from "./NotSignedIn";
import { UserContext } from "../../../../../App";

function UserTool({
  setBlackBox,
  windowWidth,
  clicked,
  setClicked,
  setSuccessMsgs,
  setErrorMsgs,
}) {
  const { user, setUser } = useContext(UserContext);

  const [ifHide, setIfHide] = useState(true);

  useEffect(() => {
    if (clicked !== "user") {
      setIfHide(true);
    }
  }, [clicked]);

  const hide = useCallback(() => {
    setIfHide(true);
    setBlackBox(false);
    setTimeout(() => {
      document.querySelector("body").style.paddingRight = 0;
      document.querySelector("html").style.overflowY = "scroll";
    }, 300);
  }, [setBlackBox]);

  useEffect(() => {
    const black = document.querySelector("header .black-box");
    if (black) black.addEventListener("click", hide);

    return () => {
      if (black) black.removeEventListener("click", hide);
    };
  }, [hide]);

  return (
    <div className="nav-bar__tools__user">
      <div
        className="nav-bar__tools__user__icon-container"
        onMouseEnter={() => {
          setBlackBox(true);
          setIfHide(false);
        }}
        onMouseLeave={() => {
          setIfHide(true);
          setBlackBox(false);
        }}
        onTouchEnd={() => {
          setClicked("user");
          if (ifHide) {
            setBlackBox(true);
            setIfHide(false);
            document.querySelector("body").style.paddingRight =
              window.innerWidth - document.body.clientWidth + "px";
            document.querySelector("html").style.overflowY = "hidden";
            document.querySelector("html").scrollTop = 0;
          } else {
            setBlackBox(false);
            setIfHide(true);
            setTimeout(() => {
              document.querySelector("body").style.paddingRight = 0;
              document.querySelector("html").style.overflowY = "scroll";
            }, 300);
          }
        }}
      >
        <svg
          className="nav-bar__tools__user__icon-container__icon"
          width="18"
          height="20"
          viewBox="0 0 20 22"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          data-icon="account"
        >
          <g
            id="Action"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="Action/-Account-(Normal)"
              transform="translate(-6.000000, -4.000000)"
              stroke="#000000"
              strokeWidth="1.5"
            >
              <g id="icon" transform="translate(7.000000, 5.000000)">
                <ellipse
                  id="Oval"
                  cx="8.91"
                  cy="5.38695652"
                  rx="4.86"
                  ry="4.93043478"
                ></ellipse>
                <path
                  d="M17.82,20.5434783 C17.82,16.4589724 13.8308571,13.1478261 8.91,13.1478261 C3.98914288,13.1478261 0,16.4589724 0,20.5434783"
                  id="Shape"
                ></path>
              </g>
            </g>
          </g>
        </svg>
      </div>

      <div
        className={
          !ifHide
            ? "nav-bar__tools__user__content nav-bar__tools__user__content--visible"
            : "nav-bar__tools__user__content"
        }
        onMouseEnter={() => {
          setIfHide(false);
          setBlackBox(true);
        }}
        onMouseLeave={() => {
          setIfHide(true);
          setBlackBox(false);
        }}
      >
        {windowWidth <= 1000 && (
          <div className="nav-bar__tools__button-container">
            <button
              type="button"
              onClick={() => {
                setIfHide(true);
                setBlackBox(false);
                setTimeout(() => {
                  document.querySelector("body").style.paddingRight = 0;
                  document.querySelector("html").style.overflowY = "scroll";
                }, 300);
              }}
            >
              <img
                src="https://img.icons8.com/fluent-systems-filled/24/000000/multiply.png"
                alt="icon"
              />
            </button>
          </div>
        )}

        {user.name ? (
          <SignedIn
            user={user}
            setUser={setUser}
            {...{ setBlackBox, setIfHide, setSuccessMsgs, setErrorMsgs }}
          />
        ) : (
          <NotSignedIn {...{ setBlackBox, setIfHide }} />
        )}
      </div>
    </div>
  );
}

export default UserTool;
