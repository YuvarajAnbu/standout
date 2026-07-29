import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/app/store/useAppStore";
import { cachedGet } from "@/shared/api/queries";
import { apiRequest } from "@/shared/api/client";
import { useForm } from "react-hook-form";
import { useTimedMessages } from "@/shared/hooks/useTimedMessages";
import MessageBanner from "@/shared/components/ui/MessageBanner";
import { reportError } from "@/shared/utils/logger";

function Reviews({ id, totalRatings }) {
  const user = useAppStore((state) => state.user);
  const userReviews = useAppStore((state) => state.reviews);
  const hideReviews = useAppStore((state) => state.hideReviews);
  const orders = useAppStore((state) => state.orders);
  const queryClient = useQueryClient();
  const [reviewVersion, setReviewVersion] = useState(0);

  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const limit = 12;

  const [reviews, setReviews] = useState([]);

  const [userReview, setUserReview] = useState({});
  const [purchased, setPurchased] = useState(false);

  const {
    successMsgs,
    errorMsgs,
    showMsgs,
    setSuccessMsgs,
    setErrorMsgs,
    dismissMessages,
  } = useTimedMessages();

  const [paginateLoading, setPaginateLoading] = useState(false);

  // getting reviews from server
  useEffect(() => {
    if (id.length < 20) {
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
      reviews = reviews.filter(
        (review) => !hideReviews.includes(`${id}&&&${review.email}`)
      );
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
      cachedGet(`/product/reviews?productId=${id}&page=0&limit=${limit}`)
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
            reviews = reviews.filter((review) => review.email !== user.email);
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
          reviews = reviews.filter(
            (review) => !hideReviews.includes(`${id}&&&${review.email}`)
          );

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
        .catch((error) => {
          reportError(error, { area: "reviews" });
          setLoading(false);
        });
    }
  }, [id, orders, user, userReviews, hideReviews, reviewVersion]);

  const pagination = async () => {
    setPaginateLoading(true);
    cachedGet(
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
      .catch((error) => reportError(error, { area: "review pagination" }));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (typeof errors.review !== "undefined") {
      setErrorMsgs(errors.review.message);
    }
  }, [errors, setErrorMsgs]);

  const refreshReviews = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["http"] }),
      queryClient.invalidateQueries({ queryKey: ["products"] }),
    ]);
    setPage(0);
    setReviewVersion((current) => current + 1);
  };
  const saveReview = useMutation({
    mutationFn: (review) =>
      apiRequest(`/product/${id}/review`, {
        method: "PUT",
        body: review,
      }),
    onSuccess: async () => {
      await refreshReviews();
      setLoading(false);
      setShowInput(false);
      setSuccessMsgs("Review updated successfully");
    },
    onError: (error) => {
      setLoading(false);
      setErrorMsgs(error.message || "Could not save your review");
    },
  });
  const deleteReview = useMutation({
    mutationFn: () =>
      apiRequest(`/product/${id}/review`, {
        method: "DELETE",
      }),
    onSuccess: async () => {
      await refreshReviews();
      setLoading(false);
      setSuccessMsgs("Your review was deleted successfully.");
    },
    onError: (error) => {
      setLoading(false);
      setErrorMsgs(error.message || "Could not delete your review");
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    saveReview.mutate({
      rating: Number(data.rating),
      review: data.review,
    });
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
      <MessageBanner message={errorMsgs} type="error" visible={showMsgs} onDismiss={dismissMessages} />
      <MessageBanner message={successMsgs} type="success" visible={showMsgs} onDismiss={dismissMessages} />
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
                {...register("rating")}
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
              autoFocus
              placeholder="Type here...."
              onInput={(event) => {
                event.currentTarget.style.height = "auto";
                event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
              }}
              {...register("review", { required: "reviews are required" })}
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
                  setLoading(true);
                  deleteReview.mutate();
                }}
              />
            </div>
          )}

          {reviews.map((el) => {
            return (
              <div
                className="item-page__reviews-container__reviews__review"
                key={el._id ?? `${el.email}-${el.review}`}
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
