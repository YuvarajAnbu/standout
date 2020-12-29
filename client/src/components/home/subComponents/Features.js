import React from "react";

function Features() {
  return (
    <div className="home__features">
      <div className="home__features__left">
        <div className="home__features__1">
          <img src="./images/clothes.jpg" alt="clothes" />
        </div>
        <div className="home__features__2">
          <img src="./images/sewing.jpg" alt="sewing" />
        </div>
      </div>

      <div className="home__features__left">
        <div className="home__features__3">
          <img src="./images/packageDelivery.jpg" alt="package delivery" />
        </div>
      </div>
    </div>
  );
}

export default Features;
