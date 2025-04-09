// game.js

// Import your scenes
import Intro from './scenes/Intro.js';
import Instructions from './scenes/Instructions.js'; // Make sure you have the instructions scene file

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: [Intro, Instructions],  // Add the Intro scene first
};

// Initialize the game
const game = new Phaser.Game(config);







