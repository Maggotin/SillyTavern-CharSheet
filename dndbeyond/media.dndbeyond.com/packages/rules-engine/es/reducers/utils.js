/**
 *
 * @param spellSlots
 * @param spellLevel
 * @param slotsUsed
 */
export function updateSpellSlots(spellSlots, spellLevel, slotsUsed) {
    let newSpellSlots = [...spellSlots];
    const levelIdx = newSpellSlots.findIndex((entity) => entity.level === spellLevel);
    if (levelIdx > -1 && slotsUsed !== null) {
        const newSlot = Object.assign(Object.assign({}, newSpellSlots[levelIdx]), { used: slotsUsed });
        newSpellSlots = [...newSpellSlots.slice(0, levelIdx), newSlot, ...newSpellSlots.slice(levelIdx + 1)];
    }
    return newSpellSlots;
}
