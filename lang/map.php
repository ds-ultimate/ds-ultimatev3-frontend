<?php
$languages = ["de", "en"];
$filesIn = recursive_get_files("out");
$filesOut = recursive_get_files("../src/translations");

$replacements = [
    "ui.table-title.allyBashRanking" => "ui.tabeltitel.allyBashRanking",
    "ui.table-title.allyRanking" => "ui.tabletitel.allyRanking",
    "ui.table-title" => "ui.tabletitel",
    "ui.title" => "ui.titel",
    "ui.world.world" => "ui.world.normal",
    "ui.inGame" => "ui.ingame",
    "lightMode" => "lightmode",
    "darkMode" => "darkmode",
    "ui.chart.title" => "chart.titel",
    "ui.chart" => "chart",
    "error.404.title" => "ui.siteNotFound",
    "error.403.title" => "ui.notAllowed",
    "error.403.generic" => "ui.notAllowedDesc",
    "error" => "ui.errors",
];

$allow_errors = false;
$doneFiles = [];
foreach($languages as $lang) {
    foreach($filesIn as $fIn) {
        if(strpos($fIn, $lang) === false) continue;
        $doneFiles[] = $fIn;
        doInputFile($fIn);
    }
}
$allow_errors = true;

foreach($filesIn as $fIn) {
    if(in_array($fIn, $doneFiles)) continue;
    doInputFile($fIn);
}

function doInputFile($fIn) {
    global $filesOut;

    $raw = substr($fIn, strlen("out/"));
    $langIn = substr($raw, 0, strrpos($raw, "."));
    $dataIn = json_decode(file_get_contents($fIn));
    echo "Doing $langIn\n";

    foreach($filesOut as $fOut) {
        $rawO = substr($fOut, strlen("../src/translations/"));
        $p = explode("/", $rawO);
        $langOut = $p[0];
        $ns = substr($p[1], 0, strrpos($p[1], "."));

        if($langIn != $langOut) continue;
        $dataOut = json_decode(file_get_contents($fOut));

        $allow_errors = $langIn == "fr" || $langIn == "cz";
        recursive_map_keys($dataIn, $dataOut, $ns);

        file_put_contents($fOut, json_encode($dataOut, JSON_PRETTY_PRINT));
    }

    file_put_contents($fIn, json_encode($dataIn, JSON_PRETTY_PRINT));
}

function recursive_map_keys($dataIn, $dataOut, $curNs) {
    global $replacements, $allow_errors;
    
    foreach(array_keys((array) $dataOut) as $key) {
        if(is_object($dataOut->$key)) {
            recursive_map_keys($dataIn, $dataOut->$key, "$curNs.$key");
        } else if($dataOut->$key == "") {
            $inNS = $curNs . "." . $key;
            foreach($replacements as $new => $old) {
                $inNS = str_replace($new, $old, $inNS);
            }
            $pos = strrpos($inNS, ".");
            $inKey = substr($inNS, $pos + 1);
            
            $err = false;
            $val = $dataIn;
            foreach(explode(".", substr($inNS, 0, $pos)) as $idx) {
                if(! check(isset($val->$idx), "$idx does not exist with $inNS / $curNs.$key", $val)) {
                    $err = true;
                    break;
                }
                $val = $val->$idx;
            }
            if($err) continue;
            if(! check(isset($val->$inKey), "$inKey does not exist in $curNs", $val)) {
                continue;
            }
            $dataOut->$key = $val->$inKey;
            unset($val->$inKey);
        }
    }
}

function check($val, $msg, $dump=null) {
    global $allow_errors;
    if($val === false && $allow_errors === false) {
        if($dump !== null) {
            var_dump(array_keys((array) $dump));
        }
        die($msg . "\n");
    }
    return $val;
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
