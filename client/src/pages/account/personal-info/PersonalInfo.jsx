import React, { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/app/store/useAppStore";
import usStates from "@/shared/data/states";
import "@/pages/account/personal-info/PersonalInfo.scss";
import Address from "@/pages/account/personal-info/components/Address";
import Info from "@/pages/account/personal-info/components/Info";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queries";
import { useTimedMessages } from "@/shared/hooks/useTimedMessages";
import MessageBanner from "@/shared/components/ui/MessageBanner";

function PersonalInfo() {
  // const history = useHistory();
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const updateProfile = useMutation({
    mutationFn: (data) =>
      apiRequest("/user/update", { method: "PUT", body: { data } }),
  });

  const {
    successMsgs,
    errorMsgs,
    showMsgs,
    setSuccessMsgs,
    setErrorMsgs,
    dismissMessages,
  } = useTimedMessages();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
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
  const watchedAddresses = useWatch({ control, name: "addresses" });

  const onSubmit = async (data) => {
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
          JSON.stringify(user.addresses) === JSON.stringify(watchedAddresses)
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

      try {
          await updateProfile.mutateAsync(data);
          setSuccessMsgs("updated successfully");
          setUser((prev) => {
            return {
              ...prev,
              ...data,
            };
          });
          setShowInput({ name: false, email: false, password: false });
          queryClient.invalidateQueries({ queryKey: queryKeys.auth });
          setLoading(false);
      } catch {
          setErrorMsgs("Something went Wrong. Please try again");
          setLoading(false);
      }
    }
  };

  return typeof user.name === "undefined" ? (
    <div className="personal-info__tool-tip-container">
      <title>My Account | Stand Out</title>
      <div className="personal-info__tool-tip-container__tool-tip">
        <p>please signin to continue</p>
        <button type="button" onClick={() => navigate("/signin")}>ok</button>
      </div>
      <div
        className="personal-info__tool-tip-container__black-box"
        onClick={() => {
          // history.goBack();
          navigate(-1);
        }}
      ></div>
    </div>
  ) : (
    <div className="personal-info">
      <title>My Account | Stand Out</title>
      <MessageBanner message={errorMsgs} type="error" visible={showMsgs} onDismiss={dismissMessages} />
      <MessageBanner message={successMsgs} type="success" visible={showMsgs} onDismiss={dismissMessages} />
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
            JSON.stringify(watchedAddresses)) && (
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
