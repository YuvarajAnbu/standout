import React from "react";
import Shop from "../shop/Shop";

function Trending() {
  return (
    <Shop
      {...{
        title: `Trending This Month`,
        link: `trending`,
      }}
    />
  );
}

export default Trending;
