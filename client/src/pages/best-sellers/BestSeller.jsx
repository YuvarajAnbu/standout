import React from "react";
import Shop from "@/features/catalog/Shop";

function BestSeller() {
  return (
    <Shop
      {...{
        title: `Best Sellers`,
        link: `best-seller`,
      }}
    />
  );
}

export default BestSeller;
