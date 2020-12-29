import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

function Info({
  showInput,
  register,
  user,
  watch,
  errors,
  setShowInput,
  hidePassword,
  setHidePassword,
  showPopup,
  setShowPopup,
  wrongpassword,
  setWrongpassword,
  passwordError,
  setPasswordError,
  loadingPassword,
  setLoadingPassword,
}) {
  return (
    <div className="personal-info__container">
      <h2>profile</h2>
      <div
        className={
          showInput.name
            ? "personal-info__container__info personal-info__container__info--focused"
            : "personal-info__container__info"
        }
      >
        <label>name</label>
        {showInput.name ? (
          <div className="personal-info__container__info__input-container">
            <input
              autoFocus
              name="name"
              ref={register({
                pattern: {
                  value: /^[\w ]{0,}[\w]{2,}[\w ]{0,}$/,
                  message: "should be more than 2 letters",
                },
                required: "Required",
              })}
              defaultValue={user.name.trim()}
            />
            {typeof errors.name !== "undefined" && (
              <p className="personal-info__container__info__input-container__error-msg">
                <FontAwesomeIcon icon="circle" className="icon" />{" "}
                {errors.name.message}
              </p>
            )}
          </div>
        ) : (
          <p>{user.name}</p>
        )}
        {showInput.name ? (
          <h4
            className="personal-info__container__info__link"
            onClick={() => {
              setShowInput((prev) => {
                return {
                  ...prev,
                  name: false,
                };
              });
            }}
          >
            cancel
          </h4>
        ) : (
          <FontAwesomeIcon
            className="personal-info__container__info__icon"
            icon="pen"
            onClick={() => {
              setShowInput((prev) => {
                return {
                  ...prev,
                  name: true,
                };
              });
            }}
          />
        )}
      </div>
      <div
        className={
          showInput.email
            ? "personal-info__container__info personal-info__container__info--focused"
            : "personal-info__container__info"
        }
      >
        <label>email</label>
        {showInput.email ? (
          <div className="personal-info__container__info__input-container">
            <input
              name="email"
              type="text"
              defaultValue={user.email}
              autoFocus
              ref={register({
                pattern: {
                  value: /^\w{2,}@\w{2,}\.\w{2,}(\.\w{2,})?$/,
                  message: "Invalid Email Address",
                },
                required: "Required",
              })}
            />
            {typeof errors.email !== "undefined" && (
              <p className="personal-info__container__info__input-container__error-msg">
                <FontAwesomeIcon icon="circle" className="icon" />{" "}
                {errors.email.message}
              </p>
            )}
          </div>
        ) : (
          <p>{user.email}</p>
        )}

        {showInput.email ? (
          <h4
            className="personal-info__container__info__link"
            onClick={() => {
              setShowInput((prev) => {
                return {
                  ...prev,
                  email: false,
                };
              });
            }}
          >
            cancel
          </h4>
        ) : (
          <FontAwesomeIcon
            className="personal-info__container__info__icon"
            icon="pen"
            onClick={() => {
              setShowInput((prev) => {
                return {
                  ...prev,
                  email: true,
                };
              });
            }}
          />
        )}
      </div>
      <div
        className={
          showInput.password
            ? "personal-info__container__info personal-info__container__info--focused"
            : "personal-info__container__info"
        }
      >
        <label>password</label>

        {showInput.password ? (
          <div className="personal-info__container__info__input-container">
            <div
              className="personal-info__container__info__input-container__password-container"
              onClick={() => {
                document
                  .querySelector(
                    ".personal-info__container__info__input-container__password-container input"
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
                        ".personal-info__container__info__input-container__password-container input"
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
              <p className="personal-info__container__info__input-container__error-msg">
                <FontAwesomeIcon icon="circle" className="icon" />{" "}
                {errors.password.message}
              </p>
            )}
          </div>
        ) : (
          <p>***********</p>
        )}

        {showPopup && (
          <div>
            <div className="personal-info__container__info__pop-up">
              <p className="personal-info__container__info__pop-up__title">
                verify its you
              </p>
              <div className="personal-info__container__info__input-container">
                <label htmlFor="verifyPassword">
                  password <span>*</span>
                </label>
                {wrongpassword && (
                  <p className="personal-info__container__info__input-container__error-msg">
                    <FontAwesomeIcon icon="circle" className="icon" /> incorrect
                    password
                  </p>
                )}
                {passwordError !== "" && (
                  <p className="personal-info__container__info__input-container__error-msg">
                    <FontAwesomeIcon icon="circle" className="icon" /> Required
                  </p>
                )}
                <div
                  className="personal-info__container__info__input-container__password-container"
                  onClick={() => {
                    document
                      .querySelector(
                        ".personal-info__container__info__input-container__password-container input"
                      )
                      .focus();
                  }}
                >
                  <input
                    name="verifyPassword"
                    type={hidePassword ? "password" : "text"}
                    ref={register({
                      required: "Required",
                    })}
                    onChange={(e) => {
                      if (e.target.value.length >= 1) {
                        setPasswordError("");
                      }
                    }}
                  />
                  {hidePassword ? (
                    <FontAwesomeIcon
                      icon="eye"
                      className="icon"
                      onClick={(e) => {
                        setHidePassword(false);
                        document
                          .querySelector(
                            ".personal-info__container__info__input-container__password-container input"
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
              </div>
              <div className="personal-info__container__info__pop-up__button-container">
                <button
                  type="button"
                  className="personal-info__container__info__pop-up__button-container__cancel"
                  onClick={() => {
                    setShowPopup(false);
                  }}
                >
                  cancel
                </button>
                {loadingPassword ? (
                  <button
                    type="button"
                    disabled
                    className="personal-info__container__info__pop-up__button-container__ok personal-info__container__info__pop-up__button-container__ok--loading"
                  >
                    <div className="personal-info__container__info__pop-up__button-container__ok__loading"></div>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="personal-info__container__info__pop-up__button-container__ok"
                    onClick={() => {
                      setWrongpassword(false);
                      if (watch("verifyPassword") !== "") {
                        setLoadingPassword(true);
                        axios
                          .get(
                            `/user/check-user?userId=${
                              user._id
                            }&password=${watch("verifyPassword")}`
                          )
                          .then((res) => {
                            if (res.status !== 200) {
                              throw new Error();
                            }
                            setShowPopup(false);
                            setWrongpassword(false);

                            setShowInput((prev) => {
                              return {
                                ...prev,
                                password: true,
                              };
                            });
                            setLoadingPassword(false);
                            document
                              .querySelector(
                                ".personal-info__container__info__input-container__password-container input"
                              )
                              .focus();
                          })
                          .catch((err) => {
                            setWrongpassword(true);
                            setLoadingPassword(false);
                            document
                              .querySelector(
                                ".personal-info__container__info__input-container__password-container input"
                              )
                              .focus();
                          });
                      } else {
                        setPasswordError("Required");
                      }
                    }}
                  >
                    submit
                  </button>
                )}
              </div>
            </div>
            <div
              className="personal-info__black-box"
              onClick={() => {
                setShowPopup(false);
              }}
            ></div>
          </div>
        )}

        {showInput.password ? (
          <h4
            className="personal-info__container__info__link"
            onClick={() => {
              setShowInput((prev) => {
                return {
                  ...prev,
                  password: false,
                };
              });
            }}
          >
            cancel
          </h4>
        ) : (
          <FontAwesomeIcon
            className="personal-info__container__info__icon"
            icon="pen"
            onClick={() => {
              setShowPopup(true);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Info;
