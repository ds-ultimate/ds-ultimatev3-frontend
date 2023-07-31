import {Dict} from "../../../util/customTypes";
import {TFunction} from "i18next";
import {AxiosError} from "axios";


export type FrontendError = {
  isFrontend: true,
  code: number,
  k: string,
  p: Dict<string>,
}

export type LaravelErrorMessage = {
  message: string,
}

export type TranslatedError = {
  k: string,
  p: Dict<string>,
}

export function extractMessage(def: string, error: AxiosError | FrontendError, t: TFunction<"error", undefined, "error">) {
  let message = def
  if((error as AxiosError).isAxiosError) {
    const errAx = error as AxiosError
    if(errAx.response && errAx.response.data &&
        typeof(errAx.response?.data) === "object" && (errAx.response?.data as any).message) {
      const laravelErr = errAx.response.data as LaravelErrorMessage
      message = laravelErr.message

      if(laravelErr.message.startsWith("CUSTOM_")) {
        const customErr = JSON.parse(laravelErr.message.substring("CUSTOM_".length)) as TranslatedError
        message = t(customErr.k, customErr.p)
      }
    }
  } else if((error as FrontendError).isFrontend) {
    const errFront = error as FrontendError
    message = t(errFront.k, errFront.p)
  }
  return message
}
