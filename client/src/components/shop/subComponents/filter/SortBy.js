import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SortBy({
  filter,
  setFilter,
  hideFilter,
  setHideFilter,
  setLastClicked,
  setUpdate,
}) {
  return (
    <div className="shop__filters-container__filter-container">
      <div
        className="shop__filters-container__filter-container__filter"
        onClick={() => {
          setHideFilter((prev) => {
            return {
              ...prev,
              sort: !prev.sort,
            };
          });
        }}
      >
        <p className="shop__filters-container__filter-container__filter__name">
          sort by
        </p>
        {hideFilter.sort ? (
          <p className="shop__filters-container__filter-container__filter__icon">
            +
          </p>
        ) : (
          <p className="shop__filters-container__filter-container__filter__icon">
            -
          </p>
        )}
      </div>
      <div
        className={
          hideFilter.sort
            ? "shop__filters-container__filter-container__options--checkbox shop__filters-container__filter-container__options--hidden"
            : "shop__filters-container__filter-container__options--checkbox"
        }
      >
        <div className="shop__filters-container__filter-container__options--checkbox__checkbox">
          <div
            className="shop__filters-container__filter-container__options--checkbox__checkbox__icons"
            onClick={() => {
              setFilter((prev) => {
                return {
                  ...prev,
                  sort: prev.sort === "asc" ? "" : "asc",
                };
              });
              setLastClicked("sort");
              setUpdate((prev) => prev + 1);
            }}
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
            onClick={() => {
              setFilter((prev) => {
                return {
                  ...prev,
                  sort: prev.sort === "desc" ? "" : "desc",
                };
              });
              setLastClicked("sort");
              setUpdate((prev) => prev + 1);
            }}
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
  );
}

export default SortBy;
