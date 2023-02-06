import React, {useEffect, useState} from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import Dropdown, {leftMenu, rightMenu} from "./dropdown";
import {MenuItem} from "@mui/material";
import {worldType} from "../../apiInterface/apiTypes";
import {getWorldsOfServer} from "../../apiInterface/loadContent";

/*
$retArray = [];
if($worldArg !== null) {
  $serverCodeName = [$worldArg->server->code, $worldArg->name];
}

if($serModel !== null) {
  $serverNav = [];
  foreach(World::worldsCollection($serModel) as $worlds) {
    $worldNav = [];
    foreach($worlds as $world) {
      switch(\Request::route()->getName()) {
      case 'tools.distanceCalc':
        $worldNav[] = self::navElement($world->getDistplayName(), 'tools.distanceCalc', routeArgs: [$world->server->code, $world->name], translated: false);
        break;
      case 'tools.pointCalc':
        $worldNav[] = self::navElement($world->getDistplayName(), 'tools.pointCalc', routeArgs: [$world->server->code, $world->name], translated: false);
        break;
      case 'tools.tableGenerator':
        $worldNav[] = self::navElement($world->getDistplayName(), 'tools.tableGenerator', routeArgs: [$world->server->code, $world->name], translated: false);
        break;
      case 'tools.accMgrDB.index_world':
        $worldNav[] = self::navElement($world->getDistplayName(), 'tools.accMgrDB.index_world', routeArgs: [$world->server->code, $world->name], translated: false);
        break;
      default:
        $worldNav[] = self::navElement($world->getDistplayName(), 'world', routeArgs: [$world->server->code, $world->name], translated: false);
        break;
      }
    }
    if($worlds[0]->sortType() == "casual") {
      $serverNav[] = self::navDropdown(title: 'ui.tabletitel.casualWorlds', subelements: $worldNav);
    } else if($worlds[0]->sortType() == "speed") {
      $serverNav[] = self::navDropdown(title: 'ui.tabletitel.speedWorlds', subelements: $worldNav);
    } else if($worlds[0]->sortType() == "classic") {
      $serverNav[] = self::navDropdown(title: 'ui.tabletitel.classicWorlds', subelements: $worldNav);
    } else {
      $serverNav[] = self::navDropdown(title: 'ui.tabletitel.normalWorlds', subelements: $worldNav);
    }
  }
  $retArray[] = self::navElement('ui.titel.worldOverview', 'server', routeArgs: [$serModel->code]);
  $retArray[] = self::navDropdown(title: 'ui.server.worlds', subelements: $serverNav);
}

if($worldArg !== null) {
  $serverCodeName = [$worldArg->server->code, $worldArg->name];
  $retArray[] = self::navDropdown(title: 'ui.server.ranking', subelements: [
    self::navElement('ui.tabletitel.top10', 'world', $serverCodeName),
    self::navElement(ucfirst(__('ui.table.player')) . " (" . __('ui.nav.current') . ")", 'worldPlayer', routeArgs: $serverCodeName, translated: false),
  self::navElement(ucfirst(__('ui.table.player')) . " (" . __('ui.nav.history') . ")", 'rankPlayer', routeArgs: $serverCodeName, translated: false),
  self::navElement(ucfirst(__('ui.table.ally')) . " (" . __('ui.nav.current') . ")", 'worldAlly', routeArgs: $serverCodeName, translated: false),
  self::navElement(ucfirst(__('ui.table.ally')) . " (" . __('ui.nav.history') . ")", 'rankAlly', routeArgs: $serverCodeName, translated: false),
]);
  $retArray[] = self::navDropdown(title: 'ui.conquer.all', subelements: [
    self::navElement(ucfirst(__('ui.conquer.all')) . " " . __('ui.nav.history'), 'worldConquer', routeArgs: [$worldArg->server->code, $worldArg->name, 'all'], translated: false),
  self::navElement('ui.conquer.daily', 'conquerDaily', routeArgs: $serverCodeName, nofollow: true),
]);
}

$tools = [];
if($worldArg !== null) {
  if($worldArg->win_condition == 9) {
    $tools[] = self::navElement('tool.greatSiegeCalc.title', 'tools.greatSiegeCalc', routeArgs: $serverCodeName);
  }
  if($worldArg->config != null && $worldArg->units != null) {
    $tools[] = self::navElement('tool.distCalc.title', 'tools.distanceCalc', routeArgs: $serverCodeName);
    $tools[] = self::navElement('tool.attackPlanner.title', 'tools.attackPlannerNew', routeArgs: $serverCodeName, nofollow: true);
  } else {
    $tools[] = self::navElementDisabled('tool.distCalc.title', 'ui.nav.disabled.missingConfig');
    $tools[] = self::navElementDisabled('tool.attackPlanner.title', 'ui.nav.disabled.missingConfig');
  }
  $tools[] = self::navElement('tool.map.title', 'tools.mapNew', routeArgs: $serverCodeName, nofollow: true);

  if($worldArg->config != null && $worldArg->buildings != null) {
    $tools[] = self::navElement('tool.pointCalc.title', 'tools.pointCalc', routeArgs: $serverCodeName);
  } else {
    $tools[] = self::navElementDisabled('tool.pointCalc.title', 'ui.nav.disabled.missingConfig');
  }
  $tools[] = self::navElement('tool.tableGenerator.title', 'tools.tableGenerator', routeArgs: $serverCodeName);

  if($worldArg->config != null && $worldArg->units != null) {
    $tools[] = self::navElement('tool.accMgrDB.title', 'tools.accMgrDB.index_world', routeArgs: $serverCodeName);
  } else {
    $tools[] = self::navElementDisabled('tool.accMgrDB.title', 'ui.nav.disabled.missingConfig');
  }

  if(AnimatedHistoryMapController::isAvailable($worldArg)) {
    $tools[] = self::navElement('tool.animHistMap.title', 'tools.animHistMap.create', routeArgs: $serverCodeName, nofollow: true);
  } else {
    $tools[] = self::navElementDisabled('tool.animHistMap.title', 'ui.nav.disabled.missingConfig');
  }
} else {
  $tools[] = self::navElementDisabled('tool.distCalc.title', 'ui.nav.disabled.noWorld');
  $tools[] = self::navElementDisabled('tool.attackPlanner.title', 'ui.nav.disabled.noWorld');
  $tools[] = self::navElementDisabled('tool.map.title', 'ui.nav.disabled.noWorld');
  $tools[] = self::navElementDisabled('tool.pointCalc.title', 'ui.nav.disabled.noWorld');
  $tools[] = self::navElementDisabled('tool.tableGenerator.title', 'ui.nav.disabled.noWorld');
  $tools[] = self::navElement('tool.accMgrDB.title', 'tools.accMgrDB.index');

  $tools[] = self::navElementDisabled('tool.animHistMap.title', 'ui.nav.disabled.noWorld');
}
$retArray[] = self::navDropdown(title: 'ui.server.tools', subelements: $tools);
 */

