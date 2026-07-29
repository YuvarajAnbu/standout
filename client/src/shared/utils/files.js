const DEFAULT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function readImagesAsDataUrls(
  files,
  { maxFiles = 8, maxBytes = 1024 * 1024, types = DEFAULT_IMAGE_TYPES } = {}
) {
  const validFiles = Array.from(files)
    .filter((file) => types.includes(file.type) && file.size <= maxBytes)
    .slice(0, maxFiles);

  return Promise.all(
    validFiles.map(
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
