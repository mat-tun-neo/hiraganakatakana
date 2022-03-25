phina.define("SpriteMoji", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(animation, x, y, width, height) {
    //console.log("SpriteMojiクラスinit");
    this.superInit("mojiwaku", animation, x, y, width, height);
    // 初期位置
    this.sprite.x = x;
    this.sprite.y = y;
    // 文字
    this.nameLabel = Label().addChildTo(this);
    this.nameLabel.text = "";
    // 移動位置
    this.targetX = x;
    this.targetY = y;
    // 正解文字のオブジェクト・座標・文字
    this.q_waku;
    this.correct_x = 0;
    this.correct_y = 0;
    this.correct_word = "";
    // 判定完了フラグ
    this.judgeComplete = false;
  },
  // 文字追加
  addMoji: function(str="", font_size) {
    this.nameLabel.text = str;
    this.nameLabel.x = this.sprite.x;
    this.nameLabel.y = this.sprite.y - PADDING;
    this.nameLabel.fontSize = font_size;
    this.nameLabel.stroke = "black";
    this.nameLabel.strokeWidth = 5;
  },
  // 文字変更
  changeMoji: function(str="") {
    this.nameLabel.text = str;
  },
  // 揺れ（r：揺れ幅、t：揺れ周期）
  shake: function(r, t) {
    // tweener定義
    let TWEEN = {
      tweens: [
        ['by', {x: r,      rotation: r     }, t],
        ['by', {x: r*(-1), rotation: r*(-1)}, t],
        ['by', {x: r*(-1), rotation: r*(-1)}, t],
        ['by', {x: r,      rotation: r     }, t],
      ],
      loop: true
    };
    this.sprite.tweener.fromJSON(TWEEN);
    this.nameLabel.tweener.fromJSON(TWEEN);
  },
  // tweenerストップ
  stop: function(x, y) {
    this.sprite.tweener.stop();
    this.nameLabel.tweener.stop();
  },
  // 移動
  move: function(x, y) {
    this.targetX = x;
    this.targetY = y;
  },
  // 正解へ移動
  moveCorrect: function(q_waku) {
    STATUS_CORRECT_WRONG = 0;   // 0:回答前、1:正解、2:不正解
    this.targetX = this.correct_x;
    this.targetY = this.correct_y;
    this.q_waku = q_waku;
  },
  // 更新
  update: function(app) {
    if (this.judgeComplete == false) {
      let xDiff = this.targetX - this.sprite.x;
      let yDiff = this.targetY - this.sprite.y;
      // 徐々に次の位置に近づける
      this.sprite.moveBy(xDiff * MOVE_SPEED, yDiff * MOVE_SPEED);
      this.nameLabel.moveBy(xDiff * MOVE_SPEED, yDiff * MOVE_SPEED);
      // 当たり判定
      let c1 = Circle(this.sprite.x, this.sprite.y, MATCH_PIXEL);
      let c2 = Circle(this.correct_x, this.correct_y, MATCH_PIXEL); 
      if (Collision.testCircleCircle(c1, c2)) {
        this.q_waku.changeMoji(this.nameLabel.text);
        this.sprite.remove();
        this.nameLabel.remove();
        // 正誤判定
        if (this.q_waku.correct_word == this.nameLabel.text) {
          //console.log("正解");
          STATUS_CORRECT_WRONG = 1;   // 0:回答前、1:正解、2:不正解
        } else {
          //console.log("不正解");
          STATUS_CORRECT_WRONG = 2;   // 0:回答前、1:正解、2:不正解
        }
        this.judgeComplete = true;
      }
    }
  }
});