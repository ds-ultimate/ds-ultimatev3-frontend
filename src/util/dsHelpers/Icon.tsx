import {Dict, NumDict} from "../customTypes";
import {BASE_PATH} from "../router"

export enum BuildingSize {
  SMALL,
  MEDIUM,
  BIG,
}

const DS_IMG = BASE_PATH + '/ds_images/'
const DS_BUILD = DS_IMG + 'buildings/'

export function get_icon(icon_num: number) {
  switch (icon_num){
    case 0: return DS_IMG + 'unit/spear.png'
    case 1: return DS_IMG + 'unit/sword.png'
    case 2: return DS_IMG + 'unit/axe.png'
    case 3: return DS_IMG + 'unit/archer.png'
    case 4: return DS_IMG + 'unit/spy.png'
    case 5: return DS_IMG + 'unit/light.png'
    case 6: return DS_IMG + 'unit/marcher.png'
    case 7: return DS_IMG + 'unit/heavy.png'
    case 8: return DS_IMG + 'unit/ram.png'
    case 9: return DS_IMG + 'unit/catapult.png'
    case 10: return DS_IMG + 'unit/knight.png'
    case 11: return DS_IMG + 'unit/snob.png'
    case 12: return DS_IMG + 'wb/def_cav.png'
    case 13: return DS_IMG + 'wb/def_archer.png'
    case 14: return DS_IMG + 'wb/fake.png'
    case 15: return DS_IMG + 'wb/ally.png\''
    case 16: return DS_IMG + 'wb/move_out.png'
    case 17: return DS_IMG + 'wb/move_in.png'
    case 18: return DS_IMG + 'wb/bullet_ball_blue.png'
    case 19: return DS_IMG + 'wb/bullet_ball_green.png'
    case 20: return DS_IMG + 'wb/bullet_ball_yellow.png'
    case 21: return DS_IMG + 'wb/bullet_ball_red.png'
    case 22: return DS_IMG + 'wb/bullet_ball_grey.png'
    case 23: return DS_IMG + 'wb/warning.png'
    case 24: return DS_IMG + 'wb/die.png'
    case 25: return DS_IMG + 'wb/add.png'
    case 26: return DS_IMG + 'wb/remove.png'
    case 27: return DS_IMG + 'wb/checkbox.png'
    case 28: return DS_IMG + 'wb/eye.png'
    case 29: return DS_IMG + 'wb/eye_forbidden.png'
    case 30: return DS_BUILD + 'small/main.png'
    case 31: return DS_BUILD + 'small/barracks.png'
    case 32: return DS_BUILD + 'small/stable.png'
    case 33: return DS_BUILD + 'small/garage.png'
    case 34: return DS_BUILD + 'small/church.png'
    case 35: return DS_BUILD + 'small/snob.png'
    case 36: return DS_BUILD + 'small/smith.png'
    case 37: return DS_BUILD + 'small/place.png'
    case 38: return DS_BUILD + 'small/statue.png'
    case 39: return DS_BUILD + 'small/market.png'
    case 40: return DS_BUILD + 'small/wood.png'
    case 41: return DS_BUILD + 'small/stone.png'
    case 42: return DS_BUILD + 'small/iron.png'
    case 43: return DS_BUILD + 'small/farm.png'
    case 44: return DS_BUILD + 'small/storage.png'
    case 45: return DS_BUILD + 'small/wall.png'
    case 46: return DS_IMG + 'wb/def_fake.png'
    default: return DS_IMG + 'wb/remove.png'
  }
}

