export default class winner extends Phaser.Scene {
    constructor() {
      super({ key: 'winner' });
    }
  
    preload() {
      // Load the game over image
      this.load.image('winner', 'assets/winner.png');
      // Load the game over sound
      this.load.audio('winnerSound', 'assets/winnerSound.mp3');
    }
  
    create() {
      // Display the game over image
      const bg = this.add.image(0, 0, 'winner').setOrigin(0, 0);
      bg.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
  
      // Play the game over sound
      this.sound.play('winnerSound');
  
      // Restart the game on SPACE key press
      this.input.keyboard.once('keydown-ENTER', () => {
        this.scene.start('intro');
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