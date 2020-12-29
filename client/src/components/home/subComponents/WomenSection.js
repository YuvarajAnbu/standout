import React from "react";
import { Link } from "react-router-dom";

function WomenSection() {
  const links = ["dresses", "rompers", "tops", "shoes"];

  return (
    <div className=" home__section home__section--women">
      <div className="home__section__content home__section--women__content">
        <h2>Lorem ipsum dolor sit, amet</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero enim
          harum ducimus quaerat nostrum eaque adipisci aperiam aut maiores eum
          praesentium voluptatum, iure quia laborum mollitia soluta quasi
          ratione illo. Ea nisi,
        </p>
        <div className="home__section__content__links-container">
          {links.map((el, index) => (
            <div
              className="home__section__content__links-container__link"
              key={index}
            >
              <Link to={`/items/women/${el}`}>
                <img src={`/images/links/women/${el}.jpg`} alt={el} />
              </Link>
              <Link
                to={`/items/women/${el}`}
                className="home__section__content__links-container__link__a"
              >
                {el}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="home__section__img-container home__section--women__img-container">
        <img
          className="home__section__model-image"
          src="./images/womanModel.png"
          alt="woman model"
        />
      </div>
    </div>
  );
}

export default WomenSection;