const BUILDING_ICON_MAP: NumDict<Dict<NumDict<string>>> = {
  [BuildingSize.SMALL]: {
    "main": {1: DS_BUILD + 'small/main.png'},
    "barracks": {1: DS_BUILD + 'small/barracks.png'},
    "stable": {1: DS_BUILD + 'small/stable.png'},
    "garage": {1: DS_BUILD + 'small/garage.png'},
    "church": {1: DS_BUILD + 'small/church.png'},
    "watchtower": {1: DS_BUILD + 'small/watchtower.png'},
    "snob": {1: DS_BUILD + 'small/snob.png'},
    "smith": {1: DS_BUILD + 'small/smith.png'},
    "place": {1: DS_BUILD + 'small/place.png'},
    "statue": {1: DS_BUILD + 'small/statue.png'},
    "market": {1: DS_BUILD + 'small/market.png'},
    "wood": {1: DS_BUILD + 'small/wood.png'},
    "stone": {1: DS_BUILD + 'small/stone.png'},
    "iron": {1: DS_BUILD + 'small/iron.png'},
    "farm": {1: DS_BUILD + 'small/farm.png'},
    "storage": {1: DS_BUILD + 'small/storage.png'},
    "hide": {1: DS_BUILD + 'small/hide.png'},
    "wall": {1: DS_BUILD + 'small/wall.png'},
  },
  [BuildingSize.MEDIUM]: {
    "main": {1: DS_BUILD + 'mid/main1.png', 2: DS_BUILD + 'mid/main2.png', 3: DS_BUILD + 'mid/main3.png'},
    "barracks": {1: DS_BUILD + 'mid/barracks1.png', 2: DS_BUILD + 'mid/barracks2.png', 3: DS_BUILD + 'mid/barracks3.png'},
    "stable": {1: DS_BUILD + 'mid/stable1.png', 2: DS_BUILD + 'mid/stable2.png', 3: DS_BUILD + 'mid/stable3.png'},
    "garage": {1: DS_BUILD + 'mid/garage1.png', 2: DS_BUILD + 'mid/garage2.png', 3: DS_BUILD + 'mid/garage3.png'},
    "church": {1: DS_BUILD + 'mid/church1.png', 2: DS_BUILD + 'mid/church2.png', 3: DS_BUILD + 'mid/church3.png'},
    "watchtower": {1: DS_BUILD + 'mid/watchtower1.png', 2: DS_BUILD + 'mid/watchtower2.png', 3: DS_BUILD + 'mid/watchtower3.png'},
    "snob": {1: DS_BUILD + 'mid/snob1.png'},
    "smith": {1: DS_BUILD + 'mid/smith1.png', 2: DS_BUILD + 'mid/smith2.png', 3: DS_BUILD + 'mid/smith3.png'},
    "place": {1: DS_BUILD + 'mid/place1.png'},
    "statue": {1: DS_BUILD + 'mid/statue1.png'},
    "market": {1: DS_BUILD + 'mid/market1.png', 2: DS_BUILD + 'mid/market2.png', 3: DS_BUILD + 'mid/market3.png'},
    "wood": {1: DS_BUILD + 'mid/wood1.png', 2: DS_BUILD + 'mid/wood2.png', 3: DS_BUILD + 'mid/wood3.png'},
    "stone": {1: DS_BUILD + 'mid/stone1.png', 2: DS_BUILD + 'mid/stone2.png', 3: DS_BUILD + 'mid/stone3.png'},
    "iron": {1: DS_BUILD + 'mid/iron1.png', 2: DS_BUILD + 'mid/iron2.png', 3: DS_BUILD + 'mid/iron3.png'},
    "farm": {1: DS_BUILD + 'mid/farm1.png', 2: DS_BUILD + 'mid/farm2.png', 3: DS_BUILD + 'mid/farm3.png'},
    "storage": {1: DS_BUILD + 'mid/storage1.png', 2: DS_BUILD + 'mid/storage2.png', 3: DS_BUILD + 'mid/storage3.png'},
    "hide": {1: DS_BUILD + 'mid/hide1.png'},
    "wall": {1: DS_BUILD + 'mid/wall1.png', 2: DS_BUILD + 'mid/wall2.png', 3: DS_BUILD + 'mid/wall3.png'},
  },
  [BuildingSize.BIG]: {
    "main": {1: DS_BUILD + 'big/main1.png', 2: DS_BUILD + 'big/main2.png', 3: DS_BUILD + 'big/main3.png'},
    "barracks": {1: DS_BUILD + 'big/barracks1.png', 2: DS_BUILD + 'big/barracks2.png', 3: DS_BUILD + 'big/barracks3.png'},
    "stable": {1: DS_BUILD + 'big/stable1.png', 2: DS_BUILD + 'big/stable2.png', 3: DS_BUILD + 'big/stable3.png'},
    "garage": {1: DS_BUILD + 'big/garage1.png', 2: DS_BUILD + 'big/garage2.png', 3: DS_BUILD + 'big/garage3.png'},
    "church": {1: DS_BUILD + 'big/church1.png', 2: DS_BUILD + 'big/church2.png', 3: DS_BUILD + 'big/church3.png'},
    "watchtower": {1: DS_BUILD + 'big/watchtower1.png', 2: DS_BUILD + 'big/watchtower2.png', 3: DS_BUILD + 'big/watchtower3.png'},
    "snob": {1: DS_BUILD + 'big/snob1.png'},
    "smith": {1: DS_BUILD + 'big/smith1.png', 2: DS_BUILD + 'big/smith2.png', 3: DS_BUILD + 'big/smith3.png'},
    "place": {1: DS_BUILD + 'big/place1.png'},
    "statue": {1: DS_BUILD + 'big/statue1.png'},
    "market": {1: DS_BUILD + 'big/market1.png', 2: DS_BUILD + 'big/market2.png', 3: DS_BUILD + 'big/market3.png'},
    "wood": {1: DS_BUILD + 'big/wood1.png', 2: DS_BUILD + 'big/wood2.png', 3: DS_BUILD + 'big/wood3.png'},
    "stone": {1: DS_BUILD + 'big/stone1.png', 2: DS_BUILD + 'big/stone2.png', 3: DS_BUILD + 'big/stone3.png'},
    "iron": {1: DS_BUILD + 'big/iron1.png', 2: DS_BUILD + 'big/iron2.png', 3: DS_BUILD + 'big/iron3.png'},
    "farm": {1: DS_BUILD + 'big/farm1.png', 2: DS_BUILD + 'big/farm2.png', 3: DS_BUILD + 'big/farm3.png'},
    "storage": {1: DS_BUILD + 'big/storage1.png', 2: DS_BUILD + 'big/storage2.png', 3: DS_BUILD + 'big/storage3.png'},
    "hide": {1: DS_BUILD + 'big/hide1.png'},
    "wall": {1: DS_BUILD + 'big/wall1.png', 2: DS_BUILD + 'big/wall2.png', 3: DS_BUILD + 'big/wall3.png'},
  },
}

