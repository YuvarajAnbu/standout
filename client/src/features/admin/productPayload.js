export function buildProductPayload(
  data,
  fields,
  images,
  { includeStockIds = false } = {},
) {
  const stock = data.stock.map((entry, index) => {
    const field = fields[index];
    const imageKey = field?._id || field?.id;
    const stockImages = images[imageKey];
    if (!stockImages?.length) {
      throw new Error("Each stock item needs an image");
    }
    return {
      ...entry,
      ...(includeStockIds && field?._id ? { _id: field._id } : {}),
      images: stockImages,
    };
  });

  return {
    name: data.name.trim(),
    price: Math.round(Number(data.price) * 100),
    catagory: data.catagory,
    type: data.type,
    stock,
  };
}
