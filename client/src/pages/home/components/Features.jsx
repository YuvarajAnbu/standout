import React from "react";

function Features() {
  return (
    <div className="home__features">
      <div className="home__features__left">
        <div className="home__features__1">
          <img src="/images/clothes.jpg" alt="clothes" width="695" height="340" loading="lazy" decoding="async" />
        </div>
        <div className="home__features__2">
          <img src="/images/sewing.jpg" alt="sewing" width="695" height="340" loading="lazy" decoding="async" />
        </div>
      </div>

      <div className="home__features__left">
        <div className="home__features__3">
          <img src="/images/packageDelivery.jpg" alt="package delivery" width="523" height="685" loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  );
}

export default Features;
