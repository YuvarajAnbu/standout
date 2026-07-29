export function createStockIndex(items) {
  return Object.fromEntries(items.map((_, index) => [index, 0]));
}

export function reconcileCatalogFilter(filter, available = {}) {
  const availableColors = available.colors
    ? new Set(available.colors.map((color) => color.replace(/^#/, "")))
    : null;
  const availableSizes = available.sizes
    ? new Set(available.sizes)
    : null;
  const color = availableColors
    ? filter.color.filter((value) => availableColors.has(value))
    : filter.color;
  const size = availableSizes
    ? filter.size.filter((value) => availableSizes.has(value))
    : filter.size;

  if (color.length === filter.color.length && size.length === filter.size.length) {
    return filter;
  }
  return { ...filter, color, size };
}
