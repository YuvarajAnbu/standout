import React, { useEffect, useContext } from "react";
import SortBy from "./SortBy";
import Color from "./Color";
import Size from "./Size";
import { ColorsContext } from "../../../../App";

function Filter({
  filter,
  setFilter,
  itemStock,
  hideFilter,
  setHideFilter,
  showFilters,
  setShowFilters,
  setBlackBox,
  noResults,
  setLastClicked,
  setUpdate,
  hide,
}) {
  const colors = useContext(ColorsContext);

  useEffect(() => {
    if (showFilters) {
      document.querySelector("body").style.paddingRight =
        window.innerWidth - document.body.clientWidth + "px";
      document.querySelector("html").style.overflowY = "hidden";
    } else {
      const a = setTimeout(() => {
        document.querySelector("body").style.paddingRight = 0;
        document.querySelector("html").style.overflowY = "scroll";
      }, 300);

      return () => clearTimeout(a);
    }
  }, [showFilters]);

  return itemStock.colors.length <= 0 ? (
    <div
      style={noResults || hide ? { opacity: "0", pointerEvents: "none" } : {}}
      className={
        showFilters
          ? "shop__loading__container shop__loading__container--filter shop__loading__container--filter--active"
          : "shop__loading__container shop__loading__container--filter"
      }
    >
      <div className="shop__filters-container__button-container">
        <button
          type="button"
          onClick={() => {
            setShowFilters(false);
            setBlackBox(false);
          }}
        >
          <img
            src="https://img.icons8.com/fluent-systems-filled/24/000000/multiply.png"
            alt="icon"
          />
        </button>
      </div>
      <div className="shop__loading__container__title"></div>
      <div className="shop__loading__container__content"></div>
      <div className="shop__loading__container__content"></div>
      <div className="shop__loading__container__content"></div>
    </div>
  ) : (
    <div
      style={hide ? { opacity: "0", pointerEvents: "none" } : {}}
      className={
        showFilters
          ? "shop__filters-container shop__filters-container--active"
          : "shop__filters-container"
      }
    >
      <div className="shop__filters-container__button-container">
        <button
          type="button"
          onClick={() => {
            setShowFilters(false);
            setBlackBox(false);
          }}
        >
          <img
            src="https://img.icons8.com/fluent-systems-filled/24/000000/multiply.png"
            alt="icon"
          />
        </button>
      </div>
      <h4>filter by :</h4>
      <SortBy
        {...{
          filter,
          setFilter,
          hideFilter,
          setHideFilter,
          setLastClicked,
          setUpdate,
        }}
      />
      <Color
        {...{
          filter,
          setFilter,
          hideFilter,
          setHideFilter,
          itemStock,
          setLastClicked,
          setUpdate,
          colors,
        }}
      />
      <Size
        {...{
          filter,
          setFilter,
          hideFilter,
          setHideFilter,
          itemStock,
          setLastClicked,
          setUpdate,
        }}
      />
      <button
        className="shop__filters-container__apply"
        onClick={() => {
          setShowFilters(false);
          setBlackBox(false);
        }}
      >
        apply
      </button>
    </div>
  );
}

export default Filter;
