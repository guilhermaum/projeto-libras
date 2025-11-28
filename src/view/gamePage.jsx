import { useEffect, useRef, useState } from "react";
import GameController from "../controller/gameController";
import { useTimer } from "../hooks/timer";
import useNavigation from "../hooks/useNavigation";
import thumbsUp from "../assets/images/thumbs-up.png";
import thumbsDown from "../assets/images/thumbs-down.png";

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
  const [score, setScore] = useState(0);
  const time = useTimer();
  const [isBuildingRound, setIsBuildingRound] = useState(true);
  const { goScore } = useNavigation();

  const [feedbackImg, setFeedbackImg] = useState(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const feedbackTimeoutsRef = useRef([]);

  const FEEDBACK_ENTER_MS = 180;
  const FEEDBACK_VISIBLE_MS = 380;
  const FEEDBACK_EXIT_MS = 180;
  const FEEDBACK_TOTAL_MS =
    FEEDBACK_ENTER_MS + FEEDBACK_VISIBLE_MS + FEEDBACK_EXIT_MS;

  function playFeedback(imgSrc, cb) {
    feedbackTimeoutsRef.current.forEach((t) => clearTimeout(t));
    feedbackTimeoutsRef.current = [];

    // garante que sempre começará "fora da tela"
    setFeedbackVisible(false);

    // define nova imagem
    setFeedbackImg(imgSrc);

    // próximo frame → anima entrada
    requestAnimationFrame(() => setFeedbackVisible(true));

    // saída
    const tExit = setTimeout(() => {
      setFeedbackVisible(false);
    }, FEEDBACK_ENTER_MS + FEEDBACK_VISIBLE_MS);

    // fim total
    const tEnd = setTimeout(() => {
      setFeedbackImg(null);
      if (typeof cb === "function") cb();
    }, FEEDBACK_TOTAL_MS);

    feedbackTimeoutsRef.current.push(tExit, tEnd);
  }

  // limpar timeouts no unmount (adicione ao useEffect que já existe ou crie um)
  useEffect(() => {
    return () => {
      feedbackTimeoutsRef.current.forEach((t) => clearTimeout(t));
      feedbackTimeoutsRef.current = [];
    };
  }, []);

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

    queueMicrotask(() => setIsBuildingRound(true));

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

            if (index === newWords.length - 1) {
              setTimeout(() => setIsBuildingRound(false), 150);
            }
            return update;
          });
        }, 250);
      }, index * 500);
    });
  }, [round]);

  function handleAnswer(optionId) {
    if (!controller) return;

    const isCorrect = controller.validateAnswer(optionId);
    const imgFor = isCorrect ? thumbsUp : thumbsDown;

    if (isCorrect) {
      const newScore = controller.getScore();
      setScore(newScore);
    }

    const advanceAfterFeedback = () => {
      const next = controller.nextRound();

      if (!next) {
        return goScore({
          pontuacao: controller.getScore(),
          tempo: time,
        });
      }

      setRound(next);
    };

    playFeedback(imgFor, advanceAfterFeedback);
  }

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#f0554f] flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-screen h-screen bg-red-700 flex items-center justify-center">
        <p className="text-white text-3xl font-bold">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-red-500">
      <div className="absolute top-8 right-8 z-50 text-whit text-7xl font-nabanar text-outline">
        {score}
        <div className="text-4xl mt-2 relative right-4">
          {String(Math.floor(time / 60)).padStart(2, "0")}:
          {String(time % 60).padStart(2, "0")}
        </div>
      </div>

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
            hover:after:scale-x-100
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
        <img
          src={feedbackImg}
          alt="feedback"
          className={`
  absolute top-1/2 z-50 w-[220px] h-[220px] object-contain
  -translate-y-1/2 transition-transform
  duration-300 ease-[cubic-bezier(.22,.61,.36,1)]
  ${
    feedbackVisible
      ? "translate-x-[-10%] opacity-100"
      : "translate-x-[-150%] opacity-0"
  }
`}
        />

        <div
          className="
    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-outline
    w-[350px] h-[350px] rounded-2xl shadow-2xl overflow-hidden 
    bg-black flex items-center justify-center border-4 border-white/50
  "
        >
          {/* vídeo sempre presente por trás */}
          <video
            ref={videoRef}
            src={round.correct.video}
            autoPlay
            loop
            muted
            // aplica blur/dimming/scale enquanto isBuildingRound for true
            className={`
      w-full h-full object-cover transition-all duration-500 ease-out
      ${
        isBuildingRound
          ? "filter blur-sm scale-95 brightness-75"
          : "filter blur-0 scale-100 brightness-100"
      }
    `}
          />

          {/* overlay com blur/backdrop + spinner (visível somente enquanto isBuildingRound) */}
          <div
            className={`
      absolute inset-0 flex items-center justify-center transition-opacity duration-500
      ${
        isBuildingRound
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }
    `}
          >
            {/* fundo semi-transparente + efeito de backdrop blur (se quiser blur extra) */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            {/* conteúdo do loading */}
            <div className="relative z-10 flex flex-col items-center justify-center text-white">
              <div className="w-16 h-16 border-4 border-white/40 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
