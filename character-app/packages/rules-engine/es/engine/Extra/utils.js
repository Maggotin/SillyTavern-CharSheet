import { HelperUtils } from '../Helper';
import { getExtraType, getMappingId } from './accessors';
import { ExtraTypeEnum } from './constants';
export function getTypedExtra(extra, lookup, defaultValue = null) {
    const mappingId = getMappingId(extra);
    return HelperUtils.lookupDataOrFallback(lookup, mappingId, defaultValue);
}
export function isCreature(extra) {
    return getExtraType(extra) === ExtraTypeEnum.CREATURE;
}
export function isVehicle(extra) {
    return getExtraType(extra) === ExtraTypeEnum.VEHICLE;
}
export function getCreatureExtras(extras) {
    return extras.filter(isCreature);
}
export function getVehicleExtras(extras) {
    return extras.filter(isVehicle);
}
