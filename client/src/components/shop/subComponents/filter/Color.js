import React from "react";

function Color({
  filter,
  setFilter,
  hideFilter,
  setHideFilter,
  itemStock,
  setLastClicked,
  setUpdate,
  colors,
}) {
  return (
    <div className="shop__filters-container__filter-container">
      <div
        className="shop__filters-container__filter-container__filter"
        onClick={() => {
          setHideFilter((prev) => {
            return {
              ...prev,
              color: !prev.color,
            };
          });
        }}
      >
        <p className="shop__filters-container__filter-container__filter__name">
          colour
        </p>
        {hideFilter.color ? (
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
          hideFilter.color
            ? "shop__filters-container__filter-container__options--color shop__filters-container__filter-container__options--hidden"
            : "shop__filters-container__filter-container__options--color"
        }
      >
        {itemStock.colors.map((color, index) => (
          <div
            key={index}
            className={
              filter.color.includes(color.slice(1))
                ? "shop__filters-container__filter-container__options--color__color-container shop__filters-container__filter-container__options--color__color-container--active"
                : "shop__filters-container__filter-container__options--color__color-container"
            }
            onClick={() => {
              setFilter((prev) => {
                return {
                  ...prev,
                  color: prev.color.includes(color.slice(1))
                    ? prev.color.filter((el) => el !== color.slice(1))
                    : [...prev.color, color.slice(1)],
                };
              });
              setLastClicked("color");
              setUpdate((prev) => prev + 1);
            }}
          >
            <div
              className={
                filter.color.includes(color.slice(1))
                  ? "shop__filters-container__filter-container__options--color__color-container__color-box shop__filters-container__filter-container__options--color__color-container__color-box--active"
                  : "shop__filters-container__filter-container__options--color__color-container__color-box"
              }
            >
              <div
                className="shop__filters-container__filter-container__options--color__color-container__color-box__color"
                style={{ backgroundColor: color }}
              ></div>
            </div>
            <p>{colors.filter((k) => k[1] === color)[0][0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Color;
