import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";
import { queryClient } from "./api/queryClient";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
