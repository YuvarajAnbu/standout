import React from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../../../../api/client";
import { queryKeys } from "../../../../../api/queries";
import { unlockPageScroll } from "../../../../../utils/pageScroll";

function SignedIn({
  user,
  setUser,
  setBlackBox,
  setIfHide,
  setSuccessMsgs,
  setErrorMsgs,
}) {
  const queryClient = useQueryClient();
  const logoutMutation = useMutation({
    mutationFn: (allSessions) =>
      apiRequest(allSessions ? "/user/logout-all" : "/user/logout", {
        method: "PUT",
      }),
    onSuccess: () => {
      setUser({});
      queryClient.clear();
      queryClient.setQueryData(queryKeys.auth, { user: {} });
    },
  });

  const logout = (allSessions) => {
    logoutMutation.mutate(allSessions, {
      onSuccess: () => {
        setIfHide(true);
        setBlackBox(false);
        setSuccessMsgs("logout successful");
      },
      onError: () => {
        setIfHide(true);
        setBlackBox(false);
        setErrorMsgs("something went wrong. please try again");
      },
    });
  };

  return (
    <div className="nav-bar__tools__user__content--signed-in">
      <div className="nav-bar__tools__user__content--signed-in__profile">
        <Link
          to="/personal-info"
          onClick={() => {
            setIfHide(true);
            setBlackBox(false);
            setTimeout(() => {
              unlockPageScroll();
            }, 300);
          }}
        >
          <div className="nav-bar__tools__user__content--signed-in__profile__img">
            {user.name.slice(0)[0]}
          </div>
        </Link>
        <div className="nav-bar__tools__user__content--signed-in__profile__info">
          <div className="nav-bar__tools__user__content--signed-in__profile__info__email">
            {user.email}
          </div>
          <div className="nav-bar__tools__user__content--signed-in__profile__info__name">
            {user.name}
          </div>
        </div>
      </div>
      <div className="nav-bar__tools__user__content__line"></div>
      <ul className="nav-bar__tools__user__content__links">
        <li>
          <Link
            to="/personal-info"
            style={{ textDecoration: "none", color: "black" }}
            onClick={() => {
              setIfHide(true);
              setBlackBox(false);
              setTimeout(() => {
                unlockPageScroll();
              }, 300);
            }}
          >
            your account
          </Link>
        </li>
        <li>
          <Link
            to="/your-orders"
            style={{ textDecoration: "none", color: "black" }}
            onClick={() => {
              setIfHide(true);
              setBlackBox(false);
              setTimeout(() => {
                unlockPageScroll();
              }, 300);
            }}
          >
            your orders
          </Link>
        </li>
        <li
          className="nav-bar__tools__user__content__links__log-out"
          onClick={() => logout(false)}
        >
          log out
        </li>
        <li
          className="nav-bar__tools__user__content__links__log-out"
          onClick={() => logout(true)}
        >
          log out on all device
        </li>
      </ul>
    </div>
  );
}

export default SignedIn;
