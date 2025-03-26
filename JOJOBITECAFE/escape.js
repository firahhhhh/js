class escape extends Phaser.Scene {
    constructor() {
      super({ key: 'escape' });
      this.player = null;
      this.cursors = null;
    }
      
    preload() {
        // Load assets
        this.load.image('pixel-cyberpunk-interiorimg', 'assets/pixel-cyberpunk-interior.png');
        this.load.image('pipoyaimg', 'assets/pipoya.png');
        this.load.image('free_overviewimg', 'assets/free_overview.png');
        this.load.tilemapTiledJSON('escape', 'assets/escape.tmj');
    }
        
    create() {
      // Create the tilemap and layers
      const map = this.make.tilemap({ key: 'escape' });
      const cyberpunkTileset = map.addTilesetImage('pixel-cyberpunk-interior', 'pixel-cyberpunk-interiorimg');
      const pipoyaTileset = map.addTilesetImage('pipoya', 'pipoyaimg');
      const free_overviewTiles = map.addTilesetImage('free_overview', 'free_overviewimg');
      let tilesArray = [cyberpunkTileset, pipoyaTileset, free_overviewTiles];
  
      // Create layers
      map.createLayer('object2', tilesArray);
      map.createLayer('object1', tilesArray);
      map.createLayer('floor', tilesArray);
     
  
    }
}