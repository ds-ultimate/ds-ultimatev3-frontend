import {Dict} from "./apiTypes";

const BASE_PATH = <censored>

const apiRequestGenerator = (uri: string) => {
  return (params: Dict<string>) => {
    let result = uri
    Object.keys(params).forEach((pName) => {
      result = result.replace("{" + pName + "}", params[pName] as string)
    })
    return BASE_PATH + result
  }
}

const serverGetWorlds = apiRequestGenerator("serverGetWorlds/{server}")

export {serverGetWorlds}
