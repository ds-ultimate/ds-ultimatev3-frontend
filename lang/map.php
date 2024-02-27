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
    "datatable.export.csv" => "global.datatables.csv",
    "tool.distCalc.villageNotExist" => "ui.villageNotExist",
    "tool.disabled" => "ui.nav.disabled",
    "tool.tableGenerator.additionalColumns" => "ui.additionalColumns",
    "tool.tableGenerator.casualPointRange" => "ui.showPointDiff",
    "tool.tableGenerator.columns" => "ui.columns",
    "tool.tableGenerator.numberLines" => "ui.numberLines",
    "tool.tableGenerator.points" => "ui.showPoints",
    "tool.distCalc.unit" => "global.unit",
    "tool.distCalc.units" => "global.units",
    "tool.distCalc.ally" => "ui.chart.who.ally",
    "tool.distCalc.points" => "ui.chart.titel.points",
    "tool.commandPlanner.title" => "tool.commandPlanner.mainToolTitleAddManually",
    "tool.commandPlanner" => "tool.attackPlanner",
    "tool.attackPlanner.overview.building" => "tool.accMgrDB.building",
    "tool.attackPlanner.overview.defensive" => "tool.attackPlanner.defensive",
    "tool.attackPlanner.overview.offensive" => "tool.attackPlanner.offensive",
    "tool.attackPlanner.overview.otherUnits" => "tool.attackPlanner.otherUnits",
    "tool.attackPlanner.overview.iconsTitle" => "tool.attackPlanner.iconsTitle",
    "tool.attackPlanner.overview.deleteAllConfirm" => "tool.attackPlanner.confirm.clear",
    "tool.attackPlanner.overview.deleteAll" => "tool.attackPlanner.deleteAll",
    "tool.attackPlanner.overview.deleteOutdated" => "tool.attackPlanner.deleteOutdated",
    "tool.attackPlanner.overview.deleteSent" => "tool.attackPlanner.deleteSent",
    "tool.attackPlanner.overview.import.exportBBDesc" => "tool.attackPlanner.exportBBDesc",
    "tool.attackPlanner.overview.import.exportBB" => "tool.attackPlanner.exportBB",
    "tool.attackPlanner.overview.import.exportIGMDesc" => "tool.attackPlanner.exportIGMDesc",
    "tool.attackPlanner.overview.import.exportIGM" => "tool.attackPlanner.exportIGM",
    "tool.attackPlanner.overview.import.exportWBDesc" => "tool.attackPlanner.exportWBDesc",
    "tool.attackPlanner.overview.import.exportWB" => "tool.attackPlanner.exportWB",
    "tool.attackPlanner.overview.import.importWBDesc" => "tool.attackPlanner.import_helper",
    "tool.attackPlanner.overview.import.import" => "tool.attackPlanner.import",
    "tool.attackPlanner.overview.import.templateBB_body" => "tool.attackPlanner.export.BB.default.body",
    "tool.attackPlanner.overview.import.templateBB_row" => "tool.attackPlanner.export.BB.default.row",
    "tool.attackPlanner.overview.import.templateIGM_body" => "tool.attackPlanner.export.IGM.default.body",
    "tool.attackPlanner.overview.import.templateIGM_row" => "tool.attackPlanner.export.IGM.default.row",
    "tool.attackPlanner.overview.link.editLinkHelp" => "tool.attackPlanner.editLink_helper",
    "tool.attackPlanner.overview.link.editLink" => "tool.attackPlanner.editLink",
    "tool.attackPlanner.overview.link.showLinkHelp" => "tool.attackPlanner.showLink_helper",
    "tool.attackPlanner.overview.link.showLink" => "tool.attackPlanner.showLink",
    "tool.attackPlanner.overview.noTitle" => "ui.noTitle",
    "tool.attackPlanner.overview.prop.arrivalTime" => "tool.attackPlanner.arrivalTime",
    "tool.attackPlanner.overview.prop.date" => "tool.attackPlanner.date",
    "tool.attackPlanner.overview.prop.sendTime" => "tool.attackPlanner.sendTime",
    "tool.attackPlanner.overview.prop.startVillage" => "tool.attackPlanner.startVillage",
    "tool.attackPlanner.overview.prop.support_boost" => "tool.attackPlanner.type_support_boost",
    "tool.attackPlanner.overview.prop.targetVillage" => "tool.attackPlanner.targetVillage",
    "tool.attackPlanner.overview.prop.tribe_boost" => "tool.attackPlanner.type_tribe_boost",
    "tool.attackPlanner.overview.prop.type" => "tool.attackPlanner.type",
    "tool.attackPlanner.overview.prop.unit" => "global.unit",
    "tool.attackPlanner.overview.save" => "global.save",
    "tool.attackPlanner.overview.tabs.create" => "global.create",
    "tool.attackPlanner.overview.tabs.import" => "tool.attackPlanner.importExport",
    "tool.attackPlanner.overview.tabs.link" => "tool.attackPlanner.links",
    "tool.attackPlanner.overview.tabs.multiedit" => "tool.attackPlanner.multiedit",
    "tool.attackPlanner.overview.tabs.stats" => "tool.attackPlanner.statistics",
    "tool.attackPlanner.overview.tabs.tips" => "tool.attackPlanner.tips",
    "tool.attackPlanner.overview.title" => "tool.attackPlanner.title",
    "tool.attackPlanner.overview.type" => "tool.attackPlanner",
    "tool.copy" => "global.datatables.copy",
    "ui.confirmation.cancel" => "user.confirm.destroy.cancel",
    "ui.confirmation.ok" => "user.confirm.destroy.ok",
    "tool.attackPlanner.import.successTitle" => "tool.attackPlanner.importWBSuccess",
    "tool.attackPlanner.import.wbImportWrongData" => "tool.attackPlanner.wbImportWrongData",
    "tool.attackPlanner.overview.create.createSuccessTitle" => "tool.attackPlanner.storeSuccessTitle",
    "tool.attackPlanner.overview.create.createSuccessDesc" => "tool.attackPlanner.storeSuccess",
    // add ui here because of error => ui.errors conversion above
    "tool.attackPlanner.overview.create.ui.errorsCoordTitle" => "tool.attackPlanner.errorKoordTitle",
    "tool.attackPlanner.overview.create.ui.errorsCoordSame" => "tool.attackPlanner.errorKoord",
    "tool.attackPlanner.overview.create.ui.errorsStartCoord" => "tool.attackPlanner.villageNotExistStart",
    "tool.attackPlanner.overview.create.ui.errorsTargetCoord" => "tool.attackPlanner.villageNotExistTarget",
    "tool.attackPlanner.overview.import.failed" => "tool.attackPlanner.errorTitle",
    "tool.attackPlanner.overview.import.successTitle" => "tool.attackPlanner.importWBSuccess",
    "tool.attackPlanner.overview.import.wbImportWrongData" => "tool.attackPlanner.wbImportWrongData",
    "tool.attackPlanner.overview.stats.attackStartVillage" => "tool.attackPlanner.attackStart_village",
    "tool.attackPlanner.overview.stats.attackTargetVillage" => "tool.attackPlanner.attackTarget_village",
    "tool.attackPlanner.overview.stats.attackTotal" => "tool.attackPlanner.attackTotal",
    "tool.attackPlanner.overview.stats.generalTitle" => "ui.tabletitel.general",
    "tool.total" => "global.total",
    "tool.attackPlanner.overview.table.attacker" => "tool.attackPlanner.attacker",
    "tool.attackPlanner.overview.table.countdown" => "tool.attackPlanner.countdown",
    "tool.attackPlanner.overview.table.defender" => "tool.attackPlanner.defender",
    "tool.attackPlanner.overview.table.villageNotExist" => "tool.attackPlanner.villageNotExist",
    "tool.attackPlanner.overview.warnSending" => "tool.attackPlanner.warnSending",
];

