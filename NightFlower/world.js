class world extends Phaser.Scene {
  constructor() {
    super({ key: "world" });
  }

  init(data) {
    this.player = data.player;
    this.inventory = data.inventory || [];
  }

  preload() {
    // MAP
    this.load.tilemapTiledJSON("map1", "assets/map1.tmj");

    // TILES
    this.load.image("InteriorIMG", "assets/Interior.png");
    this.load.image("pipoyaIMG", "assets/pipoya.png");
    this.load.image("WoodIMG", "assets/Wood.png");

    // PLAYER
    this.load.spritesheet("rossa", "assets/rossa.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    console.log("*** world scene");

    let map = this.make.tilemap({ key: "map1" });

    // tilesets
    let InteriorTiles = map.addTilesetImage("Interior", "InteriorIMG");
    let pipoyaTiles = map.addTilesetImage("pipoya", "pipoyaIMG");
    let WoodTiles = map.addTilesetImage("Wood", "WoodIMG");

    let tilesArray = [InteriorTiles, pipoyaTiles, WoodTiles];

    // LAYERS: create walkable layers first, then object/frame layers on top
    this.floorlayer = map.createLayer("floor", tilesArray, 0, 0);
    this.floor2layer = map.createLayer("floor2", tilesArray, 0, 0);

    // top layers that should block player
    this.framelayer = map.createLayer("frame", tilesArray, 0, 0);
    this.objectlayer = map.createLayer("object", tilesArray, 0, 0);
    this.object2layer = map.createLayer("object2", tilesArray, 0, 0);

    // ---------- IMPORTANT ----------
    // Make the blocking layers collide. Two approaches:
    // 1) Preferred: if you set "collides" property on tiles in Tiled, use:
    //    this.framelayer.setCollisionByProperty({ collides: true });
    //    this.objectlayer.setCollisionByProperty({ collides: true });
    //    this.object2layer.setCollisionByProperty({ collides: true });
    //
    // 2) Fallback: collide every tile that exists in the layer (use this if you didn't set collides in Tiled):
    this.framelayer.setCollisionByExclusion([-1]);
    this.objectlayer.setCollisionByExclusion([-1]);
    this.object2layer.setCollisionByExclusion([-1]);
    // --------------------------------

    // START POSITION
    let start = map.findObject("objectLayer", (obj) => obj.name === "start");

    if (!start) {
      console.error("Start object not found in the map.");
      return;
    }

    // PLAYER
    this.player = this.physics.add.sprite(start.x, start.y, "rossa");
    this.player.setCollideWorldBounds(true);

    // PLAYER BODY SIZE (smaller than sprite so collisions feel correct)
    this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.6);
    this.player.body.setOffset(this.player.width * 0.25, this.player.height * 0.35);

    // ANIMATIONS
    if (!this.anims.exists("rossa-up")) {
      this.anims.create({
        key: "rossa-up",
        frames: this.anims.generateFrameNumbers("rossa", { start: 105, end: 112 }),
        frameRate: 5,
        repeat: -1,
      });
    }
    if (!this.anims.exists("rossa-left")) {
      this.anims.create({
        key: "rossa-left",
        frames: this.anims.generateFrameNumbers("rossa", { start: 118, end: 125 }),
        frameRate: 5,
        repeat: -1,
      });
    }
    if (!this.anims.exists("rossa-down")) {
      this.anims.create({
        key: "rossa-down",
        frames: this.anims.generateFrameNumbers("rossa", { start: 131, end: 138 }),
        frameRate: 5,
        repeat: -1,
      });
    }
    if (!this.anims.exists("rossa-right")) {
      this.anims.create({
        key: "rossa-right",
        frames: this.anims.generateFrameNumbers("rossa", { start: 144, end: 151 }),
        frameRate: 5,
        repeat: -1,
      });
    }

    // ---------- COLLIDERS ----------
    // Collide player with blocking layers so player cannot walk through them
    this.physics.add.collider(this.player, this.framelayer);
    this.physics.add.collider(this.player, this.objectlayer);
    this.physics.add.collider(this.player, this.object2layer);

    // If you later spawn enemies or flowers, make sure to add colliders between them and blocking layers too:
    // this.physics.add.collider(enemy, this.framelayer);
    // this.physics.add.collider(flowerGroup, this.objectlayer);

    // INPUT
    this.cursors = this.input.keyboard.createCursorKeys();

    // CAMERA
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Adjust physics world bounds
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
  }

  update() {
    let speed = 200;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play("rossa-left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play("rossa-right", true);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play("rossa-up", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play("rossa-down", true);
    }

    if (
      !this.cursors.left.isDown &&
      !this.cursors.right.isDown &&
      !this.cursors.up.isDown &&
      !this.cursors.down.isDown
    ) {
      this.player.anims.stop();
    }

    // teleport to room1
    if (
      this.player.x > 554 &&
      this.player.x < 614 &&
      this.player.y > 291 &&
      this.player.y < 384
    ) {
      this.scene.start("room1", { inventory: this.inventory });
    }
  }
}



