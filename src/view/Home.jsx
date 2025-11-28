import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  function handePlay() {
    navigate("/game");
  }

  // ir renderinzando as letrinha bunitin
  const renderAnimatedText = (text) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="animated-letter"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f] flex">
      {/* Tela vermelha */}
      <div className="w-full h-screen bg-[#f0554f] relative flex flex-col items-center justify-center p-4">
        <div className="relative flex flex-col items-center justify-center -mt-8 z-100">
          {/* Imagem do personagem */}
          {/*<img
            src={characterImage}
            alt="personagem"
            className="w-88 absolute -top-37 left-[calc(50%+75px)] -translate-x-1/2 z-0 drop-shadow-xl"
          />*}

          {/* TÍTULO: DUO */}
          <h1 className="text-[173px] font-chewy text-white duolibras-stroke leading-[0.8] relative z-10">
            {renderAnimatedText("DUO")}
          </h1>

          {/* TÍTULO: LIBRAS */}
          <h1 className="text-[173px] font-chewy text-white duolibras-stroke leading-[0.8] relative z-10 mb-12">
            {renderAnimatedText("LIBRAS")}
          </h1>
        </div>

        {/* Subtítulo */}
        <p
          className="text-3xl font-chewy text-black uppercase fade-in-up-animation"
          style={{ animationDelay: "0.9s" }}
        >
          APRENDA DE FORMA DIVERTIDA
        </p>

        {/* Botão */}
        <button
          onClick={handePlay}
          className="mt-8 bg-[#004AAC] text-white text-[28px] font-semibold rounded-full px-12 py-3 shadow-lg hover:scale-105 transition-transform fade-in-up-animation active:scale-95 cursor-pointer"
          style={{ animationDelay: "1.1s" }}
        >
          JOGAR
        </button>

        {/* Rodapé */}
        <p
          className="absolute bottom-6 w-full text-center text-[18px] font-semibold text-white/90 fade-in-up-animation"
          style={{ animationDelay: "1.3s" }}
        >
          Luís Guilherme - Maria Eduarda - Victor Oliveira - Victor Hugo -
          Wellison de Oliveira
        </p>
      </div>
    </div>
  );
}
