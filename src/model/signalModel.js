import { supabase } from "../services/supabase";

export default class GameModel {
  async getAllSignals() {
    const { data, error } = await supabase.from("videos-libras").select("*");

    if (error) throw error;
    return data;
  }
}
