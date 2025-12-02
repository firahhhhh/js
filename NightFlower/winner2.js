class winner2 extends Phaser.Scene {

    constructor() {
        super({ key: 'winner2' });
    }

    preload() {
        this.load.image("winner2IMG", "assets/winner2.png");

        // ⭐ ADD YOUR WINNER SOUND HERE
        this.load.audio("winnerSound", "assets/winner.mp3");
    }

    create() {

        console.log('*** winner2 scene');

        // Display image
        this.add.image(320, 320, 'winner2IMG').setOrigin(0.5, 0.5);

        // ⭐ PLAY THE WINNER SOUND
        this.winMusic = this.sound.add("winnerSound", { volume: 0.8 });
        this.winMusic.play();

        // SPACE to return to main1
        let spaceDown = this.input.keyboard.addKey('SPACE');

        spaceDown.on('down', function () {
            console.log('Jump to main1');

            // ⭐ STOP MUSIC BEFORE LEAVING
            if (this.winMusic) this.winMusic.stop();

            this.scene.start('main1');
        }, this);
    }
}