export default function Navbar({serverCode}: {serverCode: string}) {
  const [serverWorlds, setServerWorlds] = useState<worldType[]>([])
  useEffect(() => {
    let mounted = true
    getWorldsOfServer(serverCode)
        .then(data => {
          if(mounted) {
            setServerWorlds(data)
          }
        })
    return () => {
      mounted = false
    }
  }, [serverCode])

  const trigger = useScrollTrigger()
  const allMenu: Array<JSX.Element> = []

  const worldTypes = [...new Set(serverWorlds.map(w => w.sortType))]
  const serverNavs = worldTypes.map(t => {
    const filteredWorlds = serverWorlds.filter(w => w.sortType === t)
    return (
        <Dropdown key={"fWorlds" + t} root={<MenuItem>{t}</MenuItem>} {...rightMenu}>
          {filteredWorlds.map(w => <MenuItem key={"fWorlds" + t + w.server + w.name}>{w.server + w.name}</MenuItem>)}
        </Dropdown>
    )
  })

  allMenu.push(<Dropdown key={"serverWorlds"} root={<MenuItem>ui.server.worlds</MenuItem>} hover={true}>
    {serverNavs}
  </Dropdown>)

  return (
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            {allMenu}
            {/*<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Photos
            </Typography>
            <Dropdown root={<IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
              >
                <AccountCircle />
              </IconButton>}>
              <Dropdown root={<MenuItem>Profile 1</MenuItem>} {...leftMenu}>
                <MenuItem>Profile 2</MenuItem>
                <MenuItem>My account 2</MenuItem>
              </Dropdown>
              <MenuItem>My account 1</MenuItem>
            </Dropdown>*/}
          </Toolbar>
        </AppBar>
      </Slide>
  )
}
