import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MessageBanner({ message, type, visible, onDismiss }) {
  if (!message) return null;

  return (
    <div
      className={visible ? "msg msg--visible" : "msg"}
      role={type === "error" ? "alert" : "status"}
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss message"
        style={{ all: "unset", cursor: "pointer" }}
      >
        <FontAwesomeIcon
          icon={["far", type === "error" ? "times-circle" : "check-circle"]}
          className="icon"
        />
      </button>
      <p>{message}</p>
    </div>
  );
}
