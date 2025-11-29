class lose extends Phaser.Scene {

    constructor() {
        super({ key: 'lose' });
    }

    preload() {

        // Background image (already in your code)
        this.load.image("loseIMG", "assets/lose.png");

        // 🔊 Add your lose sound effect here (put the correct file name)
        this.load.audio("laugh", "assets/laugh.mp3");
    }

    create() {

        console.log('*** lose scene');

        // 🎧 Play the lose sound once when entering scene
        this.sound.play("laugh", { volume: 0.6 });

        // Show Lose screen
        this.add.image(320, 320, 'loseIMG').setOrigin(0.5, 0.5);

        // Space key to go back
        let spaceDown = this.input.keyboard.addKey('SPACE');

        spaceDown.on('down', () => {
            console.log('Jump to main1');

            this.scene.start('main1');  
        });
    }
}



