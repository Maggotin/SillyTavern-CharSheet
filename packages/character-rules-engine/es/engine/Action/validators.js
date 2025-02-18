import { ActivationAccessors } from '../Activation';
import { getActivation } from './accessors';
/**
 *
 * @param action
 * @param activationType
 */
export function validateIsActivationType(action, activationType) {
    const activation = getActivation(action);
    if (activation === null) {
        return false;
    }
    return activationType === ActivationAccessors.getType(activation);
}
