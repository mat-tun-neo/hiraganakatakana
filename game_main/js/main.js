// グローバルに展開
phina.globalize();

// 画面・スプライトサイズ
const SCREEN_WIDTH           = 640;
const SCREEN_HEIGHT          = 960;
const PADDING                = 10;
const BUTTON_SIZE            = 80;
const START_BUTTON_WIDTH     = 250;
const START_BUTTON_HEIGHT    = 125;
const GOAL_BUTTON_WIDTH      = 250;
const GOAL_BUTTON_HEIGHT     = 125;
const QUESTION_WIDTH         = 300;
const QUESTION_HEIGHT        = 300;
const QUESTIONER_WIDTH       = 320;
const QUESTIONER_HEIGHT      = 280;
const ANSWERER_WIDTH         = 180;
const ANSWERER_HEIGHT        = 160;
const FRAME_WIDTH            = 640;
const FRAME_HEIGHT           = 420;
const WAKU_PATTERN           = 3;
const CHAR_REGEX             = document.getElementById("char_regex").innerText;

// メイン画面
var GameMain;
var STATUS_CORRECT_WRONG = 0;   // 0:回答前、1:正解、2:不正解

// URL
const HREF = document.getElementById("HTTP_REFERER").innerText;

const date = new Date();
const Y = date.getFullYear();
const M = ("00" + (date.getMonth()+1)).slice(-2);
const D = ("00" + date.getDate()).slice(-2);
const h = ("00" + date.getHours()).slice(-2);
const m = ("00" + date.getMinutes()).slice(-2);
const s = ("00" + date.getSeconds()).slice(-2);
const datestr = "?" + Y + M + D + h + m + s;

// 各セッティング値
const UPDATE_FRAME = 10;          // 同期フレーム
const MOVE_SPEED = 0.1;           // ふうせんの移動速度
const SHAKE_WIDTH = 5;            // ふうせんの揺れ幅
const SHAKE_CYCLE_MIN = 1000;     // ふうせんの揺れ周期MIN
const SHAKE_CYCLE_MAX = 2000;     // ふうせんの揺れ周期MAX
const MATCH_PIXEL = 2;            // 当たり判定のピクセル数

// アセット
const ASSETS = {
  // 画像
  image: {
    "mainwindow":      "./images/window.png" + datestr,
    "start_button":    "./images/startbutton.png" + datestr,
    "goal_button":     "./images/goalbutton.png" + datestr,
    "x_button":        "./images/xbutton.png" + datestr,
    "questioner":      "./images/questioner.png" + datestr,
    "answerer":        "./images/answerer.png" + datestr,
    "frame":           "./images/frame.png" + datestr,
    "mojiwaku":        "./images/mojiwaku.png" + datestr
  },
  // スプライトシート
  spritesheet: {
    "start_button":
    {
      "frame": { "width": 800, "height": 354, "cols": 1, "rows": 2 },
      "animations" : {
        "000": {"frames": [0, 1] , "next": "000", "frequency": 30 }
      }
    },
    "goal_button":
    {
      "frame": { "width": 735, "height": 360, "cols": 1, "rows": 2 },
      "animations" : {
        "000": {"frames": [0, 1] , "next": "000", "frequency": 30 }
      }
    },
    "x_button":
    {
      "frame": { "width": 220, "height": 210, "cols": 1, "rows": 1 },
      "animations" : {
        "000": {"frames": [0] , "next": "000", "frequency": 1 }
      }
    },
    "questioner":
    {
      "frame": { "width": 750, "height": 660, "cols": 3, "rows": 1 },
      "animations" : {
        "000": {"frames": [0] , "next": "000", "frequency": 1 },
        "001": {"frames": [1] , "next": "001", "frequency": 1 },
        "002": {"frames": [2] , "next": "002", "frequency": 1 }
      }
    },
    "answerer":
    {
      "frame": { "width": 1000, "height": 946, "cols": 3, "rows": 1 },
      "animations" : {
        "000": {"frames": [0] , "next": "000", "frequency": 1 },
        "001": {"frames": [1] , "next": "001", "frequency": 1 },
        "002": {"frames": [2] , "next": "002", "frequency": 1 }
      }
    },
    "frame":
    {
      "frame": { "width": 1980, "height": 1220, "cols": 1, "rows": 1 },
      "animations" : {
        "000": {"frames": [0] , "next": "000", "frequency": 1 }
      }
    },
    "mojiwaku":
    {
      "frame": { "width": 330, "height": 460, "cols": 3, "rows": 2 },
      "animations" : {
        "000": {"frames": [0] , "next": "000", "frequency": 1 },
        "001": {"frames": [1] , "next": "001", "frequency": 1 },
        "002": {"frames": [2] , "next": "002", "frequency": 1 },
        "003": {"frames": [3] , "next": "003", "frequency": 1 },
        "004": {"frames": [4] , "next": "004", "frequency": 1 },
        "005": {"frames": [5] , "next": "005", "frequency": 1 }
      }
    }
  }
};

// 0パディング（NUM=値 LEN=桁数）
function zeroPadding(NUM, LEN) {
	return ( Array(LEN).join("0") + NUM ).slice( -LEN );
};

// 文字列挿入
function strIns(str, idx, val) {
  return str.slice(0, idx) + val + str.slice(idx);
}

// 配列ランダムソート（シャッフル）関数
function shuffleArray(arr) {
    var n = arr.length;
    var temp = 0, i = 0;
    while (n) {
        i = Math.floor(Math.random() * n--);
        temp = arr[n];
        arr[n] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

// 乱数
const rand = (from, to) =>
  ~~(from + Math.random() * (to - from + 1))

// 重なったspriteの最前を判定
var listSemaphore = [];
function getSemaphore(obj) {
  currentFront = listSemaphore.findIndex(elem=> elem==1);
  //console.log("currentFront", currentFront);
  if (currentFront == null || obj.index > currentFront) {
    for (let i = 0; i < listSemaphore.length; i++) listSemaphore[i] = 0;
    listSemaphore[obj.index] = 1;
  }
  //console.log("getSemaphore", listSemaphore);
}
function releaseSemaphore(obj) {
  for (let i = 0; i < listSemaphore.length; i++) listSemaphore[i] = 0;
  //console.log("releaseSemaphore", listSemaphore);
}

/*
 * メイン処理
 */
phina.main(function() {
  console.log("main");
  // アプリケーションを生成
  var app = GameApp({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    assets: ASSETS,
  });
  // fps表示
  //app.enableStats();
  // 実行
  app.replaceScene(SceneSequence());
  app.run();
});

// SceneSequenceクラス
phina.define("SceneSequence", {
  superClass: "phina.game.ManagerScene",

  // 初期化
  init: function() {
    console.log("SceneSequenceクラスinit");
    this.superInit({
      scenes: [
        { label: "Loading", className: "SceneLoading" },
        { label: "Main",    className: "SceneMain" },
        { label: "Exit",    className: "SceneExit" },
      ]
    });
  }
});
  
phina.define("SceneLoading", {
  superClass: "phina.game.LoadingScene",

  init: function(options) {
    console.log("SceneLoadingクラスinit");

    this.superInit({
      // アセット読み込み
      assets: ASSETS,
    });

    this.backgroundColor = "BLACK";

    // view
    var baseLayer = DisplayElement(options).addChildTo(this);

    // ラベル
    var label = Label({
      text: "NOW LOADING...",
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

    this.exit("Main");
  }
});
