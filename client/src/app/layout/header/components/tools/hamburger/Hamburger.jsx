import React, { useEffect, useState, useCallback } from "react";
import products from "@/features/catalog/data/products";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lockPageScroll, unlockPageScroll } from "@/shared/utils/pageScroll";

function Hamburger({ setBlackBox, clicked, setClicked }) {
  const { navLinksOptions } = products;

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
      unlockPageScroll();
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
    <div className="nav-bar__tools__hamburger">
      <div
        className={
          ifHide
            ? "nav-bar__tools__hamburger__icon-container"
            : "nav-bar__tools__hamburger__icon-container nav-bar__tools__hamburger__icon-container--active"
        }
        aria-expanded={!ifHide}
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
            lockPageScroll();
            document.querySelector("html").scrollTop = 0;
          } else {
            setIfHide(true);
            setBlackBox(false);
            setTimeout(() => {
              unlockPageScroll();
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
            <FontAwesomeIcon icon="chevron-right" rotation={180} aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => {
              setIfHide(true);
              setBlackBox(false);
              setTimeout(() => {
                unlockPageScroll();
              }, 300);
            }}
          >
            <FontAwesomeIcon icon="times" aria-hidden="true" />
          </button>
        </div>
        <ul
          className={
            goRight
              ? "nav-bar__tools__hamburger__content__links nav-bar__tools__hamburger__content__links--go-right"
              : "nav-bar__tools__hamburger__content__links"
          }
        >
          {navLinksOptions.map((d) => {
            return (
              <li key={d.for}>
                <button
                  type="button"
                  className="nav-bar__tools__hamburger__content__links__link"
                  aria-expanded={goRight && d.for === catagory}
                  aria-controls={`mobile-navigation-${d.for}`}
                  onClick={() => {
                    setGoRight(true);
                    setCatagory(d.for);
                  }}
                >
                  <p>{d.for}</p>
                  <FontAwesomeIcon icon="chevron-right" aria-hidden="true" />
                </button>
                <div
                  className={
                    d.for === catagory
                      ? "nav-bar__tools__hamburger__content__links__options nav-bar__tools__hamburger__content__links__options--visible"
                      : "nav-bar__tools__hamburger__content__links__options"
                  }
                  id={`mobile-navigation-${d.for}`}
                >
                  {d.catagory.map((f) => {
                    const linksVisible = showLinks.includes(f.title);
                    const categoryId = `mobile-navigation-${d.for}-${f.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`;
                    return (
                      <div
                        className="nav-bar__tools__hamburger__content__links__options__options-catagory"
                        key={f.title}
                      >
                        <button
                          type="button"
                          className="nav-bar__tools__hamburger__content__links__options__options-catagory__catagory"
                          aria-expanded={linksVisible}
                          aria-controls={categoryId}
                          onClick={() => {
                            if (linksVisible) {
                              setShowLinks((prev) =>
                                prev.filter((el) => el !== f.title)
                              );
                            } else {
                              setShowLinks((prev) => [...prev, f.title]);
                            }
                          }}
                        >
                          <p>{f.title}</p>
                          {linksVisible ? (
                            <FontAwesomeIcon icon="minus" aria-hidden="true" />
                          ) : (
                            <FontAwesomeIcon icon="plus" aria-hidden="true" />
                          )}
                        </button>

                        <ul
                          id={categoryId}
                          className={
                            linksVisible
                              ? "nav-bar__tools__hamburger__content__links__options__options-catagory__links nav-bar__tools__hamburger__content__links__options__options-catagory__links--visible"
                              : "nav-bar__tools__hamburger__content__links__options__options-catagory__links"
                          }
                        >
                          {f.items.map((g) => {
                            return (
                              <li key={g}>
                                <Link
                                  to={`/items/${d.for.toLowerCase()}/${g.toLowerCase()}`}
                                  onClick={() => {
                                    setIfHide(true);
                                    setBlackBox(false);
                                    setTimeout(() => {
                                      unlockPageScroll();
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
