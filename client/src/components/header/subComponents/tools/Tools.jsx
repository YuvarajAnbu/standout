import React, { useState } from "react";
import SearchTool from "./searchTool/SearchTool";
import UserTool from "./userTool/UserTool";
import CartTool from "./cartTool/CartTool";
import Hamburger from "./hamburger/Hamburger";
import { useMediaQuery } from "../../../../hooks/useMediaQuery";
import { useTimedMessages } from "../../../../hooks/useTimedMessages";
import MessageBanner from "../../../common/MessageBanner";
import { lockPageScroll, unlockPageScroll } from "../../../../utils/pageScroll";

function Tools({ setBlackBox }) {
  const windowWidth = useMediaQuery("(max-width: 1000px)") ? 1000 : 1001;

  const [clicked, setClicked] = useState("");

  const {
    successMsgs,
    errorMsgs,
    showMsgs,
    setSuccessMsgs,
    setErrorMsgs,
    dismissMessages,
  } = useTimedMessages();

  return (
    <div
      className="nav-bar__tools"
      onMouseEnter={lockPageScroll}
      onMouseLeave={() => {
        setTimeout(unlockPageScroll, 300);
      }}
    >
      <MessageBanner
        message={errorMsgs}
        type="error"
        visible={showMsgs}
        onDismiss={dismissMessages}
      />
      <MessageBanner
        message={successMsgs}
        type="success"
        visible={showMsgs}
        onDismiss={dismissMessages}
      />
      <SearchTool
        {...{
          clicked,
          setClicked,
          setBlackBox,
          windowWidth,
        }}
      />
      <UserTool
        {...{
          clicked,
          setClicked,
          setBlackBox,
          windowWidth,
          setSuccessMsgs,
          setErrorMsgs,
        }}
      />
      <CartTool
        {...{
          clicked,
          setClicked,
          setBlackBox,
          windowWidth,
        }}
      />
      <Hamburger
        {...{
          clicked,
          setClicked,
          setBlackBox,
          windowWidth,
        }}
      />
    </div>
  );
}

export default Tools;
