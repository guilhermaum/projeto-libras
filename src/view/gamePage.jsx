import { useEffect, useState } from "react";
import { getRandomSignal } from "../services/getRandomSignal";
import { signalController } from "../controller/gameController";

export default function GamePage() {
  const [round, setRound] = useState(null);

  async function loadRound() {
    const correctSignal = await getRandomSignal();

    const newRound = await signalController.builRound(correctSignal);

    setRound(newRound);
  }

  useEffect(() => {
    loadRound();
  }, []);

  // Paleta de cores pré-definida
  const COLOR_SET = [
    "#F04C47",
    "#004AAC",
    "#70853C",
    "#FF65C5",
    "#FEBC5A",
    "#FFDE59",
    "#B5DCDB",
  ];

  function shuffleColors() {
    const shuffled = [...COLOR_SET].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }

  const [colors] = useState(() => shuffleColors());

  if (!round) return <p>Carregando...</p>;

  return (
    <div className="w-screen h-screen grid grid-cols-2 grid-rows-2 relative select-none">
      {/* 🔹 Quatro áreas clicáveis */}
      {round.options.map((option, index) => (
        <div
          key={option.id}
          onClick={() => {
            if (option.id === round.correct.id) {
              alert("✔ ACERTOU!");
            } else {
              alert("❌ ERROU!");
            }
            loadRound();
          }}
          className="w-full h-full flex items-center justify-center 
                   relative cursor-pointer 
                   after:absolute after:bottom-0 after:left-0 
                   after:w-full after:h-6 after:bg-white
                   after:scale-x-0 after:transition-transform after:duration-500 
                   hover:after:scale-x-100"
          style={{ backgroundColor: colors[index] }}
        >
          <span className="font-wonderful text-5xl text-white drop-shadow-lg">
            {option.palavra}
          </span>
        </div>
      ))}

      {/* 🔹 Vídeo no centro */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-[350px] h-[350px] rounded-2xl shadow-2xl overflow-hidden 
                      bg-black flex items-center justify-center border-4 border-white/50"
      >
        <video
          src={round.correct.video}
          autoPlay
          loop
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
