const cloudinary = require("cloudinary").v2;
const HttpError = require("#shared/errors/HttpError");

const PRODUCT_FOLDER = "standout/products";

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new HttpError(503, "Product image storage is not configured");
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

async function uploadProductImage(dataUri) {
  configureCloudinary();
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: PRODUCT_FOLDER,
    resource_type: "image",
  });
  return result.public_id;
}

function managedPublicId(reference) {
  return typeof reference === "string" && reference.startsWith(`${PRODUCT_FOLDER}/`)
    ? reference.replace(/\.[a-z0-9]+$/i, "")
    : null;
}

async function destroyProductImage(reference) {
  const publicId = managedPublicId(reference);
  if (!publicId) return;
  configureCloudinary();
  await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: "image",
  });
}

async function destroyProductImages(references) {
  await Promise.allSettled([...new Set(references)].map(destroyProductImage));
}

module.exports = {
  destroyProductImage,
  destroyProductImages,
  managedPublicId,
  uploadProductImage,
};
