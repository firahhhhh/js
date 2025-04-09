// scenes/Intro.js
import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.esm.js';

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' });
  }

  preload() {
    this.load.image('introImg', 'assets/intro.png');
    this.load.audio("music","assets/music.mp3")
    this.load.audio('click',  'assets/click.mp3');
  }

  create() {
    console.log('IntroScene created');

    this.add.image(400, 300, 'introImg').setOrigin(0.5);

    // Play a little sound when they press ENTER
    this.input.keyboard.once('keydown-ENTER', () => {
      this.sound.play('click', { volume: 0.8 });
      this.sound.play('music', { volume: 0.2 });
      this.scene.start('InstructionsScene');
    });
  }
}





