import {worldType} from "./World";
import {Link} from "react-router-dom";
import {formatRoute} from "../util/router";
import {ALLY_INFO, PLAYER_INFO, VILLAGE_INFO} from "../util/routes";
import {DecodeName} from "../util/UtilFunctions";
import {useTranslation} from "react-i18next";
import styles from "./Conquer.module.scss"
import {TFunction} from "i18next";


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
  NORMAL,
  INTERNAL,
  SELF,
  BARBARIAN,
  DELETION,
  WIN,
  LOOSE,
}

export const conquerChangeTypeSetting: Array<{className: string, title: (t: TFunction<"ui">) => string}> = [
  { //Normal
    className: "",
    title: (_t) => ""
  },
  { //Internal
    className: styles.internalType,
    title: (t) => t("conquer.highlight.internal")
  },
  { //Self
    className: styles.selfType,
    title: (t) => t("conquer.highlight.self")
  },
  { //Barbarian
    className: styles.barbarianType,
    title: (t) => t("conquer.highlight.barbarian")
  },
  { //Deletion
    className: styles.deletedType,
    title: (t) => t("conquer.highlight.deleted")
  },
  { //Win
    className: styles.winType,
    title: (t) => t("conquer.highlight.win")
  },
  { //Loose
    className: styles.looseType,
    title: (t) => t("conquer.highlight.loose")
  },
]

export function getConquerType(conquer: conquerType): conquerChangeType {
  if(conquer.new_owner === 0) return conquerChangeType.DELETION
  if(conquer.old_owner === 0) return conquerChangeType.BARBARIAN
  if(conquer.old_owner === conquer.new_owner) return conquerChangeType.SELF
  if(conquer.old_ally === conquer.new_ally && conquer.old_ally !== 0) return conquerChangeType.INTERNAL
  return conquerChangeType.NORMAL
}

function LinkConquerPlayer({owner, owner_name, world}: {owner: number, owner_name: string | null, world: worldType}) {
  const { t } = useTranslation("ui")
  if(owner === 0) {
    return <>{t("player.barbarian")}</>
  }
  if(owner_name === null) {
    return <>{t("player.deleted")}</>
  }

  return (
      <Link to={formatRoute(PLAYER_INFO, {server: world.server__code, world: world.name, player: (owner + "")})}>
        <DecodeName name={owner_name} />
      </Link>
  )
}

function LinkConquerAlly({ally, ally_tag, ally_name, world, useTag}: {ally: number, ally_tag: string | null,
      ally_name: string | null, world: worldType, useTag?: boolean}) {
  const { t } = useTranslation("ui")
  if(ally === 0) return null
  if(ally_tag === null || ally_name === null) {
    return (
        <>
          {useTag?<>[{t("player.deleted")}]</>:t("player.deleted")}
        </>
    )
  }

  return (
      <Link to={formatRoute(ALLY_INFO, {server: world.server__code, world: world.name, ally: (ally + "")})}>
        {useTag?<>[<DecodeName name={ally_tag} />]</>:<DecodeName name={ally_name} />}
      </Link>
  )
}

export function LinkConquerOldPlayer({conquer, world}: {conquer: conquerType, world: worldType}) {
  return <LinkConquerPlayer owner={conquer.old_owner} owner_name={conquer.old_owner_name} world={world} />
}

export function LinkConquerNewPlayer({conquer, world}: {conquer: conquerType, world: worldType}) {
  return <LinkConquerPlayer owner={conquer.new_owner} owner_name={conquer.new_owner_name} world={world} />
}

export function LinkConquerOldAlly({conquer, world, useTag}: {conquer: conquerType, world: worldType, useTag?: boolean}) {
  return <LinkConquerAlly ally={conquer.old_ally} ally_tag={conquer.old_ally_tag} ally_name={conquer.old_ally_name} world={world} useTag={useTag} />
}

export function LinkConquerNewAlly({conquer, world, useTag}: {conquer: conquerType, world: worldType, useTag?: boolean}) {
  return <LinkConquerAlly ally={conquer.new_ally} ally_tag={conquer.new_ally_tag} ally_name={conquer.new_ally_name} world={world} useTag={useTag} />
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
          {p(dTime.getDay())}-{p(dTime.getMonth())}-{p(dTime.getFullYear())}
        </div>
      </>
  )
}
