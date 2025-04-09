// mainhall2.js
export default class mainhall2 extends Phaser.Scene {
  constructor() {
    super({ key: 'mainhall2' }); // Ensure key matches what you call in scene.start()
    this.player = null;
    this.cursors = null;
  }

  init(data) {
    // Retrieve the player from Kitchen
    this.player = data.player || null;
  }

  preload() {
    // Load the horror map tilemap (exported as JSON)
    this.load.tilemapTiledJSON('mainhall2', 'assets/mainhall2.tmj');

    // Load tileset images (names must match Tiled)
    this.load.image('pixel-cyberpunk-interiorimg', 'assets/pixel-cyberpunk-interior.png');
    this.load.image('pipoyaimg', 'assets/pipoya.png');
    this.load.image('free_overviewimg', 'assets/free_overview.png');

    // Load the player sprite if needed
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    const map = this.make.tilemap({ key: 'mainhall2' });
    const tileset1 = map.addTilesetImage('pixel-cyberpunk-interior', 'pixel-cyberpunk-interiorimg');
    const tileset2 = map.addTilesetImage('pipoya', 'pipoyaimg');
    const tileset3 = map.addTilesetImage('free_overview', 'free_overview.png');
    const tilesArray = [tileset1, tileset2, tileset3];

    // Create layers (adjust names as needed)
    map.createLayer('floor', tilesArray, 0, 0);
    map.createLayer('table', tilesArray, 0, 0);
    map.createLayer('chashier', tilesArray, 0, 0);
    map.createLayer('food', tilesArray, 0, 0);
    // Add any additional horror effects or layers here

    // Position the player. If passed from Kitchen, use it; otherwise create a new one.
    if (this.player) {
      this.physics.world.enable(this.player);
      this.add.existing(this.player);
      // Optionally adjust player position in the horror map:
      this.player.x = 100;
      this.player.y = 100;
    } else {
      this.player = this.physics.add.sprite(100, 100, 'player');
    }
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(100);

    // (Re)create animations if needed:
    this.anims.create({
      key: 'player-left',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'player-up',
      frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'player-down',
      frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'player-right',
      frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
      frameRate: 5,
      repeat: -1
    });

    // Setup keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Camera follows the player
    this.cameras.main.startFollow(this.player);
  }

  update() {
    const speed = 200;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play('player-left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play('player-right', true);
    }
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play('player-up', true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play('player-down', true);
    } else {
      this.player.anims.stop();
    }
    
    // Stop animation if idle
    if (
      !this.cursors.left.isDown &&
      !this.cursors.right.isDown &&
      !this.cursors.up.isDown &&
      !this.cursors.down.isDown
    ) {
      this.player.anims.stop();
    }

    // Debug: player position
    // console.log(Player in Kitchen update: x=${this.player.x}, y=${this.player.y});

    // Example: transition to mainhall2 if within a certain area
    if (
      this.player.x >= 640 &&
      this.player.x <= 650 &&
      this.player.y >= 135&&
      this.player.y <= 185) 
      {
      console.log('Switching to escape scene');

      // ✅ Pass just playerData — NOT the full sprite!
      this.scene.start('escape', {
        playerData: {
          x: this.player.x,
          y: this.player.y,
          frame: this.player.frame.name 
        }
      });
  }
}

}
