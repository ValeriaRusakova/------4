// main.jsx - the starting point of the React app.
// It finds <div id="root"> in index.html and draws <App /> inside it.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* BrowserRouter lets us switch pages without reloading (SPA) */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
