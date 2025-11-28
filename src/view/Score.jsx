import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import useNavigation from "../hooks/useNavigation";

export default function Score() {
  const { state } = useLocation();
  const pontuacao = state?.pontuacao ?? 0;
  const tempo = state?.tempo ?? 0;
  const { goHome } = useNavigation();

  // Estado para ajustar o tamanho da tela do confete
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#e74a46] flex flex-col items-center justify-center px-4 font-chewy">
      {/*  CONFETES  */}
      <Confetti width={windowSize.width} height={windowSize.height} />

      {/* TITULO */}
      <div className="mt-10">
        <h1 className="text-[50px] text-center text-black leading-tight">
          PARABÉNS, VOCÊ CHEGOU <br /> AO FINAL DO JOGO!
        </h1>
      </div>

      {/* PONTUAÇÃO */}
      <h2
        className="
          text-[120px] 
          text-white 
          font-bold 
          text-center 
          mt-1 
          drop-shadow-[6px_6px_0px_#000]
        "
      >
        PONTUAÇÃO
      </h2>

      {/* NÚMERO */}
      <div className="text-[160px] text-black leading-none mb-4">
        {pontuacao}
      </div>

      {/* TEMPO */}
      <div className="text-[52px] text-black mb-4">
        TEMPO: {String(Math.floor(tempo / 60)).padStart(2, "0")}:
        {String(tempo % 60).padStart(2, "0")}
      </div>

      {/* BOTÃO */}
      <div className="mb-4">
        <button
          onClick={() => goHome()}
          className="
            bg-[#3fabb4] 
            text-[#e6d8d8] 
            text-[28px] 
            px-10 py-4 
            rounded-full
            transition-all
            duration-200
            hover:bg-[#369aa2]
            hover:scale-105
            active:scale-95
            cursor-pointer
          "
        >
          JOGAR NOVAMENTE
        </button>
      </div>
    </div>
  );
}
