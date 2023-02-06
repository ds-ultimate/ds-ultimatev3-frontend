<?php

$files = recursive_get_files("lang_in");

$all_data = [];
foreach($files as $f) {
    $ext = substr($f, strrpos($f, ".") + 1);
    $raw = substr($f, strlen("lang_in/"));
    
    if($ext == "php") {
        $data = require $f;
        $lang = explode("/", $raw)[0];
        $p = explode("/", $raw)[1];
        $ns = substr($p, 0, strrpos($p, "."));
    } else if($ext == "json") {
        $encoded = file_get_contents($f);
        $data = json_decode($encoded);
        $lang = substr($raw, 0, strrpos($raw, "."));
        $ns = "global";
    } else {
        die("unknown ext $ext\n");
    }
    
    if(! isset($all_data[$lang])) {
        $all_data[$lang] = [];
    }
    $all_data[$lang][$ns] = (array) $data;
}

if(!is_dir("lang_out")) {
    mkdir("lang_out", recursive: true);
}

foreach($all_data as $lang => $data) {
    $cnt = 0;
    foreach($data as $ns => $ns_data) {
        $cnt += count($ns_data);
    }
    
    $outFileName = "lang_out/$lang.json";
    file_put_contents($outFileName, json_encode($data, JSON_PRETTY_PRINT));
    
    echo "Saved $cnt keys for lang $lang\n";
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
