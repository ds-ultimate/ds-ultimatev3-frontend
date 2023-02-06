<?php

$files = recursive_get_files("lang_in");

foreach($files as $f) {
    $ext = substr($f, strrpos($f, ".") + 1);
    $raw = substr($f, strlen("lang_in/"));
    $outDir = "lang_out/" . substr($raw, 0, strrpos($raw, "/"));
    
    if(!is_dir($outDir)) {
        mkdir($outDir, recursive: true);
    }
    
    if($ext == "php") {
        $data = require $f;
        print_r(json_encode($data, JSON_PRETTY_PRINT));
    } else {
        die("unknown ext $ext");
    }
    
    die();
}

function recursive_get_files($path) {
    $result = [];
    $data = scandir($path);
    foreach($data as $d) {
        if($d == ".") continue;
        if($d == "..") continue;
        $sub = $path . "/" . $d;
        
        if(is_dir($sub)) {
            $result = array_merge($result, recursive_get_files($sub));
        }
        if(is_file($sub)) {
            $result[] = $sub;
        }
    }
    return $result;
}
