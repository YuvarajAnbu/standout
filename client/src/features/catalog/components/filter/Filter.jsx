import React, { useEffect } from "react";
import SortBy from "@/features/catalog/components/filter/SortBy";
import Color from "@/features/catalog/components/filter/Color";
import Size from "@/features/catalog/components/filter/Size";
import colors from "@/features/catalog/data/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lockPageScroll, unlockPageScroll } from "@/shared/utils/pageScroll";

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
  hide,
}) {

  useEffect(() => {
    if (showFilters) {
      lockPageScroll();
    } else {
      const a = setTimeout(() => {
        unlockPageScroll();
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
          <FontAwesomeIcon icon="times" aria-hidden="true" />
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
          <FontAwesomeIcon icon="times" aria-hidden="true" />
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
