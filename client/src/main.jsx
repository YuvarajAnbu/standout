import React from "react";
import ReactDOM from "react-dom/client";
import "@/shared/styles/global.css";
import App from "@/app/App";
import AppProviders from "@/app/providers";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppProviders>
    <App />
  </AppProviders>,
);
