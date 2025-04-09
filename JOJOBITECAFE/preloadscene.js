// preloadScene.js
import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.esm.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() { super({ key: 'preloadScene' }); }
  preload() {
    this.load.image('introBg','assets/intro.png');
    this.load.audio('bgMusic','assets/bgMusic.mp3');
    this.load.audio('click','assets/click.mp3');
  }
  create() {
    this.add.image(0,0,'introBg').setOrigin(0);
    this.sound.play('bgMusic',{ loop:true, volume:0.5 });
    this.sound.play('click');
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('intro', { playerPos:{ x:150, y:276 } });
    });
  }
}

