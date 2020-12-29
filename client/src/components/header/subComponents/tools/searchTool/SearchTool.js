import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function SearchTool({ setBlackBox, windowWidth, clicked, setClicked }) {
  const [inputValue, setInputvalue] = useState("");

  const [ifHide, setIfHide] = useState(true);

  useEffect(() => {
    if (clicked !== "search") {
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
    document.querySelector("header .black-box").addEventListener("click", hide);

    return () =>
      document
        .querySelector("header .black-box")
        .removeEventListener("click", hide);
  }, [hide]);

  return (
    <div className="nav-bar__tools__search">
      <div
        className="nav-bar__tools__search__icon-container"
        onMouseEnter={() => {
          setBlackBox(true);
          setIfHide(false);
        }}
        onMouseLeave={() => {
          setIfHide(true);
          setBlackBox(false);
        }}
        onTouchEnd={() => {
          setClicked("search");
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
          className="nav-bar__tools__search__icon-container__icon"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="32"
          height="32"
          viewBox="0 0 30 30"
          style={{ fill: "#000000" }}
        >
          <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
        </svg>
      </div>

      <div
        className={
          !ifHide
            ? "nav-bar__tools__search__content nav-bar__tools__search__content--visible"
            : "nav-bar__tools__search__content"
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
        <div className="nav-bar__tools__search__content__input-container">
          <svg
            className="nav-bar__tools__search__content__input-container__icon"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="32"
            height="32"
            viewBox="0 0 30 30"
            style={{ fill: "#000000" }}
          >
            <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
          </svg>
          <form>
            <input
              placeholder="Search"
              value={inputValue}
              onChange={(e) => setInputvalue(e.target.value)}
            />
            <Link
              onClick={() => {
                setIfHide(true);
                setBlackBox(false);
                setInputvalue("");
                setTimeout(() => {
                  document.querySelector("body").style.paddingRight = 0;
                  document.querySelector("html").style.overflowY = "scroll";
                }, 300);
              }}
              to={`/search?q=${inputValue}`}
            >
              <button type="submit" style={{ display: "none" }}>
                <FontAwesomeIcon
                  className="nav-bar__tools__search__icon"
                  icon="search"
                />
              </button>
            </Link>
          </form>
        </div>
        <Link
          onClick={() => {
            setIfHide(true);
            setBlackBox(false);
            setInputvalue("");
            setTimeout(() => {
              document.querySelector("body").style.paddingRight = 0;
              document.querySelector("html").style.overflowY = "scroll";
            }, 300);
          }}
          to={`/search?q=women's tops`}
        >
          <p>women's tops</p>
        </Link>
        <Link
          onClick={() => {
            setIfHide(true);
            setBlackBox(false);
            setInputvalue("");
            setTimeout(() => {
              document.querySelector("body").style.paddingRight = 0;
              document.querySelector("html").style.overflowY = "scroll";
            }, 300);
          }}
          to={`/search?q=button down shirt for men`}
        >
          <p>button down shirt for men</p>
        </Link>
        <Link
          onClick={() => {
            setIfHide(true);
            setBlackBox(false);
            setInputvalue("");
            setTimeout(() => {
              document.querySelector("body").style.paddingRight = 0;
              document.querySelector("html").style.overflowY = "scroll";
            }, 300);
          }}
          to={`/search?q=socks for men and women`}
        >
          <p>socks for men and women</p>
        </Link>
        <Link
          onClick={() => {
            setIfHide(true);
            setBlackBox(false);
            setInputvalue("");
            setTimeout(() => {
              document.querySelector("body").style.paddingRight = 0;
              document.querySelector("html").style.overflowY = "scroll";
            }, 300);
          }}
          to={`/search?q=men's jackets`}
        >
          <p>men's jackets</p>
        </Link>
      </div>
    </div>
  );
}

export default SearchTool;
