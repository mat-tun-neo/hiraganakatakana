phina.define("SpriteButtonX", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(animation, x, y, width= BUTTON_SIZE, height= BUTTON_SIZE) {
    //console.log("SpriteButtonXクラスinit");
    this.superInit("x_button", animation, x, y, width, height);
    // 初期位置
    this.sprite.x = x;
    this.sprite.y = y;
  }
});