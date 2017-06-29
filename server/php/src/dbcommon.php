<?php

require_once(dirname(__FILE__) . "/utils.php");


# dbcommon - common MySQL function (CRUD etc.)
# version 0.1 (PHP-PDO)

function db_open($host, $user, $passwd, $db) {
    $db = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4",$user,$passwd);
    return $db;
}


function db_close($connection) {
    # TODO do it outside, this will not work
    $connection = NULL;
}


function db_delete_command($tablename) {
    return format("DELETE FROM `{tablename}` WHERE `id`=%s", array('tablename' => $tablename));
}


function db_get_command($tablename, $columns) {
    $cols = array_map(function($x) { return "`${x}`"; }, $columns);
    return format("SELECT `id`, {cols} FROM `{tablename}` WHERE `id`=%s", array('cols'=>join(", ", $cols), 'tablename'=>$tablename));
}


function db_list_command($tablename, $columns, $order_by_col) {
    $cols = array_map(function($x) { return "`${x}`"; }, $columns);
    return format("SELECT `id`, {cols} FROM `{tablename}` ORDER BY `{orderbycol}`", array('cols'=>join(", ", $cols), 'tablename'=>$tablename, 'orderbycol'=>$order_by_col));
}


function db_get_by_command($tablename, $columns, $colname) {
    $cols = array_map(function($x) { return "`${x}`"; }, $columns);
    return format("SELECT `id`, {cols} FROM `{tablename}` WHERE `{colname}`=%s", array('cols'=>join(", ", $cols), 'tablename'=>$tablename, 'colname'=>$colname));
}


function db_get_by_params_command($tablename, $columns, $params) {
    $cols = array_map(function($x) { return "`${x}`"; }, $columns);
    $where = join(" AND ", array_map(function($x) { return format("`{colname}`=%s", array('colname'=>$x["colname"])); }, $params));
    return format("SELECT `id`, {cols} FROM `{tablename}` WHERE {where}", array('cols'=>join(", ", $cols), 'tablename'=>$tablename, 'where'=>$where));
}


function db_get_by_ids_command($tablename, $columns) {
    $cols = array_map(function($x) { return "`${x}`"; }, $columns);
    return format("SELECT `id`, {cols} FROM `{tablename}` WHERE `id` IN (%s) ORDER BY FIELD(id, %s)", array('cols'=>join(", ", $cols), 'tablename'=>$tablename));
}


function db_select_command_join($table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec) {
    $cols_main = array_map(function($x) { return "`${x}`"; }, $columns_main);
    $cols_sec = array_map(function($x) { return "`${x}`"; }, $columns_sec);
    return format("SELECT `{table_main}`.`id`, {cols} FROM `{table_main}` INNER JOIN `{table_sec}` ON `{table_main}`.`{join_main}` = `{table_sec}`.`{join_sec}`", array('cols'=>join(", ", array_merge($cols_main, $cols_sec)), 'table_main'=>$table_main, 'table_sec'=>$table_sec, 'join_main'=>$join_main, 'join_sec'=>$join_sec));
}


function db_select_command_join2($table_main, $columns_main, $table_sec, $columns_sec, $table_sec2, $columns_sec2, $join_main, $join_sec, $join_main2, $join_sec2) {
    $cols_main = array_map(function($x) use (&$table_main) { return "`${table_main}`.`${x}` as `${x}`"; }, $columns_main);
    $cols_sec = array_map(function($x) use (&$table_sec) { return "`${table_sec}`.`${x}` as `${x}`"; }, $columns_sec);
    $cols_sec2 = array_map(function($x) use (&$table_sec2) { return "`${table_sec2}`.`${x}` as `${x}`"; }, $columns_sec2);
    return format("SELECT `{table_main}`.`id`, {cols} FROM `{table_main}` INNER JOIN `{table_sec}` ON `{table_main}`.`{join_main}` = `{table_sec}`.`{join_sec}` INNER JOIN `{table_sec2}` ON `{table_main}`.`{join_main2}` = `{table_sec2}`.`{join_sec2}`", array('cols'=>join(", ", array_merge($cols_main, $cols_sec, $cols_sec2)), 'table_main'=>$table_main, 'table_sec'=>$table_sec, 'table_sec2'=>$table_sec2, 'join_main'=>$join_main, 'join_sec'=>$join_sec, 'join_main2'=>$join_main2, 'join_sec2'=>$join_sec2));
}


function db_get_command_join($table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec) {
    return db_select_command_join($table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec) . format(" WHERE `{table_main}`.`id`=%s", array('table_main'=>$table_main));
}


function db_get_by_command_join($table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec, $colname) {
    return db_select_command_join($table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec) . format(" WHERE `{table_main}`.`{colname}`=%s", array('colname'=>$colname, 'table_main'=>$table_main));
}


function db_get_by_command_join2($table_main, $columns_main, $table_sec, $columns_sec, $table_sec2, $columns_sec2, $join_main, $join_sec, $join_main2, $join_sec2, $colname) {
    return db_select_command_join2($table_main, $columns_main, $table_sec, $columns_sec, $table_sec2, $columns_sec2, $join_main, $join_sec, $join_main2, $join_sec2) . format(" WHERE `{table_main}`.`{colname}`=%s", array('colname'=>$colname, 'table_main'=>$table_main));
}


