import React, { useContext, useEffect, useState, useCallback } from "react";
import { ProductsContext } from "../../../../../App";
import { Link } from "react-router-dom";

function Hamburger({ setBlackBox, clicked, setClicked, windowWidth }) {
  const { navLinksOptions } = useContext(ProductsContext);

  const [ifHide, setIfHide] = useState(true);

  const [goRight, setGoRight] = useState(false);
  const [catagory, setCatagory] = useState("");
  const [showLinks, setShowLinks] = useState([]);

  useEffect(() => {
    if (clicked !== "ham") {
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
    <div className="nav-bar__tools__hamburger">
      <div
        className="nav-bar__tools__hamburger__icon-container"
        onMouseEnter={() => {
          setGoRight(false);
          setIfHide(false);
          setBlackBox(true);
        }}
        onMouseLeave={() => {
          setIfHide(true);
          setBlackBox(false);
        }}
        onTouchEnd={() => {
          setGoRight(false);
          setShowLinks([]);
          setClicked("ham");
          if (ifHide) {
            setIfHide(false);
            setBlackBox(true);
            document.querySelector("body").style.paddingRight =
              window.innerWidth - document.body.clientWidth + "px";
            document.querySelector("html").style.overflowY = "hidden";
            document.querySelector("html").scrollTop = 0;
          } else {
            setIfHide(true);
            setBlackBox(false);
            setTimeout(() => {
              document.querySelector("body").style.paddingRight = 0;
              document.querySelector("html").style.overflowY = "scroll";
            }, 300);
          }
        }}
      >
        <div className="nav-bar__tools__hamburger__icon-container__icon">
          <div className="nav-bar__tools__hamburger__icon-container__icon__line"></div>
          <div className="nav-bar__tools__hamburger__icon-container__icon__line"></div>
          <div className="nav-bar__tools__hamburger__icon-container__icon__line"></div>
        </div>
      </div>
      <div
        className={
          ifHide
            ? "nav-bar__tools__hamburger__content"
            : "nav-bar__tools__hamburger__content nav-bar__tools__hamburger__content--visible"
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
        <div className="nav-bar__tools__hamburger__content__button-container">
          <button
            type="button"
            className={
              goRight
                ? ""
                : "nav-bar__tools__hamburger__content__button-container__hide-button"
            }
            onClick={() => {
              setGoRight(false);
              setShowLinks([]);
            }}
          >
            <img
              src="https://img.icons8.com/material/24/000000/more-than--v1.png"
              alt="icon"
              style={{ transform: "rotate(180deg)" }}
            />
          </button>

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
        <ul
          className={
            goRight
              ? "nav-bar__tools__hamburger__content__links nav-bar__tools__hamburger__content__links--go-right"
              : "nav-bar__tools__hamburger__content__links"
          }
        >
          {navLinksOptions.map((d, i) => {
            return (
              <li key={i}>
                <div
                  className="nav-bar__tools__hamburger__content__links__link"
                  onClick={() => {
                    setGoRight(true);
                    setCatagory(d.for);
                  }}
                >
                  <p>{d.for}</p>
                  <img
                    src="https://img.icons8.com/material/24/000000/more-than--v1.png"
                    alt="icon"
                  />
                </div>
                <div
                  className={
                    d.for === catagory
                      ? "nav-bar__tools__hamburger__content__links__options nav-bar__tools__hamburger__content__links__options--visible"
                      : "nav-bar__tools__hamburger__content__links__options"
                  }
                  id={d.for}
                >
                  {d.catagory.map((f, j) => {
                    return (
                      <div
                        className="nav-bar__tools__hamburger__content__links__options__options-catagory"
                        key={j}
                      >
                        <div
                          className="nav-bar__tools__hamburger__content__links__options__options-catagory__catagory"
                          onClick={() => {
                            if (showLinks.includes(f.title)) {
                              setShowLinks((prev) =>
                                prev.filter((el) => el !== f.title)
                              );
                            } else {
                              setShowLinks((prev) => [...prev, f.title]);
                            }
                          }}
                        >
                          <p>{f.title}</p>
                          {showLinks.includes(f.title) ? (
                            <img
                              src="https://img.icons8.com/android/24/000000/minus.png"
                              alt="icon"
                            />
                          ) : (
                            <img
                              src="https://img.icons8.com/android/24/000000/plus.png"
                              alt="icon"
                            />
                          )}
                        </div>

                        <ul
                          className={
                            showLinks.includes(f.title)
                              ? "nav-bar__tools__hamburger__content__links__options__options-catagory__links nav-bar__tools__hamburger__content__links__options__options-catagory__links--visible"
                              : "nav-bar__tools__hamburger__content__links__options__options-catagory__links"
                          }
                        >
                          {f.items.map((g, k) => {
                            return (
                              <li key={k}>
                                <Link
                                  to={`/items/${d.for.toLowerCase()}/${g.toLowerCase()}`}
                                  onClick={() => {
                                    setIfHide(true);
                                    setBlackBox(false);
                                    setTimeout(() => {
                                      document.querySelector(
                                        "body"
                                      ).style.paddingRight = 0;
                                      document.querySelector(
                                        "html"
                                      ).style.overflowY = "scroll";
                                    }, 300);
                                  }}
                                >
                                  {g}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}

                  <img
                    className="nav-bar__tools__hamburger__content__links__options__img"
                    src={d.img}
                    alt={d.img}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Hamburger;
