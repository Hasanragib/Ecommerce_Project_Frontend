import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // 👈 Import Router here
import App from "./App.jsx";
import { AppProvider } from "./contexts/AppContext.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
  </React.StrictMode>,
);
