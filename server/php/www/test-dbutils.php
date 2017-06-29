<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once(dirname(__FILE__) . "/webconfig.php");
require_once($ROOT_DIR . "/src/dbcommon.php");
require_once($ROOT_DIR . "/src/db.php");

echo "<pre>";



// test PDO

$conn = new PDO('mysql:host=localhost;dbname=kote;charset=utf8mb4','kote','kote');
$db = new DB($conn);

$user1 = $db->user_get_by_nick("svejk");
var_dump($user1);

$conn = NULL;


echo "</pre>";

?>
