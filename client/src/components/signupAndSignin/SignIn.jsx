import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import "./SignUpAndSignIn.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiRequest } from "../../api/client";
import { queryKeys } from "../../api/queries";

function SignIn() {
  // const history = useHistory();
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);
  const path = useAppStore((state) => state.path);
  const queryClient = useQueryClient();
  const loginMutation = useMutation({
    mutationFn: (credentials) =>
      apiRequest("/user/login", { method: "POST", body: credentials }),
  });

  const [hidePassword, setHidePassword] = useState(true);

  const [failed, setFailed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Sign In | Stand Out";
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setFailed(false);
    try {
      const result = await loginMutation.mutateAsync(data);
      setUser(result.user);
      queryClient.clear();
      queryClient.setQueryData(queryKeys.auth, result);
      navigate(path || "/", { replace: true });
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form signin">
      <img src="/images/shopping.jpg" alt="shopping" width="548" height="642" decoding="async" />
      <div className="user-form__content">
        <div className="user-form__content__title">
          <div className="user-form__content__title__desc">
            <h1>Welcome</h1>
            <p>
              Explore millions of designs and stand out alone with your fashion
            </p>
          </div>
          <button type="button" onClick={() => navigate("/signup")}>
            sign up
          </button>
        </div>
        {failed && (
          <p
            className="user-form__content__form__input-container__error-msg"
            style={{ marginTop: "20px", maxWidth: "100%" }}
          >
            <FontAwesomeIcon icon="circle" className="icon" /> Incorrect
            Username or Password
          </p>
        )}
        <form
          className="user-form__content__form"
          onSubmit={handleSubmit(onSubmit)}
        >
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
                required: "required",
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
                  required: "required",
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
            <button type="submit">sign in</button>
          )}
        </form>
        <p className="user-form__content__signup">
          Not a member ? <Link to="/signup">join for free</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
