phina.define("SpriteQuestioner", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(animation, x, y, width= QUESTIONER_WIDTH, height= QUESTIONER_HEIGHT) {
    //console.log("SpriteQuestionクラスinit");
    this.superInit("questioner", animation, x, y, width, height);
    // 初期位置
    this.sprite.x = x;
    this.sprite.y = y;
  }
});