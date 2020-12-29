import React, { useCallback, useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  UserContext,
  ReviewsContext,
  UserCountContext,
  HideReviewsContent,
  OrdersContext,
} from "../../../App";
import axios from "axios";
import { useForm } from "react-hook-form";

function Reviews({ id, totalRatings, setItem }) {
  const { user } = useContext(UserContext);
  const { reviews: userReviews, setReviews: setUserReviews } = useContext(
    ReviewsContext
  );
  const { userCount, setUserCount } = useContext(UserCountContext);
  const { hideReviews, setHideReviews } = useContext(HideReviewsContent);
  const { orders } = useContext(OrdersContext);

  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const limit = 12;

  const [reviews, setReviews] = useState([]);

  const [userReview, setUserReview] = useState({});
  const [purchased, setPurchased] = useState(false);

  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");
  const [showMsgs, setShowMsgs] = useState(false);

  const [paginateLoading, setPaginateLoading] = useState(false);

  // getting reviews from server
  useEffect(() => {
    if (id < 20) {
      let { reviews, reviewed, purchased } = {
        reviews: [],
        reviewed: {},
        purchased: false,
      };
      if (typeof user.name !== "undefined") {
        userReviews.forEach((el) => {
          if (el.productId === id && el.email !== user.email) {
            reviews.push(el);
          }
          if (el.productId === id && el.email === user.email) {
            if (!hideReviews.includes(id + "&&&" + user.email)) {
              reviewed = el;
            }
          }
        });
        orders.forEach((el) => {
          if (!purchased) {
            el.items.forEach((e) => {
              if (e._id === id && el.customer.email === user.email) {
                purchased = true;
              }
            });
          }
        });
      } else {
        userReviews.forEach((el) => {
          if (el.productId === id) {
            reviews.push(el);
          }
        });
      }
      reviews.filter((e) => !hideReviews.includes(id + "&&&" + user.email));
      if (typeof reviewed.email === "undefined") {
        setUserReview(undefined);
      } else {
        reviews = reviews.filter((e) => e.email !== user.email);
        setUserReview(reviewed);
      }
      setReviews(reviews);
      setPurchased(purchased);
      setPage(1);
      setLoading(false);
    } else {
      axios
        .get(`/product/reviews?productId=${id}&page=${0}&limit=${limit}`)
        .then((res) => {
          let { reviews, reviewed, purchased } = res.data;

          if (typeof user.name !== "undefined") {
            userReviews.forEach((el) => {
              if (el.productId === id && el.email !== user.email) {
                reviews.push(el);
              }
              if (el.productId === id && el.email === user.email) {
                reviewed = [el];
              }
            });
            reviews.forEach((e, i) => {
              if (e.email === user.email) {
                reviews.splice(i, 1);
              }
            });
            orders.forEach((el) => {
              if (!purchased) {
                el.items.forEach((e) => {
                  if (e._id === id && el.customer.email === user.email) {
                    purchased = true;
                  }
                });
              }
            });
          } else {
            userReviews.forEach((el) => {
              if (el.productId === id) {
                reviews.push(el);
              }
            });
          }
          reviews.filter((e) => !hideReviews.includes(id + "&&&" + user.email));

          if (typeof reviewed !== "undefined") {
            if (reviewed.length < 1) {
              setReviews(reviews);
              setUserReview(undefined);
            } else {
              reviews = reviews.filter((e) => e.email !== user.email);
              setReviews(reviews.filter((el) => el._id !== reviewed[0]._id));
              if (!hideReviews.includes(id + "&&&" + user.email)) {
                setUserReview(reviewed[0]);
              } else {
                setUserReview(undefined);
              }
            }
          } else {
            setReviews(reviews);
            setUserReview(undefined);
          }

          setPurchased(purchased);
          setPage(1);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id, orders, user, userReviews, hideReviews]);

  // focusing text-area
  useEffect(() => {
    if (showInput) {
      const textArea = document.getElementById("text-area");
      textArea.focus();
      document.querySelector("textarea").style.height =
        document.querySelector("textarea").scrollHeight + "px";
    }
  }, [showInput]);

  const setHeight = useCallback(() => {
    if (showInput) {
      document.querySelector("textarea").style.height =
        document.querySelector("textarea").scrollHeight + "px";
    }
  }, [showInput]);

  useEffect(() => {
    window.addEventListener("resize", setHeight);

    return () => window.removeEventListener("resize", setHeight);
  }, [setHeight]);

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

  const pagination = async () => {
    setPaginateLoading(true);
    axios
      .get(
        `/product/reviews/?userId=${user.name}&productId=${id}&page=${page}&limit=${limit}`
      )
      .then((res) => {
        if (typeof userReview !== "undefined") {
          setReviews((prev) =>
            prev.concat(
              res.data.reviews.filter((el) => el._id !== userReview._id)
            )
          );
        } else {
          setReviews((prev) => prev.concat(res.data.reviews));
        }
        setPage((prev) => prev + 1);
        setPaginateLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    if (typeof errors.review !== "undefined") {
      setErrorMsgs(errors.review.message);
    }
  }, [errors]);

  const onSubmit = (data) => {
    setLoading(true);
    let review = {
      _id: userCount,
      productId: id,
      email: user.email,
      userName: user.name,
      rating: data.rating,
      review: data.review,
    };

    setUserReviews((prev) => [
      ...prev.filter((el) => review.email !== el.email),
      review,
    ]);
    setUserCount((prev) => prev + 1);
    setPage(0);

    //at last
    setLoading(false);
    setShowInput(false);
    setSuccessMsgs("review updated successfully");

    // axios
    //   .put("/product/reviews/add", {
    //     ...data,
    //     productId: id,
    //   })
    //   .then((res) => {
    //     setPage(0);
    //     setLoading(true);
    //     axios
    //       .get(`/product/reviews?productId=${id}&page=${0}&limit=${limit}`)
    //       .then((res) => {
    //         const { reviews, reviewed, purchased } = res.data;

    //         if (typeof reviewed !== "undefined") {
    //           if (reviewed.length < 1) {
    //             setReviews(reviews);
    //             setUserReview(undefined);
    //           } else {
    //             setReviews(reviews.filter((el) => el._id !== reviewed[0]._id));
    //             setUserReview(reviewed[0]);
    //           }
    //         } else {
    //           setReviews(reviews);
    //           setUserReview(undefined);
    //         }

    //         setPurchased(purchased);
    //         setPage(1);
    //         setLoading(false);
    //         setSuccessMsgs("review updated successfully");
    //         // axios
    //         //   .get(`/product/${id}`)
    //         //   .then((res) => {
    //         //     if (res.status !== 200) {
    //         //       throw new Error();
    //         //     }
    //         //     setItem(res.data);
    //         //   })
    //         //   .catch((err) => {
    //         //     console.log(err);
    //         //   });
    //       })
    //       .catch((err) => {
    //         console.log(err);

    //         setLoading(false);
    //         setSuccessMsgs("review updated successfully");
    //       });
    //     setShowInput(false);
    //   })
    //   .catch((err) => {
    //     setErrorMsgs("something went wrong. please try again");
    //     console.log(err);
    //   });
  };

  return loading ? (
    <div className="item-page__loading__container item-page__loading__container--reviews">
      <div className="item-page__loading__container__title"></div>
      <div className="item-page__loading__container__flex">
        <div className="item-page__loading__container__circle"></div>
        <div className="item-page__loading__container__text"></div>
      </div>
      <div className="item-page__loading__container__text item-page__loading__container__text--ratings"></div>
      <div className="item-page__loading__container__text"></div>
    </div>
  ) : (
    <div className="item-page__reviews-container">
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
      <div className="item-page__reviews-container__title-container">
        <h1>reviews</h1>

        {!showInput && !loading && (
          <p
            onClick={() => {
              if (errorMsgs === "") {
                if (typeof user.name !== "undefined") {
                  if (purchased) {
                    setShowInput(true);
                  } else {
                    setErrorMsgs(
                      "you need to purchase the product first inorder or review about it"
                    );
                  }
                } else {
                  setErrorMsgs("login or signup to review about it");
                }
              }
            }}
          >
            {typeof userReview !== "undefined"
              ? "Edit review"
              : "Write a review"}
          </p>
        )}
      </div>

      {showInput && (
        <div className="item-page__reviews-container__edit">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="item-page__reviews-container__edit__select">
              <select
                name="rating"
                ref={register}
                defaultValue={
                  typeof userReview !== "undefined" ? userReview.rating : "1"
                }
              >
                <option value="1">1</option>
                <option value="1.5">1.5</option>
                <option value="2">2</option>
                <option value="2.5">2.5</option>
                <option value="3">3</option>
                <option value="3.5">3.5</option>
                <option value="4">4</option>
                <option value="4.5">4.5</option>
                <option value="5">5</option>
              </select>
              <FontAwesomeIcon className="icon" icon="chevron-right" />
            </div>
            <textarea
              name="review"
              id="text-area"
              placeholder="Type here...."
              ref={register({ required: "reviews are required" })}
              defaultValue={
                typeof userReview !== "undefined" ? userReview.review : ""
              }
              onInput={(e) => {
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
            <div className="item-page__reviews-container__edit__button-container">
              <button
                type="button"
                onClick={() => {
                  setShowInput(false);
                }}
              >
                cancel
              </button>
              <button
                className={
                  typeof errors.review !== "undefined"
                    ? "item-page__reviews-container__edit__button-container--disabled"
                    : ""
                }
                type="submit"
              >
                add
              </button>
            </div>
          </form>
        </div>
      )}
      {reviews.length < 1 && typeof userReview === "undefined" ? (
        <p className="item-page__reviews-container__no-reviews">
          This product is not yet rated.
        </p>
      ) : (
        <div className="item-page__reviews-container__reviews">
          {typeof userReview !== "undefined" && (
            <div className="item-page__reviews-container__reviews__review">
              <div className="item-page__reviews-container__reviews__review__profile">
                <div className="item-page__reviews-container__reviews__review__profile__img">
                  {userReview.userName.slice(0, 1)}
                </div>
                <p className="item-page__reviews-container__reviews__review__profile__name">
                  {userReview.userName}
                </p>
              </div>
              <div className="item-page__reviews-container__reviews__review__rating-container">
                <div className="item-page__reviews-container__reviews__review__rating-container__icons">
                  {`${userReview.rating}`.split(".").map((el, index) => {
                    if (index === 0) {
                      const arr = [];
                      for (var i = 0; i < Number(el); i++) {
                        arr.push(
                          <FontAwesomeIcon
                            key={i}
                            icon="star"
                            className="item-page__reviews-container__reviews__review__rating-container__icons__icon"
                          />
                        );
                      }
                      return arr;
                    } else {
                      return (
                        <FontAwesomeIcon
                          key={9}
                          icon="star-half"
                          className="item-page__reviews-container__reviews__review__rating-container__icons__icon"
                        />
                      );
                    }
                  })}
                </div>
                <p className="item-page__reviews-container__reviews__review__rating-container__rating">
                  {`(${userReview.rating})`}
                </p>
              </div>
              <p className="item-page__reviews-container__reviews__review__desc">
                {userReview.review}
              </p>
              <FontAwesomeIcon
                icon="trash"
                className="icon"
                onClick={() => {
                  setHideReviews((prev) => [...prev, id + "&&&" + user.email]);
                  setUserReview(undefined);
                  setSuccessMsgs("your review had deleted successfully");
                  // axios
                  //   .put(`/product/review/delete/${id}`)
                  //   .then((res) => {
                  //     setUserReview(undefined);
                  //     setSuccessMsgs("your review had deleted successfully");
                  //   })
                  //   .catch((err) => {
                  //     console.log(err);
                  //     setErrorMsgs("something went wrong. Try again later");
                  //   });
                }}
              />
            </div>
          )}

          {reviews.map((el, j) => {
            return (
              <div
                className="item-page__reviews-container__reviews__review"
                key={j}
              >
                <div className="item-page__reviews-container__reviews__review__profile">
                  <div className="item-page__reviews-container__reviews__review__profile__img">
                    {el.userName.slice(0, 1)}
                  </div>
                  <p className="item-page__reviews-container__reviews__review__profile__name">
                    {el.userName}
                  </p>
                </div>
                <div className="item-page__reviews-container__reviews__review__rating-container">
                  <div className="item-page__reviews-container__reviews__review__rating-container__icons">
                    {`${el.rating}`.split(".").map((el, index) => {
                      if (index === 0) {
                        const arr = [];
                        for (var i = 0; i < Number(el); i++) {
                          arr.push(
                            <FontAwesomeIcon
                              key={i}
                              icon="star"
                              className="item-page__reviews-container__reviews__review__rating-container__icons__icon"
                            />
                          );
                        }
                        return arr;
                      } else {
                        return (
                          <FontAwesomeIcon
                            key={9}
                            icon="star-half"
                            className="item-page__reviews-container__reviews__review__rating-container__icons__icon"
                          />
                        );
                      }
                    })}
                  </div>
                  <p className="item-page__reviews-container__reviews__review__rating-container__rating">
                    {`(${el.rating})`}
                  </p>
                </div>
                <p className="item-page__reviews-container__reviews__review__desc">
                  {el.review}
                </p>
              </div>
            );
          })}

          <p className="item-page__reviews-container__reviews__count">
            {(typeof userReview !== "undefined"
              ? reviews.length + 1
              : reviews.length) < totalRatings
              ? `${
                  typeof userReview !== "undefined"
                    ? reviews.length + 1
                    : reviews.length
                } / ${totalRatings}`
              : `${totalRatings}/${totalRatings}`}{" "}
            reviews
          </p>
          {(typeof userReview !== "undefined"
            ? reviews.length + 1
            : reviews.length) < totalRatings && (
            <button
              className={
                paginateLoading
                  ? "item-page__reviews-container__reviews__load-more--loading"
                  : "item-page__reviews-container__reviews__load-more"
              }
              type="button"
              onClick={() => {
                if (!paginateLoading) {
                  pagination();
                }
              }}
            >
              {paginateLoading ? (
                <div className="item-page__reviews-container__reviews__load-more"></div>
              ) : (
                "load more"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Reviews;
