import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// Self-hosted so text isn't blocked on a third-party stylesheet
import "@fontsource-variable/inter";
import "@fontsource-variable/sora";
import "./styles.css";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Production pages arrive pre-rendered (scripts/prerender.mjs), so React attaches to the
// existing HTML. The dev server sends an empty #root, so render from scratch there.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
