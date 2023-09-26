import {cacheable} from "../apiInterface/MainDatabase"

type newsType = cacheable & {
  id: number,
  order: number,
  content_de: string,
  content_en: string,
}

export type {newsType}
