import {
  getAmountForUnit,
  getAttackStrength, getAttackStrengthSingle,
  getDefenseStrength,
  getFarmUsage,
  TroopArmyAmounts
} from "./TroopHelper"
import {worldUnitType} from "../../modelHelper/World"
import {techSystemType, worldConfigType} from "../../modelHelper/WorldConfig"


type simulatorSettings = {
  isNight: boolean,
  attacker: TroopArmyAmounts,
  defender: TroopArmyAmounts,
  luck: number,
  wall: number,
  morale: number,
  farmLevel: number,
  worldUnit: worldUnitType,
  worldConfig: worldConfigType,
}

export type SimulatorTroopResult = {
  before: TroopArmyAmounts,
  loss: TroopArmyAmounts,
  survivors: TroopArmyAmounts,
}

export type SimulatorBuildingResult = {
  before: number,
  after: number
}

export type SimulatorResult = {
  attacker: SimulatorTroopResult,
  defender: SimulatorTroopResult,
  wall: SimulatorBuildingResult,
}


export default function simulate(simSettings: simulatorSettings) {
  return simulateOld(simSettings)
}

function simulateOld({attacker, defender, luck, wall, morale, isNight, farmLevel, worldConfig, worldUnit}: simulatorSettings) : SimulatorResult {
  const baseAttStrength = getAttackStrength(attacker, worldUnit)
  const baseDefStrength = getDefenseStrength(defender, worldUnit)

  const nightFactor = isNight ? worldConfig.night.def_factor : 1

  const attStrength = {
    infantry: baseAttStrength.infantry * luck * morale,
    cavalry: baseAttStrength.cavalry * luck * morale,
  }

  const defStrength = {
    infantry: baseDefStrength.infantry * nightFactor,
    cavalry: baseDefStrength.cavalry * nightFactor,
  }

  const infantryRatio = (attStrength.infantry + attStrength.cavalry > 0)?
      (attStrength.infantry / (attStrength.infantry + attStrength.cavalry)):0
  let combinedDefStrength = defStrength.infantry * infantryRatio + defStrength.cavalry * (1 - infantryRatio)

  //Farm limit
  if(worldConfig.game.farm_limit > 0) {
    const defFarmUsage = getFarmUsage(defender, worldUnit)
    const limit = worldConfig.game.farm_limit * farmLevel
    const farmLimitFactor = Math.min(1, limit / defFarmUsage)
    combinedDefStrength = farmLimitFactor * combinedDefStrength
  }

  //Wall reduction by rams
  let simWallLevel = wall
  if(getAmountForUnit(attacker, "ram") > 0) {
    const wallReduction = getAmountForUnit(attacker, "ram") / (4 * Math.pow(1.09, simWallLevel))
    simWallLevel = Math.max(simWallLevel/2, Math.round(simWallLevel-wallReduction))
  }

  const finalFightDef = (20 + 50*simWallLevel) + (combinedDefStrength * Math.pow(1.037, simWallLevel))
  const finalFightAtt = attStrength.infantry + attStrength.cavalry

  //loss percentages
  const lossPowerValue = (worldConfig.game.tech === techSystemType.TECHS_10 || worldConfig.game.farm_limit > 0)?1.6:1.5
  const lossRatioAttRaw = Math.pow(finalFightDef/finalFightAtt, lossPowerValue)
  const lossRatioDefRaw = Math.pow(finalFightAtt/finalFightDef, lossPowerValue)
  //we can't loose more than 100%
  const lossRatioAtt = Math.min(1, lossRatioAttRaw)
  const lossRatioDef = Math.min(1, lossRatioDefRaw)

  const lossAtt: TroopArmyAmounts = attacker.map(([u, v]) => {
    if(u === "spy") {
      if(v <= 0) return [u, v]

      const spyRateTillDeath = 1
      const spyFactor = (getAmountForUnit(defender, "spy") + 1) / (v * spyRateTillDeath)
      const spyFactorLimited = Math.min(1, spyFactor)
      const spyLosses = v * Math.pow(spyFactorLimited, lossPowerValue)
      return [u, Math.round(spyLosses)]
    }
    return [u, Math.round(v*lossRatioAtt)]
  })
  const lossDef: TroopArmyAmounts = defender.map(([u, v]) => [u, Math.round(v*lossRatioDef)])

  const survivorsAtt: TroopArmyAmounts = attacker.map(([u, v]) => [u, v - getAmountForUnit(lossAtt, u)])
  const survivorsDef: TroopArmyAmounts = defender.map(([u, v]) => [u, v - getAmountForUnit(lossDef, u)])

  const wallAfter = buildingDestruction(wall, lossRatioAttRaw, lossRatioDefRaw, 8,
      getAttackStrengthSingle(attacker.filter(([u,]) => u === "ram"), worldUnit))

  return {
    attacker: {
      before: attacker,
      loss: lossAtt,
      survivors: survivorsAtt,
    },
    defender: {
      before: defender,
      loss: lossDef,
      survivors: survivorsDef,
    },
    wall: {
      before: wall,
      after: wallAfter,
    }
  }
}

function buildingDestruction(pre: number, lossRatioAtt: number, lossRatioDef: number, divFactor: number, troopAtt: number) {
  let destruction: number
  if(lossRatioAtt > 1) {
    //attacker lost
    destruction = lossRatioDef * troopAtt / (divFactor * Math.pow(1.09, pre))
  } else {
    destruction = (2 - lossRatioAtt) * troopAtt / (divFactor * Math.pow(1.09, pre))
  }
  console.log(destruction, lossRatioAtt, lossRatioDef, divFactor, troopAtt)
  return Math.max(0, Math.round(pre - destruction))
}
