import React, { useState } from "react";
import "@/pages/auth/SignUpAndSignIn.scss";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "@/app/store/useAppStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiRequest } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queries";

function SignUp() {
  // const history = useHistory();
  const navigate = useNavigate();

  const setUser = useAppStore((state) => state.setUser);
  const path = useAppStore((state) => state.path);
  const queryClient = useQueryClient();
  const signupMutation = useMutation({
    mutationFn: (account) =>
      apiRequest("/user/signup", { method: "POST", body: account }),
  });

  const [hidePassword, setHidePassword] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const [failed, setFailed] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setFailed("");
    try {
      const result = await signupMutation.mutateAsync(data);
      if (!result?.user) {
        setFailed("Email already exists");
        return;
      }
      setUser(result.user);
      queryClient.clear();
      queryClient.setQueryData(queryKeys.auth, result);
      navigate(path || "/", { replace: true });
    } catch {
      setFailed("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form">
      <title>Sign Up | Stand Out</title>
      <img src="/images/shopping.jpg" alt="shopping" width="548" height="642" decoding="async" />
      <div className="user-form__content">
        <div className="user-form__content__title">
          <div className="user-form__content__title__desc">
            <h1>Welcome</h1>
            <p>
              Explore millions of designs and stand out alone with your fashion
            </p>
          </div>
          <button type="button" onClick={() => navigate("/signin")}>
            sign in
          </button>
        </div>
        {failed !== "" && (
          <p
            className="user-form__content__form__input-container__error-msg"
            style={{ marginTop: "20px", maxWidth: "100%" }}
          >
            <FontAwesomeIcon icon="circle" className="icon" /> {failed}
          </p>
        )}
        <form
          className="user-form__content__form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="user-form__content__form__flex">
            <div className="user-form__content__form__input-container">
              <label htmlFor="firstName">
                first name <span>*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                {...register("firstName", {
                  pattern: {
                    value: /^\w{2,}$/,
                    message: "Should be 2 or more than 2 letters",
                  },
                  required: "Required",
                })}
                onBlur={() => {
                  trigger("firstName");
                }}
              />
              {typeof errors.firstName !== "undefined" && (
                <p className="user-form__content__form__input-container__error-msg">
                  <FontAwesomeIcon icon="circle" className="icon" />{" "}
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="user-form__content__form__input-container">
              <label htmlFor="lastName">
                last name <span>*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                {...register("lastName", {
                  pattern: {
                    value: /^\w{2,}$/,
                    message: "Should be 2 or more than 2 letters",
                  },
                  required: "Required",
                })}
                onBlur={() => {
                  trigger("lastName");
                }}
              />
              {typeof errors.lastName !== "undefined" && (
                <p className="user-form__content__form__input-container__error-msg">
                  <FontAwesomeIcon icon="circle" className="icon" />{" "}
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="user-form__content__form__input-container">
            <label htmlFor="email">
              email address <span>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="text"
              {...register("email", {
                pattern: {
                  value: /^\w{2,}@\w{2,}\.\w{2,}(\.\w{2,})?$/,
                  message: "invalid email address",
                },
                required: "Required",
              })}
              onBlur={() => {
                trigger("email");
              }}
            />
            {typeof errors.email !== "undefined" && (
              <p className="user-form__content__form__input-container__error-msg">
                <FontAwesomeIcon icon="circle" className="icon" />{" "}
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="user-form__content__form__input-container">
            <label htmlFor="password">
              password <span>*</span>
            </label>
            <div
              className="user-form__content__form__input-container__password-container"
              onClick={() => {
                document
                  .querySelector(
                    ".user-form__content__form__input-container__password-container input"
                  )
                  .focus();
              }}
            >
              <input
                id="password"
                name="password"
                type={hidePassword ? "password" : "text"}
                {...register("password", {
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s])[A-Za-z\d\W_]{8,}$/,
                    message:
                      "Should be more than 8 Letters and contain atleast 1 Upper case, Lower case, Number and symbol",
                  },
                  required: "Required",
                })}
              />
              {hidePassword ? (
                <FontAwesomeIcon
                  icon="eye"
                  className="icon"
                  onClick={() => {
                    setHidePassword(false);
                    document
                      .querySelector(
                        ".user-form__content__form__input-container__password-container input"
                      )
                      .focus();
                  }}
                />
              ) : (
                <FontAwesomeIcon
                  icon="eye-slash"
                  className="icon"
                  onClick={() => {
                    setHidePassword(true);
                  }}
                />
              )}
            </div>

            {typeof errors.password !== "undefined" && (
              <p className="user-form__content__form__input-container__error-msg">
                <FontAwesomeIcon icon="circle" className="icon" />{" "}
                {errors.password.message}
              </p>
            )}
          </div>
          {loading ? (
            <button
              type="button"
              className="user-form__content__form__button user-form__content__form__button--loading"
            >
              <div className="user-form__content__form__button__loading"></div>
            </button>
          ) : (
            <button type="submit">sign up</button>
          )}
        </form>
        <p className="user-form__content__terms">
          By creating the account, you agree to Standout{" "}
          <Link to="/terms-and-conditions">Terms & Conditions</Link> and{" "}
          <Link to="/private-policy">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
