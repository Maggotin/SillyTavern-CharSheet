import { orderBy } from "lodash";

import { Constants } from "@dndbeyond/character-rules-engine/es";
import { DiceOperation, DieTerm, RollRequest } from "@dndbeyond/dice";

interface Hack__OrderableDieValueInfo {
  idx: number;
  value: number;
}

/**
 * generate lookup of dieTerm.dice idx to DieTerm
 * for RollValueContract dieType
 *
 * @param rollRequestResult
 */
export function hack__generateDiceRollResultTermLookup(
  rollRequestResult: RollRequest
): Record<number, DieTerm> {
  const hack__diceRollResultTermLookup: Record<number, DieTerm> = {};

  let dieCurrentIdx: number = 0;
  rollRequestResult.rolls[0].diceNotation.set.forEach((dieTerm) => {
    dieTerm.dice.forEach((die) => {
      hack__diceRollResultTermLookup[dieCurrentIdx] = dieTerm;
      dieCurrentIdx++;
    });
  });

  return hack__diceRollResultTermLookup;
}

/**
 * generate lookup of RollResult.values array idx to DiceRollExcludeTypeEnum
 * for RollValueContract excludeType
 *
 * @param rollRequestResult
 */
export function hack__generateDiceRollResultValueExcludeTypeLookup(
  rollRequestResult: RollRequest
): Record<number, Constants.DiceRollExcludeTypeEnum> {
  const hack__diceRollResultValueExcludeTypeLookup: Record<
    number,
    Constants.DiceRollExcludeTypeEnum
  > = {};

  //RollResult | undefined - RollResult is not exported from Dice;
  //  only expect to have one single rollRequest.
  const rollResult = rollRequestResult.rolls[0].result;

  let dieGroupStartIdx: number = 0;

  rollRequestResult.rolls[0].diceNotation.set.forEach((dieTerm) => {
    let diceCount = dieTerm.count;

    //determine sortOrder based on dieTerm.operation
    let sortOrder: "asc" | "desc" | null = null;
    switch (dieTerm.operation) {
      case DiceOperation.Min:
        sortOrder = "asc";
        break;
      case DiceOperation.Max:
      default:
        sortOrder = "desc";
    }

    let dieTermResults =
      rollResult?.values.slice(
        dieGroupStartIdx,
        dieGroupStartIdx + diceCount
      ) ?? [];
    let hack__orderableDieValueInfos: Array<Hack__OrderableDieValueInfo> =
      dieTermResults.map((value, idx) => ({
        idx: dieGroupStartIdx + idx,
        value,
      }));
    let orderedDieTermResults = orderBy(
      hack__orderableDieValueInfos,
      (valueInfo) => valueInfo.value,
      sortOrder
    );

    //build-up hack__diceRollResultValueExcludeTypeLookup
    orderedDieTermResults.slice(0, dieTerm.operand).forEach((dieTermResult) => {
      hack__diceRollResultValueExcludeTypeLookup[dieTermResult.idx] =
        Constants.DiceRollExcludeTypeEnum.ALL;
    });
    orderedDieTermResults.slice(dieTerm.operand).forEach((dieTermResult) => {
      hack__diceRollResultValueExcludeTypeLookup[dieTermResult.idx] =
        Constants.DiceRollExcludeTypeEnum.NONE;
    });

    //move diceGroupStartIdx
    dieGroupStartIdx += diceCount;
  });

  return hack__diceRollResultValueExcludeTypeLookup;
}
