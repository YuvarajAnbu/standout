import React, { useState, useEffect, useContext, useCallback } from "react";
import { CartContext, ColorsContext } from "../../../../../App";
import { Link } from "react-router-dom";
import CartItem from "./CartItem";

function CartTool({ setBlackBox, windowWidth, clicked, setClicked }) {
  const [ifHide, setIfHide] = useState(true);

  const { cart, setCart } = useContext(CartContext);
  const colors = useContext(ColorsContext);

  useEffect(() => {
    if (clicked !== "cart") {
      setIfHide(true);
    }
  }, [clicked]);

  const hide = useCallback(() => {
    setIfHide(true);
    setBlackBox(false);
    setTimeout(() => {
      document.querySelector("body").style.paddingRight = 0;
      document.querySelector("html").style.overflowY = "scroll";
    }, 300);
  }, [setBlackBox]);

  useEffect(() => {
    const black = document.querySelector("header .black-box");
    if (black) black.addEventListener("click", hide);

    return () => {
      if (black) black.removeEventListener("click", hide);
    };
  }, [hide]);

  const noOfItems = () => {
    let a = 0;
    cart.forEach((el) => {
      a = a + el.quantity;
    });
    return a;
  };

  const subTotal = () => {
    let a = 0;

    cart.forEach((el) => {
      a = a + Number(el.price * el.quantity);
    });
    return a;
  };

  return (
    <div className="nav-bar__tools__cart">
      <div
        className="nav-bar__tools__cart__icon-container"
        onMouseEnter={() => {
          setIfHide(false);
          setBlackBox(true);
        }}
        onMouseLeave={() => {
          setIfHide(true);
          setBlackBox(false);
        }}
        onTouchEnd={() => {
          setClicked("cart");
          if (ifHide) {
            setBlackBox(true);
            setIfHide(false);
            document.querySelector("body").style.paddingRight =
              window.innerWidth - document.body.clientWidth + "px";
            document.querySelector("html").style.overflowY = "hidden";
            document.querySelector("html").scrollTop = 0;
          } else {
            setBlackBox(false);
            setIfHide(true);
            setTimeout(() => {
              document.querySelector("body").style.paddingRight = 0;
              document.querySelector("html").style.overflowY = "scroll";
            }, 300);
          }
        }}
      >
        <div className="nav-bar__tools__cart__icon-container--cart">
          <img
            className="nav-bar__tools__cart__icon-container__icon"
            alt="icon"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAACXklEQVRoge2Zy27UMBSGvw5SFtAV3bQwsGb6CrDrC3DRqPsKWPVREHuQYFneBlhOK2ilDkiwgE1vaiWmLHwOE4LtJPakcYb5JCvWOD79/56c2ElggZMM2ATeASPgWNoI2JGxrDV1FRkC+8BlSfsMPGlJo5drwEumQt8D28AAuCFtIL99yJ33QuYmg5o4A7aAJc+5PeCpnKtmkmCIEXQK3K8x7wFTM48b0FWLjGlNbAXMfyZzP9HyDWCTaU30Aub3gI8SYxgjJOSP53kkxzfAJGD+BHgr/YeRWqLYxfw370XEWJcYo5koCuRIRCxHxFiWGEczURSIrgetx4mtkWTwLVwAJ8D1qxBSgVPMDsGKLyMrpGMCjJabrkGfkTty3MVkztYU13jVVhZnr6ApyMih55yrQjVEGfniGN9w9OtSJc5YjnddQXxGdJIrI69z/VeeOGVUiaNGgjLSl6MrI5mjX5cqcaKMlNXIc4zJsfRDqRKntEZ8HBC/j5oVA4yW/boTe8A58fuoWaH7sQtq7kZuycQfDYgK5SdG05pt0OVOr8WxY7wNvAXvMlJ2620D1WJdS+Y+IwsjDbKoEehQRmxkwC9pKb019+qyZaQvv3/DrKSpcAF8x2i7XRy0GUnxslKcl5fPSEqFrjh3wf9FRjpvRO/TKRv5Zy2Zmxqxofv+1cbkhLNGxeckfRI7J833ws4n16LY/LuskA83TTMBvkq/nx9wGUmx0BXrnctlJMVCV6wF3+WM/HULLhpJeQ1Ral1ac2OkczVS/PR2jOfzVmKckFtL8hlZoTsmwGj98ynuN/L7myAUKXckAAAAAElFTkSuQmCC"
          />
          <div className="nav-bar__tools__cart__icon-container--cart__count">
            <p>{noOfItems()}</p>
          </div>
        </div>
      </div>
      <div
        className={
          !ifHide
            ? "nav-bar__tools__cart__items-container nav-bar__tools__cart__items-container--visible"
            : "nav-bar__tools__cart__items-container"
        }
        onMouseEnter={() => {
          setIfHide(false);
          setBlackBox(true);
        }}
        onMouseLeave={() => {
          setIfHide(true);
          setBlackBox(false);
        }}
      >
        {windowWidth <= 1000 && (
          <div className="nav-bar__tools__button-container">
            <button
              type="button"
              onClick={() => {
                setIfHide(true);
                setBlackBox(false);
                setTimeout(() => {
                  document.querySelector("body").style.paddingRight = 0;
                  document.querySelector("html").style.overflowY = "scroll";
                }, 300);
              }}
            >
              <img
                src="https://img.icons8.com/fluent-systems-filled/24/000000/multiply.png"
                alt="icon"
              />
            </button>
          </div>
        )}
        {cart.length < 1 ? (
          <p className="nav-bar__tools__cart__empty">
            No items in your cart. Purchase some Items.
          </p>
        ) : (
          <div>
            <div className="nav-bar__tools__cart__items-container__info">
              <p>
                <span>{noOfItems()}</span> items
              </p>
              <p>
                subTotal: <span>{`$${subTotal() / 100}`}</span>
              </p>
            </div>
            <Link
              to="/checkout"
              onClick={() => {
                setIfHide(true);
                setBlackBox(false);
                setTimeout(() => {
                  document.querySelector("body").style.paddingRight = 0;
                  document.querySelector("html").style.overflowY = "scroll";
                }, 300);
              }}
            >
              <button className="nav-bar__tools__cart__items-container__checkout-button">
                Proceed to checkout
              </button>
            </Link>

            <div className="nav-bar__tools__cart__items-container__line"></div>
            <div className="nav-bar__tools__cart__items-container__items">
              {cart.map((item, index) => (
                <CartItem
                  item={item}
                  key={index}
                  setCart={setCart}
                  {...{ setBlackBox, setIfHide, colors }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartTool;
