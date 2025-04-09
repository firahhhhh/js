export default class GameOver extends Phaser.Scene {
    constructor() {
      super({ key: 'gameover' });
    }
  
    preload() {
      // Load the game over image
      this.load.image('gameover', 'assets/gameover.png');
      // Load the game over sound
      this.load.audio('gameOverSound', 'assets/gameOverSound.mp3');
    }
  
    create() {
      // Display the game over image
      const bg = this.add.image(0, 0, 'gameover').setOrigin(0, 0);
      bg.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
  
      // Play the game over sound
      this.sound.play('gameOverSound');
  
      // Restart the game on SPACE key press
      this.input.keyboard.once('keydown-ENTER', () => {
        this.scene.start('mainhall');
      });
  
      // Optionally, handle other key inputs for different scenes
      [1, 2, 3, 4, 5].forEach(n => {
        this.input.keyboard.once(`keydown-${n}`, () => {
          const levelMap = {
            1: 'mainhall',
            2: 'kitchen',
            3: 'mainhall2',
            4: 'escape',
          
          };
          this.scene.start(levelMap[n]);
        });
      });
    }
  }
  