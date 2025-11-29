class winner2 extends Phaser.Scene {

    constructor() {
        super({ key: 'winner2' });
    }

    preload() {
        this.load.image("winner2IMG", "assets/winner2.png");
    }

    create() {

        console.log('*** winner2 scene');

        // Display image
        this.add.image(320, 320, 'winner2IMG').setOrigin(0.5, 0.5);

        // Space to return to main1
        let spaceDown = this.input.keyboard.addKey('SPACE');

        spaceDown.on('down', function () {
            console.log('Jump to main1');
            this.scene.start('main1');   // ✅ FIXED
        }, this);
    }
}
