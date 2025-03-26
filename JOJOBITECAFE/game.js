// game.js
import MainHall from './mainhall.js';
import Kitchen from './kitchen.js';
import MainHall2 from './mainhall2.js';

const config = {
  type: Phaser.AUTO,
  width: 640,  // or 32*20
  height: 640, // or 32*20
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#555555',
  pixelArt: true,
  scene: [MainHall, Kitchen, MainHall2]
};

new Phaser.Game(config);


