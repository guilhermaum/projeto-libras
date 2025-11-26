import { useEffect, useState } from "react";
import GameModel from "../model/signalModel";
import GameController from "../controller/gameController";

export default function GamePage() {
  const [rounds, setRounds] = useState([]);
  const [round, setRound] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function setAllRounds() {
      try {
        const model = new GameModel();
        const gameController = new GameController(model);
        const signals = await model.getAllSignals();

        const results = [];

        for (let i = 0; i < signals.length; i++) {
          const round = await gameController.createRound();
          results.push(round);
        }

        setRounds(results);
        setRound(results[0]);
      } catch (err) {
        console.error("Erro:", err);
        setError(err.message);
      }
    }

    setAllRounds();
  }, []);

  function generateRound() {
    const index = rounds.indexOf(round);
    const next = index + 1;

    if (next < rounds.length) {
      setRound(rounds[next]);
    } else {
      alert("Acabou o jogo!");
    }
  }

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

  if (error) return <p>Erro: {error}</p>;
  if (!round) return <p>Carregando...</p>;

  return (
    <div className="w-screen h-screen grid grid-cols-2 grid-rows-2 relative select-none">
      {round.options.map((option, index) => (
        <div
          key={option.id}
          onClick={() => {
            if (option.id === round.correct.id) {
              alert("✔ ACERTOU!");
            } else {
              alert("❌ ERROU!");
            }
            generateRound();
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
