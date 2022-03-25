phina.define("SpriteButtonStart", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(animation, x, y, width= START_BUTTON_WIDTH, height= START_BUTTON_HEIGHT) {
    //console.log("SpriteButtonStartクラスinit");
    this.superInit("start_button", animation, x, y, width, height);
    // 初期位置
    this.sprite.x = x;
    this.sprite.y = y;
  }
});