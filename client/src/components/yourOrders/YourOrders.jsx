import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../api/client";
import { queryKeys } from "../../api/queries";
import { useAppStore } from "../../store/useAppStore";
import colors from "../../state/colors";
import "./YourOrders.css";
import Order from "./subComponents/Order";
import { useTimedMessages } from "../../hooks/useTimedMessages";
import MessageBanner from "../common/MessageBanner";
import { reportError } from "../../utils/logger";

function YourOrders() {
  const location = useLocation();
  // const history = useHistory();
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const userOrders = useAppStore((state) => state.orders);
  const hideOrders = useAppStore((state) => state.hideOrders);
  const setHideOrders = useAppStore((state) => state.setHideOrders);

  const [orders, setOrders] = useState([]);
  const [loading, setLoding] = useState(true);

  const {
    successMsgs,
    errorMsgs,
    showMsgs,
    setSuccessMsgs,
    dismissMessages,
  } = useTimedMessages();

  const [NotSignedIn, setNotSignedIn] = useState(false);
  const [noOrders, setNoOrders] = useState(false);
  const isCustomerOrdersRoute = location.pathname === "/your-orders";
  const guestOrderId = new URLSearchParams(location.search).get("q") || "";
  const customerOrdersQuery = useQuery({
    queryKey: queryKeys.orders,
    queryFn: ({ signal }) => apiRequest("/user/orders", { signal }),
    enabled: isCustomerOrdersRoute && Boolean(user.name),
  });
  const guestOrderQuery = useQuery({
    queryKey: queryKeys.guestOrder(guestOrderId),
    queryFn: ({ signal }) =>
      apiRequest(`/user/guest-order?orderId=${encodeURIComponent(guestOrderId)}`, {
        signal,
      }),
    enabled:
      !isCustomerOrdersRoute &&
      Boolean(guestOrderId) &&
      !hideOrders.includes(guestOrderId),
    retry: false,
  });

  useEffect(() => {
    document.title = "Your Orders | Stand Out";
  }, []);

  useEffect(() => {
    setNotSignedIn(false);
    setNoOrders(false);

    if (isCustomerOrdersRoute) {
      if (!user.name) {
        setNotSignedIn(true);
        setLoding(false);
      } else if (customerOrdersQuery.data) {
        const localOrders = userOrders
          .filter((order) => order.customer.email === user.email)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(
          [...localOrders, ...customerOrdersQuery.data].filter(
            (order) => !hideOrders.includes(order._id),
          ),
        );
        setLoding(false);
      } else if (customerOrdersQuery.isError) {
        reportError(customerOrdersQuery.error, { area: "customer orders" });
        setLoding(false);
      }
      return;
    }

    if (!guestOrderId || hideOrders.includes(guestOrderId)) {
      setNoOrders(true);
      setLoding(false);
    } else if (guestOrderQuery.isSuccess) {
      if (guestOrderQuery.data) {
        setOrders([guestOrderQuery.data]);
      } else {
        setNoOrders(true);
      }
      setLoding(false);
    } else if (guestOrderQuery.isError) {
      setNoOrders(true);
      setLoding(false);
    }
  }, [
    customerOrdersQuery.data,
    customerOrdersQuery.error,
    customerOrdersQuery.isError,
    guestOrderId,
    guestOrderQuery.data,
    guestOrderQuery.isError,
    guestOrderQuery.isSuccess,
    hideOrders,
    isCustomerOrdersRoute,
    user.email,
    user.name,
    userOrders,
  ]);

  return loading ? (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  ) : (
    <div className="your-orders">
      <MessageBanner message={errorMsgs} type="error" visible={showMsgs} onDismiss={dismissMessages} />
      <MessageBanner message={successMsgs} type="success" visible={showMsgs} onDismiss={dismissMessages} />
      {NotSignedIn && (
        <div className="your-orders__tool-tip-container">
          <div className="your-orders__tool-tip-container__tool-tip">
            <p>please signin to continue</p>
            <button type="button" onClick={() => navigate("/signin")}>ok</button>
          </div>
          <div
            className="your-orders__tool-tip-container__black-box"
            onClick={() => {
              // history.goBack();
              navigate(-1);
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
                // history.push("/");
                navigate("/");
              }}
            >
              ok
            </button>
          </div>
          <div
            className="your-orders__tool-tip-container__black-box"
            onClick={() => {
              // history.goBack();
              navigate(-1);
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
          {orders.map((el) => (
            <Order
              key={el._id}
              {...{
                el,
                setOrders,
                setSuccessMsgs,
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
