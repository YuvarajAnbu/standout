import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
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
          Something went wrong. please try again.{" "}
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
