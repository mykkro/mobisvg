<?php


# kote-db (php)
# KoTe Database API v0.1. (PHP)


require_once(dirname(__FILE__) . "/dbcommon.php");

class DB {
    var $user_tablename = "user";
    var $user_colnames = array( "name", "nickname", "email", "birthyear", "gender", "eduyears", "notes");

    var $apitokens_tablename = "api_tokens";
    var $apitokens_colnames = array("user_id", "token", "created", "expires");

    var $role_tablename = "role";
    var $role_colnames = array("name");

    var $eventtype_tablename = "event_type";
    var $eventtype_colnames = array("name");

    var $result_tablename = "result";
    var $result_colnames = array("total_time", "correctness", "playback", "details");

    var $gametype_tablename = "game_type";
    var $gametype_colnames = array("name");

    var $event_tablename = "event";
    var $event_colnames = array("datetime", "details", "event_type_id", "user_id", "result_id", "game_type_id");

    var $measuretype_tablename = "measure_type";
    var $measuretype_colnames = array("name", "type");

    var $measure_tablename = "measure";
    var $measure_colnames = array("measure_type_id", "result_id");

    var $user2role_tablename = "user_has_role";
    var $user2role_colnames = array("user_id", "role_id");

    var $gametype2measuretype_tablename = "game_type_has_measure_type";
    var $gametype2measuretype_colnames = array("game_type_id", "measure_type_id");


    var $conn = NULL;

    function __construct($conn) {
       $this->conn = $conn;
    }

    # 'meta' table wrapper

    function user_get($id) {
        return db_get($this->conn, $this->user_tablename, $this->user_colnames, $id);
    }

    function user_get_by_nick($nickname) {
        return db_get_by($this->conn, $this->user_tablename, $this->user_colnames, "nickname", $nickname);
    }



}