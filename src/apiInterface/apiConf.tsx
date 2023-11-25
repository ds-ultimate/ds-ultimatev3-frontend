import {Dict} from "../util/customTypes";
import axios from "axios"

const API_BASE_PATH: string = process.env.REACT_APP_API_URL as string
const APP_BASE_PATH: string = process.env.REACT_APP_BASE_URL as string

if(process.env.REACT_APP_API_USE_AUTH) {
  const auth = {
    username: process.env.REACT_APP_API_AUTH_USER,
    password: process.env.REACT_APP_API_AUTH_PASS,
  }
  axios.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(auth.username + ':' + auth.password)
}

export type routeGenerator = (params: Dict<string>) => string

const apiRequestGenerator: (uri: string) => routeGenerator = (uri: string) => {
  return (params: Dict<string>) => {
    let result = uri
    Object.keys(params).forEach((pName) => {
      result = result.replace("{" + pName + "}", params[pName] as string)
    })
    return API_BASE_PATH + result
  }
}

const requestGenerator = (uri: string) => {
  return (params: Dict<string>) => {
    let result = uri
    Object.keys(params).forEach((pName) => {
      result = result.replace("{" + pName + "}", params[pName] as string)
    })
    return APP_BASE_PATH + result
  }
}


export const errorReporting = apiRequestGenerator("error")

//Various data
export const getNews = apiRequestGenerator("getNews")
export const getServers = apiRequestGenerator("getServers")
export const getChangelogs = apiRequestGenerator("getChangelogs")
export const getWorlds = apiRequestGenerator("getWorlds")
export const worldOverview = apiRequestGenerator("worldOverview/{server}/{world}")
export const worldGetExtendedData = apiRequestGenerator("worldExtendedData/{server}/{world}")
export const allyBasicData = apiRequestGenerator("allyBasicData/{server}/{world}/{id}")
export const allyChartData = apiRequestGenerator("allyChartData/{server}/{world}/{id}")
export const playerBasicData = apiRequestGenerator("playerBasicData/{server}/{world}/{id}")
export const playerChartData = apiRequestGenerator("playerChartData/{server}/{world}/{id}")
export const playerWorldPopup = apiRequestGenerator("playerWorldPopup/{world_id}/{player}")
export const villageBasicData = apiRequestGenerator("villageBasicData/{server}/{world}/{id}")
export const villageAllyDataXY = apiRequestGenerator("villageAllyDataXY/{server}/{world}/{x}/{y}")


export const searchNormal = apiRequestGenerator("basicSearch")
export const searchExtended = apiRequestGenerator("extendedSearch")

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
export const playerConquerTable = apiRequestGenerator("tables/playerConquer/{server}/{world}/{type}/{player}")
export const playerAllyChangeTable = apiRequestGenerator("tables/playerAllyChange/{server}/{world}/{type}/{player}")
export const villageConquerTable = apiRequestGenerator("tables/villageConquer/{server}/{world}/{type}/{village}")
export const allyPlayerVillageTable = apiRequestGenerator("tables/allyPlayerVillageTable/{server}/{world}/{ally}")


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

//TODO backend code for signature + proxy & cache that lives in frontend container / env
export const playerSignature = requestGenerator("api/{server}/{world}/signature/player/{player}")
