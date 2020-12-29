import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import {
  UserContext,
  OrdersContext,
  HideOrdersContext,
  ColorsContext,
} from "../../App";
import "./YourOrders.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Order from "./subComponents/Order";

function YourOrders() {
  const location = useLocation();
  const history = useHistory();
  const { user } = useContext(UserContext);
  const { orders: userOrders } = useContext(OrdersContext);
  const { hideOrders, setHideOrders } = useContext(HideOrdersContext);
  const colors = useContext(ColorsContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoding] = useState(true);

  const [successMsgs, setSuccessMsgs] = useState("");
  const [errorMsgs, setErrorMsgs] = useState("");
  const [showMsgs, setShowMsgs] = useState(false);

  const [NotSignedIn, setNotSignedIn] = useState(false);
  const [noOrders, setNoOrders] = useState(false);

  useEffect(() => {
    document.title = "Your Orders | Stand Out";
  }, []);

  useEffect(() => {
    if (errorMsgs !== "") {
      const a = setTimeout(() => {
        setErrorMsgs("");
      }, 3400);
      const b = setTimeout(() => {
        setShowMsgs(true);
      }, 1);
      const c = setTimeout(() => {
        setShowMsgs(false);
      }, 3000);

      return () => {
        clearTimeout(a);
        clearTimeout(b);
        clearTimeout(c);
      };
    }
  }, [errorMsgs]);

  useEffect(() => {
    if (successMsgs !== "") {
      const a = setTimeout(() => {
        setSuccessMsgs("");
      }, 3400);
      const b = setTimeout(() => {
        setShowMsgs(true);
      }, 1);
      const c = setTimeout(() => {
        setShowMsgs(false);
      }, 3000);

      return () => {
        clearTimeout(a);
        clearTimeout(b);
        clearTimeout(c);
      };
    }
  }, [successMsgs]);

  useEffect(() => {
    if (location.pathname === "/your-orders") {
      if (typeof user.name !== "undefined") {
        axios
          .get(`/user/orders`)
          .then((res) => {
            if (res.status !== 200) {
              throw new Error();
            }
            const arr = [];
            userOrders.forEach((e) => {
              if (e.customer.email === user.email) {
                arr.push(e);
              }
            });

            const sortArr = arr.sort((a, b) => {
              if (new Date(a.date) < new Date(b.date)) {
                return 1;
              }
              if (new Date(a.date) > new Date(b.date)) {
                return -1;
              }
              return 0;
            });

            const ordersArr = [...sortArr, ...res.data].filter(
              (el) => !hideOrders.includes(el._id)
            );
            setOrders(ordersArr);
            setLoding(false);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setLoding(false);
        setNotSignedIn(true);
      }
    } else if (location.pathname === "/orders" && location.search !== "") {
      const obj = location.search.split("&");
      obj.forEach((el) => {
        if (el.includes("q=")) {
          const id = el.replace("?", "").replace("q=", "");
          if (hideOrders.includes(id)) {
            setNoOrders(true);
            setLoding(false);
          } else {
            axios
              .get(`/user/guest-order?orderId=${id}`)
              .then((res) => {
                if (res.status !== 200) {
                  throw new Error();
                }
                if (res.data === "") {
                  throw new Error();
                }
                setOrders([res.data]);
                setLoding(false);
              })
              .catch((err) => {
                setNoOrders(true);
                setLoding(false);
              });
          }
        }
      });
    }
  }, [location, user, hideOrders, userOrders]);

  return loading ? (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  ) : (
    <div className="your-orders">
      {errorMsgs !== "" && (
        <div className={showMsgs ? "msg msg--visible" : "msg"}>
          <FontAwesomeIcon
            icon={["far", "times-circle"]}
            className="icon"
            onClick={() => {
              setSuccessMsgs("");
            }}
          />
          <p>{errorMsgs}</p>
        </div>
      )}
      {successMsgs !== "" && (
        <div className={showMsgs ? "msg msg--visible" : "msg"}>
          <FontAwesomeIcon
            icon={["far", "check-circle"]}
            className="icon"
            onClick={() => {
              setSuccessMsgs("");
            }}
          />
          <p>{successMsgs}</p>
        </div>
      )}
      {NotSignedIn && (
        <div className="your-orders__tool-tip-container">
          <div className="your-orders__tool-tip-container__tool-tip">
            <p>please signin to continue</p>
            <Link to="/signin">
              <button>ok</button>
            </Link>
          </div>
          <div
            className="your-orders__tool-tip-container__black-box"
            onClick={() => {
              history.goBack();
            }}
          ></div>
        </div>
      )}
      {noOrders && (
        <div className="your-orders__tool-tip-container">
          <div className="your-orders__tool-tip-container__tool-tip">
            <p>No orders found. Check your order-id and try again</p>
            <button
              onClick={() => {
                history.push("/");
              }}
            >
              ok
            </button>
          </div>
          <div
            className="your-orders__tool-tip-container__black-box"
            onClick={() => {
              history.goBack();
            }}
          ></div>
        </div>
      )}
      <h1>your orders</h1>
      {orders.length <= 0 ? (
        <p className="your-orders__no-orders">
          {location.pathname === "/your-orders"
            ? "you haven't purchased anything yet.........."
            : "No Orders left......"}
        </p>
      ) : (
        <div className="your-orders__orders-container">
          {orders.map((el, index) => (
            <Order
              key={index}
              {...{
                el,
                setOrders,
                setSuccessMsgs,
                setErrorMsgs,
                setHideOrders,
                colors,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default YourOrders;