function db_list_command_join($table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec, $order_by_col) {
    return db_select_command_join($table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec) . format(" ORDER BY `{order_by_col}`", array('order_by_col'=>$order_by_col));
}


function db_list_command_join2($table_main, $columns_main, $table_sec, $columns_sec, $table_sec2, $columns_sec2, $join_main, $join_sec, $join_main2, $join_sec2, $order_by_col) {
    return db_select_command_join2($table_main, $columns_main, $table_sec, $columns_sec, $table_sec2, $columns_sec2, $join_main, $join_sec, $join_main2, $join_sec2) . format(" ORDER BY `{order_by_col}`", array('order_by_col'=>$order_by_col));
}


function db_list_command_where_join($table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec, $order_by_col, $colname) {
    return db_select_command_join($table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec) . format(" WHERE `{table_main}`.`{colname}`=%s ORDER BY `{order_by_col}`", array('colname'=>$colname, 'table_main'=>$table_main, 'order_by_col'=>$order_by_col));
}


function db_insert_command($tablename, $columns) {
    $cols = array_map(function($x) { return "`${x}`"; }, $columns);
    $holders = array_map(function($x) { return "${x}"; }, $columns);
    return format("INSERT INTO `{tablename}` ({cols}) VALUES({holders})", array('cols'=>join(", ", $cols), 'holders'=>join(", ", $holders), 'tablename'=>$tablename));
}


function db_update_command($tablename, $columns) {
    $cols = array_map(function($x) { return format("`{colname}`=%s", array('colname'=>$x)); }, $columns);
    return format("UPDATE `{$tablename}` SET {cols} WHERE `id`=%s", array('tablename'=>$tablename, 'cols'=>join(", ", $cols)));
}


function db_select_single_with_params($conn, $query, $params) {
    $query = str_replace("%s", "?", $query);
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result;
}

function db_select_multi_with_params($conn, $query, $params) {
    $query = str_replace("%s", "?", $query);
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function db_get($conn, $tablename, $cols, $id) {
    $query = db_get_command($tablename, $cols);
    $params = array($id);
    return db_select_single_with_params($conn, $query, $params);
}


function db_get_by($conn, $tablename, $cols, $colname, $value) {
    $query = db_get_by_command($tablename, $cols, $colname);
    $params = array($value);
    return db_select_single_with_params($conn, $query, $params);
}


function db_get_by_params($conn, $tablename, $cols, $params) {
    $query = db_get_by_params_command($tablename, $cols, $params);
    $pp = array_map(function($x) { return $x["value"]; }, $params);
    return db_select_single_with_params($conn, $query, $pp);
}

function db_list($conn, $tablename, $cols, $sort_by_col="id") {
    $query = db_list_command($tablename, $cols, $sort_by_col);
    $params = array();
    return db_select_multi_with_params($conn, $query, $params);
}

function db_get_join($conn, $table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec, $id) {
    $query = db_get_command_join($table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec);
    $params = array($id);
    return db_select_single_with_params($conn, $query, $params);
}


function db_get_by_join($conn, $table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec, $colname, $value) {
    $query = db_get_by_command_join($table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec, $colname);
    $params = array($value);
    return db_select_single_with_params($conn, $query, $params);
}

# TODO test it!
function db_get_by_join2($conn, $table_main, $columns_main, $table_sec, $columns_sec, $table_sec2, $columns_sec2, $join_main, $join_sec, $join_main2, $join_sec2, $colname, $value) {
    $query = db_get_by_command_join2($table_main, $columns_main, $table_sec, $columns_sec, $table_sec2, $columns_sec2, $join_main, $join_sec, $join_main2, $join_sec2, $colname);
    $params = array($value);
    return db_select_single_with_params($conn, $query, $params);
}


function db_list_join($conn, $table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec, $order_by_col="id") {
    $query = db_list_command_join($table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec, $order_by_col);
    $params = array();
    return db_select_multi_with_params($conn, $query, $params);
}


# TODO test it!
function db_list_join2($conn, $table_main, $columns_main, $table_sec, $columns_sec, $table_sec2, $columns_sec2, $join_main, $join_sec, $join_main2, $join_sec2, $order_by_col="id") {
    $query = db_list_command_join2($table_main, $columns_main, $table_sec, $columns_sec, $table_sec2, $columns_sec2, $join_main, $join_sec, $join_main2, $join_sec2, $order_by_col);
    $params = array();
    return db_select_multi_with_params($conn, $query, $params);
}


function db_list_join_where($conn, $table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec, $colname, $value, $order_by_col="id") {
    $query = db_list_command_where_join($table_main, $columns_main, $table_sec, $columns_sec, $join_main, $join_sec, $order_by_col, $colname);
    $params = array($value);
    return db_select_multi_with_params($conn, $query, $params);
}


function db_get_by_ids($conn, $tablename, $cols, $ids) {
    $query = db_get_by_ids_command($tablename, $cols);
    $ids_str = join(",", $ids);
    $query = str_replace("%s", $ids_str, $query);
    $params = array();
    return db_select_multi_with_params($conn, $query, $params);
}


function db_delete($conn, $tablename, $id) {
    throw new Exception("Not implemented yet!");
}


function db_create($conn, $tablename, $cols, $vals) {
    throw new Exception("Not implemented yet!");
}


function db_update($conn, $tablename, $cols, $id, $vals) {
    throw new Exception("Not implemented yet!");
}

?>