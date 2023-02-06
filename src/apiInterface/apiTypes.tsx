
interface Dict<T> {
  [key: string]: T | undefined;
}

type worldType = {
  id: number,
  name: string,
  display_name: string | null,
  ally_count: number,
  player_count: number,
  village_count: number,
  active: boolean | null,
  maintananceMode: boolean,
  server: string,
  hasConfig: boolean,
  hasUnits: boolean,
  hasBuildings: boolean,
  sortType: string,
}

export type {Dict, worldType}