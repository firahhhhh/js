class room2 extends Phaser.Scene {
  constructor() {
    super({ key: "room2" });
  }

  init(data) {
    this.inventory = data.inventory || [];
    // persist lives between scenes if provided, otherwise start with maxLives
    this.lives = (typeof data.lives !== "undefined") ? data.lives : 5;
  }

  preload() {
    this.load.tilemapTiledJSON("map3", "assets/map3.tmj");
    this.load.image("pipoyaIMG", "assets/pipoya.png");
    this.load.image("defimon1IMG", "assets/defimon1.png");

    this.load.spritesheet("rossa", "assets/rossa.png", { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet("cikponti", "assets/cikponti.png", { frameWidth: 64, frameHeight: 64 });

    // flowers sheet: 2000x1584 => 4 cols x 3 rows => frameWidth=500, frameHeight=528
    this.load.spritesheet("flowersImg", "assets/flowers.png", { frameWidth: 500, frameHeight: 528 });

    this.load.audio("pick", "assets/pick.mp3");
    this.load.audio("hit", "assets/hit.mp3");

    // live hearts: your image is 375x67 with 5 frames (0..4) horizontally -> frameWidth=75
    this.load.spritesheet("liveImg", "assets/live.png", { frameWidth: 75, frameHeight: 67 });
  }

  create() {
    console.log("*** room2 scene");

    // ---------- map & layers ----------
    let map = this.make.tilemap({ key: "map3" });
    let pipoyaTiles = map.addTilesetImage("pipoya", "pipoyaIMG");
    let defimon1Tiles = map.addTilesetImage("defimon1", "defimon1IMG");
    let tilesArray = [defimon1Tiles, pipoyaTiles];

    this.floorlayer = map.createLayer("floor", tilesArray, 0, 0);
    this.floor2layer = map.createLayer("floor2", tilesArray, 0, 0);
    this.object1layer = map.createLayer("object1", tilesArray, 0, 0);
    this.object2layer = map.createLayer("object2", tilesArray, 0, 0);
    this.object3layer = map.createLayer("object3", tilesArray, 0, 0);
    this.object4layer = map.createLayer("object4", tilesArray, 0, 0);

    // ---------- objects ----------
    let startObj = map.findObject("objectLayer", (o) => o.name === "start");
    let roseObj = map.findObject("objectLayer", (o) => o.name === "rose");
    let enemyObj = map.findObject("objectLayer", (o) => o.name === "enemy1");

    // ---------- player ----------
    this.player = this.physics.add.sprite(startObj.x, startObj.y, "rossa");
    this.player.setCollideWorldBounds(true);

    // player animations (create only if not exist)
    if (!this.anims.exists("rossa-left")) {
      this.anims.create({ key: "rossa-left", frames: this.anims.generateFrameNumbers("rossa", { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    }
    if (!this.anims.exists("rossa-right")) {
      this.anims.create({ key: "rossa-right", frames: this.anims.generateFrameNumbers("rossa", { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    }
    if (!this.anims.exists("rossa-up")) {
      this.anims.create({ key: "rossa-up", frames: this.anims.generateFrameNumbers("rossa", { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
    }
    if (!this.anims.exists("rossa-down")) {
      this.anims.create({ key: "rossa-down", frames: this.anims.generateFrameNumbers("rossa", { start: 12, end: 15 }), frameRate: 10, repeat: -1 });
    }

    // ---------- enemy (physics body + visual container) ----------
    const ex = enemyObj ? enemyObj.x : 400;
    const ey = enemyObj ? enemyObj.y : 200;

    // physics body (invisible)
    this.enemyBody = this.physics.add.sprite(ex, ey, null).setSize(20, 20).setOffset(0, 0);
    this.enemyBody.setCollideWorldBounds(true);

    // visual sprite inside a container to float independently
    this.enemySprite = this.add.sprite(0, 0, "cikponti");
    this.enemyContainer = this.add.container(this.enemyBody.x, this.enemyBody.y, [ this.enemySprite ]);
    this.enemySprite.setOrigin(0.5, 0.5);

    // animations for visual enemy
    if (!this.anims.exists("cikponti-left")) {
      this.anims.create({ key: "cikponti-left", frames: this.anims.generateFrameNumbers("cikponti", { start: 118, end: 125 }), frameRate: 5, repeat: -1 });
    }
    if (!this.anims.exists("cikponti-right")) {
      this.anims.create({ key: "cikponti-right", frames: this.anims.generateFrameNumbers("cikponti", { start: 144, end: 151 }), frameRate: 5, repeat: -1 });
    }
    if (!this.anims.exists("cikponti-up")) {
      this.anims.create({ key: "cikponti-up", frames: this.anims.generateFrameNumbers("cikponti", { start: 105, end: 112 }), frameRate: 5, repeat: -1 });
    }
    if (!this.anims.exists("cikponti-down")) {
      this.anims.create({ key: "cikponti-down", frames: this.anims.generateFrameNumbers("cikponti", { start: 131, end: 138 }), frameRate: 5, repeat: -1 });
    }

    // start animation
    this.enemySprite.play("cikponti-down");

    // enemy params
    this.enemyBaseSpeed = 40;
    this.enemyFloatingAmp = 6; // pixels of bob
    this.enemyFloatingSpeed = 0.004; // change for faster/slower bob
    this.enemyBaseY = this.enemyBody.y;

    // make enemy glow light (uses the display container position)
    this.lights.enable().setAmbientColor(0x111116);
    this.enemyGlow = this.lights.addLight(this.enemyContainer.x, this.enemyContainer.y, 140, 0xff6666, 0.9);
    this.enemySprite.setPipeline("Light2D");

    // ---------- collisions ----------
    this.physics.add.overlap(this.player, this.enemyBody, this.hitEnemy, null, this);

    // ---------- camera/world ----------
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;

    // ---------- lights (player + tiles) ----------
    // make layers receive lighting
    this.floorlayer.setPipeline("Light2D");
    this.floor2layer.setPipeline("Light2D");
    this.object1layer.setPipeline("Light2D");
    this.object2layer.setPipeline("Light2D");
    this.object3layer.setPipeline("Light2D");
    this.object4layer.setPipeline("Light2D");

    // player light
    this.playerLightRadius = 260;
    this.playerLightIntensity = 1.4;
    this.playerLight = this.lights.addLight(this.player.x, this.player.y, this.playerLightRadius, 0xffffff, this.playerLightIntensity);
    this.player.setPipeline("Light2D");

    // set enemyBody invisible (we use container visually)
    this.enemyBody.setVisible(false);

    // ---------- flowers ----------
    // animations (red=Rose, pink=Kemboja, yellow=Melati)
    if (!this.anims.exists("roseAnim")) this.anims.create({ key: "roseAnim", frames: this.anims.generateFrameNumbers("flowersImg",{ start: 0, end:3 }), frameRate:6, repeat:-1 });
    if (!this.anims.exists("kembojaAnim")) this.anims.create({ key: "kembojaAnim", frames: this.anims.generateFrameNumbers("flowersImg",{ start: 4, end:7 }), frameRate:6, repeat:-1 });
    if (!this.anims.exists("melatiAnim")) this.anims.create({ key: "melatiAnim", frames: this.anims.generateFrameNumbers("flowersImg",{ start: 8, end:11 }), frameRate:6, repeat:-1 });

    this.flowerGroup = this.physics.add.group();
    this.flowerScale = 0.12;

    const spawnFlower = (x, y, animKey, typeName) => {
      let f = this.physics.add.sprite(x, y, "flowersImg").play(animKey).setScale(this.flowerScale).setDepth(10);
      f.body.setSize(f.width * 0.6, f.height * 0.4);
      f.flowerType = typeName;
      f.setPipeline("Light2D");
      this.flowerGroup.add(f);
      // colored glow
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

    const extraCount = 6;
    for (let i = 0; i < extraCount; i++) {
      let x = Phaser.Math.Between(64, map.widthInPixels - 64);
      let y = Phaser.Math.Between(64, map.heightInPixels - 64);
      let r = Phaser.Math.Between(0,2);
      if (r===0) spawnFlower(x,y,"roseAnim","Rose");
      else if (r===1) spawnFlower(x,y,"kembojaAnim","Kemboja");
      else spawnFlower(x,y,"melatiAnim","Melati");
    }

    this.physics.add.overlap(this.player, this.flowerGroup, this.collectFlower, null, this);

    // ---------- input & UI ----------
    this.cursors = this.input.keyboard.createCursorKeys();

    this.totalFlowers = this.flowerGroup.getChildren().length;
    this.collectedSet = new Set();
    this.collectedText = this.add.text(16,16,`Flowers: 0/${this.totalFlowers}`, { fontSize: "16px", fill: "#fff" }).setScrollFactor(0).setDepth(200);

    // ---------- lives UI (hearts top-right) ----------
    this.maxLives = 5;
    if (typeof this.lives === "undefined" || this.lives === null) this.lives = this.maxLives;
    this.livesImages = [];
    const padding = 8;
    const heartSize = 36;
    for (let i = 0; i < this.maxLives; i++) {
      // show full heart -> frame index 4 (your request). empty = 0
      const frameIndex = (i < this.lives) ? 4 : 0;
      const heart = this.add.image(this.scale.width - padding - (i+1)*(heartSize+6) + (heartSize+6)/2, padding, "liveImg", frameIndex).setScrollFactor(0).setDepth(1000);
      heart.setDisplaySize(heartSize, heartSize).setOrigin(0.5,0);
      this.livesImages.push(heart);
    }

    // update display helper
    this.updateLivesDisplay = function() {
      for (let i=0;i<this.livesImages.length;i++){
        const img = this.livesImages[i];
        if (i < this.lives) img.setFrame(4); else img.setFrame(0);
      }
    };
    this.updateLivesDisplay();

    // ---------- sounds ----------
    this.pickSound = this.sound.add("pick");
    // hit sound may not exist - try/catch playback later
    try { this.hitSound = this.sound.add("hit"); } catch(e) { this.hitSound = null; }

    // invul
    this.playerInvulnerable = false;
    this.invulDuration = 1000; // ms
  }

  update(time, delta) {
    // player movement
    const speed = 200;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) { this.player.setVelocityX(-speed); this.player.play("rossa-left", true); }
    else if (this.cursors.right.isDown) { this.player.setVelocityX(speed); this.player.play("rossa-right", true); }
    if (this.cursors.up.isDown) { this.player.setVelocityY(-speed); this.player.play("rossa-up", true); }
    else if (this.cursors.down.isDown) { this.player.setVelocityY(speed); this.player.play("rossa-down", true); }

    if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
      this.player.anims.stop();
    }

    // update lights to follow player
    if (this.playerLight) { this.playerLight.x = this.player.x; this.playerLight.y = this.player.y; }

    // ---------- enemy follow using physics body (manual normalized velocity) ----------
    const dx = this.player.x - this.enemyBody.x;
    const dy = this.player.y - this.enemyBody.y;
    const dist = Math.hypot(dx,dy);
    if (dist > 24) {
      const vx = (dx / dist) * this.enemyBaseSpeed;
      const vy = (dy / dist) * this.enemyBaseSpeed;
      this.enemyBody.setVelocity(vx, vy);
    } else {
      this.enemyBody.setVelocity(0,0);
    }

    // update visual container to the body position + floating offset
    // base position = enemyBody.x,y then add bob offset
    this.enemyBaseY = this.enemyBody.y;
    const bob = Math.sin(time * this.enemyFloatingSpeed) * this.enemyFloatingAmp;
    this.enemyContainer.x = this.enemyBody.x;
    this.enemyContainer.y = this.enemyBaseY + bob;

    // update enemy animation based on direction
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) this.enemySprite.play("cikponti-right", true);
      else this.enemySprite.play("cikponti-left", true);
    } else {
      if (dy > 0) this.enemySprite.play("cikponti-down", true);
      else this.enemySprite.play("cikponti-up", true);
    }

    // update enemy glow position
    if (this.enemyGlow) { this.enemyGlow.x = this.enemyContainer.x; this.enemyGlow.y = this.enemyContainer.y; }
    // update flower lights
    this.flowerGroup.getChildren().forEach(f => { if (f.__light) { f.__light.x = f.x; f.__light.y = f.y; } });
    // update collected text
    this.collectedText.setText(`Flowers: ${this.collectedSet.size}/${this.totalFlowers}`);

    // check completion -> jump to winner
    if (this.collectedSet.size >= this.totalFlowers) {
      this.time.delayedCall(350, () => { this.scene.start("winner", { inventory: Array.from(this.collectedSet), lives: this.lives }); });
    }
  }

  collectFlower(player, flower) {
    if (!flower || !flower.flowerType) return;
    if (this.pickSound) this.pickSound.play();
    const uid = flower.flowerType + "_" + Phaser.Math.RND.uuid();
    this.inventory.push(flower.flowerType);
    this.collectedSet.add(uid);
    if (flower.__light) this.lights.removeLight(flower.__light);

    // popup Malay name
    const label = this.add.text(flower.x, flower.y - 20, flower.flowerType, { fontSize: "14px", fill: "#fff", backgroundColor: "rgba(0,0,0,0.5)" }).setOrigin(0.5).setDepth(200);
    this.tweens.add({ targets: label, y: label.y - 18, alpha: 0, duration: 900, onComplete: () => label.destroy() });

    flower.destroy();
  }

  // update hearts display when lives change
  updateLivesDisplay() {
    for (let i=0;i<this.livesImages.length;i++){
      const img = this.livesImages[i];
      if (i < this.lives) img.setFrame(4); else img.setFrame(0);
    }
  }

  hitEnemy(player, enemyBody) {
    if (this.playerInvulnerable) return;
    // play hit sound if available
    if (this.hitSound) this.hitSound.play();

    // camera shake
    this.cameras.main.shake(200, 0.01);

    // reduce life
    this.lives = Math.max(0, this.lives - 1);
    this.updateLivesDisplay();

    // flash tint & invul
    this.player.setTint(0xff6666);
    this.playerInvulnerable = true;

    // brief knockback
    const nx = this.player.x - enemyBody.x;
    const ny = this.player.y - enemyBody.y;
    const mag = Math.hypot(nx, ny) || 1;
    this.player.body.setVelocity((nx / mag) * 120, (ny / mag) * 120);
    this.time.delayedCall(200, () => this.player.body.setVelocity(0,0));
    this.time.delayedCall(150, ()=> this.player.clearTint());
    this.time.delayedCall(this.invulDuration, ()=> this.playerInvulnerable = false);

    // if zero lives -> lose
    if (this.lives <= 0) {
      this.time.delayedCall(250, ()=> this.scene.start("lose", { inventory: this.inventory, lives: this.lives }));
    }
  }
}





















