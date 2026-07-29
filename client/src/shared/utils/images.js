const cloudName =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "xander-ecommerce";

export const imgPrefix = (width) =>
  `https://res.cloudinary.com/${cloudName}/image/upload/c_fit,f_auto,q_auto,${
    width ? `w_${width}` : ""
  }/`;
