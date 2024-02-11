import {worldType} from "../../../modelHelper/World"
import {useTranslation} from "react-i18next"
import React from "react"
import {formatRoute} from "../../../util/router"
import {DISTANCE_CALC, POINT_CALC, TABLE_GENERATOR} from "../../tools/routes"
import {faStopwatch, faList, faToolbox} from "@fortawesome/free-solid-svg-icons"
import {faFortAwesomeAlt} from "@fortawesome/free-brands-svg-icons"
import {NavbarItem, NavbarItemDisabled, NavbarMenu} from "../Navbar"


export function ToolNavDropdown({serverCode, worldName, currentWorld}: {serverCode: string | undefined, worldName: string | undefined, currentWorld: worldType | undefined}) {
  const { t } = useTranslation("tool")

  const toolEntries: React.ReactElement[] = []
  if(serverCode !== undefined && worldName !== undefined && currentWorld !== undefined) {
    //TODO create generator function for disabled nav elements
    /* //TODO add this/these tool(s)
    if($worldArg->win_condition == 9) {
      $tools[] = self::navElement('tool.greatSiegeCalc.title', 'tools.greatSiegeCalc', routeArgs: $serverCodeName);
    }
     */
    if(currentWorld.hasConfig && currentWorld.hasUnits) {
      toolEntries.push(<NavbarItem
          key={"dstClc"}
          to={formatRoute(DISTANCE_CALC, {server: serverCode, world: worldName})}
          text={t("distCalc.title")}
          icon={faStopwatch} />)
    } else {
      toolEntries.push(<NavbarItemDisabled
          key={"dstClc"}
          text={t("distCalc.title")}
          tooltip={t("disabled.missingConfig")}
          icon={faStopwatch} />)
    }
    /* //TODO add this/these tool(s)
    if($worldArg->config != null && $worldArg->units != null) {
      $tools[] = self::navElement('tool.attackPlanner.title', 'tools.attackPlannerNew', routeArgs: $serverCodeName, nofollow: true);
    } else {
      $tools[] = self::navElementDisabled('tool.attackPlanner.title', 'ui.nav.disabled.missingConfig');
    }
    $tools[] = self::navElement('tool.map.title', 'tools.mapNew', routeArgs: $serverCodeName, nofollow: true);
    */

    if(currentWorld.hasConfig && currentWorld.hasUnits) {
      toolEntries.push(<NavbarItem
          key={"pntClc"}
          to={formatRoute(POINT_CALC, {server: serverCode, world: worldName})}
          text={t("pointCalc.title")}
          icon={faFortAwesomeAlt} />)
    } else {
      toolEntries.push(<NavbarItemDisabled
          key={"pntClc"}
          text={t("pointCalc.title")}
          tooltip={t("disabled.missingConfig")}
          icon={faFortAwesomeAlt} />)
    }
    toolEntries.push(<NavbarItem
        key={"tblGen"}
        to={formatRoute(TABLE_GENERATOR, {server: serverCode, world: worldName})}
        text={t("tableGenerator.title")}
        icon={faList} />)

    /* //TODO add this/these tool(s)
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
    if(currentWorld.hasConfig && currentWorld.hasUnits) {
      toolEntries.push(<NavbarItem
          key={"sim"}
          to={formatRoute(SIMULATOR, {server: serverCode, world: worldName})}
          text={t("simulator.title")}
          icon={faHammer} />)
    } else {
      toolEntries.push(<NavbarItemDisabled
          key={"sim"}
          text={t("simulator.title")}
          tooltip={t("disabled.missingConfig")}
          icon={faHammer} />)
    }
     */
  } else {
    toolEntries.push(<NavbarItemDisabled
        key={"dstClc"}
        text={t("distCalc.title")}
        tooltip={t("disabled.noWorld")}
        icon={faStopwatch} />)
    /* //TODO add this/these tool(s)
    $tools[] = self::navElementDisabled('tool.attackPlanner.title', 'ui.nav.disabled.noWorld');
    $tools[] = self::navElementDisabled('tool.map.title', 'ui.nav.disabled.noWorld');
     */
    toolEntries.push(<NavbarItemDisabled
        key={"pntClc"}
        text={t("pointCalc.title")}
        tooltip={t("disabled.noWorld")}
        icon={faFortAwesomeAlt} />)
    toolEntries.push(<NavbarItemDisabled
        key={"tblGen"}
        text={t("tableGenerator.title")}
        tooltip={t("disabled.noWorld")}
        icon={faList} />)
    /* //TODO add this/these tool(s)
    $tools[] = self::navElement('tool.accMgrDB.title', 'tools.accMgrDB.index');

    $tools[] = self::navElementDisabled('tool.animHistMap.title', 'ui.nav.disabled.noWorld');
    toolEntries.push(<NavbarItemDisabled
        key={"sim"}
        text={t("simulator.title")}
        tooltip={t("disabled.noWorld")}
        icon={faHammer} />)
     */
  }

  return (
      <NavbarMenu
          keyName={"toolDropdown"}
          title={t("navGroupTitle")}
          sub={[
            ...toolEntries,
            <NavbarItemDisabled
                key={"TODO"}
                text={"TODO"}
                tooltip={"TODO"}
                icon={faList} />,
          ]}
          icon={faToolbox}
      />
  )
}