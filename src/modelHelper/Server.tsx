import Flags from 'country-flag-icons/react/3x2'
import {cacheable} from "../apiInterface/MainDatabase"

type serverType = cacheable & {
  id: number,
  code: string,
  flag: string,
  url: string,
  active: boolean,
  speed_active: boolean,
  classic_active: boolean,
  locale: string,

  world_cnt: number,
}

const ServerFlag = ({server}: {server: serverType}) => {
  // @ts-ignore
  const Flag = Flags[server.flag.toUpperCase()]
  return (
      <Flag className={"flags"}/>
  )
}

export type {serverType}
export {ServerFlag}
