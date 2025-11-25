import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import GamePage from "./view/gamePage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div>
      <GamePage />
    </div>
  </StrictMode>
);
