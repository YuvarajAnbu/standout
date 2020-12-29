import React, { useState, useEffect, useCallback } from "react";
import SearchTool from "./searchTool/SearchTool";
import UserTool from "./userTool/UserTool";
import CartTool from "./cartTool/CartTool";
import Hamburger from "./hamburger/Hamburger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Tools({ setBlackBox }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [clicked, setClicked] = useState("");

  const [successMsgs, setSuccessMsgs] = useState("");
  const [errorMsgs, setErrorMsgs] = useState("");
  const [showMsgs, setShowMsgs] = useState(false);

  const resizeEvent = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resizeEvent);

    return () => window.removeEventListener("resize", resizeEvent);
  }, [resizeEvent]);

  useEffect(() => {
    if (errorMsgs !== "") {
      const a = setTimeout(() => {
        setErrorMsgs("");
      }, 3400);
      const b = setTimeout(() => {
        setShowMsgs(true);
      }, 1);
      const c = setTimeout(() => {
        setShowMsgs(false);
      }, 3000);

      return () => {
        clearTimeout(a);
        clearTimeout(b);
        clearTimeout(c);
      };
    }
  }, [errorMsgs]);

  useEffect(() => {
    if (successMsgs !== "") {
      const a = setTimeout(() => {
        setSuccessMsgs("");
      }, 3400);
      const b = setTimeout(() => {
        setShowMsgs(true);
      }, 1);
      const c = setTimeout(() => {
        setShowMsgs(false);
      }, 3000);

      return () => {
        clearTimeout(a);
        clearTimeout(b);
        clearTimeout(c);
      };
    }
  }, [successMsgs]);

  return (
    <div
      className="nav-bar__tools"
      onMouseEnter={() => {
        document.querySelector("body").style.paddingRight =
          window.innerWidth - document.body.clientWidth + "px";
        document.querySelector("html").style.overflowY = "hidden";
        document.querySelector("html").scrollTop = 0;
      }}
      onMouseLeave={() => {
        setTimeout(() => {
          document.querySelector("body").style.paddingRight = 0;
          document.querySelector("html").style.overflowY = "scroll";
        }, 300);
      }}
    >
      {errorMsgs !== "" && (
        <div className={showMsgs ? "msg msg--visible" : "msg"}>
          <FontAwesomeIcon
            icon={["far", "times-circle"]}
            className="icon"
            onClick={() => {
              setSuccessMsgs("");
            }}
          />
          <p>{errorMsgs}</p>
        </div>
      )}
      {successMsgs !== "" && (
        <div className={showMsgs ? "msg msg--visible" : "msg"}>
          <FontAwesomeIcon
            icon={["far", "check-circle"]}
            className="icon"
            onClick={() => {
              setSuccessMsgs("");
            }}
          />
          <p>{successMsgs}</p>
        </div>
      )}
      <SearchTool
        {...{
          clicked,
          setClicked,
          setBlackBox,
          windowWidth,
        }}
      />
      <UserTool
        {...{
          clicked,
          setClicked,
          setBlackBox,
          windowWidth,
          setSuccessMsgs,
          setErrorMsgs,
        }}
      />
      <CartTool
        {...{
          clicked,
          setClicked,
          setBlackBox,
          windowWidth,
        }}
      />
      <Hamburger
        {...{
          clicked,
          setClicked,
          setBlackBox,
          windowWidth,
        }}
      />
    </div>
  );
}

export default Tools;
