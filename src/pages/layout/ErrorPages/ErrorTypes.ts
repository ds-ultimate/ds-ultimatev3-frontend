import {Dict} from "../../../util/customTypes";
import {TFunction} from "i18next";
import {AxiosError} from "axios";

export type LaravelErrorMessage = {
  message: string,
}

export type TranslatedError = {
  k: string,
  p: Dict<string>,
}

export function extractMessage(def: string, error: AxiosError, t: TFunction<"error", undefined, "error">) {
  let message = def
  if(error.response && error.response.data &&
      typeof(error.response?.data) === "object" && (error.response?.data as any).message) {
    const laravelErr = error.response.data as LaravelErrorMessage
    message = laravelErr.message

    if(laravelErr.message.startsWith("CUSTOM_")) {
      const customErr = JSON.parse(laravelErr.message.substring("CUSTOM_".length)) as TranslatedError
      message = t(customErr.k, customErr.p)
    }
  }
  return message
}
