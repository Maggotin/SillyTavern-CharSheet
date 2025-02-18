import * as actionTypes from '../actionTypes';
/**
 *
 * @param classId
 * @param classFeatureId
 * @param choiceType
 * @param choiceId
 * @param optionValue
 */
export function classFeatureChoiceSetRequest(classId, classFeatureId, choiceType, choiceId, optionValue, parentChoiceId) {
    return {
        type: actionTypes.CLASS_FEATURE_CHOICE_SET_REQUEST,
        payload: {
            classId,
            classFeatureId,
            choiceType,
            choiceId,
            optionValue,
            parentChoiceId,
        },
        meta: {},
    };
}
