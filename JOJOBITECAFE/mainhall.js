// mainhall.js
export default class MainHall extends Phaser.Scene {
  constructor() {
    super({ key: 'mainhall' });
    this.player = null;
    this.cursors = null;
  }

  preload() {
    // Load assets for MainHall
    this.load.tilemapTiledJSON('mainhall', 'assets/mainhall.tmj');
    this.load.image('pixel-cyberpunk-interiorimg', 'assets/pixel-cyberpunk-interior.png');
    this.load.image('pipoyaimg', 'assets/pipoya.png');
    this.load.image('free_overviewimg', 'assets/free_overview.png');
    
    // Load the player spritesheet
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    // Create the tilemap
    const map = this.make.tilemap({ key: 'mainhall' });
    const cyberpunkTileset = map.addTilesetImage('pixel-cyberpunk-interior', 'pixel-cyberpunk-interiorimg');
    const pipoyaTileset = map.addTilesetImage('pipoya', 'pipoyaimg');
    const freeOverviewTileset = map.addTilesetImage('free_overview', 'free_overviewimg');
    const tilesArray = [cyberpunkTileset, pipoyaTileset, freeOverviewTileset];

    // Create layers (adjust names to your Tiled file)
    map.createLayer('floor', tilesArray, 0, 0);
    map.createLayer('food', tilesArray, 0, 0);
    map.createLayer('table', tilesArray, 0, 0);
    map.createLayer('chashier', tilesArray, 0, 0);

    // Create the player at a starting position (you can adjust these coordinates)
    this.player = this.physics.add.sprite(150, 570, 'player');
    window.player = this.player; // For debugging

    // Ensure the player stays within the world bounds
    this.player.setCollideWorldBounds(true);

    // Create basic player animations
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

    // Movement handling
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
    }
    if (
      !this.cursors.left.isDown &&
      !this.cursors.right.isDown &&
      !this.cursors.up.isDown &&
      !this.cursors.down.isDown
    ) {
      this.player.anims.stop();
    }

    // Debug: log player's coordinates
    console.log(`Player in MainHall: x=${this.player.x}, y=${this.player.y}`);

    // Bounding box check to switch to Kitchen scene
    // Adjust these numbers to your trigger area
    if (
      this.player.x >= 32 &&
      this.player.x <= 35 &&
      this.player.y >= 165 &&
      this.player.y <= 180
    ) {
      console.log('Switching to Kitchen scene');
      this.scene.start('kitchen', { player: this.player });
    }
  }
}








