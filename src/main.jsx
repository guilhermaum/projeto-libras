import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import GamePage from "./view/gamePage";
import Teste from "./teste";

createRoot(document.getElementById("root")).render(
  <div>
    <GamePage />
  </div>
);
