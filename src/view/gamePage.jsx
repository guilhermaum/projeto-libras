import { useEffect, useRef, useState } from "react";
import GameController from "../controller/gameController";

export default function GamePage() {
  const [controller, setController] = useState(null);
  const [round, setRound] = useState(null);
  const [colors, setColors] = useState([]);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const optionRefs = useRef([]);
  const videoRef = useRef(null);
  const [animateWords, setAnimateWords] = useState([
    false,
    false,
    false,
    false,
  ]);

  const COLOR_SET = [
    "#F04C47",
    "#004AAC",
    "#70853C",
    "#FF65C5",
    "#FEBC5A",
    "#FFDE59",
    "#B5DCDB",
    "#8CC6E8",
    "#C28A29",
    "#A8B4BD",
    "#973f7c",
  ];

  function shuffleColors() {
    return [...COLOR_SET].sort(() => Math.random() - 0.5).slice(0, 4);
  }

  function shuffleColorsAvoidRepeat(prev) {
    let newColors = shuffleColors();
    while (JSON.stringify(prev) === JSON.stringify(newColors)) {
      newColors = shuffleColors();
    }
    return newColors;
  }

  useEffect(() => {
    async function startGame() {
      try {
        const c = new GameController();
        await c.initGame();

        const firstRound = c.getCurrentRound();

        setController(c);
        setRound(c.getCurrentRound());
        setWords(firstRound.option.map((o) => o.palavra));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    startGame();
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => {});

    if (!round) return;

    const newColors = shuffleColorsAvoidRepeat();
    const newWords = round.option.map((o) => o.palavra);

    newColors.forEach((color, index) => {
      setTimeout(() => {
        setColors((prev) => {
          const update = [...prev];
          update[index] = color;
          return update;
        });

        setTimeout(() => {
          setAnimateWords((prev) => {
            const update = [...prev];
            update[index] = false;
            return update;
          });

          requestAnimationFrame(() => {
            setAnimateWords((prev) => {
              const update = [...prev];
              update[index] = true;
              return update;
            });
          });

          setWords((prev) => {
            const update = [...prev];
            update[index] = newWords[index];
            return update;
          });
        }, 250);
      }, index * 500);
    });
  }, [round]);

  function handleAnswer(optionId) {
    if (!controller) return;

    const isCorrect = controller.validateAnswer(optionId);

    if (isCorrect) {
      console.log("ok");
    } else {
      alert("❌ Errou!");
    }

    const next = controller.nextRound();

    if (!next) {
      alert("Fim do jogo!");
      return;
    }

    setRound(next);
  }

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">Erro: {error}</p>;
  if (!round) return <p>Carregando round...</p>;

  return (
    <div className="w-screen h-screen grid grid-cols-2 grid-rows-2 relative select-none overflow-hidden">
      {round.option.map((option, index) => (
        <div
          key={option.id}
          ref={(el) => (optionRefs.current[index] = el)}
          onClick={() => handleAnswer(option.id)}
          className="
            w-full h-full flex items-center justify-center 
            relative cursor-pointer transition-colors duration-700
            after:absolute after:bottom-0 after:left-0 
            after:w-full after:h-6 after:bg-white
            after:scale-x-0 after:transition-transform after:duration-500 
            hover:after:scale-x-100 after:d-4
          "
          style={{ backgroundColor: colors[index] }}
        >
          <span
            key={words[index]}
            className={`font-wonderful text-5xl text-white drop-shadow-lg word-enter ${
              animateWords[index] ? "word-enter-active" : ""
            }
  `}
          >
            {words[index]}
          </span>
        </div>
      ))}

      <div
        className="
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-[350px] h-[350px] rounded-2xl shadow-2xl overflow-hidden 
          bg-black flex items-center justify-center border-4 border-white/50
        "
      >
        <video
          ref={videoRef}
          src={round.correct.video}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
