import { useState } from "react";
import "@/app/layout/header/Header.scss";
import NavLinks from "@/app/layout/header/components/navLinks/NavLinks";
import Tools from "@/app/layout/header/components/tools/Tools";
import { Link } from "react-router-dom";
import { useAppStore } from "@/app/store/useAppStore";

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
          <span>Hurry up!</span> 40% off every product this month. Don't miss
          the deal
        </p>
      </div>

      {isAdmin && (
        <div className="owner-features">
          <p>
            You are viewing this website from the owner's perspective. You can
            upload and edit products and update orders.{" "}
            <span>(Note: demo changes are not saved to the database.)</span>
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
