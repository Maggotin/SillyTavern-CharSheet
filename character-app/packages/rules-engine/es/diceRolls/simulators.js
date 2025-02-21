import { HelperUtils } from '../engine/Helper';
/**
 *
 * @param rollGroupContractProps
 * @param simulatedRollResultCount
 */
export function simulateRollGroupContract(rollGroupContractProps, simulatedRollResultCount = 0) {
    var _a;
    let rollResults = [];
    let lastRoll = null;
    for (let i = 0; i < simulatedRollResultCount; i++) {
        const rollResultContract = simulateRollResultContract({
            nextRollKey: (_a = lastRoll === null || lastRoll === void 0 ? void 0 : lastRoll.rollKey) !== null && _a !== void 0 ? _a : null,
        });
        rollResults.push(rollResultContract);
        lastRoll = rollResultContract;
    }
    return Object.assign({ groupKey: HelperUtils.generateGuid(), nextGroupKey: null, rollResults }, rollGroupContractProps);
}
/**
 *
 * @param rollResultContractProps
 */
export function simulateRollResultContract(rollResultContractProps) {
    return Object.assign({ rollKey: HelperUtils.generateGuid(), nextRollKey: null, rollTotal: null, rollValues: [], assignedValue: null }, rollResultContractProps);
}
