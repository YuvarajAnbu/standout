const DEFAULT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const DEFAULT_MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const DEFAULT_MAX_TOTAL_BYTES = 16 * 1024 * 1024;

export async function readImagesAsDataUrls(
  files,
  {
    maxFiles = 8,
    maxBytes = DEFAULT_MAX_IMAGE_BYTES,
    maxTotalBytes = DEFAULT_MAX_TOTAL_BYTES,
    types = DEFAULT_IMAGE_TYPES,
  } = {},
) {
  const selectedFiles = Array.from(files);
  if (selectedFiles.length > maxFiles) {
    throw new Error(`You can add up to ${maxFiles} more images`);
  }
  if (selectedFiles.some((file) => !types.includes(file.type))) {
    throw new Error("Images must be JPEG, PNG, WebP, or AVIF files");
  }
  if (selectedFiles.some((file) => file.size > maxBytes)) {
    throw new Error("Each image must be 5 MB or smaller");
  }
  if (
    selectedFiles.reduce((total, file) => total + file.size, 0) >
    maxTotalBytes
  ) {
    throw new Error("The selected images must total 16 MB or less");
  }

  return Promise.all(
    selectedFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.addEventListener("load", () => resolve(reader.result), {
            once: true,
          });
          reader.addEventListener("error", reject, { once: true });
          reader.readAsDataURL(file);
        })
    )
  );
}
