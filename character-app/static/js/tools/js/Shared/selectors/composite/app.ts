import { createSelector } from "reselect";

import * as RollResultUtils from "../../utils/RollResult/generators";
import * as rollResultSelectors from "../rollResult";

/**
 * @Returns {RollParentKeyInfoLookup}
 */
export const getRollParentKeyInfoLookup = createSelector(
  [rollResultSelectors.getRollResultComponentGroupsLookup],
  RollResultUtils.generateRollParentKeyInfoLookup
);

/**
 * @Returns {RollParentKeyInfoLookup}
 */
export const getSimulatedRollParentKeyInfoLookup = createSelector(
  [rollResultSelectors.getRollResultComponentSimulatedGroupsLookup],
  RollResultUtils.generateRollParentKeyInfoLookup
);
