// mainhall.js
export default class MainHall extends Phaser.Scene {
  constructor() {
    super({ key: 'MainHall' });
    this.player = null;
    this.keyItem = null;
    this.enemy = null;
    this.cursors = null;
    this.hitSnd = null;
  }

  preload() {
    // Tiles & sprites
    this.load.image('pixel-cyberpunk-interiorimg', 'assets/pixel-cyberpunk-interior.png');
    this.load.image('pipoyaimg', 'assets/pipoya.png');
    this.load.image('free_overviewimg', 'assets/free_overview.png');
    this.load.tilemapTiledJSON('mainhall', 'assets/mainhall.tmj');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('freddyImg', 'assets/freddy.png', { frameWidth: 40, frameHeight: 80 });
    this.load.image('keyImg', 'assets/key.png');

    // Audio
    this.load.audio('keySound', 'assets/keySound.mp3');
    this.load.audio('hitSound', 'assets/hitSound.mp3');
  }

  create() {
    // Tilemap + layers
    const map = this.make.tilemap({ key: 'mainhall' });
    const tilesets = [
      map.addTilesetImage('pixel-cyberpunk-interior', 'pixel-cyberpunk-interiorimg'),
      map.addTilesetImage('pipoya', 'pipoyaimg'),
      map.addTilesetImage('free_overview', 'free_overviewimg')
    ];
    map.createLayer('floor', tilesets, 0, 0);
    map.createLayer('food', tilesets, 0, 0);
    map.createLayer('table', tilesets, 0, 0);
    map.createLayer('chashier', tilesets, 0, 0);

    // Player
    this.player = this.physics.add.sprite(150, 570, 'player').setCollideWorldBounds(true);
    this.createPlayerAnims();

    // Freddy (enemy)
    this.enemy = this.physics.add.sprite(400, 200, 'freddyImg')
      .setDepth(600)
      .setTint(0xff0000);
    this.physics.add.overlap(this.player, this.enemy, this.hitEnemy, null, this);

    // Key pickup
    this.keyItem = this.physics.add.sprite(50, 485, 'keyImg');
    this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);

    // Sounds
    this.hitSnd = this.sound.add('hitSound');

    // Input & camera
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player);
  }

  update() {
    this.handlePlayerMovement();
    this.handleEnemyChase();
    this.checkSceneBounds();
  }

  createPlayerAnims() {
    this.anims.create({ key: 'player-left',  frames: this.anims.generateFrameNumbers('player',{start:0,end:2}), frameRate:5, repeat:-1 });
    this.anims.create({ key: 'player-up',    frames: this.anims.generateFrameNumbers('player',{start:3,end:5}), frameRate:5, repeat:-1 });
    this.anims.create({ key: 'player-down',  frames: this.anims.generateFrameNumbers('player',{start:6,end:8}), frameRate:5, repeat:-1 });
    this.anims.create({ key: 'player-right', frames: this.anims.generateFrameNumbers('player',{start:9,end:11}),frameRate:5,repeat:-1 });
  }

  handlePlayerMovement() {
    const speed = 200;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown)  { this.player.setVelocityX(-speed); this.player.anims.play('player-left', true); }
    else if (this.cursors.right.isDown) { this.player.setVelocityX(speed); this.player.anims.play('player-right', true); }
    if (this.cursors.up.isDown)    { this.player.setVelocityY(-speed); this.player.anims.play('player-up', true); }
    else if (this.cursors.down.isDown)  { this.player.setVelocityY(speed); this.player.anims.play('player-down', true); }

    if (!this.cursors.left.isDown && !this.cursors.right.isDown &&
        !this.cursors.up.isDown   && !this.cursors.down.isDown) {
      this.player.anims.stop();
    }
  }

  handleEnemyChase() {
    if (this.enemy.active) {
      this.physics.moveToObject(this.enemy, this.player, 60);
      const dist = Phaser.Math.Distance.Between(
        this.enemy.x, this.enemy.y, this.player.x, this.player.y
      );
      if (dist < 10) {
        this.enemy.body.setVelocity(0, 0);
      }
    }
  }

  checkSceneBounds() {
    // Switch to Kitchen if at door area
    if (this.player.x >= 32 && this.player.x <= 35 &&
        this.player.y >= 165 && this.player.y <= 180) {
      this.scene.start('kitchen', { player: this.player });
    }
  }

  collectKey(player, key) {
    this.sound.play('keySound');
    key.disableBody(true, true);
  }

  hitEnemy(player, enemy) {
    // Play hit sound & shake
    this.hitSnd.play();
    this.cameras.main.shake(300);
    enemy.disableBody(true, true);

    // After 0.5s, go to GameOver
    this.time.delayedCall(500, () => {
      this.scene.start('gameover');
    });
    
    // Add ENTER key listener (same as intro.js)
    this.input.keyboard.once('keydown-ENTER', () => {
      // Transition to MainHall scene
      this.scene.start('MainHall'); 
    });
  }
}


