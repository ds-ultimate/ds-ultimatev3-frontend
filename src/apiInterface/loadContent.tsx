import {worldType} from "./apiTypes";
import axios from "axios";
import {serverGetWorlds} from "./apiConf";

const auth = {
  username: <censored>,
  password: <censored>,
}
axios.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(auth.username + ':' + auth.password)

const getWorldsOfServer = (server: string) => {
  return new Promise<worldType[]>((resolve) => {
    axios.get(serverGetWorlds({server}))
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          resolve([])
        })
  })
}

export {getWorldsOfServer}