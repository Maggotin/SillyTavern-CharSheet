import { HelperUtils } from '../Helper';
import { getConfigurationValueLookup } from './accessors';
/**
 *
 * @param key
 * @param configurationLookup
 */
export function getConfigurationInfo(key, configurationLookup) {
    return HelperUtils.lookupDataOrFallback(configurationLookup, key);
}
/**
 *
 * @param key
 * @param vehicle
 */
export function getConfigurationValue(key, vehicle) {
    return getConfigurationValueLookup(vehicle)[key];
}
