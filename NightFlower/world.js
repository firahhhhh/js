class world extends Phaser.Scene {
  constructor() {
    super({
      key: "world",
    });
  }

  init(data) {
    this.player = data.player;
    this.inventory = data.inventory;
  }

  preload() {
    // Step 1, load JSON
    this.load.tilemapTiledJSON("map1", "assets/map1.tmj");

    // Step 2 : Preload any images here
    this.load.image("InteriorIMG", "assets/Interior.png");
    this.load.image("pipoyaIMG", "assets/pipoya.png");
    this.load.image("WoodIMG", "assets/Wood.png");

//     this.load.spritesheet('flowersImg', 'assets/flowers.png',
//  {  frameWidth:16, frameHeight:16 });

    // preload generated character spritesheets
    this.load.spritesheet("rossa", "assets/rossa.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("cikponti", "assets/cikponti.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    console.log("*** world scene");

       this.load.image("intro1", "assets/intro1.png");

        var spaceDown = this.input.keyboard.addKey('SPACE');

        spaceDown.on('down', function(){
            this.scene.start("world");
            }, this );

    // Step 3 - Create the map from main - worldmap
    let map = this.make.tilemap({ key: "map1" });

    // Step 4: Load the game tiles
    let InteriorTiles = map.addTilesetImage("Interior", "InteriorIMG");
    let pipoyaTiles = map.addTilesetImage("pipoya", "pipoyaIMG");
    let WoodTiles = map.addTilesetImage("Wood", "WoodIMG");

    let tilesArray = [InteriorTiles, pipoyaTiles, WoodTiles];
    this.floorlayer = map.createLayer("floor", tilesArray, 0, 0);
    this.framelayer = map.createLayer("frame", tilesArray, 0, 0);
    this.objectlayer = map.createLayer("object", tilesArray, 0, 0);
    this.object2layer = map.createLayer("object2", tilesArray, 0, 0);

    // Step 5: Load in layers, from bottom to top
    this.floor = map.createLayer("floor", tilesArray, 0, 0);
    this.frame = map.createLayer("frame", tilesArray, 0, 0);
    this.object = map.createLayer("object", tilesArray, 0, 0);
    this.object2 = map.createLayer("object2", tilesArray, 0, 0);

    let start = map.findObject("objectLayer", (obj) => obj.name === "start");
    console.log("Start Object:", start);

    if (!start) {
      console.error("Start object not found in the map.");
      return; // Exit if "start" object is not found
    }

    // Create the player sprite
    this.player = this.physics.add.sprite(start.x, start.y, "rossa");
    window.player = this.player;
    console.log("Player created:", this.player);

    // Check if player is correctly created
    if (!this.player) {
      console.error("Player sprite not initialized correctly.");
      return;
    }

    // Player animations
    this.anims.create({
      key: "rossa-up",
      frames: this.anims.generateFrameNumbers("rossa", {
        start: 105,
        end: 112,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "rossa-left",
      frames: this.anims.generateFrameNumbers("rossa", {
        start: 118,
        end: 125,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "rossa-down",
      frames: this.anims.generateFrameNumbers("rossa", {
        start: 131,
        end: 138,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "rossa-right",
      frames: this.anims.generateFrameNumbers("rossa", {
        start: 144,
        end: 151,
      }),
      frameRate: 5,
      repeat: -1,
    });

   
    // Adjust player body size only if player is properly initialized
    if (this.player && this.player.width && this.player.height) {
      this.player.body.setSize(
        this.player.width * 0.8,
        this.player.height * 0.8
      );
      console.log("Player size adjusted:", this.player.body);
    } else {
      console.warn("Player size could not be adjusted.");
    }

    // Create arrow keys input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Camera follow player
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Adjust physics world bounds based on the ground layer

    this.physics.world.bounds.width = this.floorlayer.width;
    this.physics.world.bounds.height = this.floorlayer.height;

    this.player.setCollideWorldBounds(true);

    // this.physics.moveToObject( this.cikponti, this.rossa, 60, 3000);


    ///enemy tween
    // this.cikponti = this.physics.add
    //   .sprite(100, 300, "cikponti")
    //   .play("cikponti-right");

    // this.tweens.add({
    //   targets: this.cikponti,
    //   x: 280,
    //   flipX: true,
    //   yoyo: true,
    //   duration: 1800,
    //   repeat: -1,
    // });
  }

  update() {
    let speed = 200;

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
      this.player.anims.play("rossa-left", true); // walk left
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      this.player.anims.play("rossa-right", true);
    } else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
      this.player.anims.play("rossa-up", true);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
      this.player.anims.play("rossa-down", true);
    } else {
      this.player.anims.stop();
      this.player.body.setVelocity(0, 0);
    }
    if (
      this.player.x > 554 &&
      this.player.x < 614 &&
      this.player.y > 291 &&
      this.player.y < 384
    ) {
      console.log("Go to Room1 function");
      this.room1();
    }
  }

  // Function room1
  room1(player, tile) {
    console.log("Function to jump to room1 scene");
    this.scene.start("room1");
  }
}
