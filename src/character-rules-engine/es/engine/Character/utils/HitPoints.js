/**
 *
 * @param hitPointInfo
 * @param hpDiff
 */
export function calculateHitPoints(hitPointInfo, hpDiff) {
    let newTemp;
    let newHp;
    const hpTemp = hitPointInfo.tempHp ? hitPointInfo.tempHp : 0;
    if (hpDiff < 0) {
        newTemp = Math.max(hpTemp + hpDiff, 0);
        if (Math.abs(hpDiff) > hpTemp) {
            newHp = hitPointInfo.remainingHp + (hpTemp + hpDiff);
        }
        else {
            newHp = hitPointInfo.remainingHp;
        }
    }
    else {
        newTemp = hitPointInfo.tempHp;
        newHp = Math.min(hitPointInfo.remainingHp + hpDiff, hitPointInfo.totalHp);
    }
    newHp = Math.max(0, newHp);
    const newRemovedHp = hitPointInfo.totalHp - newHp;
    return {
        newTemp,
        newHp,
        newRemovedHp,
        startHp: hitPointInfo.remainingHp,
    };
}
