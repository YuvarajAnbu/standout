import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleKeyboardActivation } from "@/shared/utils/accessibility";

function SortBy({
  filter,
  setFilter,
  hideFilter,
  setHideFilter,
  setLastClicked,
}) {
  const toggleSection = () =>
    setHideFilter((prev) => ({ ...prev, sort: !prev.sort }));
  const toggleSort = (sort) => {
    setFilter((prev) => ({ ...prev, sort: prev.sort === sort ? "" : sort }));
    setLastClicked("sort");
  };

  return (
    <div className="shop__filters-container__filter-container">
      <div
        className="shop__filters-container__filter-container__filter"
        role="button"
        tabIndex={0}
        aria-expanded={!hideFilter.sort}
        onClick={toggleSection}
        onKeyDown={(event) => handleKeyboardActivation(event, toggleSection)}
      >
        <p className="shop__filters-container__filter-container__filter__name">
          sort by
        </p>
        <span
          className="shop__filters-container__filter-container__filter__icon"
          aria-hidden="true"
        />
      </div>
      <div
        className={
          hideFilter.sort
            ? "shop__filters-container__filter-container__options shop__filters-container__filter-container__options--hidden"
            : "shop__filters-container__filter-container__options"
        }
      >
        <div className="shop__filters-container__filter-container__options--checkbox">
          <div className="shop__filters-container__filter-container__options--checkbox__checkbox">
            <div
              className="shop__filters-container__filter-container__options--checkbox__checkbox__icons"
              role="checkbox"
              tabIndex={0}
              aria-checked={filter.sort === "asc"}
              onClick={() => toggleSort("asc")}
              onKeyDown={(event) =>
                handleKeyboardActivation(event, () => toggleSort("asc"))
              }
            >
              {filter.sort === "asc" ? (
                <FontAwesomeIcon
                  className="shop__filters-container__filter-container__options--checkbox__checkbox__icons__icon"
                  icon="check-square"
                />
              ) : (
                <FontAwesomeIcon
                  className="shop__filters-container__filter-container__options--checkbox__checkbox__icons__icon"
                  icon={["far", "square"]}
                />
              )}
            </div>

            <p>Low to high</p>
          </div>
          <div className="shop__filters-container__filter-container__options--checkbox__checkbox">
            <div
              className="shop__filters-container__filter-container__options--checkbox__checkbox__icons"
              role="checkbox"
              tabIndex={0}
              aria-checked={filter.sort === "desc"}
              onClick={() => toggleSort("desc")}
              onKeyDown={(event) =>
                handleKeyboardActivation(event, () => toggleSort("desc"))
              }
            >
              {filter.sort === "desc" ? (
                <FontAwesomeIcon
                  className="shop__filters-container__filter-container__options--checkbox__checkbox__icons__icon"
                  icon="check-square"
                />
              ) : (
                <FontAwesomeIcon
                  className="shop__filters-container__filter-container__options--checkbox__checkbox__icons__icon"
                  icon={["far", "square"]}
                />
              )}
            </div>
            <p>High to low</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SortBy;
