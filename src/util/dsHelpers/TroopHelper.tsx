import {worldUnitSingeType, worldUnitType} from "../../modelHelper/World"
import {useTranslation} from "react-i18next"

export type TroopAmount = [string, number]

export type TroopArmyAmounts = Array<TroopAmount>


export function getAttackStrength(troops: TroopArmyAmounts, worldUnit: worldUnitType) {
  return {
    infantry: troopSum(troops.filter(t => isInfantry(t) && !isArcher(t)), worldUnit, "attack"),
    cavalry: troopSum(troops.filter(t => isCavalry(t) && !isArcher(t)), worldUnit, "attack"),
    archer: troopSum(troops.filter(t => isArcher(t)), worldUnit, "attack"),
  }
}

export function getAttackStrengthSingle(troops: TroopArmyAmounts, worldUnit: worldUnitType) {
  return troopSum(troops, worldUnit, "attack")
}

export function getDefenseStrength(troops: TroopArmyAmounts, worldUnit: worldUnitType) {
  return {
    infantry: troopSum(troops, worldUnit, "defense"),
    cavalry: troopSum(troops, worldUnit, "defense_cavalry"),
    archer: troopSum(troops, worldUnit, "defense_archer"),
  }
}

export function getFarmUsage(troops: TroopArmyAmounts, worldUnit: worldUnitType) {
  return troopSum(troops, worldUnit, "pop")
}

export function getAmountForUnit(troops: TroopArmyAmounts, unitName: string) {
  return (troops.find(([n,]) => n === unitName) ?? [unitName, 0])[1]
}

function troopSum(troops: TroopArmyAmounts, worldUnit: worldUnitType, sumOver: keyof worldUnitSingeType) {
  return troops.reduce((previousValue, [curName, curAmount]) => {
    const tmp = worldUnit[curName]
    const curAtt = (tmp !== undefined?tmp[sumOver]:undefined) ?? 0
    return previousValue + curAtt * curAmount
  }, 0)
}

export function isInfantry(troop: TroopAmount) {
  return !isCavalry(troop)
}

export function isCavalry(troop: TroopAmount) {
  const name = troop[0]
  return name === "spy" || name === "light" || name === "marcher" || name === "heavy" || name === "knight"
}

export function isArcher(troop: TroopAmount) {
  const name = troop[0]
  return name === "archer" || name === "marcher"
}

export function UnitName({unit}: {unit: string}){
  const { t } = useTranslation("ui")
  return <>{t("unit." + unit)}</>
}