export function getBuildingImage(name: string, size: BuildingSize, level: number) {
  if(name === "church_f") name = "church"

  const size_res = BUILDING_ICON_MAP[size]
  if(size_res === undefined) {
    return get_icon(-1)
  }
  const name_res = size_res[name]
  if(name_res === undefined) {
    return get_icon(-1)
  }
  const result = name_res[level]
  if(result === undefined) {
    return get_icon(-1)
  }
  return result
}

export function getUnitIcon(name: string) {
  switch (name) {
    case "spear":
      return DS_IMG + 'unit/spear.png'
    case "sword":
      return DS_IMG + 'unit/sword.png'
    case "axe":
      return DS_IMG + 'unit/axe.png'
    case "archer":
      return DS_IMG + 'unit/archer.png'
    case "spy":
      return DS_IMG + 'unit/spy.png'
    case "light":
      return DS_IMG + 'unit/light.png'
    case "marcher":
      return DS_IMG + 'unit/marcher.png'
    case "heavy":
      return DS_IMG + 'unit/heavy.png'
    case "ram":
      return DS_IMG + 'unit/ram.png'
    case "catapult":
      return DS_IMG + 'unit/catapult.png'
    case "knight":
      return DS_IMG + 'unit/knight.png'
    case "snob":
      return DS_IMG + 'unit/snob.png'
    case "militia":
      return DS_IMG + 'unit/militia.png'
    default:
      return DS_IMG + 'wb/remove.png'
  }
}

