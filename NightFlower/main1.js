class main1 extends Phaser.Scene {
    constructor() {
        super({ key: 'main1' });
    }

    preload() {
        // images
        this.load.image("intro1IMG", "assets/intro1.png");

        // audio - make sure file is at assets/horrormusic.mp3 (no extra spaces)
        this.load.audio('horrormusic', 'assets/horrormusic.mp3');
    }

    create() {
        console.log('*** main1 scene');

        // Start or resume music: only create/play one global instance to avoid duplicates.
        // Ensure the sound is in cache before trying to add/play it.
        if (this.sound && this.cache.audio.exists('horrormusic')) {
            // If we already created a global music instance earlier, reuse it.
            if (window.music && window.music instanceof Phaser.Sound.BaseSound) {
                // If it exists but not playing, start it
                if (!window.music.isPlaying) {
                    window.music.play({ loop: true, volume: 0.3 });
                }
            } else {
                // Create a new global music sound and play it
                try {
                    window.music = this.sound.add('horrormusic', { loop: true, volume: 0.3 });
                    window.music.play();
                } catch (err) {
                    console.warn("Failed to start music:", err);
                }
            }
        } else {
            // In case audio isn't ready, do a safe fallback: try to play after a short delay
            this.time.delayedCall(200, () => {
                if (this.cache.audio.exists('horrormusic')) {
                    if (!window.music || !(window.music instanceof Phaser.Sound.BaseSound)) {
                        try {
                            window.music = this.sound.add('horrormusic', { loop: true, volume: 0.3 });
                            window.music.play();
                        } catch (err) {
                            console.warn("Failed to start music after delay:", err);
                        }
                    } else if (!window.music.isPlaying) {
                        window.music.play({ loop: true, volume: 0.3 });
                    }
                } else {
                    console.warn("Audio 'horrormusic' not found in cache. Check filename/path.");
                }
            });
        }

        // Show intro image
        this.add.image(320, 320, 'intro1IMG').setScale(1);

        // Space to go to next scene
        var spaceDown = this.input.keyboard.addKey('SPACE');

        spaceDown.on('down', function () {
            console.log('Jump to main3');
            // Do NOT stop the music here if you want it to keep playing across scenes
            // If you DO want it to stop, uncomment the next line:
            // if (window.music) window.music.stop();

            this.scene.start('main3');
        }, this);
    }
}


