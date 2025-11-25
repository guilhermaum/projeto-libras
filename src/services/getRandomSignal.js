import { Signal } from "../model/signalModel";
import { supabase } from "./supabase";

export async function getRandomSignal() {
  const { data, error } = await supabase
    .from("videos-libras")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Erro ao buscar sinal:", error);
    return null;
  }

  return new Signal(data[0]);
}
