import {worldExtendedType} from "../../modelHelper/World";
import {NumDict} from "../customTypes";
import {useTranslation} from "react-i18next";

const BUILDINGS: Array<{
  'name': string,
  'min_level': number, 'max_level': number, 'wood': number, 'stone': number, 'iron': number, 'pop': number, 'build_time': number, 'point': number,
  'wood_factor': number, 'stone_factor': number, 'iron_factor': number, 'pop_factor': number, 'build_time_factor': number, 'point_factor': number
}> = [
  {
    'name': 'main', 'min_level': 1, 'max_level': 30, 'wood': 90, 'stone': 80, 'iron': 70, 'pop': 5, 'build_time': 900, 'point': 10,
    'wood_factor': 1.26, 'stone_factor': 1.275, 'iron_factor': 1.26, 'pop_factor': 1.17, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'barracks', 'min_level': 0, 'max_level': 25, 'wood': 200, 'stone': 170, 'iron': 90, 'pop': 7, 'build_time': 1800, 'point': 16,
    'wood_factor': 1.26, 'stone_factor': 1.28, 'iron_factor': 1.26, 'pop_factor': 1.17, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'stable', 'min_level': 0, 'max_level': 20, 'wood': 270, 'stone': 240, 'iron': 260, 'pop': 8, 'build_time': 6000, 'point': 20,
    'wood_factor': 1.26, 'stone_factor': 1.28, 'iron_factor': 1.26, 'pop_factor': 1.17, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'garage', 'min_level': 0, 'max_level': 15, 'wood': 300, 'stone': 240, 'iron': 260, 'pop': 8, 'build_time': 6000, 'point': 24,
    'wood_factor': 1.26, 'stone_factor': 1.28, 'iron_factor': 1.26, 'pop_factor': 1.17, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'church', 'min_level': 0, 'max_level': 3, 'wood': 16000, 'stone': 20000, 'iron': 5000, 'pop': 5000, 'build_time': 184980, 'point': 10,
    'wood_factor': 1.26, 'stone_factor': 1.28, 'iron_factor': 1.26, 'pop_factor': 1.55, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'church_f', 'min_level': 0, 'max_level': 1, 'wood': 160, 'stone': 200, 'iron': 50, 'pop': 5, 'build_time': 8160, 'point': 10,
    'wood_factor': 1.26, 'stone_factor': 1.28, 'iron_factor': 1.26, 'pop_factor': 1.55, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'watchtower', 'min_level': 0, 'max_level': 20, 'wood': 12000, 'stone': 14000, 'iron': 10000, 'pop': 500, 'build_time': 13200, 'point': 42,
    'wood_factor': 1.17, 'stone_factor': 1.17, 'iron_factor': 1.18, 'pop_factor': 1.18, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'snob', 'min_level': 0, 'max_level': 1, 'wood': 15000, 'stone': 25000, 'iron': 10000, 'pop': 80, 'build_time': 586800, 'point': 512,
    'wood_factor': 2, 'stone_factor': 2, 'iron_factor': 2, 'pop_factor': 1.17, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'smith', 'min_level': 0, 'max_level': 20, 'wood': 220, 'stone': 180, 'iron': 240, 'pop': 20, 'build_time': 6000, 'point': 19,
    'wood_factor': 1.26, 'stone_factor': 1.275, 'iron_factor': 1.26, 'pop_factor': 1.17, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'place', 'min_level': 0, 'max_level': 1, 'wood': 10, 'stone': 40, 'iron': 30, 'pop': 0, 'build_time': 10860, 'point': 0,
    'wood_factor': 1.26, 'stone_factor': 1.275, 'iron_factor': 1.26, 'pop_factor': 1.17, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'statue', 'min_level': 0, 'max_level': 1, 'wood': 220, 'stone': 220, 'iron': 220, 'pop': 10, 'build_time': 1500, 'point': 24,
    'wood_factor': 1.26, 'stone_factor': 1.275, 'iron_factor': 1.26, 'pop_factor': 1.17, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'market', 'min_level': 0, 'max_level': 25, 'wood': 100, 'stone': 100, 'iron': 100, 'pop': 20, 'build_time': 2700, 'point': 10,
    'wood_factor': 1.26, 'stone_factor': 1.275, 'iron_factor': 1.26, 'pop_factor': 1.17, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'wood', 'min_level': 0, 'max_level': 30, 'wood': 50, 'stone': 60, 'iron': 40, 'pop': 5, 'build_time': 900, 'point': 6,
    'wood_factor': 1.25, 'stone_factor': 1.275, 'iron_factor': 1.245, 'pop_factor': 1.155, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'stone', 'min_level': 0, 'max_level': 30, 'wood': 65, 'stone': 50, 'iron': 40, 'pop': 10, 'build_time': 900, 'point': 6,
    'wood_factor': 1.27, 'stone_factor': 1.265, 'iron_factor': 1.24, 'pop_factor': 1.14, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'iron', 'min_level': 0, 'max_level': 30, 'wood': 75, 'stone': 65, 'iron': 70, 'pop': 10, 'build_time': 1080, 'point': 6,
    'wood_factor': 1.252, 'stone_factor': 1.275, 'iron_factor': 1.24, 'pop_factor': 1.17, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'farm', 'min_level': 1, 'max_level': 30, 'wood': 45, 'stone': 40, 'iron': 30, 'pop': 0, 'build_time': 1200, 'point': 5,
    'wood_factor': 1.3, 'stone_factor': 1.32, 'iron_factor': 1.29, 'pop_factor': 1, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'storage', 'min_level': 1, 'max_level': 30, 'wood': 60, 'stone': 50, 'iron': 40, 'pop': 0, 'build_time': 1020, 'point': 6,
    'wood_factor': 1.265, 'stone_factor': 1.27, 'iron_factor': 1.245, 'pop_factor': 1.15, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'hide', 'min_level': 0, 'max_level': 10, 'wood': 50, 'stone': 60, 'iron': 50, 'pop': 2, 'build_time': 1800, 'point': 5,
    'wood_factor': 1.25, 'stone_factor': 1.25, 'iron_factor': 1.25, 'pop_factor': 1.17, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    'name': 'wall', 'min_level': 0, 'max_level': 20, 'wood': 50, 'stone': 100, 'iron': 20, 'pop': 5, 'build_time': 3600, 'point': 8,
    'wood_factor': 1.26, 'stone_factor': 1.275, 'iron_factor': 1.26, 'pop_factor': 1.17, 'build_time_factor': 1.2, 'point_factor': 1.2,
  },
  {
    //not buildable in normal villages -> ingore for point calc
    //also none of that information is shown in /interface.php?func=get_building_info exept for max=30 min=1
    'name': 'university', 'min_level': -1, 'max_level': -1, 'wood': -1, 'stone': -1, 'iron': -1, 'pop': -1, 'build_time': -1, 'point': -1,
    'wood_factor': -1, 'stone_factor': -1, 'iron_factor': -1, 'pop_factor': -1, 'build_time_factor': -1, 'point_factor': -1,
  },
]

