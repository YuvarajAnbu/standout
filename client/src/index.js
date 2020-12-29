import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import ErrorBoundary from "./ErrorBoundary";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
const App = lazy(() => import("./App"));

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        }
      >
        <App />{" "}
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
