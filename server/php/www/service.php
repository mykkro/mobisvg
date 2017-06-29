<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

# wrapper/controller for the web service
# parameters are stroed in the query string
# parameter 'method' determines which API method to use

require_once(dirname(__FILE__) . "/webconfig.php");
require_once($ROOT_DIR . "/config/config.php");
require_once($ROOT_DIR . "/src/utils.php");
require_once($ROOT_DIR . "/src/db.php");


$METHODS = array('user_get_by_nick');
$POSTMETHODS = array(); 

$params = $_GET;

if(!isset($params['method'])) {
	die("No method specified!");
}
if(!isset($params['token'])) {
	die("API token missing!");
}

$method = $params['method'];
$token = $params['token'];

if($token != $APITOKEN) {
    die("Invalid API token!");
}

function make_connection() {
    global $DBNAME;
    global $DBUSER;
    global $DBPASS;
    $conn = new PDO("mysql:host=localhost;dbname=$DBNAME;charset=utf8mb4",$DBUSER, $DBPASS);
    $db = new DB($conn);
    return $db;
}

function get_arg($payload, $name, $default_val=NULL) {
    if(isset($payload[$name])) {
        return $payload[$name];
    } else {
        return $default_val;
    }
}

function invoke_method($db, $method, $payload) {
    switch($method) {

        # define method calls here...

        case 'user_get_by_nick':
          $nickname = get_arg($payload, 'nickname');
          return $db->user_get_by_nick($nickname);

        default:
            die("Unknown method: $method");

    }
}




$result = NULL;
$payload = $params;
unset($payload["token"]);
unset($payload["method"]);

if(!in_array($method, $METHODS)) {
    die("Unsupported method");
}

if(in_array($method, $POSTMETHODS)) {
    # payload expected - POST method must be used...
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        die("Expected POST method");
    }
    $json = file_get_contents('php://input');
    # TODO merge it with the payload from _GET
    $payload = json_decode($json, true);
}


#################################################################################

# Execute the request (invoke method should always find a method)

$db = make_connection();
$result = invoke_method($db, $method, $payload);
header('Content-type: application/json');
echo json_encode( $result );

?>
