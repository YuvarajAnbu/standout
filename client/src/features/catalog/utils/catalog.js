const asArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const matchesStock = (product, filter) => {
  const colors = filter.color || [];
  const sizes = filter.size || [];

  if (colors.length === 0 && sizes.length === 0) return true;

  return product.stock?.some((stock) => {
    const colorMatches =
      colors.length === 0 || colors.includes(`${stock.color}`.replace("#", ""));
    const sizeMatches =
      sizes.length === 0 ||
      stock.sizeRemaining?.some(({ size }) => sizes.includes(size));
    return colorMatches && sizeMatches;
  });
};

export function filterLocalProducts(
  products,
  { categories, types, filter = {}, includeBoth = true },
) {
  const categoryList = asArray(categories);
  const typeList = asArray(types);

  return products.filter((product) => {
    const categoryMatches =
      categoryList.length === 0 ||
      categoryList.includes(product.catagory) ||
      (includeBoth && product.catagory === "both");
    const typeMatches = typeList.length === 0 || typeList.includes(product.type);
    return categoryMatches && typeMatches && matchesStock(product, filter);
  });
}

export function sortCatalogProducts(products, sort) {
  const next = [...products];
  if (sort === "asc") return next.sort((a, b) => a.price - b.price);
  if (sort === "desc") return next.sort((a, b) => b.price - a.price);
  return next.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
}

export function createStockIndex(items) {
  return Object.fromEntries(items.map((_, index) => [index, 0]));
}

export function collectStockOptions(products) {
  const colors = new Set();
  const sizes = new Set();

  products.forEach((product) => {
    product.stock?.forEach((stock) => {
      if (stock.color) colors.add(stock.color);
      stock.sizeRemaining?.forEach(({ size }) => size && sizes.add(size));
    });
  });

  return { colors: [...colors], sizes: [...sizes] };
}
