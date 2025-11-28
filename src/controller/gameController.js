import GameModel from "../model/signalModel";

export default class GameController {
  constructor() {
    this.model = new GameModel();
    this.signals = [];
    this.usedCorrectWords = new Set();
    this.currentIndex = 0;
    this.rounds = [];
    this.wrongRounds = [];
    this.reviewMode = false;
    this.score = 0;
  }

  async loadSignals() {
    if (this.signals.length === 0) {
      this.signals = await this.model.getAllSignals();
    }
  }

  async initGame() {
    await this.loadSignals();

    this.usedCorrectWords.clear();
    this.rounds = [];
    this.currentIndex = 0;
    this.score = 0;

    for (let i = 0; i < this.signals.length; i++) {
      this.rounds.push(this._createRoundInternal());
    }

    return this.rounds;
  }

  _createRoundInternal() {
    const availableCorrects = this.signals.filter(
      (s) => !this.usedCorrectWords.has(s.palavra)
    );

    if (availableCorrects.length === 0) {
      throw new Error("Não há mais palavras");
    }

    const correctItem =
      availableCorrects[Math.floor(Math.random() * availableCorrects.length)];

    this.usedCorrectWords.add(correctItem.palavra);

    const incorrect = this.signals
      .filter((s) => s.palavra !== correctItem.palavra)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const option = [correctItem, ...incorrect]
      .map((item) => ({
        id: item.palavra,
        palavra: item.palavra,
      }))
      .sort(() => Math.random() - 0.5);

    return {
      correct: {
        id: correctItem.palavra,
        palavra: correctItem.palavra,
        video: correctItem.video,
      },
      option,
    };
  }

  getCurrentRound() {
    return this.rounds[this.currentIndex] || null;
  }

  nextRound() {
    if (this.currentIndex + 1 < this.rounds.length) {
      this.currentIndex++;
      return this.getCurrentRound();
    }

    if (this.wrongRounds.length > 0) {
      this.rounds = [...this.rounds, ...this.wrongRounds];

      this.wrongRounds = [];

      this.currentIndex++;
      return this.getCurrentRound();
    }

    return null;
  }

  validateAnswer(optionId) {
    const correctId = this.getCurrentRound().correct.id;

    if (correctId === optionId) {
      this.score++;
      return correctId;
    }

    this.wrongRounds.push(this.getCurrentRound());
    console.log(this.wrongRounds);
    return null;
  }

  getScore() {
    return this.score;
  }
}
