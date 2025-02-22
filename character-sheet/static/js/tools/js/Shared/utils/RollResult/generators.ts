import { RollParentKeyInfoLookup, RollResultGroupsLookup } from "./typings";

/**
 *
 * @param rollResultGroupsLookup
 */
export function generateRollParentKeyInfoLookup(
  rollResultGroupsLookup: RollResultGroupsLookup
): RollParentKeyInfoLookup {
  let lookup: RollParentKeyInfoLookup = {};

  Object.keys(rollResultGroupsLookup).forEach((componentKey) => {
    rollResultGroupsLookup[componentKey].forEach((rollGroupContract) => {
      rollGroupContract.rollResults.forEach((rollResult) => {
        lookup[rollResult.rollKey] = {
          componentKey,
          groupKey: rollGroupContract.groupKey,
        };
      });
    });
  });

  return lookup;
}
