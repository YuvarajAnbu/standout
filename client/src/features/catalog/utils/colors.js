export const getColorName = (colors, value) =>
  colors.find((color) => color[1] === value)?.[0] || value || "Unknown";
