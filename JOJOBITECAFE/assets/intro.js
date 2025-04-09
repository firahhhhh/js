// Intro.js

export default class intro extends Phaser.Scene {
  constructor() {
      super({ key: 'intro' });
  }

  preload() {
      // JOJOBITECAFE/scenes/Intro.js
preload() ;{
  this.load.image("intro", "../assets/intro.png"); // Go UP one folder from "scenes"

      this.load.audio("click", "../assets/click.mp3");
  }
}
  create() {
      this.add.image(0, 0, "intro").setOrigin(0, 0);
      const enterKey = this.input.keyboard.addKey('ENTER');
      
      enterKey.on('down', () => {
          this.sound.play("click");
          this.scene.start('instructions');
      });
  }
}







