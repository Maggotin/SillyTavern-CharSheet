import {
  DiceUtils,
  DiceContract,
  RollValueContract,
  HelperUtils,
} from "../../character-rules-engine/es";
import {
  DiceEvent,
  Dice,
  RollRequest,
  RollType,
  RollKind,
  DiceNotation,
} from "../../dice";

import { DiceComponentUtils, TypeScriptUtils } from "../index";
import {
  hack__generateDiceRollResultTermLookup,
  hack__generateDiceRollResultValueExcludeTypeLookup,
} from "./hacks";

/**
 * Adds an event listener that sets the state variable isCriticalHit to false when a roll is performed
 * that is not this component's to-hit roll
 *
 * Note: Move this to a hook if the components go classless
 */
export function setupResetCritStateOnRoll(
  rollAction: string,
  rollNode: React.ReactNode
): (eventData: any) => void {
  let handler = _handler.bind(undefined, rollAction, rollNode);
  Dice.addEventListener(DiceEvent.ROLL, handler);
  return handler;
}

export function _handler(
  rollAction: string,
  rollNode: React.PureComponent<any, any>,
  result: RollRequest
): void {
  let shouldResetCritState =
    // A multi-roll was performed
    result.rolls.length !== 1 ||
    // A roll from another action was performed
    rollAction != result.action ||
    // This didn't have a to-hit roll, and we already know it is this same action
    result.rolls.find((r) => r.rollType != RollType.ToHit);

  if (shouldResetCritState) {
    rollNode?.setState({ isCriticalHit: false });
  }
}

/**
 * Checks for a critical hit
 */
export function isCriticalRoll(result: RollRequest): boolean {
  // Does this roll have a to-hit roll?
  const hitRoll = result.rolls.find((r) => r.rollType == RollType.ToHit);
  if (hitRoll) {
    const minRollForCrit: number = 20;
    let numCritRolls: number =
      hitRoll.result?.values.filter((v) => v >= minRollForCrit).length ?? 0;

    let critRoll: boolean = false;
    switch (hitRoll.rollKind) {
      case RollKind.Disadvantage:
        critRoll = numCritRolls >= 2;
        break;
      case RollKind.Advantage:
      default:
        critRoll = numCritRolls > 0;
        break;
    }
    return critRoll;
  }
  return false;
}

/**
 * Returns a dice notation string taking into account the current state
 * (doubles damage dice when in critical hit state)
 *
 * @param isCriticalHit Flags if the dice notation is in a critical hit state
 * @param damage Normally displayed damage
 */
export function getDamageDiceNotation(
  damage: number | DiceContract | null,
  isCriticalHit?: boolean
): string {
  if (typeof damage === "number") {
    return damage.toString();
  }

  if (!isCriticalHit) {
    return DiceUtils.renderDice(damage);
  }

  let dn = DiceNotation.parseDiceNotation(DiceUtils.renderDice(damage));
  for (let i = 0; i < dn.set.length; i++) {
    // Double the dice on each term
    dn.set[i].count *= 2;
  }
  return dn.toDiceNotationString();
}

/**
 *
 * @param dieType
 */
export function getDieTypeValue(dieType: string): number {
  return Number(dieType.substr(1));
}

/**
 * Returns Array<RollValueContract> given the a rollRequestResult with a single RollResult
 *
 * @param rollRequestResult
 */
export function generateRollValueContracts(
  rollRequestResult: RollRequest
): Array<RollValueContract> | null {
  //these hacks make it easier to grab the data from the dice api until the api is updated
  const hack__diceRollResultTermLookup =
    hack__generateDiceRollResultTermLookup(rollRequestResult);
  const hack__diceRollResultValueExcludeTypeLookup =
    hack__generateDiceRollResultValueExcludeTypeLookup(rollRequestResult);

  //RollResult | undefined - RollResult is not exported from Dice;
  //  only expect to have one single rollRequest.
  const rollResult = rollRequestResult.rolls[0].result ?? null;

  if (!rollResult) {
    return null;
  }

  return rollResult.values
    .map((value, idx) => {
      const dieTerm = HelperUtils.lookupDataOrFallback(
        hack__diceRollResultTermLookup,
        idx
      );
      const excludeType = HelperUtils.lookupDataOrFallback(
        hack__diceRollResultValueExcludeTypeLookup,
        idx
      );

      if (!dieTerm || !excludeType) {
        return null;
      }

      return {
        value,
        dieType: DiceComponentUtils.getDieTypeValue(dieTerm.dieType),
        excludeType,
      };
    })
    .filter(TypeScriptUtils.isNotNullOrUndefined);
}
