class room1 extends Phaser.Scene {
  constructor() {
    super({ key: "room1" });
  }

  init(data) {
    this.player = data.player;
    this.inventory = data.inventory || [];
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

    // flowers sheet - same as room2
    this.load.spritesheet("flowersImg", "assets/flowers.png", { frameWidth: 500, frameHeight: 528 });

    // sounds
    this.load.audio("pick", "assets/pick.mp3");
    this.load.audio("hit", "assets/hit.mp3");

    // live hearts spritesheet
    this.load.spritesheet("liveImg", "assets/live.png", { frameWidth: 75, frameHeight: 67 });
  }

  create() {
    console.log("*** room1 scene");

    // MAP
    let map = this.make.tilemap({ key: "map2" });
    let pipoyaTiles = map.addTilesetImage("pipoya", "pipoyaIMG");
    let defimon1Tiles = map.addTilesetImage("defimon1", "defimon1IMG");
    let tilesArray = [defimon1Tiles, pipoyaTiles];

    this.floorlayer = map.createLayer("floor", tilesArray, 0, 0);
    this.objectlayer = map.createLayer("object", tilesArray, 0, 0);
    this.forestlayer = map.createLayer("forest", tilesArray, 0, 0);
    this.forest2layer = map.createLayer("forest2", tilesArray, 0, 0);
    this.forest3layer = map.createLayer("forest3", tilesArray, 0, 0);
    this.forest4layer = map.createLayer("forest4", tilesArray, 0, 0);

    let start = map.findObject("objectLayer", (obj) => obj.name === "start");
    let roseObj = map.findObject("objectLayer", (obj) => obj.name === "rose");
    let enemyObj = map.findObject("objectLayer", (obj) => obj.name === "enemy1");

    // PLAYER
    this.player = this.physics.add.sprite(start.x, start.y, "rossa");
    this.player.setCollideWorldBounds(true);

    if (!this.anims.exists("rossa-up")) {
      this.anims.create({ key: "rossa-up", frames: this.anims.generateFrameNumbers("rossa", { start: 105, end: 112 }), frameRate: 5, repeat: -1 });
      this.anims.create({ key: "rossa-left", frames: this.anims.generateFrameNumbers("rossa", { start: 118, end: 125 }), frameRate: 5, repeat: -1 });
      this.anims.create({ key: "rossa-down", frames: this.anims.generateFrameNumbers("rossa", { start: 131, end: 138 }), frameRate: 5, repeat: -1 });
      this.anims.create({ key: "rossa-right", frames: this.anims.generateFrameNumbers("rossa", { start: 144, end: 151 }), frameRate: 5, repeat: -1 });
    }

    // ENEMY - same approach as room2
    const enemyX = enemyObj ? enemyObj.x : 400;
    const enemyY = enemyObj ? enemyObj.y : 200;

    this.enemyBody = this.physics.add.sprite(enemyX, enemyY, null).setSize(40, 48).setVisible(false);
    this.enemyBody.setCollideWorldBounds(true);

    this.enemy = this.add.sprite(enemyX, enemyY, "cikponti").setDepth(10);
    if (!this.anims.exists("cikponti-up")) {
      this.anims.create({ key: "cikponti-up", frames: this.anims.generateFrameNumbers("cikponti", { start: 105, end: 112 }), frameRate: 5, repeat: -1 });
      this.anims.create({ key: "cikponti-left", frames: this.anims.generateFrameNumbers("cikponti", { start: 118, end: 125 }), frameRate: 5, repeat: -1 });
      this.anims.create({ key: "cikponti-down", frames: this.anims.generateFrameNumbers("cikponti", { start: 131, end: 138 }), frameRate: 5, repeat: -1 });
      this.anims.create({ key: "cikponti-right", frames: this.anims.generateFrameNumbers("cikponti", { start: 144, end: 151 }), frameRate: 5, repeat: -1 });
    }

    this.enemyBaseSpeed = 40; // same as room2
    this.lights.enable();
    this.enemy.setPipeline("Light2D");
    this.enemyBody.setPipeline("Light2D");
    this.enemyGlow = this.lights.addLight(this.enemyBody.x, this.enemyBody.y, 120, 0xff6666, 0.9);

    this.physics.add.overlap(this.player, this.enemyBody, this.hitEnemy, null, this);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;

    // NIGHT MODE
    this.lights.enable().setAmbientColor(0x202020);
    this.floorlayer.setPipeline("Light2D");
    this.objectlayer.setPipeline("Light2D");
    this.forestlayer.setPipeline("Light2D");
    this.forest2layer.setPipeline("Light2D");
    this.forest3layer.setPipeline("Light2D");
    this.forest4layer.setPipeline("Light2D");

    this.playerLight = this.lights.addLight(this.player.x, this.player.y, 300, 0xffffff, 1.6);
    this.player.setPipeline("Light2D");

    // FLOWERS (same as room2)
    if (!this.anims.exists("roseAnim")) {
      this.anims.create({ key: "roseAnim", frames: this.anims.generateFrameNumbers("flowersImg", { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
      this.anims.create({ key: "kembojaAnim", frames: this.anims.generateFrameNumbers("flowersImg", { start: 4, end: 7 }), frameRate: 6, repeat: -1 });
      this.anims.create({ key: "melatiAnim", frames: this.anims.generateFrameNumbers("flowersImg", { start: 8, end: 11 }), frameRate: 6, repeat: -1 });
    }

    this.flowerGroup = this.physics.add.group();
    this.flowerScale = 0.12;

    const spawnFlower = (x, y, animKey, typeName) => {
      let f = this.physics.add.sprite(x, y, "flowersImg").play(animKey).setScale(this.flowerScale).setDepth(10);
      f.body.setSize(f.width * 0.6, f.height * 0.4);
      f.flowerType = typeName;
      f.setPipeline("Light2D");
      this.flowerGroup.add(f);
      let color = 0xffffff;
      if (typeName === "Rose") color = 0xff8aa3;
      if (typeName === "Kemboja") color = 0xffb3ff;
      if (typeName === "Melati") color = 0xfff1b3;
      f.__light = this.lights.addLight(f.x, f.y, 90, color, 0.6);
    };

    if (roseObj) {
      spawnFlower(roseObj.x, roseObj.y, "roseAnim", "Rose");
      spawnFlower(roseObj.x + 48, roseObj.y + 6, "kembojaAnim", "Kemboja");
      spawnFlower(roseObj.x - 48, roseObj.y + 18, "melatiAnim", "Melati");
    }

    for (let i = 0; i < 5; i++) {
      let x = Phaser.Math.Between(64, map.widthInPixels - 64);
      let y = Phaser.Math.Between(64, map.heightInPixels - 64);
      let r = Phaser.Math.Between(0, 2);
      if (r === 0) spawnFlower(x, y, "roseAnim", "Rose");
      else if (r === 1) spawnFlower(x, y, "kembojaAnim", "Kemboja");
      else spawnFlower(x, y, "melatiAnim", "Melati");
    }

    this.physics.add.overlap(this.player, this.flowerGroup, this.collectFlower, null, this);

    this.totalFlowers = this.flowerGroup.getChildren().length;
    this.collectedSet = new Set();
    this.collectedText = this.add.text(16, 16, `Flowers: 0/${this.totalFlowers}`, { fontSize: "16px", fill: "#fff" }).setScrollFactor(0).setDepth(200);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.pickSound = this.sound.add("pick");
    this.hitSound = this.sound.add("hit", { volume: 0.6 });

    // HEARTS UI identical to room2
    this.maxLives = 5;
    this.livesImages = [];
    const padding = 8;
    const heartSize = 40;
    const startX = this.scale.width - padding - heartSize;
    const startY = padding + 8;
    for (let i = 0; i < this.maxLives; i++) {
      let frameIndex = (i < this.lives) ? 4 : 0;
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
  }

  update(time, delta) {
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

    // player light follow
    if (this.playerLight) {
      this.playerLight.x = this.player.x;
      this.playerLight.y = this.player.y;
    }

    // enemy movement using physics body and visual bobbing (same as room2)
    const dist = Phaser.Math.Distance.Between(this.enemyBody.x, this.enemyBody.y, this.player.x, this.player.y);
    if (dist > 24) this.physics.moveToObject(this.enemyBody, this.player, this.enemyBaseSpeed);
    else this.enemyBody.body.setVelocity(0, 0);

    const bob = Math.sin(time / 300) * 6;
    this.enemy.x = this.enemyBody.x;
    this.enemy.y = this.enemyBody.y + bob;

    let dx = this.player.x - this.enemyBody.x;
    let dy = this.player.y - this.enemyBody.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      dx > 0 ? this.enemy.play("cikponti-right", true) : this.enemy.play("cikponti-left", true);
    } else {
      dy > 0 ? this.enemy.play("cikponti-down", true) : this.enemy.play("cikponti-up", true);
    }

    if (this.enemyGlow) {
      this.enemyGlow.x = this.enemyBody.x;
      this.enemyGlow.y = this.enemyBody.y;
    }

    this.flowerGroup.getChildren().forEach((f) => {
      if (f.__light) {
        f.__light.x = f.x;
        f.__light.y = f.y;
      }
    });

    this.collectedText.setText(`Flowers: ${this.collectedSet.size}/${this.totalFlowers}`);

    // do not auto-go to winner in room1 (you asked to remove winner auto-jump in room1). For room1 we do not auto-jump; room2 does.
    // Teleport to room2 region (keeps your original teleport area)
    if (this.scene.key === "room1") {
      if (this.player.x > 554 && this.player.x < 614 && this.player.y > 291 && this.player.y < 384) {
        this.room2();
      }
    }
  }

  collectFlower(player, flower) {
    if (!flower || !flower.flowerType) return;
    if (this.pickSound) this.pickSound.play();

    const uid = flower.flowerType + "_" + Phaser.Math.RND.uuid();
    this.inventory.push(flower.flowerType);
    this.collectedSet.add(uid);

    if (flower.__light) this.lights.removeLight(flower.__light);

    const label = this.add.text(flower.x, flower.y - 20, flower.flowerType, { fontSize: "14px", fill: "#fff", backgroundColor: "rgba(0,0,0,0.5)" }).setOrigin(0.5).setDepth(200);
    this.tweens.add({ targets: label, y: label.y - 18, alpha: 0, duration: 900, onComplete: () => label.destroy() });

    flower.destroy();
  }

  hitEnemy(player, enemyBody) {
    if (this.playerInvulnerable) return;

    // decrement life, update hearts
    this.lives = Math.max(0, this.lives - 1);
    this.updateLivesDisplay();

    if (this.hitSound) this.hitSound.play();

    this.player.setTint(0xff6666);
    this.cameras.main.shake(200, 0.01);
    this.playerInvulnerable = true;

    const nx = this.player.x - enemyBody.x;
    const ny = this.player.y - enemyBody.y;
    const mag = Math.sqrt(nx * nx + ny * ny) || 1;
    const kb = 150;
    this.player.body.setVelocity((nx / mag) * kb, (ny / mag) * kb);

    this.time.delayedCall(150, () => this.player.clearTint());
    this.time.delayedCall(200, () => this.player.body.setVelocity(0, 0));
    this.time.delayedCall(1000, () => (this.playerInvulnerable = false));

    if (this.lives <= 0) {
      this.time.delayedCall(250, () => this.scene.start("lose", { inventory: this.inventory, lives: this.lives }));
    }
  }

  room2() {
    // when switching scenes, pass inventory + lives
    this.scene.start("room2", { inventory: this.inventory, lives: this.lives });
  }
}