$duplicated = [
    "tool.accMgrDB.building",
    "ui.noTitle",
    "global.create",
    "global.save",
    "global.total",
    "global.unit",
    "global.units",
    "global.datatables.copy",
    "ui.title.ally",
    "ui.tabletitel.general",
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

    $writeBuffer = [];

    foreach($filesOut as $fOut) {
        $rawO = substr($fOut, strlen("../src/translations/"));
        $p = explode("/", $rawO);
        $langOut = $p[0];
        $ns = substr($p[1], 0, strrpos($p[1], "."));

        if($langIn != $langOut) continue;
        $dataOut = json_decode(file_get_contents($fOut));
        if($dataOut === NULL) {
            echo "$fOut is NULL??";
            die();
        }

        recursive_map_keys($dataIn, $dataOut, $ns);
        $writeBuffer[] = [$fOut, json_encode($dataOut, JSON_PRETTY_PRINT)];
    }

    foreach($writeBuffer as $wBuf) {
        file_put_contents($wBuf[0], $wBuf[1]);
    }

    file_put_contents($fIn, json_encode($dataIn, JSON_PRETTY_PRINT));
}

function recursive_map_keys($dataIn, $dataOut, $curNs) {
    global $replacements, $allow_errors, $duplicated;
    
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
            if(! check(isset($val->$inKey), "$inKey does not exist: $inNS (from $curNs.$key)", $val)) {
                continue;
            }
            if(gettype($val->$inKey) !== "string") {
              var_dump($val->$inKey);
              echo "CRITICAL tried to assign array\n$inNS (from $curNs.$key)\n";
              die();
            }

            $dataOut->$key = $val->$inKey;
            if(! in_array($inNS, $duplicated)) {
                unset($val->$inKey);
            }
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
