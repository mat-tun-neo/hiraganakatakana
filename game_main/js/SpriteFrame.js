phina.define("SpriteFrame", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(animation, x, y, width= FRAME_WIDTH, height= FRAME_HEIGHT) {
    //console.log("SpriteFrameクラスinit");
    this.superInit("frame", animation, x, y, width, height);
    // 初期位置
    this.sprite.x = x;
    this.sprite.y = y;
  }
});