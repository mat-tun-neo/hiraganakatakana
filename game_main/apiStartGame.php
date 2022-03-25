<?php
    require "./commonClassload.php";
    session_start();
    header("Content-Type: application/json; charset=UTF-8");
    $room = new Room($_POST);
    echo json_encode($room->startGame());
?>
