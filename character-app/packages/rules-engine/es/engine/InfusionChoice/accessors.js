export function getLevel(infusionChoice) {
    return infusionChoice.level;
}
export function getKey(infusionChoice) {
    return infusionChoice.choiceKey;
}
export function getKnownInfusion(infusionChoice) {
    return infusionChoice.knownInfusion;
}
export function getInfusion(infusionChoice) {
    return infusionChoice.infusion;
}
export function getDataOrigin(infusionChoice) {
    return infusionChoice.dataOrigin;
}
export function getDataOriginType(infusionChoice) {
    const dataOrigin = getDataOrigin(infusionChoice);
    return dataOrigin.type;
}
export function getForcedModifierData(infusionChoice) {
    return infusionChoice.forcedModifierData;
}
export function canInfuse(infusionChoice) {
    return infusionChoice.canInfuse;
}