export const MAIN_REDUCTION = 1.05


export function getPointBuildingMap(world: worldExtendedType) {
  const pointBuildingMap: NumDict<Array<[string, number]>> = {}

  Object.keys(world.buildings).forEach(name => {
    const building = BUILDINGS.find(b => b.name === name)
    if(building === undefined) return

    for(let i = Math.max(building.min_level, 1); i <= building.max_level; i++) {
      const points = Math.round(building.point * Math.pow(building.point_factor, i-1))
      const pointsLast = i>1?Math.round(building.point * Math.pow(building.point_factor, i-2)):0
      const pointDiff = points - pointsLast
      const tmp = pointBuildingMap[pointDiff] ?? []
      tmp.push([name, i])
      pointBuildingMap[pointDiff] = tmp
    }
  })

  return pointBuildingMap
}

export function isValidBuilding(name: string) {
  return BUILDINGS.find(b => b.name === name) !== undefined
}

const DummyFunction = () => {
  const { t } = useTranslation("ui")
  //tell translation interface that we need these
  t("buildings.main")
  t("buildings.barracks")
  t("buildings.stable")
  t("buildings.garage")
  t("buildings.church")
  t("buildings.church_f")
  t("buildings.watchtower")
  t("buildings.snob")
  t("buildings.smith")
  t("buildings.place")
  t("buildings.statue")
  t("buildings.market")
  t("buildings.wood")
  t("buildings.stone")
  t("buildings.iron")
  t("buildings.farm")
  t("buildings.storage")
  t("buildings.hide")
  t("buildings.wall")
  t("buildings.university")
}
