// room2.js - complete, fixed version
class room2 extends Phaser.Scene {
  constructor() {
    super({ key: "room2" });
  }

  init(data) {
    // preserve incoming inventory and lives if provided
    this.inventory = data.inventory || [];
    this.lives = (typeof data.lives !== "undefined") ? data.lives : 5;
    this.player = data.player || null;
  }

  preload() {
    // Tilemap + tiles
    this.load.tilemapTiledJSON("map3", "assets/map3.tmj");
    this.load.image("pipoyaIMG", "assets/pipoya.png");
    this.load.image("defimon1IMG", "assets/defimon1.png");

    // Characters & enemy
    this.load.spritesheet("rossa", "assets/rossa.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("cikponti", "assets/cikponti.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // Flowers spritesheet (4 cols x 3 rows -> 12 frames). Adjust if your sheet differs.
    this.load.spritesheet("flowersImg", "assets/flowers.png", {
      frameWidth: 500,
      frameHeight: 528,
    });

    // sounds
    this.load.audio("pick", "assets/pick.mp3");
    this.load.audio("hit", "assets/hit.mp3");

    // live hearts sheet (375x67 -> 5 frames horizontally => 75x67 per frame)
    this.load.spritesheet("liveImg", "assets/live.png", {
      frameWidth: 75,
      frameHeight: 67,
    });
  }

  create() {
    console.log("*** room2 scene");

    // --------- MAP & LAYERS -------------
    let map = this.make.tilemap({ key: "map3" });
    let pipoyaTiles = map.addTilesetImage("pipoya", "pipoyaIMG");
    let defimon1Tiles = map.addTilesetImage("defimon1", "defimon1IMG");
    let tilesArray = [defimon1Tiles, pipoyaTiles];

    // Create floor layers first (these are walkable ground)
    this.floorlayer = map.createLayer("floor", tilesArray, 0, 0);
    this.floor2layer = map.createLayer("floor2", tilesArray, 0, 0);

    // top / object layers (should block player & enemy)
    this.object1layer = map.createLayer("object1", tilesArray, 0, 0);
    this.object2layer = map.createLayer("object2", tilesArray, 0, 0);
    this.object3layer = map.createLayer("object3", tilesArray, 0, 0);
    this.object4layer = map.createLayer("object4", tilesArray, 0, 0);

    // If tiles in Tiled are not already marked as colliding, enable fallback:
    this.object1layer.setCollisionByExclusion([-1]);
    this.object2layer.setCollisionByExclusion([-1]);
    this.object3layer.setCollisionByExclusion([-1]);
    this.object4layer.setCollisionByExclusion([-1]);

    // Set physics world bounds according to the main ground (floor) layer width/height
    // Use floor layer size (floor2 assumed same size)
    this.physics.world.bounds.width = this.floorlayer.width;
    this.physics.world.bounds.height = this.floorlayer.height;

    // find objects (Tiled)
    let startObj = map.findObject("objectLayer", (obj) => obj.name === "start");
    let roseObj = map.findObject("objectLayer", (obj) => obj.name === "rose");
    let enemyObj = map.findObject("objectLayer", (obj) => obj.name === "enemy1");

    if (!startObj) {
      console.error("Start object not found in map3. Using fallback (100,100).");
      startObj = { x: 100, y: 100 };
    }

    // --------- PLAYER -------------
    this.player = this.physics.add.sprite(startObj.x, startObj.y, "rossa");
    this.player.setCollideWorldBounds(true);
    // smaller body for nicer collisions
    this.player.body.setSize(this.player.width * 0.6, this.player.height * 0.8);

    // Colliders: player should collide with blocking layers so they can't walk through them
    this.physics.add.collider(this.player, this.object1layer);
    this.physics.add.collider(this.player, this.object2layer);
    this.physics.add.collider(this.player, this.object3layer);
    this.physics.add.collider(this.player, this.object4layer);

    // player animations (only create if not exists)
    if (!this.anims.exists("rossa-left")) {
      this.anims.create({
        key: "rossa-left",
        frames: this.anims.generateFrameNumbers("rossa", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
    }
    if (!this.anims.exists("rossa-right")) {
      this.anims.create({
        key: "rossa-right",
        frames: this.anims.generateFrameNumbers("rossa", { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1,
      });
    }
    if (!this.anims.exists("rossa-up")) {
      this.anims.create({
        key: "rossa-up",
        frames: this.anims.generateFrameNumbers("rossa", { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1,
      });
    }
    if (!this.anims.exists("rossa-down")) {
      this.anims.create({
        key: "rossa-down",
        frames: this.anims.generateFrameNumbers("rossa", { start: 12, end: 15 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    // --------- ENEMY -------------
    // spawn coordinates
    const enemyX = enemyObj ? enemyObj.x : 400;
    const enemyY = enemyObj ? enemyObj.y : 200;

    // invisible physics body that follows the player (so it can collide with blocking tiles)
    this.enemy = this.physics.add.sprite(enemyX, enemyY, "cikponti");
    // keep the same sprite as physics body for simplicity (works fine)
    // set body size slightly tighter
    this.enemy.body.setSize(40, 48);
    this.enemy.setCollideWorldBounds(true);

    // ensure enemy collides with blocking top layers
    this.physics.add.collider(this.enemy, this.object1layer);
    this.physics.add.collider(this.enemy, this.object2layer);
    this.physics.add.collider(this.enemy, this.object3layer);
    this.physics.add.collider(this.enemy, this.object4layer);

    // enemy animations if not exist
    if (!this.anims.exists("cikponti-up")) {
      this.anims.create({
        key: "cikponti-up",
        frames: this.anims.generateFrameNumbers("cikponti", { start: 105, end: 112 }),
        frameRate: 5,
        repeat: -1,
      });
      this.anims.create({
        key: "cikponti-left",
        frames: this.anims.generateFrameNumbers("cikponti", { start: 118, end: 125 }),
        frameRate: 5,
        repeat: -1,
      });
      this.anims.create({
        key: "cikponti-down",
        frames: this.anims.generateFrameNumbers("cikponti", { start: 131, end: 138 }),
        frameRate: 5,
        repeat: -1,
      });
      this.anims.create({
        key: "cikponti-right",
        frames: this.anims.generateFrameNumbers("cikponti", { start: 144, end: 151 }),
        frameRate: 5,
        repeat: -1,
      });
    }

    // enemy base speed
    this.enemyBaseSpeed = 40;

    // --------- COLLISIONS & OVERLAP -------------
    // enemy hit -> handle damage
    this.physics.add.overlap(this.player, this.enemy, this.hitEnemy, null, this);

    // --------- CAMERA & WORLD BOUNDS -------------
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // ensure physics world bounds are set to floor size already above

    // --------- LIGHTS (NIGHT MODE) -------------
    this.lights.enable().setAmbientColor(0x111116); // darker ambient
    // make layers receive lighting
    this.floorlayer.setPipeline("Light2D");
    this.floor2layer.setPipeline("Light2D");
    this.object1layer.setPipeline("Light2D");
    this.object2layer.setPipeline("Light2D");
    this.object3layer.setPipeline("Light2D");
    this.object4layer.setPipeline("Light2D");

    // Player light
    this.playerLightRadius = 260;
    this.playerLightIntensity = 1.4;
    this.playerLight = this.lights.addLight(this.player.x, this.player.y, this.playerLightRadius, 0xffffff, this.playerLightIntensity);
    this.player.setPipeline("Light2D");

    // enemy glow
    this.enemy.setPipeline("Light2D");
    this.enemyGlow = this.lights.addLight(this.enemy.x, this.enemy.y, 140, 0xff6666, 0.9);

    // --------- FLOWER ANIMATIONS -------------
    if (!this.anims.exists("roseAnim")) {
      this.anims.create({
        key: "roseAnim",
        frames: this.anims.generateFrameNumbers("flowersImg", { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1,
      });
    }
    if (!this.anims.exists("kembojaAnim")) {
      this.anims.create({
        key: "kembojaAnim",
        frames: this.anims.generateFrameNumbers("flowersImg", { start: 4, end: 7 }),
        frameRate: 6,
        repeat: -1,
      });
    }
    if (!this.anims.exists("melatiAnim")) {
      this.anims.create({
        key: "melatiAnim",
        frames: this.anims.generateFrameNumbers("flowersImg", { start: 8, end: 11 }),
        frameRate: 6,
        repeat: -1,
      });
    }

    // --------- FLOWER GROUP & SAFE SPAWN -------------
    this.flowerGroup = this.physics.add.group();
    this.flowerScale = 0.12;

    // helper: spawn only on floor/floor2 tiles and not inside blocking object layers
    const spawnFlowerSafe = (x, y, animKey, typeName) => {
      // ensure tile under is from floor or floor2
      const tileOnFloor = this.floorlayer.getTileAtWorldXY(x, y, true);
      const tileOnFloor2 = this.floor2layer.getTileAtWorldXY(x, y, true);
      const onFloor = !!tileOnFloor || !!tileOnFloor2;
      if (!onFloor) return false;

      // ensure not overlapping a blocking tile
      const blocked =
        (this.object1layer.hasTileAtWorldXY && this.object1layer.hasTileAtWorldXY(x, y)) ||
        (this.object2layer.hasTileAtWorldXY && this.object2layer.hasTileAtWorldXY(x, y)) ||
        (this.object3layer.hasTileAtWorldXY && this.object3layer.hasTileAtWorldXY(x, y)) ||
        (this.object4layer.hasTileAtWorldXY && this.object4layer.hasTileAtWorldXY(x, y));

      if (blocked) return false;

      // Create flower
      const f = this.physics.add.sprite(x, y, "flowersImg").play(animKey).setScale(this.flowerScale).setDepth(10);
      f.body.setSize(f.width * 0.6, f.height * 0.4);
      f.flowerType = typeName;
      f.setPipeline("Light2D");
      this.flowerGroup.add(f);

      // small glow light
      let color = 0xffffff;
      if (typeName === "Rose") color = 0xff8aa3;
      if (typeName === "Kemboja") color = 0xffb3ff;
      if (typeName === "Melati") color = 0xfff1b3;
      f.__light = this.lights.addLight(f.x, f.y, 90, color, 0.6);

      return true;
    };

    // spawn around rose object (if present)
    if (roseObj) {
      spawnFlowerSafe(roseObj.x, roseObj.y, "roseAnim", "Rose");
      spawnFlowerSafe(roseObj.x + 48, roseObj.y + 6, "kembojaAnim", "Kemboja");
      spawnFlowerSafe(roseObj.x - 48, roseObj.y + 18, "melatiAnim", "Melati");
    }

    // spawn random flowers but ensure they are on ground and not on blocking tiles
    let extras = 6;
    let attempts = 0;
    while (extras > 0 && attempts < 300) {
      attempts++;
      const x = Phaser.Math.Between(64, map.widthInPixels - 64);
      const y = Phaser.Math.Between(64, map.heightInPixels - 64);
      const r = Phaser.Math.Between(0, 2);
      const anim = r === 0 ? "roseAnim" : (r === 1 ? "kembojaAnim" : "melatiAnim");
      const name = r === 0 ? "Rose" : (r === 1 ? "Kemboja" : "Melati");
      if (spawnFlowerSafe(x, y, anim, name)) extras--;
    }

    // overlap -> collect
    this.physics.add.overlap(this.player, this.flowerGroup, this.collectFlower, null, this);

    // --------- INPUT -------------
    this.cursors = this.input.keyboard.createCursorKeys();

    // --------- FLOWER COUNTER (UI) -------------
    this.totalFlowers = this.flowerGroup.getChildren().length;
    this.collectedSet = new Set();
    this.collectedText = this.add.text(16, 16, `Flowers: 0/${this.totalFlowers}`, { fontSize: "16px", fill: "#fff" }).setScrollFactor(0).setDepth(200);

    // --------- LIVES UI (top-right hearts) -------------
    this.maxLives = 5;
    if (typeof this.lives === "undefined" || this.lives === null) this.lives = this.maxLives;
    this.livesImages = [];
    const padding = 8;
    const heartSize = 40;
    const startX = this.scale.width - padding - heartSize;
    const startY = padding + 8;
    for (let i = 0; i < this.maxLives; i++) {
      // frame 4 = full heart (you requested)
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

    // --------- AUDIO -------------
    this.pickSound = this.sound.add("pick", { volume: 0.7 });
    // hit audio optional (only add if loaded)
    if (this.cache.audio.exists("hit")) {
      this.hitSound = this.sound.add("hit", { volume: 0.7 });
    }

    // damage flags
    this.playerInvulnerable = false;
    this.invulDuration = 1000;
  }

  update(time, delta) {
    // Guard cursors
    if (!this.cursors) return;

    // Player movement
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

    // update player light to follow
    if (this.playerLight) {
      this.playerLight.x = this.player.x;
      this.playerLight.y = this.player.y;
    }

    // ENEMY follow — fixed: use normalized vector for velocity (steady behaviour)
    const dist = Phaser.Math.Distance.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);
    if (dist > 24) {
      const nx = (this.player.x - this.enemy.x) / dist;
      const ny = (this.player.y - this.enemy.y) / dist;
      this.enemy.body.setVelocity(nx * this.enemyBaseSpeed, ny * this.enemyBaseSpeed);
    } else {
      this.enemy.body.setVelocity(0, 0);
    }

    // bobbing effect on enemy (soft)
    const bob = Math.sin(time / 300) * 6;
    this.enemy.y += 0; // physics position used; kept for clarity (we use physics body already)

    // Play enemy animation based on direction to player
    const dx = this.player.x - this.enemy.x;
    const dy = this.player.y - this.enemy.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      dx > 0 ? this.enemy.play("cikponti-right", true) : this.enemy.play("cikponti-left", true);
    } else {
      dy > 0 ? this.enemy.play("cikponti-down", true) : this.enemy.play("cikponti-up", true);
    }

    // update enemy glow to follow enemy
    if (this.enemyGlow) {
      this.enemyGlow.x = this.enemy.x;
      this.enemyGlow.y = this.enemy.y;
    }

    // update flower lights positions
    this.flowerGroup.getChildren().forEach((f) => {
      if (f && f.__light) {
        f.__light.x = f.x;
        f.__light.y = f.y;
      }
    });

    // UI updates
    this.collectedText.setText(`Flowers: ${this.collectedSet.size}/${this.totalFlowers}`);
    this.updateLivesDisplay();

    // check completion -> winner (room2 sends to winner)
    if (this.collectedSet.size >= this.totalFlowers) {
      this.time.delayedCall(350, () => {
        this.scene.start("winner", { inventory: Array.from(this.collectedSet), lives: this.lives });
      });
    }
  }

  collectFlower(player, flower) {
    // guard: ensure flower still exists and is an active sprite
    if (!flower || !flower.active) return;

    // play sound
    if (this.pickSound) this.pickSound.play();

    // unique id so same types counted multiple times
    const uid = flower.flowerType + "_" + Phaser.Math.RND.uuid();
    this.inventory.push(flower.flowerType);
    this.collectedSet.add(uid);

    // remove associated light safely
    if (flower.__light) {
      try { this.lights.removeLight(flower.__light); } catch (e) { /* ignore */ }
    }

    // popup Malay name
    const label = this.add.text(flower.x, flower.y - 20, flower.flowerType, { fontSize: "14px", fill: "#fff", backgroundColor: "rgba(0,0,0,0.5)" })
      .setOrigin(0.5)
      .setDepth(200);
    this.tweens.add({
      targets: label,
      y: label.y - 18,
      alpha: 0,
      duration: 900,
      onComplete: () => label.destroy(),
    });

    // finally destroy the flower sprite
    flower.destroy();
  }

  // hearts display: show full (frame 4) for lives, empty (frame 0) for lost
  updateLivesDisplay() {
    for (let i = 0; i < this.livesImages.length; i++) {
      const img = this.livesImages[i];
      if (i < this.lives) {
        img.setFrame(4); // full heart
        img.clearTint();
        img.setAlpha(1);
      } else {
        img.setFrame(0); // empty/grey frame
        img.setTint(0x555555);
        img.setAlpha(0.6);
      }
    }
  }

  hitEnemy(player, enemy) {
    if (this.playerInvulnerable) return;

    // decrement life & update hearts
    this.lives = Math.max(0, this.lives - 1);
    this.updateLivesDisplay();

    if (this.hitSound) this.hitSound.play();

    // camera shake
    this.cameras.main.shake(200, 0.01);

    // tint player red and small knockback
    player.setTint(0xff6666);
    this.playerInvulnerable = true;

    const nx = (player.x - enemy.x);
    const ny = (player.y - enemy.y);
    const mag = Math.sqrt(nx * nx + ny * ny) || 1;
    const kb = 140;
    player.body.setVelocity((nx / mag) * kb, (ny / mag) * kb);

    this.time.delayedCall(180, () => {
      player.body.setVelocity(0, 0);
      player.clearTint();
    });

    this.time.delayedCall(this.invulDuration || 1000, () => (this.playerInvulnerable = false));

    // if no lives left -> lose (pass inventory & lives)
    if (this.lives <= 0) {
      this.time.delayedCall(250, () => {
        this.scene.start("lose", { inventory: this.inventory, lives: this.lives });
      });
    }
  }
}

























