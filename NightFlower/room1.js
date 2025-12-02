class room1 extends Phaser.Scene {
  constructor() {
    super({ key: "room1" });
  }

  init(data) {
    this.player = data.player || null;
    this.inventory = data.inventory || [];
    // carry lives forward if provided, otherwise default 5
    this.lives = (typeof data.lives === "number") ? data.lives : 5;
  }

  preload() {
    // tilemap + tiles
    this.load.tilemapTiledJSON("map2", "assets/map2.tmj");
    this.load.image("pipoyaIMG", "assets/pipoya.png");
    this.load.image("defimon1IMG", "assets/defimon1.png");

    // characters / enemy
    this.load.spritesheet("rossa", "assets/rossa.png", { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet("cikponti", "assets/cikponti.png", { frameWidth: 64, frameHeight: 64 });

    // flowers sheet - same as room2 (frameWidth/frameHeight must match your sheet)
    this.load.spritesheet("flowersImg", "assets/flowers.png", { frameWidth: 500, frameHeight: 528 });

    // sounds
    this.load.audio("pick", "assets/pick.mp3");
    this.load.audio("hit", "assets/hit.mp3");

    // live hearts spritesheet (use your sprite frames; we use frame index 4 as full heart)
    // adjust frameWidth/frameHeight if your live.png differs
    this.load.spritesheet("liveImg", "assets/live.png", { frameWidth: 75, frameHeight: 67 });
  }

  create() {
    console.log("*** room1 scene");

    // ---------- MAP & LAYERS ----------
    const map = this.make.tilemap({ key: "map2" });
    const pipoyaTiles = map.addTilesetImage("pipoya", "pipoyaIMG");
    const defimon1Tiles = map.addTilesetImage("defimon1", "defimon1IMG");
    const tilesArray = [defimon1Tiles, pipoyaTiles];

    // Create floor (walkable) layer first (we'll call it groundLayer)
    this.groundLayer = map.createLayer("floor", tilesArray, 0, 0);
    // Create other top/object layers (these will block the player)
    this.objectlayer = map.createLayer("object", tilesArray, 0, 0);
    this.forestlayer = map.createLayer("forest", tilesArray, 0, 0);
    this.forest2layer = map.createLayer("forest2", tilesArray, 0, 0);
    this.forest3layer = map.createLayer("forest3", tilesArray, 0, 0);
    this.forest4layer = map.createLayer("forest4", tilesArray, 0, 0);

    // If Tiled didn't mark collidable, use fallback (collide every tile except -1)
    this.objectlayer.setCollisionByExclusion([-1]);
    this.forestlayer.setCollisionByExclusion([-1]);
    this.forest2layer.setCollisionByExclusion([-1]);
    this.forest3layer.setCollisionByExclusion([-1]);
    this.forest4layer.setCollisionByExclusion([-1]);

    // set world bounds to the groundLayer (floor) size
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    // ---------- OBJECTS (from Tiled) ----------
    const start = map.findObject("objectLayer", (obj) => obj.name === "start");
    const roseObj = map.findObject("objectLayer", (obj) => obj.name === "rose");
    const enemyObj = map.findObject("objectLayer", (obj) => obj.name === "enemy1");

    if (!start) {
      console.error("Start object not found in map2. Aborting room1 create.");
      return;
    }

    // ---------- PLAYER ----------
    this.player = this.physics.add.sprite(start.x, start.y, "rossa");
    // smaller body so collisions feel right
    this.player.body.setSize(this.player.width * 0.6, this.player.height * 0.8);
    this.player.setCollideWorldBounds(true);

    // Create player animations only if not already created
    if (!this.anims.exists("rossa-up")) {
      this.anims.create({ key: "rossa-up", frames: this.anims.generateFrameNumbers("rossa", { start: 105, end: 112 }), frameRate: 5, repeat: -1 });
      this.anims.create({ key: "rossa-left", frames: this.anims.generateFrameNumbers("rossa", { start: 118, end: 125 }), frameRate: 5, repeat: -1 });
      this.anims.create({ key: "rossa-down", frames: this.anims.generateFrameNumbers("rossa", { start: 131, end: 138 }), frameRate: 5, repeat: -1 });
      this.anims.create({ key: "rossa-right", frames: this.anims.generateFrameNumbers("rossa", { start: 144, end: 151 }), frameRate: 5, repeat: -1 });
    }

    // Colliders: player should collide with object layers so they can't walk through them
    this.physics.add.collider(this.player, this.objectlayer);
    this.physics.add.collider(this.player, this.forestlayer);
    this.physics.add.collider(this.player, this.forest2layer);
    this.physics.add.collider(this.player, this.forest3layer);
    this.physics.add.collider(this.player, this.forest4layer);

    // ---------- ENEMY (physics body + visible sprite) ----------
    // choose spawn point from Tiled if exists, else fallback
    const enemyX = enemyObj ? enemyObj.x : 400;
    const enemyY = enemyObj ? enemyObj.y : 200;

    // invisible physics body that will move/follow player (collides with world)
    this.enemyBody = this.physics.add.sprite(enemyX, enemyY, null).setSize(40, 48).setVisible(false);
    this.enemyBody.setCollideWorldBounds(true);

    // visible sprite for animations and bobbing
    this.enemy = this.add.sprite(enemyX, enemyY, "cikponti").setDepth(10);

    // enemy animations if not exist
    if (!this.anims.exists("cikponti-up")) {
      this.anims.create({ key: "cikponti-up", frames: this.anims.generateFrameNumbers("cikponti", { start: 105, end: 112 }), frameRate: 5, repeat: -1 });
      this.anims.create({ key: "cikponti-left", frames: this.anims.generateFrameNumbers("cikponti", { start: 118, end: 125 }), frameRate: 5, repeat: -1 });
      this.anims.create({ key: "cikponti-down", frames: this.anims.generateFrameNumbers("cikponti", { start: 131, end: 138 }), frameRate: 5, repeat: -1 });
      this.anims.create({ key: "cikponti-right", frames: this.anims.generateFrameNumbers("cikponti", { start: 144, end: 151 }), frameRate: 5, repeat: -1 });
    }

    this.enemyBaseSpeed = 40; // same as room2
    // bobbing for visible sprite done in update (sin bob)

    // make enemyBody collide with blocking layers so it cannot pass through walls
    this.physics.add.collider(this.enemyBody, this.objectlayer);
    this.physics.add.collider(this.enemyBody, this.forestlayer);
    this.physics.add.collider(this.enemyBody, this.forest2layer);
    this.physics.add.collider(this.enemyBody, this.forest3layer);
    this.physics.add.collider(this.enemyBody, this.forest4layer);

    // enemy hit -> call hitEnemy when overlapping player
    this.physics.add.overlap(this.player, this.enemyBody, this.hitEnemy, null, this);

    // add light for enemy
    this.lights.enable(); // ensure lights enabled
    this.enemy.setPipeline("Light2D");
    this.enemyBody.setPipeline("Light2D");
    this.enemyGlow = this.lights.addLight(this.enemyBody.x, this.enemyBody.y, 120, 0xff6666, 0.9);

    // ---------- CAMERA & WORLD ----------
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // ensure physics world bounds are set to groundLayer (floor)
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    // ---------- NIGHT MODE ----------
    this.lights.setAmbientColor(0x202020); // slightly dark
    // make tile layers receive lighting (so ground and objects darken)
    this.groundLayer.setPipeline("Light2D");
    this.objectlayer.setPipeline("Light2D");
    this.forestlayer.setPipeline("Light2D");
    this.forest2layer.setPipeline("Light2D");
    this.forest3layer.setPipeline("Light2D");
    this.forest4layer.setPipeline("Light2D");

    // player light
    this.playerLight = this.lights.addLight(this.player.x, this.player.y, 300, 0xffffff, 1.6);
    this.player.setPipeline("Light2D");

    // ---------- FLOWERS ----------
    // create flower animations once (if not exist)
    if (!this.anims.exists("roseAnim")) {
      this.anims.create({ key: "roseAnim", frames: this.anims.generateFrameNumbers("flowersImg", { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
      this.anims.create({ key: "kembojaAnim", frames: this.anims.generateFrameNumbers("flowersImg", { start: 4, end: 7 }), frameRate: 6, repeat: -1 });
      this.anims.create({ key: "melatiAnim", frames: this.anims.generateFrameNumbers("flowersImg", { start: 8, end: 11 }), frameRate: 6, repeat: -1 });
    }

    this.flowerGroup = this.physics.add.group();
    this.flowerScale = 0.12;

    // helper: spawn only on ground tiles and not inside blocking top layers
    const spawnFlowerSafe = (x, y, animKey, typeName) => {
      // ensure world XY corresponds to a tile on ground layer
      const tileUnder = this.groundLayer.getTileAtWorldXY(x, y);
      if (!tileUnder) return false; // not on floor
      // ensure not overlapping a blocking tile (object layers)
      const collOnObject = this.objectlayer.hasTileAtWorldXY(x, y) ||
                           this.forestlayer.hasTileAtWorldXY(x, y) ||
                           this.forest2layer.hasTileAtWorldXY(x, y) ||
                           this.forest3layer.hasTileAtWorldXY(x, y) ||
                           this.forest4layer.hasTileAtWorldXY(x, y);
      if (collOnObject) return false;

      let f = this.physics.add.sprite(x, y, "flowersImg").play(animKey).setScale(this.flowerScale).setDepth(10);
      f.body.setSize(f.width * 0.6, f.height * 0.4);
      f.flowerType = typeName;
      f.setPipeline("Light2D");
      this.flowerGroup.add(f);

      // add soft glow light to flower
      let color = 0xffffff;
      if (typeName === "Rose") color = 0xff8aa3;
      if (typeName === "Kemboja") color = 0xffb3ff;
      if (typeName === "Melati") color = 0xfff1b3;
      f.__light = this.lights.addLight(f.x, f.y, 90, color, 0.6);

      return true;
    };

    // spawn flowers around rose object (if present)
    if (roseObj) {
      spawnFlowerSafe(roseObj.x, roseObj.y, "roseAnim", "Rose");
      spawnFlowerSafe(roseObj.x + 48, roseObj.y + 6, "kembojaAnim", "Kemboja");
      spawnFlowerSafe(roseObj.x - 48, roseObj.y + 18, "melatiAnim", "Melati");
    }

    // spawn some random flowers but ensure they are on ground and not on blocking layers
    let extras = 5;
    let attempts = 0;
    while (extras > 0 && attempts < 200) {
      attempts++;
      const x = Phaser.Math.Between(64, map.widthInPixels - 64);
      const y = Phaser.Math.Between(64, map.heightInPixels - 64);
      const r = Phaser.Math.Between(0, 2);
      const anim = r === 0 ? "roseAnim" : (r === 1 ? "kembojaAnim" : "melatiAnim");
      const name = r === 0 ? "Rose" : (r === 1 ? "Kemboja" : "Melati");
      if (spawnFlowerSafe(x, y, anim, name)) extras--;
    }

    // overlap collect
    this.physics.add.overlap(this.player, this.flowerGroup, this.collectFlower, null, this);

    // ---------- UI & SOUNDS ----------
    this.pickSound = this.sound.add("pick");
    this.hitSound = this.sound.add("hit");

    // flowers counter
    this.totalFlowers = this.flowerGroup.getChildren().length;
    this.collectedSet = new Set();
    this.collectedText = this.add.text(16, 16, `Flowers: 0/${this.totalFlowers}`, { fontSize: "16px", fill: "#fff" }).setScrollFactor(0).setDepth(200);

    // ---------- LIVES UI (top-right hearts) ----------
    this.maxLives = 5;
    this.livesImages = [];
    const padding = 8;
    const heartSize = 40;
    const startX = this.scale.width - padding - heartSize;
    const startY = padding + 8;
    for (let i = 0; i < this.maxLives; i++) {
      // frame 4 = full heart 
      const frameIndex = (i < this.lives) ? 4 : 0;
      const heart = this.add.image(startX - i * (heartSize + 6), startY, "liveImg", frameIndex).setScrollFactor(0).setDepth(1000);
      heart.setOrigin(0, 0);
      heart.setDisplaySize(heartSize, heartSize);
      this.livesImages.push(heart);
    }
    this.updateLivesDisplay = () => {
      for (let i = 0; i < this.maxLives; i++) {
        if (i < this.lives) this.livesImages[i].setFrame(4);
        else this.livesImages[i].setFrame(0);
      }
    };
    this.updateLivesDisplay();

    // ---------- INPUT ----------
    this.cursors = this.input.keyboard.createCursorKeys();

    // invulnerability flag & durations
    this.playerInvulnerable = false;
    this.invulDuration = 1000;
  }

  update(time, delta) {
    // guard: ensure cursors exist
    if (!this.cursors) return;

    const speed = 200;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.play("rossa-left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.play("rossa-right", true);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.play("rossa-up", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.play("rossa-down", true);
    }

    if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
      this.player.anims.stop();
    }

    // update player light
    if (this.playerLight) {
      this.playerLight.x = this.player.x;
      this.playerLight.y = this.player.y;
    }

    // ---------- ENEMY: physics body follows player, visible bobbing ----------
    // safe guard enemyBody exists
    if (this.enemyBody) {
      // move invisible body toward player
      const dist = Phaser.Math.Distance.Between(this.enemyBody.x, this.enemyBody.y, this.player.x, this.player.y);
      if (dist > 24) this.physics.moveToObject(this.enemyBody, this.player, this.enemyBaseSpeed);
      else this.enemyBody.body.setVelocity(0, 0);

      // make visible sprite follow the physics body with small vertical bob
      const bob = Math.sin(time / 300) * 6; // gentle bob
      this.enemy.x = this.enemyBody.x;
      this.enemy.y = this.enemyBody.y + bob;

      // set animations based on direction to player
      const dx = this.player.x - this.enemyBody.x;
      const dy = this.player.y - this.enemyBody.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        dx > 0 ? this.enemy.play("cikponti-right", true) : this.enemy.play("cikponti-left", true);
      } else {
        dy > 0 ? this.enemy.play("cikponti-down", true) : this.enemy.play("cikponti-up", true);
      }

      // update enemy glow
      if (this.enemyGlow) {
        this.enemyGlow.x = this.enemyBody.x;
        this.enemyGlow.y = this.enemyBody.y;
      }
    }

    // update flowers' lights positions
    this.flowerGroup.getChildren().forEach((f) => {
      if (f.__light) {
        f.__light.x = f.x;
        f.__light.y = f.y;
      }
    });

    // UI
    this.collectedText.setText(`Flowers: ${this.collectedSet.size}/${this.totalFlowers}`);

    // Teleport to room2 region (keep previous area coordinates)
    if (this.player.x > 554 && this.player.x < 614 && this.player.y > 291 && this.player.y < 384) {
      // pass inventory and lives to next room
      this.scene.start("room2", { inventory: this.inventory, lives: this.lives });
    }
  }

  collectFlower(player, flower) {
    if (!flower || !flower.flowerType) return;

    if (this.pickSound) this.pickSound.play();

    const uid = flower.flowerType + "_" + Phaser.Math.RND.uuid();
    this.inventory.push(flower.flowerType);
    this.collectedSet.add(uid);

    if (flower.__light) this.lights.removeLight(flower.__light);

    // show Malay name popup
    const label = this.add.text(flower.x, flower.y - 20, flower.flowerType, { fontSize: "14px", fill: "#fff", backgroundColor: "rgba(0,0,0,0.5)" })
      .setOrigin(0.5)
      .setDepth(200);
    this.tweens.add({
      targets: label,
      y: label.y - 18,
      alpha: 0,
      duration: 900,
      onComplete: () => label.destroy()
    });

    flower.destroy();
  }

  updateLivesDisplay() {
    for (let i = 0; i < this.maxLives; i++) {
      if (i < this.lives) this.livesImages[i].setFrame(4);
      else this.livesImages[i].setFrame(0);
    }
  }

  hitEnemy(player, enemyBody) {
    if (this.playerInvulnerable) return;

    // decrement life & update hearts
    this.lives = Math.max(0, this.lives - 1);
    this.updateLivesDisplay();

    if (this.hitSound) this.hitSound.play();

    this.player.setTint(0xff6666);
    this.cameras.main.shake(200, 0.01);
    this.playerInvulnerable = true;

    // knockback away from enemy body
    const nx = this.player.x - enemyBody.x;
    const ny = this.player.y - enemyBody.y;
    const mag = Math.sqrt(nx * nx + ny * ny) || 1;
    const kb = 150;
    this.player.body.setVelocity((nx / mag) * kb, (ny / mag) * kb);

    this.time.delayedCall(150, () => this.player.clearTint());
    this.time.delayedCall(200, () => this.player.body.setVelocity(0, 0));
    this.time.delayedCall(this.invulDuration, () => (this.playerInvulnerable = false));

    // if no lives left -> lose
    if (this.lives <= 0) {
      this.time.delayedCall(250, () => {
        this.scene.start("lose", { inventory: this.inventory, lives: this.lives });
      });
    }
  }
}











