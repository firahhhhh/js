(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("kitchen",
{ "compressionlevel":-1,
 "height":20,
 "infinite":false,
 "layers":[
        {
         "draworder":"topdown",
         "id":5,
         "name":"chica",
         "objects":[
                {
                 "height":0,
                 "id":1,
                 "name":"",
                 "point":true,
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":0,
                 "x":565.413533834586,
                 "y":63.1578947368421
                }],
         "opacity":1,
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }, 
        {
         "data":[4418, 4399, 4399, 4399, 4399, 4399, 4399, 4399, 4399, 4399, 4399, 4399, 4399, 4399, 4399, 4399, 4399, 4399, 4399, 4400,
            4439, 3549, 3541, 3541, 3549, 3541, 3541, 4303, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3549, 3541, 3549, 3549, 4443,
            4419, 3549, 3549, 3549, 3541, 3549, 3549, 3541, 3541, 3541, 3541, 3541, 3549, 3541, 3541, 3541, 3549, 3549, 3541, 4443,
            3549, 3541, 3549, 3541, 3541, 3549, 3541, 3549, 3541, 3549, 3541, 3541, 3541, 3549, 3541, 3541, 3549, 3549, 3549, 4443,
            3549, 3549, 3541, 3549, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3549, 3549, 3541, 3549, 4443,
            4461, 3541, 3549, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3549, 3549, 3549, 3549, 4443,
            4439, 3541, 3549, 3541, 3549, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 4443,
            4439, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3549, 3541, 3541, 3541, 3549, 3541, 3541, 3549, 3549, 3549, 3549, 4443,
            4439, 3541, 3541, 3541, 3549, 3549, 3541, 3549, 3541, 3549, 3549, 3549, 3549, 3541, 3549, 3541, 3549, 3541, 3541, 4443,
            4439, 3541, 3549, 3541, 3541, 3549, 3541, 3541, 3541, 3549, 3549, 3541, 3541, 3541, 3541, 3549, 3549, 3541, 3549, 4443,
            4439, 3549, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3541, 3549, 3541, 3541, 3541, 3541, 3541, 3549, 3549, 4443,
            4460, 4483, 4483, 4483, 4483, 4483, 4483, 4483, 4483, 4483, 4483, 4483, 4483, 4483, 4483, 4483, 4483, 4483, 4483, 4464,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":20,
         "id":2,
         "name":"floor",
         "offsetx":0.751879699248093,
         "offsety":-0.751879699248121,
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 4121, 0, 4125, 4126, 4127, 4128, 4020, 4019, 4021, 4020, 4018, 4018, 4013, 4124, 4116, 0, 0, 0, 0,
            0, 4107, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            4086, 4088, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            4102, 4104, 0, 0, 0, 4062, 4063, 4063, 4063, 4063, 4063, 4063, 4063, 4063, 4064, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 4070, 4071, 4071, 4071, 4071, 4071, 4071, 4071, 4071, 4072, 0, 0, 0, 0, 0,
            0, 3925, 0, 0, 0, 4078, 4079, 4079, 4079, 4079, 4079, 4079, 4079, 4079, 4080, 0, 0, 0, 0, 0,
            0, 3933, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 3933, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 3941, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2395, 2396, 2397, 2398, 0, 0, 0, 0,
            0, 0, 0, 0, 4081, 4082, 4083, 4081, 4082, 4083, 0, 0, 2453, 2454, 2455, 2456, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":20,
         "id":3,
         "name":"object 1",
         "offsetx":0,
         "offsety":-0.751879699248121,
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 4260, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 3299, 4268, 0, 0, 0, 4303, 3311, 0, 4255, 4256, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 3311, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 3311, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4240, 0, 3299, 0, 0, 0, 0,
            3311, 0, 0, 0, 0, 4302, 0, 4254, 0, 4240, 4231, 4232, 0, 4248, 4240, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 4233, 4229, 0, 4235, 4248, 3311, 4255, 4230, 4221, 4248, 0, 0, 0, 0, 0,
            0, 4215, 0, 0, 0, 0, 0, 0, 0, 4226, 4226, 4226, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 4224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 4223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 4239, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 3299, 0, 0, 4303, 0, 0, 0, 4247, 0, 0, 0, 0, 0, 0, 3299, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":20,
         "id":4,
         "name":"object 2",
         "offsetx":-0.503759398496186,
         "offsety":3.25563909774435,
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }],
 "nextlayerid":6,
 "nextobjectid":2,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.8.6",
 "tileheight":32,
 "tilesets":[
        {
         "columns":58,
         "firstgid":1,
         "image":"free_overview.png",
         "imageheight":1792,
         "imagewidth":1886,
         "margin":0,
         "name":"free_overview",
         "spacing":0,
         "tilecount":3248,
         "tileheight":32,
         "tilewidth":32
        }, 
        {
         "columns":8,
         "firstgid":3249,
         "image":"pipoya.png",
         "imageheight":4256,
         "imagewidth":256,
         "margin":0,
         "name":"pipoya",
         "spacing":0,
         "tilecount":1064,
         "tileheight":32,
         "tilewidth":32
        }, 
        {
         "columns":21,
         "firstgid":4313,
         "image":"pixel-cyberpunk-interior.png",
         "imageheight":352,
         "imagewidth":672,
         "margin":0,
         "name":"pixel-cyberpunk-interior",
         "spacing":0,
         "tilecount":231,
         "tileheight":32,
         "tilewidth":32
        }],
 "tilewidth":32,
 "type":"map",
 "version":"1.8",
 "width":20
});