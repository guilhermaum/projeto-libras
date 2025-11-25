import { useEffect, useState } from "react";
import GameController from "./controller/gameController";
import GameModel from "./model/signalModel";

export default function Teste() {
  const [rounds, setRounds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function runAllRounds() {
      try {
        const model = new GameModel();
        const gameController = new GameController(model); // 👈 NOVA INSTÂNCIA AQUI
        const signals = await model.getAllSignals();

        console.log(`🔢 Total de sinais: ${signals.length}`);

        const results = [];

        for (let i = 0; i < signals.length; i++) {
          console.log(`\n▶ Rodada ${i + 1}`);

          const round = await gameController.createRound();

          console.log("Resultado:", round);

          results.push(round);
        }

        setRounds(results);
      } catch (err) {
        console.error("❌ Erro:", err);
        setError(err.message);
      }
    }

    runAllRounds();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Teste do GameController (Todas as Rodadas)
      </h1>

      {error && <p className="text-red-500 font-semibold">Erro: {error}</p>}

      {rounds.length === 0 && !error && <p>Carregando...</p>}

      {rounds.length > 0 && (
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg mt-4 overflow-auto max-h-[600px]">
          {JSON.stringify(rounds, null, 2)}
        </pre>
      )}
    </div>
  );
}
