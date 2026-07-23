import React from "react";
import { handleKeyboardActivation } from "../../../../utils/accessibility";

function Size({
  filter,
  setFilter,
  hideFilter,
  setHideFilter,
  itemStock,
  setLastClicked,
  setUpdate,
}) {
  const toggleSection = () =>
    setHideFilter((prev) => ({ ...prev, size: !prev.size }));
  const toggleSize = (size) => {
    setFilter((prev) => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter((selected) => selected !== size)
        : [...prev.size, size],
    }));
    setLastClicked("size");
    setUpdate((prev) => prev + 1);
  };

  return (
    <div className="shop__filters-container__filter-container">
      <div
        className="shop__filters-container__filter-container__filter"
        role="button"
        tabIndex={0}
        aria-expanded={!hideFilter.size}
        onClick={toggleSection}
        onKeyDown={(event) => handleKeyboardActivation(event, toggleSection)}
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
            role="checkbox"
            tabIndex={0}
            aria-checked={filter.size.includes(size)}
            onClick={() => toggleSize(size)}
            onKeyDown={(event) =>
              handleKeyboardActivation(event, () => toggleSize(size))
            }
          >
            <p>{size}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Size;
