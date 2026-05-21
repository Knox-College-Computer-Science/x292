import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <TooltipPrimitive.Provider>
        <App />
      </TooltipPrimitive.Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);
