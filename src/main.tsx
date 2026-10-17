import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TipProvider } from "@poiesis/library/tip.js";
import "virtual:poiesis-tokens.css";
import "./gallery.css";
import { App } from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TipProvider>
      <App />
    </TipProvider>
  </StrictMode>,
);
