import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.esm.js';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'gameover' });
  }

  preload() {
    this.load.image('gameOverBackground', 'assets/gameOverBackground.png');
    this.load.audio('gameOverMusic', 'assets/gameOverMusic.mp3');
  }

  create() {
    // Background and music setup
    this.add.image(400, 300, 'gameOverBackground');
    this.sound.play('gameOverMusic', { loop: true });

    // Display "Game Over" text
    this.add.text(250, 200, 'Game Over', {
      fontSize: '48px',
      fill: '#ff0000'
    });

    // Instructions for restarting the game
    this.add.text(250, 250, 'Press ENTER to Retry', {
      fontSize: '24px',
      fill: '#ffffff'
    });

    // Listen for ENTER key to restart the game
    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('mainhall', { playerPos: { x: 150, y: 570 } });
    });
  }

  update() {
    // Any updates can go here if needed
  }
}

  