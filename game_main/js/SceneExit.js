/*
 * メインシーン
 */
phina.define("SceneExit", {
  // 継承
  superClass: "DisplayScene",
  // コンストラクタ
  init: function(options) {
    console.log("SceneExitクラスinit");
    // 親クラス初期化
    this.superInit();
    this.backgroundColor = "BLACK";

    // view
    var baseLayer = DisplayElement(options).addChildTo(this);

    axios.post("./apiDeleteData.php")
    .then(function (response) {
    }.bind(this))
    .catch(function (error) { console.log(error); })
    .finally(function () {});

    // ラベル
    var label = Label({
      text: "EXIT GAME...",
    })
    .addChildTo(baseLayer)
    .setPosition(this.width*0.5, this.height*0.5)
    label.tweener.clear()
    .setLoop(1)
    .to({alpha:0}, 500)
    .to({alpha:1}, 500)
    ;
    label.fill = "white";
    label.fontSize = 40;

    this.exit();
    location.href = HREF;
  },
});
