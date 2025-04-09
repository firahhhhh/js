// game.js
import IntroScene from './intro.js';
import InstructionsScene from './instructions.js';
import MainHall from './mainhall.js';
import Kitchen from './kitchen.js';
import MainHall2 from './mainhall2.js';
import Escape from './escape.js';
import GameOver from './gameover.js';
import winner from './winner.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: [
    IntroScene,
    InstructionsScene,
    MainHall,
    Kitchen,
    MainHall2,
    Escape,
    GameOver,
    winner
  ]
};

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
});
