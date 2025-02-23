import * as actionTypes from '../actionTypes';
/**
 *
 * @param racialTraitId
 * @param choiceType
 * @param choiceId
 * @param optionValue
 */
export function racialTraitChoiceSetRequest(racialTraitId, choiceType, choiceId, optionValue) {
    return {
        type: actionTypes.RACIAL_TRAIT_CHOICE_SET_REQUEST,
        payload: {
            racialTraitId,
            choiceType,
            choiceId,
            optionValue,
        },
        meta: {},
    };
}
