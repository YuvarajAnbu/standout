import React, { useContext, useState, useEffect } from "react";
import "./SignUpAndSignIn.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { UserContext, PathContext } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SignUp() {
  const history = useHistory();
  const { setUser } = useContext(UserContext);
  const { path } = useContext(PathContext);

  const [hidePassword, setHidePassword] = useState(true);

  const { register, handleSubmit, errors, trigger } = useForm();

  const [loading, setLoading] = useState(false);

  const [failed, setFailed] = useState("");

  useEffect(() => {
    document.title = "Sign Up | Stand Out";
  }, []);

  const onSubmit = (data) => {
    setLoading(true);
    setFailed("");
    axios
      .post("/user/signup", data)
      .then((res) => {
        if (res.status === 203) {
          setLoading(false);
          setFailed("Email already exists");
        } else {
          if (res.status !== 201) {
            throw new Error();
          }
          setUser(res.data.user);
          setLoading(false);
          history.replace(path);
        }
      })
      .catch((err) => {
        setLoading(false);
        setFailed("Something went wrong. Please try again");
        console.log(err);
      });
  };

  return (
    <div className="user-form">
      <img src="/images/shopping.jpg" alt="shopping" />
      <div className="user-form__content">
        <div className="user-form__content__title">
          <div className="user-form__content__title__desc">
            <h1>Welcome</h1>
            <p>
              Explore millions of designs and stand out alone with your fashion
            </p>
          </div>
          <Link to="/signin">
            <button type="button">sign in</button>
          </Link>
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
                name="firstName"
                ref={register({
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
                name="lastName"
                ref={register({
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
              name="email"
              type="text"
              ref={register({
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
                name="password"
                type={hidePassword ? "password" : "text"}
                ref={register({
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s])[A-Za-z\d\W_]{8,}$/,
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
            <button type="submit">sign up</button>
          )}
        </form>
        <p className="user-form__content__terms">
          By creating the account, you agree to Standout{" "}
          <Link to="/terms&conditions">Terms & Conditions</Link> and{" "}
          <Link to="private-policy">Private Policy</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
