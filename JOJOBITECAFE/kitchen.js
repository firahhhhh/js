// kitchen.js
export default class Kitchen extends Phaser.Scene {
  constructor() {
    super({ key: 'kitchen' });
  }

  init(data) {
    // Retrieve the player passed from MainHall (if any)
    this.player = data.player || null;
  }

  preload() {
    // Load the kitchen tilemap (exported as JSON)
    this.load.tilemapTiledJSON('kitchen', 'assets/kitchen.tmj');

    // Load tileset images (names must match Tiled)
    this.load.image('pixel-cyberpunk-interiorimg', 'assets/pixel-cyberpunk-interior.png');
    this.load.image('pipoyaimg', 'assets/pipoya.png');
    this.load.image('free_overviewimg', 'assets/free_overview.png');
    
    // Load the player sprite if needed (if not already loaded)
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 64 });
    
    // DO NOT call any methods on "this.player" here,
    // because the player does not exist until create().
  }

  create() {
    // Create the tilemap for Kitchen
    const map = this.make.tilemap({ key: 'kitchen' });
    const cyberpunkTileset = map.addTilesetImage('pixel-cyberpunk-interior', 'pixel-cyberpunk-interiorimg');
    const pipoyaTileset = map.addTilesetImage('pipoya', 'pipoyaimg');
    const freeOverviewTileset = map.addTilesetImage('free_overview', 'free_overviewimg');
    const tilesArray = [cyberpunkTileset, pipoyaTileset, freeOverviewTileset];

    // Create layers (make sure these names match your Tiled map)
    map.createLayer('floor', tilesArray, 0, 0);
    map.createLayer('object 1', tilesArray, 0, 0);
    map.createLayer('object 2', tilesArray, 0, 0);

    // (Optional) Look for an object layer with a "start" object.
    // If your object layer is named differently, update the string accordingly.
    const startPoint = map.findObject('objectLayer', obj => obj.name === 'start');

    // If a player was passed from MainHall, re-enable and position it.
    if (this.player) {
      // Re-enable physics for the existing player if necessary
      this.physics.world.enable(this.player);
      this.add.existing(this.player);
      
      
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
    
      if (startPoint) {
        this.player.x = startPoint.x;
        this.player.y = startPoint.y;
      } else {
        this.player.x = 100;
        this.player.y = 100;
      }
    } else {
      // If no player was passed, create a new one at default coordinates.
      this.player = this.physics.add.sprite(100, 100, 'player');
    }

    // Ensure the player is visible and above the tilemap layers
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(100);
    this.player.setVisible(true);

   // Debug: log player's coordinates
   console.log(`Player in kitchen: x=${this.player.x}, y=${this.player.y}`);

    // Let the camera follow the player
    this.cameras.main.startFollow(this.player);

    // Setup keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (!this.player) return;
    const speed = 200;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    }
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    }
  }
}







