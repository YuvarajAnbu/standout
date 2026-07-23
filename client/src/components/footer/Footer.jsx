import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer">
      <div className="footer__icons">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        >
          <FontAwesomeIcon
            className="footer__icons__icon"
            icon={["fab", "youtube"]}
          />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.instagram.com/officialrickastley/?hl=en"
        >
          <FontAwesomeIcon
            className="footer__icons__icon"
            icon={["fab", "instagram"]}
          />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/rickastley"
        >
          <FontAwesomeIcon
            className="footer__icons__icon"
            icon={["fab", "twitter"]}
          />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.facebook.com/RickAstley/"
        >
          <FontAwesomeIcon
            className="footer__icons__icon"
            icon={["fab", "facebook-square"]}
          />
        </a>
      </div>
      <div className="footer__links">
        <Link to="/terms-and-conditions">terms & conditions</Link>
        <Link to="/accessibility">accessibility</Link>
        <Link to="/private-policy">private policy</Link>
      </div>

      <p className="footer__copy-right">
        @Stand out {new Date().getFullYear()}. All rights reserved.
      </p>
    </div>
  );
}

export default Footer;
