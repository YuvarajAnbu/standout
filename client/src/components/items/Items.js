import React from "react";
import { useParams } from "react-router-dom";
import Shop from "../shop/Shop";

function Items() {
  const { catagory, type } = useParams();

  const toTitleCase = (str) =>
    `${str}`.replace(
      /(^\w|\s\w)(\S*)/g,
      (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
    );

  return (
    <Shop
      {...{
        title: toTitleCase(`${catagory}'s ${type}`),
        link: `${catagory}/${type}`,
      }}
    />
  );
}

export default Items;
