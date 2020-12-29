import React, { useContext, useState, useEffect } from "react";
import { ProductsContext } from "../../../../App";
import { Link } from "react-router-dom";

function NavLinks({ setBlackBox }) {
  const { navLinksOptions } = useContext(ProductsContext);

  const [catagory, setCatagory] = useState("");

  const [ifHide, setIfHide] = useState(true);

  useEffect(() => {
    document
      .querySelector("header .black-box")
      .addEventListener("click", () => {
        setIfHide(true);
        setBlackBox(false);
      });
  });

  return (
    <ul className="nav-bar__links-container">
      {navLinksOptions.map((d, i) => {
        return (
          <li key={i} className="nav-bar__links-container__link-container">
            <div
              className="nav-bar__links-container__link-container__title"
              onMouseEnter={() => {
                setCatagory(d.for);
                setBlackBox(true);
                setIfHide(false);
              }}
              onMouseLeave={(e) => {
                setIfHide(true);
                setBlackBox(false);
              }}
              onTouchEnd={() => {
                if (catagory === d.for) {
                  setCatagory("");
                  setIfHide(true);
                  setBlackBox(false);
                } else {
                  setCatagory(d.for);
                  setBlackBox(true);
                  setIfHide(false);
                }
              }}
            >
              <p>{d.for}</p>
              <div
                className={
                  catagory === d.for && !ifHide
                    ? "nav-bar__links-container__link-container__title__under-line nav-bar__links-container__link-container__title__under-line--visible"
                    : "nav-bar__links-container__link-container__title__under-line"
                }
              ></div>
            </div>
            <div
              className={
                catagory === d.for && !ifHide
                  ? "nav-bar__links-container__link-container__options-container nav-bar__links-container__link-container__options-container--visible"
                  : "nav-bar__links-container__link-container__options-container"
              }
              id={d.for}
              onMouseEnter={(e) => {
                setIfHide(false);
                setBlackBox(true);
              }}
              onMouseLeave={(e) => {
                setIfHide(true);
                setBlackBox(false);
              }}
            >
              <div
                className={
                  catagory === d.for && !ifHide
                    ? "nav-bar__links-container__link-container__options-container__option-container nav-bar__links-container__link-container__options-container__option-container--visible"
                    : "nav-bar__links-container__link-container__options-container__option-container"
                }
              >
                {d.catagory.map((f, j) => {
                  return (
                    <div
                      className="nav-bar__links-container__link-container__options-container__option-container__option"
                      key={j}
                    >
                      <p className="nav-bar__links-container__link-container__options-container__option-container__option__title">
                        {f.title}
                      </p>
                      <ul>
                        {f.items.map((g, k) => {
                          return (
                            <li key={k}>
                              <Link
                                onClick={() => {
                                  setIfHide(true);
                                  setBlackBox(false);
                                  setCatagory("");
                                }}
                                to={`/items/${d.for.toLowerCase()}/${g.toLowerCase()}`}
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

                <img src={d.img} alt="model" />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default NavLinks;
