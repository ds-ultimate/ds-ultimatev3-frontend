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

//Various data
export const indexPage = apiRequestGenerator("indexPage")
export const serverGetWorlds = apiRequestGenerator("serverGetWorlds/{server}")
export const worldOverview = apiRequestGenerator("worldOverview/{server}/{world}")
export const worldGetExtendedData = apiRequestGenerator("worldExtendedData/{server}/{world}")
export const allyBasicData = apiRequestGenerator("allyBasicData/{server}/{world}/{ally}")
export const allyChartData = apiRequestGenerator("allyChartData/{server}/{world}/{ally}")
export const playerBasicData = apiRequestGenerator("playerBasicData/{server}/{world}/{player}")
export const playerChartData = apiRequestGenerator("playerChartData/{server}/{world}/{player}")
export const playerWorldPopup = apiRequestGenerator("playerWorldPopup/{world_id}/{player}")

//Datatables
export const worldAllyCurrentTable = apiRequestGenerator("tables/worldAlly/{server}/{world}")
export const worldPlayerCurrentTable = apiRequestGenerator("tables/worldPlayer/{server}/{world}")
export const worldAllyHistoryTable = apiRequestGenerator("tables/worldHistoryAlly/{server}/{world}")
export const worldPlayerHistoryTable = apiRequestGenerator("tables/worldHistoryPlayer/{server}/{world}")
export const worldConquerTable = apiRequestGenerator("tables/worldConquer/{server}/{world}/{type}")
export const worldDailyPlayerConquerTable = apiRequestGenerator("tables/worldConquerDailyPlayer/{server}/{world}")
export const worldDailyAllyConquerTable = apiRequestGenerator("tables/worldConquerDailyAlly/{server}/{world}")
export const allyPlayerTable = apiRequestGenerator("tables/allyPlayer/{server}/{world}/{ally}")
export const allyAllyHistoryTable = apiRequestGenerator("tables/allyAllyHistory/{server}/{world}/{ally}")
export const allyConquerTable = apiRequestGenerator("tables/allyConquer/{server}/{world}/{type}/{ally}")
export const allyAllyChangeTable = apiRequestGenerator("tables/allyAllyChange/{server}/{world}/{type}/{ally}")
export const playerVillageTable = apiRequestGenerator("tables/playerVillage/{server}/{world}/{player}")
export const playerPlayerHistoryTable = apiRequestGenerator("tables/playerPlayerHistory/{server}/{world}/{player}")

//Bootstrap-select
export const villageSelect = apiRequestGenerator("select/village/{world}")
export const playerSelect = apiRequestGenerator("select/player/{world}")
export const allySelect = apiRequestGenerator("select/ally/{world}")
export const playerTopSelect = apiRequestGenerator("select/playerTop/{world}")
export const allyTopSelect = apiRequestGenerator("select/allyTop/{world}")

//Maps
export const overviewMap = apiRequestGenerator("maps/{server}/{world}/{type}-{id}.{ext}")
export const overviewMapSized = apiRequestGenerator("maps/{server}/{world}/{type}-{id}-{width}-{height}.{ext}")
//TODO add maptop10 maptop10 player when adding map tool. Should use same as viewing a custom map
