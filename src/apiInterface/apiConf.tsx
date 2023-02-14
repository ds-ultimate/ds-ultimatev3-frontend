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

const indexPage = apiRequestGenerator("indexPage")
const serverGetWorlds = apiRequestGenerator("serverGetWorlds/{server}")
const worldOverview = apiRequestGenerator("worldOverview/{server}/{world}")

//Datatables
const worldAllyCurrentTable = apiRequestGenerator("tables/worldAlly/{server}/{world}")
const worldPlayerCurrentTable = apiRequestGenerator("tables/worldPlayer/{server}/{world}")


export {indexPage, serverGetWorlds, worldOverview, worldAllyCurrentTable, worldPlayerCurrentTable}
