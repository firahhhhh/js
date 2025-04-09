// kitchen.js
export default class Kitchen extends Phaser.Scene {
  constructor() {
    super({ key: 'kitchen' });
  }

  init(data) {
    // Accept playerData instead of a full player object
    this.playerData = data.playerData || { x: 100, y: 100 };
  }

  preload() {
    // Load the kitchen tilemap (exported as JSON)
    this.load.tilemapTiledJSON('kitchen', 'assets/kitchen.tmj');

    // Load tileset images
    this.load.image('pixel-cyberpunk-interiorimg', 'assets/pixel-cyberpunk-interior.png');
    this.load.image('pipoyaimg', 'assets/pipoya.png');
    this.load.image('free_overviewimg', 'assets/free_overview.png');

    // Load player sprite if not done in a Boot scene
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    // 1) Create the tilemap
    const map = this.make.tilemap({ key: 'kitchen' });
    const tileset1 = map.addTilesetImage('pixel-cyberpunk-interior', 'pixel-cyberpunk-interiorimg');
    const tileset2 = map.addTilesetImage('pipoya', 'pipoyaimg');
    const tileset3 = map.addTilesetImage('free_overview', 'free_overviewimg');
    const tilesArray = [tileset1, tileset2, tileset3];

    // 2) Create layers
    let floorLayer = map.createLayer('floor', tilesArray, 0, 0).setDepth(0);
    let object1Layer = map.createLayer('object 1', tilesArray, 0, 0).setDepth(1);
    let object2Layer = map.createLayer('object 2', tilesArray, 0, 0).setDepth(2);

    // 3) Start point from object layer
    const startPoint = map.findObject('objectLayer', obj => obj.name === 'start');

    // 4) Determine spawn position
    let spawnX = this.playerData.x;
    let spawnY = this.playerData.y;

    if (startPoint) {
      spawnX = startPoint.x;
      spawnY = startPoint.y;
    }

    // 5) Create player from scratch using position
    this.player = this.physics.add.sprite(spawnX, spawnY, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(999);
    // console.log(Player in Kitchen: x=${this.player.x}, y=${this.player.y});

    // 6) Camera follow
    this.cameras.main.startFollow(this.player);

    // 7) Define animations if not already existing
    if (!this.anims.exists('player-left')) {
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
    }

    // 8) Setup keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (!this.player) return;

    const speed = 200;
    this.player.setVelocity(0);

    // Movement + animations
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
      this.player.x >= 32 &&
      this.player.x <= 35 &&
      this.player.y >= 165 &&
      this.player.y <= 180
    ) {
      console.log('Switching to mainhall2 scene');

      // ✅ Pass just playerData — NOT the full sprite!
      this.scene.start('mainhall2', {
        playerData: {
          x: this.player.x,
          y: this.player.y,
          frame: this.player.frame.name
        }
      });
    }
  }
}










