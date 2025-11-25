export default class GameController {
  constructor(model) {
    this.model = model;
    this.usedCorrectWords = new Set();
  }

  async createRound() {
    const allSignals = await this.model.getAllSignals();

    const availableCorrects = allSignals.filter(
      (item) => !this.usedCorrectWords.has(item.palavra)
    );

    if (availableCorrects.length == 0) {
      throw new Error("Não há mais palavras");
    }

    const correctItem =
      availableCorrects[Math.floor(Math.random() * availableCorrects.length)];

    this.usedCorrectWords.add(correctItem.palavra);

    const incorrectPool = allSignals.filter(
      (item) => item.palavra !== correctItem.palavra
    );

    const incorrectItem = incorrectPool
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = [
      correctItem.palavra,
      ...incorrectItem.map((item) => item.palavra),
    ].sort(() => Math.random() - 0.5);

    return {
      video: correctItem.video,
      palavra: correctItem.palavra,
      options,
    };
  }
}
