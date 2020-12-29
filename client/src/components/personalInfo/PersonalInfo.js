import React, { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext, StateContext } from "../../App";
import "./PersonalInfo.css";
import Address from "./subComponents/Address";
import Info from "./subComponents/Info";
import { Link, useHistory } from "react-router-dom";

function PersonalInfo() {
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);
  const usStates = useContext(StateContext);

  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");
  const [showMsgs, setShowMsgs] = useState(false);

  const [showInput, setShowInput] = useState({
    name: false,
    email: false,
    password: false,
  });

  const [showPopup, setShowPopup] = useState(false);

  const [hidePassword, setHidePassword] = useState(true);

  const [wrongpassword, setWrongpassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [loadingPassword, setLoadingPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    document.title = "My Account | Stand Out";
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

  const {
    register,
    handleSubmit,
    errors,
    watch,
    control,
    setValue,
    trigger,
  } = useForm({
    defaultValues: { addresses: user.addresses },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const onSubmit = (data) => {
    if (user.email === "xander21here@gmail.com") {
      setErrorMsgs(
        "you cannot change owner info, but you can change your account info"
      );
      setLoading(false);
    } else {
      setLoading(true);
      if (typeof data.addresses === "undefined") {
        data.addresses = [];
      } else {
        if (
          JSON.stringify(user.addresses) === JSON.stringify(watch("addresses"))
        ) {
          delete data.addresses;
        } else {
          data.addresses.forEach((el) => {
            if (el._id === "") {
              delete el._id;
            }
          });
        }
      }

      axios
        .put("/user/update", { data })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error();
          }
          setSuccessMsgs("updated successfully");
          setUser((prev) => {
            return {
              ...prev,
              ...data,
            };
          });
          setShowInput({ name: false, email: false, password: false });
          setLoading(false);
        })
        .catch((err) => {
          setErrorMsgs("Something went Wrong. Please try again");
          setLoading(false);
        });
    }
  };

  return typeof user.name === "undefined" ? (
    <div className="personal-info__tool-tip-container">
      <div className="personal-info__tool-tip-container__tool-tip">
        <p>please signin to continue</p>
        <Link to="/signin">
          <button>ok</button>
        </Link>
      </div>
      <div
        className="personal-info__tool-tip-container__black-box"
        onClick={() => {
          history.goBack();
        }}
      ></div>
    </div>
  ) : (
    <div className="personal-info">
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
      <h1>Personal info</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Info
          {...{
            showInput,
            register,
            watch,
            user,
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
          }}
        />
        <div className="personal-info__container personal-info__container--address">
          <h2>address</h2>
          {fields.map((field, index) => (
            <Address
              key={field.id}
              userAddresses={user.addresses}
              usStates={usStates}
              {...{
                field,
                index,
                errors,
                control,
                register,
                watch,
                setValue,
                trigger,
                remove,
              }}
            />
          ))}

          <div className="personal-info__container__info__add-address">
            <button
              type="button"
              onClick={() => {
                append({
                  region: "AL",
                });
              }}
            >
              add address
            </button>
          </div>
        </div>
        {(Object.values(showInput).includes(true) ||
          JSON.stringify(user.addresses) !==
            JSON.stringify(watch("addresses"))) && (
          <div>
            {loading ? (
              <button
                disabled
                type="button"
                className="personal-info__submit personal-info__submit--loading"
              >
                <div className="personal-info__submit__loading"></div>
              </button>
            ) : (
              <button type="submit" className="personal-info__submit">
                upload changes
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default PersonalInfo;
