import React, { useState } from "react";
import "./Header.css";
import NavLinks from "./subComponents/navLinks/NavLinks";
import Tools from "./subComponents/tools/Tools";
import { Link } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

function Header() {
  const [blackBox, setBlackBox] = useState(false);

  const isAdmin = useAppStore((state) => state.user.type === "admin");

  return (
    <header>
      <div className="nav-bar">
        <div className="nav-bar__logo">
          <h1>
            <Link to="/">StandOut</Link>
          </h1>
        </div>
        <NavLinks setBlackBox={setBlackBox} />
        <Tools setBlackBox={setBlackBox} blackBox={blackBox} />
      </div>
      <div
        className={blackBox ? " black-box black-box--visible" : "black-box"}
      ></div>

      <div className="advertisement">
        <p>
          <span>Hurry up!</span> 40% off every product this month. Don't
          miss the deal
        </p>
      </div>

      {isAdmin && (
        <div className="owner-features">
          <p>
            You are viewing this website from the owner's perspective. You can
            upload and edit products and update orders.{" "}
            <span>
              (Note: demo changes are not saved to the database.)
            </span>
          </p>
          <Link to="/upload">Upload Products</Link>
          <Link to="/update-products">Update Products</Link>
          <Link to="/update-order">Update Orders</Link>
        </div>
      )}
    </header>
  );
}

export default Header;
