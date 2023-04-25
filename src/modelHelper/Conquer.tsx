import {worldType} from "./World";
import {Link} from "react-router-dom";
import {formatRoute} from "../util/router";
import {ALLY_INFO, PLAYER_INFO, VILLAGE_INFO} from "../util/routes";
import {DecodeName} from "../util/UtilFunctions";
import {useTranslation} from "react-i18next";
import styles from "./Conquer.module.scss"
import {TFunction} from "i18next";
import {LinkAllyGeneric} from "./Ally";
import {LinkPlayerGeneric} from "./Player";


export type conquerPureType = {
  id: number,
  village_id: number,
  timestamp: number,
  new_owner: number,
  old_owner: number,
  old_owner_name: string | null,
  new_owner_name: string | null,
  old_ally: number,
  new_ally: number,
  old_ally_name: string | null,
  new_ally_name: string | null,
  old_ally_tag: string | null,
  new_ally_tag: string | null,
  points: number,
}

export type conquerType = conquerPureType & {
  village__name: string | null,
  village__x: string | null,
  village__y: string | null,
  village__bonus_id: number | null,
}

export enum conquerChangeType {
  NORMAL = 0,
  INTERNAL = 1,
  SELF = 2,
  BARBARIAN = 3,
  //DELETION = 4,
  WIN = 5,
  LOOSE = 6,
}

export enum highlightRefType {
  ALLY,
  PLAYER,
  VILLAGE
}

export const conquerChangeTypeSetting: Array<{cls_in: string, cls_act: string, title: (t: TFunction<"ui">) => string}> = [
  { //Normal
    cls_in: styles.conquerDiv,
    cls_act: styles.conquerDiv,
    title: (t) => t("conquer.highlight.normal")
  },
  { //Internal
    cls_in: styles.conquerDiv,
    cls_act: styles.internalType,
    title: (t) => t("conquer.highlight.internal")
  },
  { //Self
    cls_in: styles.conquerDiv,
    cls_act: styles.selfType,
    title: (t) => t("conquer.highlight.self")
  },
  { //Barbarian
    cls_in: styles.conquerDiv,
    cls_act: styles.barbarianType,
    title: (t) => t("conquer.highlight.barbarian")
  },
  { //Deletion
    cls_in: styles.conquerDiv,
    cls_act: styles.deletedType,
    title: (t) => t("conquer.highlight.deleted")
  },
  { //Win
    cls_in: styles.conquerDiv,
    cls_act: styles.winType,
    title: (t) => t("conquer.highlight.win")
  },
  { //Loose
    cls_in: styles.conquerDiv,
    cls_act: styles.looseType,
    title: (t) => t("conquer.highlight.loose")
  },
]

export function getConquerType(conquer: conquerType, allowed: conquerChangeType[], ref: [highlightRefType, number]): conquerChangeType {
  if(ref[0] === highlightRefType.PLAYER) {
    if(conquer.old_owner !== ref[1] && conquer.new_owner === ref[1] && allowed.includes(conquerChangeType.WIN)) return conquerChangeType.WIN
    if(conquer.old_owner === ref[1] && conquer.new_owner !== ref[1] && allowed.includes(conquerChangeType.LOOSE)) return conquerChangeType.LOOSE
  }
  if(ref[0] === highlightRefType.ALLY) {
    if(conquer.old_ally !== ref[1] && conquer.new_ally === ref[1] && allowed.includes(conquerChangeType.WIN)) return conquerChangeType.WIN
    if(conquer.old_ally === ref[1] && conquer.new_ally !== ref[1] && allowed.includes(conquerChangeType.LOOSE)) return conquerChangeType.LOOSE
  }
  //if(conquer.new_owner === 0 && allowed.includes(conquerChangeType.DELETION)) return conquerChangeType.DELETION not possible as of now
  if(conquer.old_owner === 0 && allowed.includes(conquerChangeType.BARBARIAN)) return conquerChangeType.BARBARIAN
  if(conquer.old_owner === conquer.new_owner && allowed.includes(conquerChangeType.SELF)) return conquerChangeType.SELF
  if(conquer.old_ally === conquer.new_ally && conquer.old_ally !== 0 && allowed.includes(conquerChangeType.INTERNAL)) return conquerChangeType.INTERNAL
  return conquerChangeType.NORMAL
}

export function LinkConquerOldPlayer({conquer, world}: {conquer: conquerType, world: worldType}) {
  return <LinkPlayerGeneric owner={conquer.old_owner} owner_name={conquer.old_owner_name} world={world} />
}

export function LinkConquerNewPlayer({conquer, world}: {conquer: conquerType, world: worldType}) {
  return <LinkPlayerGeneric owner={conquer.new_owner} owner_name={conquer.new_owner_name} world={world} />
}

export function LinkConquerOldAlly({conquer, world, useTag}: {conquer: conquerType, world: worldType, useTag?: boolean}) {
  return <LinkAllyGeneric ally={conquer.old_ally} ally_tag={conquer.old_ally_tag} ally_name={conquer.old_ally_name} world={world} useTag={useTag} />
}

export function LinkConquerNewAlly({conquer, world, useTag}: {conquer: conquerType, world: worldType, useTag?: boolean}) {
  return <LinkAllyGeneric ally={conquer.new_ally} ally_tag={conquer.new_ally_tag} ally_name={conquer.new_ally_name} world={world} useTag={useTag} />
}

export function LinkConquerOld({conquer, world}: {conquer: conquerType, world: worldType}) {
  return (
      <>
        <div className={"d-md-inline-block me-1 " + styles.conquerTruncate}>
          <LinkConquerOldPlayer conquer={conquer} world={world} />
        </div>
        <div className={"d-md-inline-block"}>
          <LinkConquerOldAlly conquer={conquer} world={world} useTag />
        </div>
      </>
  )
}

export function LinkConquerNew({conquer, world}: {conquer: conquerType, world: worldType}) {
  return (
      <>
        <div className={"d-md-inline-block me-1 " + styles.conquerTruncate}>
          <LinkConquerNewPlayer conquer={conquer} world={world} />
        </div>
        <div className={"d-md-inline-block"}>
          <LinkConquerNewAlly conquer={conquer} world={world} useTag />
        </div>
      </>
  )
}

export function LinkConquerVillage({conquer, world}: {conquer: conquerType, world: worldType}) {
  const { t } = useTranslation("ui")
  if(conquer.village__x === null || conquer.village__y === null || conquer.village__name === null) {
    return <>{t("player.deleted")}</>
  }

  return (
      <>
        <Link to={formatRoute(VILLAGE_INFO, {server: world.server__code, world: world.name, village: (conquer.village_id + "")})}>
          <div className={"d-md-inline-block me-1"}>
            [{conquer.village__x + "|" + conquer.village__y}]
          </div>
          <div className={"d-md-inline-block " + styles.conquerTruncate}>
            <DecodeName name={conquer.village__name} />
          </div>
        </Link>
      </>
  )
}

const datePad = (n: number) => String(n).padStart(2, '0')
export function ConquerTime({conquer}: {conquer: conquerType}) {
  const dTime = new Date(conquer.timestamp * 1000)
  const p = datePad
  return (
      <>
        <div className={"d-md-inline-block me-1"}>
          {p(dTime.getHours())}:{p(dTime.getMinutes())}:{p(dTime.getSeconds())}
        </div>
        <div className={"d-md-inline-block"}>
          {p(dTime.getDate())}-{p(dTime.getMonth() + 1)}-{p(dTime.getFullYear())}
        </div>
      </>
  )
}
