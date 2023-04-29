import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext, PathContext } from "../../App";
import "./SignUpAndSignIn.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SignIn() {
  // const history = useHistory();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { path } = useContext(PathContext);

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

  const onSubmit = (data) => {
    setLoading(true);
    setFailed(false);
    axios
      .post("/user/login", data)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error();
        }
        setUser(res.data.user);
        setLoading(false);
        // history.replace(path);
        navigate(path, { replace: true });
      })
      .catch((err) => {
        setFailed(true);
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className="user-form signin">
      <img src="/images/shopping.jpg" alt="shopping" />
      <div className="user-form__content">
        <div className="user-form__content__title">
          <div className="user-form__content__title__desc">
            <h1>Welcome</h1>
            <p>
              Explore millions of designs and stand out alone with your fashion
            </p>
          </div>
          <Link to="/signup">
            <button type="button">sign up</button>
          </Link>
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
                  onClick={(e) => {
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
