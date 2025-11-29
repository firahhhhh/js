var config = {
  type: Phaser.AUTO,
  width: 32 * 20,
  height: 32 * 20,
  physics: {
    default: "arcade",
    arcade: {
      debug: false // <- turn off debug to remove pink outlines
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: "#000000",
  pixelArt: true,
  scene: [main1, main2, main3, main4, main5, world, room1, room2, winner, winner2, lose],
};

var game = new Phaser.Game(config);
