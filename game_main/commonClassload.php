<?php
  //クラス一覧を取得
  $array = glob("./phpclass/*");
  //全クラスをrequire
  foreach($array as $file){
    //出力
    require $file;
  }
?>