import React from 'react';
import { Link } from 'react-router-dom';

function WomenSection() {
  const links = ['dresses', 'rompers', 'tops', 'shoes'];

  return (
    <div className=" home__section home__section--women">
      <div className="home__section__content home__section--women__content">
        <h2>Shop Dresses, Jeans, Tops & More</h2>
        <p>
          Find women's clothing at StandOut. From dresses and jumpsuits, to
          jeans and dress pants, update your wardrobe all in one place. If you
          need to upgrade your style game at work, try a new suit, dressy top,
          work dress or dark wash jeans. Shop clothing for women online or
          in-store today.
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
