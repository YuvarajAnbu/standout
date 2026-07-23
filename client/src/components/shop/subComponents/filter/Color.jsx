import React from "react";
import { getColorName } from "../../../../utils/colors";
import { handleKeyboardActivation } from "../../../../utils/accessibility";

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
  const toggleSection = () =>
    setHideFilter((prev) => ({ ...prev, color: !prev.color }));
  const toggleColor = (color) => {
    setFilter((prev) => ({
      ...prev,
      color: prev.color.includes(color.slice(1))
        ? prev.color.filter((selected) => selected !== color.slice(1))
        : [...prev.color, color.slice(1)],
    }));
    setLastClicked("color");
    setUpdate((prev) => prev + 1);
  };

  return (
    <div className="shop__filters-container__filter-container">
      <div
        className="shop__filters-container__filter-container__filter"
        role="button"
        tabIndex={0}
        aria-expanded={!hideFilter.color}
        onClick={toggleSection}
        onKeyDown={(event) => handleKeyboardActivation(event, toggleSection)}
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
            role="checkbox"
            tabIndex={0}
            aria-checked={filter.color.includes(color.slice(1))}
            onClick={() => toggleColor(color)}
            onKeyDown={(event) =>
              handleKeyboardActivation(event, () => toggleColor(color))
            }
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
            <p>{getColorName(colors, color)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Color;
