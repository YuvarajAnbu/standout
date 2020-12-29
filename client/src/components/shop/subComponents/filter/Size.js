import React from "react";

function Size({
  filter,
  setFilter,
  hideFilter,
  setHideFilter,
  itemStock,
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
              size: !prev.size,
            };
          });
        }}
      >
        <p className="shop__filters-container__filter-container__filter__name">
          size
        </p>
        {hideFilter.size ? (
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
          hideFilter.size
            ? "shop__filters-container__filter-container__options--size shop__filters-container__filter-container__options--hidden"
            : "shop__filters-container__filter-container__options--size"
        }
      >
        {itemStock.sizes.map((size, index) => (
          <div
            key={index}
            className={
              filter.size.includes(size)
                ? "shop__filters-container__filter-container__options--size__size shop__filters-container__filter-container__options--size__size--active"
                : "shop__filters-container__filter-container__options--size__size"
            }
            onClick={() => {
              setFilter((prev) => {
                return {
                  ...prev,
                  size: prev.size.includes(size)
                    ? prev.size.filter((el) => el !== size)
                    : [...prev.size, size],
                };
              });
              setLastClicked("size");
              setUpdate((prev) => prev + 1);
            }}
          >
            <p>{size}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Size;
