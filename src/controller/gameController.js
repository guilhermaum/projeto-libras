import { supabase } from "../services/supabase";
import { Signal } from "../model/signalModel";

class SignalController {
  async builRound(correctSignal) {
    if (!correctSignal) return null;

    const wrongOptions = await this.getWrongOptions(correctSignal.id, 3);

    const all = [correctSignal, ...wrongOptions];

    const options = this.shuffle(all);

    return {
      correct: correctSignal,
      options,
    };
  }

  async getWrongOptions(excludeId, limit = 3) {
    const { data, error } = await supabase
      .from("videos-libas")
      .select("*")
      .neq("id", excludeId)
      .limit(limit);

    if (error) {
      console.log("Erro ao buscar opções: ", error);
      return [];
    }

    return data.map((row) => new Signal(row));
  }

  shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
}

export const signalController = new SignalController();
