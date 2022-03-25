phina.define("SpriteButtonGoal", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(animation, x, y, width= GOAL_BUTTON_WIDTH, height= GOAL_BUTTON_HEIGHT) {
    //console.log("SpriteButtonGoalクラスinit");
    this.superInit("goal_button", animation, x, y, width, height);
    // 初期位置
    this.sprite.x = x;
    this.sprite.y = y;
  }
});