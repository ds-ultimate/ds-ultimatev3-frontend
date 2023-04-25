import {worldType} from "./World";
import {LinkAllyGeneric} from "./Ally";
import {LinkPlayerGeneric} from "./Player";


export type allyChangePureType = {
  player_id: number,
  old_ally_id: number,
  new_ally_id: number,
  points: number,
  created_at: string,
}

export type allyChangeType = allyChangePureType & {
  player__name: string | null,
  ally_old__name: string | null,
  ally_old__tag: string | null,
  ally_new__name: string | null,
  ally_new__tag: string | null,
}

export function LinkAllyChangeOld({allyChange, world, useTag}: {allyChange: allyChangeType, world: worldType, useTag?: boolean}) {
  return <LinkAllyGeneric ally={allyChange.old_ally_id} ally_tag={allyChange.ally_old__tag} ally_name={allyChange.ally_old__name} world={world} useTag={useTag} />
}

export function LinkAllyChangeNew({allyChange, world, useTag}: {allyChange: allyChangeType, world: worldType, useTag?: boolean}) {
  return <LinkAllyGeneric ally={allyChange.new_ally_id} ally_tag={allyChange.ally_new__tag} ally_name={allyChange.ally_new__name} world={world} useTag={useTag} />
}

export function LinkAllyChangePlayer({allyChange, world}: {allyChange: allyChangeType, world: worldType}) {
  return <LinkPlayerGeneric owner={allyChange.player_id} owner_name={allyChange.player__name} world={world} />
}

const datePad = (n: number) => String(n).padStart(2, '0')
export function AllyChangeTime({allyChange}: {allyChange: allyChangeType}) {
  const dTime = new Date(allyChange.created_at)
  const p = datePad
  return (
      <>
        {p(dTime.getHours())}:{p(dTime.getMinutes())}:{p(dTime.getSeconds())} {p(dTime.getDate())}-{p(dTime.getMonth() + 1)}-{p(dTime.getFullYear())}
      </>
  )
}
