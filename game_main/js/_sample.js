phina.globalize();

TITLE = "phina.jsでギャラリープログラムを作った"；

SCREEN_WIDTH = 2304;
SCREEN_HEIGHT = 1440;
IMAGE_WIDTH = 480;
IMAGE_HEIGHT = 640;
IMAGE_FILE_NAME = "img";
UPDATE_TIME = 30000;
FRAME_MOVE_TIME = 5000;

phina.define('MainScene', {
superClass: 'DisplayScene',

init: function(option) {
  this.superInit(option);
  
  // グリッド
  var self = this;
  var gx = this.gridX;
  var gy = this.gridY;
  var xidx = 0;
  var yidx = 0;
  var cidx = 0;
  var buttons = [];
  var imgsize = 0;
  var works = [];
  
  var rectGroup = DisplayElement().addChildTo(this);
  var rects = [];
  
  (4).times(function(spanY){
    (5).times(function(spanX){
      var rect = RectangleShape({
        width: IMAGE_WIDTH/2,
        height: IMAGE_HEIGHT/2,
        fill: 'transparent',
        stroke: 'transparent'
      }).addChildTo(rectGroup).setPosition(gx.span(spanX*2+1), gy.span(spanY*4.5+4.5));
      rects.push(rect);
    });
  });
  
  var buttonGroup = DisplayElement();
  
  // アセットローダー
  var loader = phina.asset.AssetLoader();
  
  rectGroup.tweener.call(function(){
      this.loadPicture(imgsize, loader)
  }, this).wait(UPDATE_TIME).setLoop(true);
  
  // ボタン
  Button({text: 'PUSH'})
    .addChildTo(this)
    .setPosition(gx.span(15), gy.span(1))
    .on('push', function(){
      self.loadPicture(imgsize, loader)
    });
  // ロード後処理
  loader.on('load', function() {
    var img = new Image();
    img.src = IMAGE_FILE_NAME+imgsize+'.png';
    works.push(Sprite('work', img.width, img.height));
    (20).times(function(i){
      if(rects[i].children.first) rects[i].children.first.remove();
      let w = works[i%works.length];
      let per = self.getPictureSizeScale(w.width, w.height)*0.5;
      Sprite(w._image, w.width, w.height).addChildTo(rects[i]).setScale(per, per);
    });
    self.updatePicture(xidx, yidx, rect, rects);
    imgsize++;
  });
  
  // 縦線
  var axeY = RectangleShape({
    width: 2,
    height: gy.width,
    fill: '#aaa',
  }).addChildTo(this).setPosition(gx.span(10), gy.center()+gy.span(2));
  axeY.alpha = 0.5;
  
  var frame = RectangleShape({
    width: IMAGE_WIDTH/2,
    height: IMAGE_HEIGHT/2,
    fill: 'transparent',
    stroke: 'yellow',
    strokeWidth: 8,
  }).addChildTo(rectGroup).setPosition(gx.span(1), gy.span(4.5));
  
  var rect = RectangleShape({
    width: IMAGE_WIDTH*1.5,
    height: IMAGE_HEIGHT*1.5,
    fill: 'transparent',
    stroke: 'transparent',
  }).addChildTo(rectGroup).setPosition(gx.span(13), gy.center()+gy.span(1));
  
  var labelRect = RectangleShape({
    width: gx.width,
    height: 200,
    fill: '#fff',
    stroke: 'transparent',
  }).addChildTo(this).setPosition(gx.center(), gy.span(0.5));
  var label = Label({
    text: TITLE,
    fontSize:100,
    fontWeight:"bold",
    align:"left",
    fill: 'black',
  }).addChildTo(labelRect);
  label.x = -SCREEN_WIDTH/2+50;
  label.y += 50;
  buttonGroup.addChildTo(labelRect);
  frame.tweener.to({
    x: gx.span(1),
  }, FRAME_MOVE_TIME*0.16, "swing").call(function(){
    xidx = 0;
    this.updatePicture(xidx, yidx, rect, rects);
  }, this).wait(FRAME_MOVE_TIME).to({
    x: gx.span(3),
  }, FRAME_MOVE_TIME*0.1, "swing").call(function(){
    xidx = 1;
    this.updatePicture(xidx, yidx, rect, rects);
  }, this).wait(FRAME_MOVE_TIME).to({
    x: gx.span(5),
  }, FRAME_MOVE_TIME*0.1, "swing").call(function(){
    xidx = 2;
    this.updatePicture(xidx, yidx, rect, rects);
  }, this).wait(FRAME_MOVE_TIME).to({
    x: gx.span(7),
  }, FRAME_MOVE_TIME*0.1, "swing").call(function(){
    xidx = 3;
    this.updatePicture(xidx, yidx, rect, rects);
  }, this).wait(FRAME_MOVE_TIME).to({
    x: gx.span(9),
  }, FRAME_MOVE_TIME*0.1, "swing").call(function(){
    xidx = 4;
    this.updatePicture(xidx, yidx, rect, rects);
  }, this).wait(FRAME_MOVE_TIME).call(function(){
    (19).times(function(span){
      rects[span].tweener2 = phina.accessory.Tweener().attachTo(rects[span]);
      rects[span].tweener2.by({
        y: -gy.span(4.5),
      }, FRAME_MOVE_TIME*0.16, "swing");
    });
    yidx = (yidx+1)%4;
    cidx = (cidx+1)%works.length;
    rects[19].tweener2 = phina.accessory.Tweener().attachTo(rects[19]);
    rects[19].tweener2.by({
      y: -gy.span(4.5),
    }, FRAME_MOVE_TIME*0.16, "swing").call(function(){
      (5).times(function(span){
        rects[span+(yidx+3)%4*5].y = gy.span(3*4.5+4.5);
        if(rects[span+(yidx+3)%4*5].children.first) rects[span+(yidx+3)%4*5].children.first.remove();
        let w = works[(span+(cidx+3)*5)%works.length];
        let per = self.getPictureSizeScale(w.width, w.height)*0.5;
        Sprite(w._image, w.width, w.height).addChildTo(rects[span+(yidx+3)%4*5]).setScale(per, per);
      });
    });
  }).setLoop(true);
},
loadPicture: function(imgsize, loader){
  var img = new Image();
  img.src = IMAGE_FILE_NAME+imgsize+'.png';
  img.onload = function() { 
  // アセット追加読み込み
  loader.load({
    image: {
      work : IMAGE_FILE_NAME+imgsize+'.png',
    },
  });
 }
},
updatePicture: function(xidx, yidx, rect, rects){
  if(rect.children.first) rect.children.first.remove();
  let w = rects[xidx+yidx*5].children.first;
  let per = this.getPictureSizeScale(w.width, w.height)*1.5;
  Sprite(w._image, w.width, w.height).addChildTo(rect).setScale(per, per);
},
getPictureSizeScale: function(width, height){
  if(width == height) return (IMAGE_WIDTH < IMAGE_HEIGHT ? IMAGE_WIDTH/width : IMAGE_HEIGHT/height);
  return (width > height ? IMAGE_WIDTH/width : IMAGE_HEIGHT/height);
},
});

phina.main(function() {
var app = GameApp({
  startLabel: 'main',
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
});

app.run();
});
