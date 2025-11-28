// src/hooks/useNavigation.js
import { useNavigate } from "react-router-dom";

export default function useNavigation() {
  const navigate = useNavigate();

  return {
    goHome: () => navigate("/"),
    goGame: () => navigate("/game"),
    goScore: ({ pontuacao, tempo }) =>
      navigate("/score", { state: { pontuacao, tempo } }),
  };
}
