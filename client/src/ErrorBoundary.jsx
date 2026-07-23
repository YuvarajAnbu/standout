import React from "react";
import { reportError } from "./utils/logger";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    reportError(error, { componentStack: errorInfo.componentStack });
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          style={{
            margin: "auto",
            marginTop: "50px",
            width: "100vw",
            textAlign: "center",
            padding: "20px",
            textTransform: "capitalize",
          }}
        >
          Something went wrong. Please try again.{" "}
          <button
            style={{
              display: "block",
              margin: "auto",
              marginTop: "20px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              padding: "10px 20px",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
            onClick={() => {
              window.location.reload();
            }}
          >
            reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
