import {Dict} from "../util/customTypes";

const BASE_PATH: string = process.env.REACT_APP_API_URL as string

const apiRequestGenerator = (uri: string) => {
  return (params: Dict<string>) => {
    let result = uri
    Object.keys(params).forEach((pName) => {
      result = result.replace("{" + pName + "}", params[pName] as string)
    })
    return BASE_PATH + result
  }
}

export const indexPage = apiRequestGenerator("indexPage")
export const serverGetWorlds = apiRequestGenerator("serverGetWorlds/{server}")
export const worldOverview = apiRequestGenerator("worldOverview/{server}/{world}")
export const worldGetExtendedData = apiRequestGenerator("worldExtendedData/{server}/{world}")

//Datatables
export const worldAllyCurrentTable = apiRequestGenerator("tables/worldAlly/{server}/{world}")
export const worldPlayerCurrentTable = apiRequestGenerator("tables/worldPlayer/{server}/{world}")
export const worldAllyHistoryTable = apiRequestGenerator("tables/worldHistoryAlly/{server}/{world}")
export const worldPlayerHistoryTable = apiRequestGenerator("tables/worldHistoryPlayer/{server}/{world}")
export const worldConquerTable = apiRequestGenerator("tables/worldConquer/{server}/{world}/{type}")
export const worldDailyPlayerConquerTable = apiRequestGenerator("tables/worldConquerDailyPlayer/{server}/{world}")
export const worldDailyAllyConquerTable = apiRequestGenerator("tables/worldConquerDailyAlly/{server}/{world}")

//Bootstrap-select
export const villageSelect = apiRequestGenerator("select/village/{world}")
export const playerSelect = apiRequestGenerator("select/player/{world}")
export const allySelect = apiRequestGenerator("select/ally/{world}")
export const playerTopSelect = apiRequestGenerator("select/playerTop/{world}")
export const allyTopSelect = apiRequestGenerator("select/allyTop/{world}")
