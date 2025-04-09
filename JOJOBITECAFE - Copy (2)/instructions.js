export default class InstructionsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InstructionsScene' }); // Scene key must match exactly
  }

  preload() {
    // Load instructions background image
    this.load.image('instructionsImg', 'assets/instructions.png');
  }

  create() {
    // Display instructions image
    this.add.image(400, 300, 'instructionsImg').setOrigin(0.5);
    const clickSound = this.sound.add('click', { volume: 0.8 });
    
    // Add ENTER key listener (same as intro.js)
    this.input.keyboard.once('keydown-ENTER', () => {
      clickSound.play();
      // Transition to MainHall scene
      // this.scene.stop('instructions'); 
      this.scene.start('MainHall'); 

    });
  }
}
// 8) Setup keyboard input
// var cursors = this.input.keyboard.createCursorKeys();