<?php
    require "./commonClassload.php";
    session_start();
    header("Content-Type: application/json; charset=UTF-8");
    $file = new File(json_decode(file_get_contents('php://input'), true));
    echo json_encode($file->getFileInfo());
?>
