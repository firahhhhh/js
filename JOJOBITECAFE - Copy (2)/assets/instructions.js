import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.esm.js';

export default class Instructions extends Phaser.Scene {
  constructor() { super({ key: 'instructions' }); }

  init(data) {
    this.playerPos = data.playerPos;
  }

  preload() {
    this.load.image('instructionsImg', 'assets/instructions.png');
  }

  create() {
    this.add.image(400, 300, 'instructionsImg').setOrigin(0.5);

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('mainhall', { playerPos: this.playerPos });
    });
  }
}



