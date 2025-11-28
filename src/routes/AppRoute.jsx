import { Routes, Route } from "react-router-dom";

import GamePage from "../view/gamePage";
import Home from "../view/Home";
import Score from "../view/Score";

export default function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/score" element={<Score />} />
    </Routes>
  );
}
