import { ActionAccessors } from '../../Action';
import { ActivationAccessors } from '../../Activation';
import { ActivatableTypeEnum } from '../../Core';
import { OptionAccessors } from '../../Option';
/**
 *
 * @param options
 * @param parentEntity
 */
export function deriveActivatableOptions(options, parentEntity) {
    const activatables = [];
    options.forEach((option) => {
        const actions = OptionAccessors.getActions(option);
        if (actions.length) {
            activatables.push(...deriveActivatableActions(actions, parentEntity));
        }
    });
    return activatables;
}
/**
 *
 * @param actions
 * @param parentEntity
 */
export function deriveActivatableActions(actions, parentEntity) {
    const activatables = [];
    actions.forEach((action) => {
        const activation = ActionAccessors.getActivation(action);
        if (activation !== null && ActivationAccessors.getType(activation) !== null) {
            activatables.push({
                type: ActivatableTypeEnum.ACTION,
                sortText: ActionAccessors.getName(action),
                activation,
                key: ActionAccessors.getUniqueKey(action),
                limitedUse: ActionAccessors.getLimitedUse(action),
                entity: action,
                parentEntity,
            });
        }
    });
    return activatables;
}
