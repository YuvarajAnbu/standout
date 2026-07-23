import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../api/client";
import { queryClient } from "../../api/queryClient";
import "./UpdateOrder.css";
import { useTimedMessages } from "../../hooks/useTimedMessages";
import MessageBanner from "../common/MessageBanner";

function UpdateOrder() {
  // const history = useHistory();
  const [input, setInput] = useState("");

  const [order, setOrder] = useState({});

  const [delivered, setDelivered] = useState(false);

  const {
    successMsgs,
    errorMsgs,
    showMsgs,
    setSuccessMsgs,
    setErrorMsgs,
    dismissMessages,
  } = useTimedMessages();

  const [lookup, setLookup] = useState({ id: "", request: 0 });
  const [submitLoading, setSubmitLoading] = useState(false);
  const orderQuery = useQuery({
    queryKey: ["orders", "delivery", lookup.id, lookup.request],
    queryFn: ({ signal }) =>
      apiRequest(`/user/delivered/${encodeURIComponent(lookup.id)}`, { signal }),
    enabled: Boolean(lookup.id),
    staleTime: 0,
    retry: false,
  });
  const updateOrderMutation = useMutation({
    mutationFn: (nextOrder) =>
      apiRequest("/user/order", {
        method: "PUT",
        body: { order: nextOrder },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["http", "/user/orders"] }),
  });

  useEffect(() => {
    document.title = "Update Orders | Stand Out";
  }, []);

  useEffect(() => {
    if (orderQuery.data) {
      setOrder(orderQuery.data);
      setDelivered(orderQuery.data.delivered);
    } else if (orderQuery.isError) {
      setOrder({});
      setErrorMsgs("No orders found");
    }
  }, [orderQuery.data, orderQuery.isError, setErrorMsgs]);

  return (
    <div>
      {orderQuery.isFetching && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <div className="update-order">
        <MessageBanner message={errorMsgs} type="error" visible={showMsgs} onDismiss={dismissMessages} />
        <MessageBanner message={successMsgs} type="success" visible={showMsgs} onDismiss={dismissMessages} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input !== "") {
              setLookup((current) => ({
                id: input.trim(),
                request: current.request + 1,
              }));
            }
          }}
        >
          <input
            className="update-order__search"
            placeholder="Search with order id"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">
            <FontAwesomeIcon
              icon="search"
              className="update-order__search-icon"
            />
          </button>
        </form>

        {typeof order._id !== "undefined" ? (
          <div className="update-order__order">
            <div className="update-order__order__delivered">
              <p>delivered</p>
              <input
                type="checkbox"
                checked={order.delivered}
                onChange={() => {
                  setOrder((prev) => {
                    return {
                      ...prev,
                      delivered: !prev.delivered,
                    };
                  });
                }}
              />
            </div>
            {delivered !== order.delivered && (
              <div>
                {submitLoading ? (
                  <button
                    type="button"
                    className="update-order__button--loading"
                  >
                    <div className="update-order__button__loading"></div>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSubmitLoading(true);
                      updateOrderMutation
                        .mutateAsync(order)
                        .then(() => {
                          setInput("");
                          setOrder({});
                          setSubmitLoading(false);
                          setSuccessMsgs("order updated successfully");
                        })
                        .catch(() => {
                          setErrorMsgs(
                            "something went wrong. please try again"
                          );
                          setSubmitLoading(false);
                        });
                    }}
                  >
                    update
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="update-order__no-order">search for orders</p>
        )}
      </div>
    </div>
  );
}

export default UpdateOrder;
