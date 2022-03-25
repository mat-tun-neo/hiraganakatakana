/*
 * メインシーン
 */
phina.define("SceneMain", {
  // 継承
  superClass: "DisplayScene",
  // コンストラクタ
  init: function(param) {
    console.log("SceneMainクラスinit");
    // 親クラス初期化
    this.superInit();
    // 背景スプライト
    this.mainwindow = Sprite("mainwindow").addChildTo(this);
    this.mainwindow.setPosition(this.gridX.center(), this.gridY.center());
    // メイン画面設定
    GameMain = this;
    // スプライトグループ
    this.background = DisplayElement().addChildTo(this);
    this.questionGroup = DisplayElement().addChildTo(this);
    this.correctQuestionGroup = DisplayElement().addChildTo(this);
    this.questionerGroup = DisplayElement().addChildTo(this);
    this.answererGroup = DisplayElement().addChildTo(this);
    this.buttonGroup = DisplayElement().addChildTo(this);
    // Xボタン描画
    this.drawXButton();
    // フレームの描画
    SpriteFrame(
      "000", SCREEN_WIDTH/2, SCREEN_HEIGHT/2 - PADDING * 7
    ).addChildTo(this.background);
    // 出題者の描画
    this.questioner = SpriteQuestioner(
      "000", QUESTIONER_WIDTH/2, SCREEN_HEIGHT/2
    ).addChildTo(this.questionerGroup);
    // 回答者の描画
    this.answerer = SpriteAnswerer(
      "000", SCREEN_WIDTH/2, SCREEN_HEIGHT - ANSWERER_HEIGHT/2
    ).addChildTo(this.background);
    // スタートボタン描画
    this.drawStartButton();
    // 問題の作成
    this.createQuestion();
    this.response;
    // 正解の位置
    this.correct_x;
    this.correct_y;
    // スタート直後の判定
    this.startAfter = true;
  },
  // 画面更新
  update: function(app) {
    // プレイヤー更新
    if (app.frame % UPDATE_FRAME == 0) {
      //console.log("update_frame：" + app.frame);
      //console.log(STATUS_CORRECT_WRONG);
      // 出題者・回答者・星・三角・ゴールボタンの描画
      let status = zeroPadding(STATUS_CORRECT_WRONG, 3);
      if (status != this.questioner.animation) {
        // 出題者・回答者
        this.questioner.changeAnimation(this.questioner.spritesheet, status);
        this.answerer.changeAnimation(this.answerer.spritesheet, status);
        // 問題の作成（正解した後のために問題を作成しておく）
        this.createQuestion();

        if (STATUS_CORRECT_WRONG == 1) {  // 0:回答前、1:正解、2:不正解
          // 周りに星を出す
          for (let i = 0; i < 36; i++) {
            //console.log("i", i);
            let s = phina.display.StarShape()
              .addChildTo(this.answererGroup)
              .setPosition(this.correct_x, this.correct_y)
              .setScale(1);
            let x = s.x + Math.cos(i*10)*100;
            let y = s.y + Math.sin(i*10)*100;
            s.tweener.clear()
              .to({x: x, y: y, alpha: 0}, 10000,"easeOutQuint")
              .call(function() {
                this.remove();
              }.bind(s));
          }
          // ゴールボタン
          this.drawGoalButton();

        } else if (STATUS_CORRECT_WRONG == 2) {  // 0:回答前、1:正解、2:不正解
          // 周りに三角を出す
          for (let i = 0; i < 36; i++) {
            //console.log("i", i);
            let s = phina.display.TriangleShape({fill: "black"})
              .addChildTo(this.answererGroup)
              .setPosition(this.correct_x, this.correct_y)
              .setScale(1);
            let x = s.x + Math.cos(i*10)*100;
            let y = s.y + Math.sin(i*10)*100;
            s.tweener.clear()
              .to({x: x, y: y, alpha: 0}, 10000,"easeOutQuint")
              .call(function() {
                this.remove();
              }.bind(s));
          }
        }
      }
    };
  },
  // Xボタン描画
  drawXButton: function() {
    //console.log("SceneMainクラスdrawXButton");
    let xbutton = SpriteButtonX(
      "000", SCREEN_WIDTH - BUTTON_SIZE / 2, BUTTON_SIZE / 2
    ).addChildTo(this.background);
    //console.log(this.xbutton.x + "/" + this.xbutton.y);
    // Xボタン押下時の処理
    xbutton.sprite.setInteractive(true);
    xbutton.sprite.onpointstart = function() {
      console.log("xbutton.onpointstart");
      this.exit("Exit");
    }.bind(this);
  },
  // スタートボタン描画
  drawStartButton: function() {
    //console.log("SceneMainクラスdrawStartButton");
    let startbutton = SpriteButtonStart(
      "000", SCREEN_WIDTH / 2 + PADDING * 7, SCREEN_HEIGHT / 2 - PADDING * 8
    ).addChildTo(this.buttonGroup);
    // スタートボタン押下時の処理
    startbutton.sprite.setInteractive(true);
    startbutton.sprite.onpointstart = function() {
      console.log("startButton.onpointstart");
      startbutton.removeSprite();
      this.drawQuestion();
    }.bind(this);
  },
  // ゴールボタン描画
  drawGoalButton: function() {
    //console.log("SceneMainクラスdrawGoalStartButton");
    let goalbutton = SpriteButtonGoal(
      "000", SCREEN_WIDTH / 2 + PADDING * 7, SCREEN_HEIGHT / 2 - PADDING * 8
    ).addChildTo(this.buttonGroup);
    // ゴールボタン押下時の処理
    goalbutton.sprite.setInteractive(true);
    goalbutton.sprite.onpointstart = function() {
      console.log("goalButton.onpointstart");
      goalbutton.removeSprite();
      // 枠とキャラクターの描画
      goalbutton.removeSprite();
      this.drawQuestion();
    }.bind(this);
  },
  // 問題の作成
  createQuestion: function() {
    //console.log("SceneMainクラスcreateQuestion");
    // アセットローダー
    let loader = phina.asset.AssetLoader();

    let post_data= {"char_regex":CHAR_REGEX };
    //console.log("post_data", post_data);
    axios.post("./apiGetFileInfo.php", post_data)
    .then(function (response) {
      //console.log("response", response);
      this.response = response;
      // アセット追加読み込み
      loader.load({
        image: {
          "question" : "./images/questions/" + response.data.answer + ".png" + datestr,
        },
        spritesheet: {
          "question":
          {
            "frame": { "width": response.data.size[0], "height": response.data.size[1], "cols": 1, "rows": 1 },
            "animations" : {
              "000" : {"frames": [0],  "next": "000", "frequency": 1 }
            }
          }
        }
      });
    }.bind(this))
    .catch(function (error) { console.log(error); })
    .finally(function () {});
  },
  // 問題の描画
  drawQuestion: function() {
    this.startAfter = true;
    STATUS_CORRECT_WRONG = 0;   // 0:回答前、1:正解、2:不正解
    // スプライトクリア
    if (this.questionGroup != null) this.questionGroup.children.length = 0;
    if (this.answererGroup != null) this.answererGroup.children.length = 0;
    if (this.correctQuestionGroup != null) this.correctQuestionGroup.children.length = 0;
    // 問題の描画（絵）
    SpriteQuestion(
      "question", "000", SCREEN_WIDTH/2 + PADDING * 7, SCREEN_HEIGHT/2 - PADDING * 8
    ).addChildTo(this.questionGroup);
    // 枠の色
    let animation = rand(0, WAKU_PATTERN - 1);
    // 文字の描画（問題）
    let q_waku;
    let len = this.response.data.answer.length;
    let q_waku_size = SCREEN_WIDTH / 5;
    let start_x = (5 - len)/2 * q_waku_size;
    let start_y = q_waku_size + PADDING * 2;
    if (len>5) {
      q_waku_size = SCREEN_WIDTH / len;
      start_x = 0;
      start_y = q_waku_size * 1.5;
    }
    for (let i=0; i<len; i++) {
      if (i == this.response.data.answer_pos) {
        // 正解文字の座標
        this.correct_x = start_x + (i + 0.5) * q_waku_size;
        this.correct_y = start_y;
        q_waku = SpriteMoji(
          zeroPadding(animation, 3), this.correct_x, this.correct_y, q_waku_size, q_waku_size * 1.5
        ).addChildTo(this.correctQuestionGroup);
        q_waku.addMoji("", q_waku_size * 0.8);
        q_waku.correct_word = this.response.data.answer[i];
        q_waku.shake(SHAKE_WIDTH, (SHAKE_CYCLE_MAX - SHAKE_CYCLE_MIN) / 2);
      } else {
        let q_waku = SpriteMoji(
          zeroPadding(animation + WAKU_PATTERN, 3), start_x + (i + 0.5) * q_waku_size, start_y, q_waku_size, q_waku_size * 1.5
        ).addChildTo(this.questionGroup);
        q_waku.addMoji(this.response.data.answer[i], q_waku_size * 0.8)
      }
    }
    // 文字の描画（回答用）
    len = this.response.data.kanachoice.length;
    let a_waku_size = SCREEN_WIDTH / len;
    for (i=0; i<len; i++) {
      let a_waku = SpriteMoji(
        zeroPadding(animation, 3),
        (i + 0.5) * a_waku_size, SCREEN_HEIGHT/5*4 + a_waku_size/5*(i-Math.floor(len/2))**2 - PADDING*4,
        a_waku_size, a_waku_size * 1.5
      ).addChildTo(this.answererGroup);
      a_waku.addMoji(this.response.data.kanachoice[i], a_waku_size * 0.8);
      a_waku.correct_x = this.correct_x;
      a_waku.correct_y = this.correct_y;
      a_waku.shake(SHAKE_WIDTH, rand(SHAKE_CYCLE_MIN, SHAKE_CYCLE_MAX));
      a_waku.sprite.setInteractive(true);
      a_waku.sprite.onpointstart = function() {
        console.log("startButton.onpointstart：STATUS_CORRECT_WRONG", STATUS_CORRECT_WRONG);
        if (this.startAfter || STATUS_CORRECT_WRONG == 2) {  // 0:回答前、1:正解、2:不正解
          this.startAfter = false;
          a_waku.stop();
          a_waku.moveCorrect(q_waku);
        }
      }.bind(this);
      
    }
  },
  // プレイヤーオブジェクト消去
  erasePlayers: function() {
    //console.log("SceneMainクラスerasePlayers");
    //this.buttonGroup.children.length = 0;
  }
});
