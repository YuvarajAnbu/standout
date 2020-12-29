import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";
import "./UpdateOrder.css";

function UpdateOrder() {
  const history = useHistory();

  const [input, setInput] = useState("");
  const { user } = useContext(UserContext);

  const [order, setOrder] = useState({});

  const [delivered, setDelivered] = useState(false);

  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");
  const [showMsgs, setShowMsgs] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    document.title = "Update Orders | Stand Out";
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
    if (typeof user.name !== "undefined") {
      axios
        .get(`/user/is-admin`)
        .then((res) => {
          if (res.status !== 200) {
            throw new Error();
          }
          if (res.data !== "admin") {
            history.push(404);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      history.replace("/404");
    }
  }, [user.name, history]);

  const getorders = () => {
    setLoading(true);
    axios
      .get(`/user/delivered/${input}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error();
        }
        setOrder(res.data);
        setLoading(false);
        setDelivered(res.data.delivered);
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsgs("No orders found");
      });
  };

  return (
    <div>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <div className="update-order">
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input !== "") {
              getorders();
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
                      axios
                        .put("/user/order", { order })
                        .then((res) => {
                          if (res.status !== 200) {
                            throw new Error();
                          }
                          setInput("");
                          setOrder({});
                          setSubmitLoading(false);
                          setSuccessMsgs("order updated successfully");
                        })
                        .catch((err) => {
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
