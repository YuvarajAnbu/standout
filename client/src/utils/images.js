export const imgPrefix = (width) =>
  `https://res.cloudinary.com/xander-ecommerce/image/upload/c_fit,f_auto,q_auto,${
    width ? `w_${width}` : ""
  }/`;
