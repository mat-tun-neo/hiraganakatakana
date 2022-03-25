<?php
class File extends Base
{
    // POST値
    private $post_ary;
    // PNGディレクトリ
    private $png_dir = "./images/questions/";
    // ひらがな・カタカナ一覧ファイル
    private $kana_dat = "./dat/kana.dat";

    // コンストラクタ
    public function __construct($post_ary)
    {
        // デバッグ情報
        $this->debug_log("POST値", $post_ary);
        $this->classname = get_class($this);
        $this->post_ary = $post_ary;
    }

    // ファイル情報取得
    public function getFileInfo() 
    {
        $this->methodname = __FUNCTION__;
        setlocale(LC_ALL, 'ja_JP.UTF-8');
        //PNGファイル一覧を取得
        $png_files = glob($this->png_dir . "*.png");
        // PNGファイル選定
        $char_regex = $this->post_ary['char_regex'];
        $png_files_selected = preg_grep("/$char_regex/u", $png_files);
        $png_file = $png_files[ array_rand($png_files_selected) ];
        $png_file_base = basename($png_file, ".png");
        // 回答文字を選定
        do {
            $anser_pos = mt_rand(0, mb_strlen($png_file_base) - 1);
        } while (preg_match("/$char_regex/u", mb_substr($png_file_base, $anser_pos, 1)) == false);
        // デバッグ情報
        $this->debug_log("mb_substr(png_file_base, anser_pos, 1)", mb_substr($png_file_base, $anser_pos, 1));
        // JSON作成
        $json_buf = array();
        $json_buf["answer"] = $png_file_base;
        $json_buf["size"] = getimagesize($png_file);
        $json_buf["answer_pos"] = $anser_pos;
        $json_buf["kanachoice"] = $this->getKanaChoiceInfo(mb_substr($json_buf["answer"], $json_buf["answer_pos"], 1));
        // デバッグ情報
        //$this->debug_log("png_files", $png_files);
        $this->debug_log("png_files_selected", $png_files_selected);
        $this->debug_log("$json_buf", $json_buf);
        return $json_buf;
    }

    // 選択肢情報取得
    public function getKanaChoiceInfo($kana_char) 
    {
        $this->methodname = __FUNCTION__;
        // ファイルを配列に格納
        $lines = file($this->kana_dat);
        $target_array = preg_grep("/$kana_char/", $lines);
        $target = str_replace(array("\r\n", "\r", "\n"), "", array_values($target_array)[0]);
        return $target;
    }
}
?>