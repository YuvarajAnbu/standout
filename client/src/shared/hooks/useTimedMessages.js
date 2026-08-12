import { useCallback, useEffect, useState } from "react";

export function useTimedMessages(duration = 3000) {
  const [successMsgs, setSuccessMsgsState] = useState("");
  const [errorMsgs, setErrorMsgsState] = useState("");
  const [showMsgs, setShowMsgs] = useState(false);

  const setSuccessMsgs = useCallback((message) => {
    setErrorMsgsState("");
    setSuccessMsgsState(message);
  }, []);

  const setErrorMsgs = useCallback((message) => {
    setSuccessMsgsState("");
    setErrorMsgsState(message);
  }, []);

  const dismissMessages = useCallback(() => {
    setShowMsgs(false);
    setSuccessMsgsState("");
    setErrorMsgsState("");
  }, []);

  useEffect(() => {
    if (!successMsgs && !errorMsgs) return undefined;

    const animationFrame = requestAnimationFrame(() => setShowMsgs(true));
    const hideTimer = setTimeout(() => setShowMsgs(false), duration);
    const clearTimer = setTimeout(dismissMessages, duration + 400);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
    };
  }, [dismissMessages, duration, errorMsgs, successMsgs]);

  return {
    successMsgs,
    errorMsgs,
    showMsgs,
    setSuccessMsgs,
    setErrorMsgs,
    dismissMessages,
  };
}
