import React from "react";
import { useParams } from "react-router-dom";
import Shop from "../shop/Shop";

function Items() {
  const { catagory, type } = useParams();
  return (
    <Shop
      {...{
        title: `${catagory}'s ${type}`,
        link: `${catagory}/${type}`,
      }}
    />
  );
}

export default Items;
