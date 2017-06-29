<?php

# version 0.2

// https://stackoverflow.com/questions/16632067/php-equivalent-of-pythons-str-format-method

function format($msg, $vars)
{
    $vars = (array)$vars;

    $msg = preg_replace_callback('#\{\}#', function($r){
        static $i = 0;
        return '{'.($i++).'}';
    }, $msg);

    return str_replace(
        array_map(function($k) {
            return '{'.$k.'}';
        }, array_keys($vars)),

        array_values($vars),

        $msg
    );
}



?>
