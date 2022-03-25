phina.define("SpriteQuestion", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(spritesheet, animation, x, y, width= QUESTION_WIDTH, height= QUESTION_HEIGHT) {
    //console.log("SpriteQuestionクラスinit");
    this.superInit(spritesheet, animation, x, y, width, height);
    // 初期位置
    this.sprite.x = x;
    this.sprite.y = y;
  }
});