//escape.js


import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.esm.js';

export default class escape extends Phaser.Scene {
  constructor() {
    super({ key: 'escape' });
  }

  preload() {
    this.load.image('escapeBackground', 'assets/escapeBackground.png');
    this.load.audio('escapeMusic', 'assets/escapeMusic.mp3');
  }

  create() {
    // Background and music setup
    this.add.image(400, 300, 'escapeBackground');
    this.sound.play('escapeMusic', { loop: true });

    // Text instructions for the player
    this.add.text(250, 200, 'Escape Successfully!', {
      fontSize: '32px',
      fill: '#ffffff'
    });

    this.add.text(250, 250, 'Press ENTER to return to Main Hall', {
      fontSize: '18px',
      fill: '#ffffff'
    });

    // Listen for the ENTER key to return to main hall
    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('mainhall', { playerPos: { x: 400, y: 300 } });
    });
  }

  update() {
    // Any updates can go here if needed
  }
}

