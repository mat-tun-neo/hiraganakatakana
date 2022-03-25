<?php
class Base
{
    // LOGファイル
    protected $log = "./debug.log";
    // クラス名
    protected $classname;
    // メソッド名
    protected $methodname;

    // コンストラクタ
    public function __construct()
    {
    }

    // デバッグログ出力
    protected function debug_log($key, $value)
    {
        error_log(date('Y-m-d H:i:s').":".session_id().":".$this->classname."：".$this->methodname."：".$key."：".print_r($value, true).PHP_EOL, 3, $this->log);
    }
}
?>