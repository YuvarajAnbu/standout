import React from "react";
import { Link } from "react-router-dom";

function MenSection() {
  const links = ["shirts", "jackets", "suitings", "t-shirts"];

  return (
    <div className=" home__section home__section--men">
      <div className="home__section__img-container home__section--men__img-container">
        <img
          className="home__section__model-image"
          src="/images/manModel.png"
          alt="male model"
        />
      </div>

      <div className="home__section__content  home__section--men__content">
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
              <Link to={`/items/men/${el}`}>
                <img src={`/images/links/men/${el}.jpg`} alt={el} />
              </Link>
              <Link
                to={`/items/men/${el}`}
                className="home__section__content__links-container__link__a"
              >
                {el}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenSection;
