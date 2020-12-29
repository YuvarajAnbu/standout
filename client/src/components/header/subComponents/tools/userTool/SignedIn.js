import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function SignedIn({
  user,
  setUser,
  setBlackBox,
  setIfHide,
  setSuccessMsgs,
  setErrorMsgs,
}) {
  return (
    <div className="nav-bar__tools__user__content--signed-in">
      <div className="nav-bar__tools__user__content--signed-in__profile">
        <Link
          to="/personal-info"
          onClick={() => {
            setIfHide(true);
            setBlackBox(false);
            setTimeout(() => {
              document.querySelector("body").style.paddingRight = 0;
              document.querySelector("html").style.overflowY = "scroll";
            }, 300);
          }}
        >
          <div className="nav-bar__tools__user__content--signed-in__profile__img">
            {user.name.slice(0)[0]}
          </div>
        </Link>
        <div className="nav-bar__tools__user__content--signed-in__profile__info">
          <div className="nav-bar__tools__user__content--signed-in__profile__info__email">
            {user.email}
          </div>
          <div className="nav-bar__tools__user__content--signed-in__profile__info__name">
            {user.name}
          </div>
        </div>
      </div>
      <div className="nav-bar__tools__user__content__line"></div>
      <ul className="nav-bar__tools__user__content__links">
        <li>
          <Link
            to="/personal-info"
            style={{ textDecoration: "none", color: "black" }}
            onClick={() => {
              setIfHide(true);
              setBlackBox(false);
              setTimeout(() => {
                document.querySelector("body").style.paddingRight = 0;
                document.querySelector("html").style.overflowY = "scroll";
              }, 300);
            }}
          >
            your account
          </Link>
        </li>
        <li>
          <Link
            to="/your-orders"
            style={{ textDecoration: "none", color: "black" }}
            onClick={() => {
              setIfHide(true);
              setBlackBox(false);
              setTimeout(() => {
                document.querySelector("body").style.paddingRight = 0;
                document.querySelector("html").style.overflowY = "scroll";
              }, 300);
            }}
          >
            your orders
          </Link>
        </li>
        <li
          className="nav-bar__tools__user__content__links__log-out"
          onClick={() => {
            axios
              .put(`/user/logout`)
              .then((res) => {
                if (res.status !== 200) {
                  throw new Error();
                }
                setIfHide(true);
                setBlackBox(false);
                setTimeout(() => {
                  document.querySelector("body").style.paddingRight = 0;
                  document.querySelector("html").style.overflowY = "scroll";
                }, 300);
                setTimeout(() => {
                  setUser({});
                }, 500);
                setTimeout(() => {
                  setSuccessMsgs("logout successful");
                }, 600);
              })
              .catch((err) => {
                console.log(err);
                setIfHide(true);
                setBlackBox(false);
                setTimeout(() => {
                  document.querySelector("body").style.paddingRight = 0;
                  document.querySelector("html").style.overflowY = "scroll";
                }, 300);
                setTimeout(() => {
                  setErrorMsgs("something went wrong. please try again");
                }, 600);
              });
          }}
        >
          log out
        </li>
        <li
          className="nav-bar__tools__user__content__links__log-out"
          onClick={() => {
            axios
              .put(`/user/logout-all`)
              .then((res) => {
                if (res.status !== 200) {
                  throw new Error();
                }

                setIfHide(true);
                setBlackBox(false);
                setTimeout(() => {
                  document.querySelector("body").style.paddingRight = 0;
                  document.querySelector("html").style.overflowY = "scroll";
                }, 300);
                setTimeout(() => {
                  setUser({});
                }, 500);
                setTimeout(() => {
                  setSuccessMsgs("logout successful");
                }, 600);
              })
              .catch((err) => {
                console.log(err);
                setIfHide(true);
                setBlackBox(false);
                setTimeout(() => {
                  document.querySelector("body").style.paddingRight = 0;
                  document.querySelector("html").style.overflowY = "scroll";
                }, 300);
                setTimeout(() => {
                  setErrorMsgs("something went wrong. please try again");
                }, 600);
              });
          }}
        >
          log out on all device
        </li>
      </ul>
    </div>
  );
}

export default SignedIn;
