phina.define("SpriteAnswerer", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(animation, x, y, width= ANSWERER_WIDTH, height= ANSWERER_HEIGHT) {
    //console.log("SpriteAnswererクラスinit");
    this.superInit("answerer", animation, x, y, width, height);
    // 初期位置
    this.sprite.x = x;
    this.sprite.y = y;
  }
});