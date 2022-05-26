import React from 'react';
import { Link } from 'react-router-dom';

function MenSection() {
  const links = ['shirts', 'jackets', 'suitings', 't-shirts'];

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
        <h2>Shop Suits, Jeans, Shirts & More</h2>
        <p>
          Find new men's suits, dress pants, dress shirts, chinos, jeans and
          more all in one place at StandOut. Whether you need a new work
          wardrobe for your job, some casual pieces like shorts, joggers and
          t-shirts for the weekend, or everyday essentials like undershirts,
          boxers and socks, we've got you covered. Shop clothing for men online
          or in-store today.
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
