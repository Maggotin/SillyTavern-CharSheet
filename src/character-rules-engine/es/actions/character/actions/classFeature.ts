import * as actionTypes from '../actionTypes/classFeature';

interface ClassFeatureChoiceSetRequestAction {
    type: typeof actionTypes.CLASS_FEATURE_CHOICE_SET_REQUEST;
    payload: {
        classId: unknown;
        classFeatureId: unknown;
        choiceType: unknown;
        choiceId: unknown;
        optionValue: unknown;
        parentChoiceId: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param classId
 * @param classFeatureId
 * @param choiceType
 * @param choiceId
 * @param optionValue
 * @param parentChoiceId
 */
export function classFeatureChoiceSetRequest(
    classId: unknown,
    classFeatureId: unknown,
    choiceType: unknown,
    choiceId: unknown,
    optionValue: unknown,
    parentChoiceId: unknown
): ClassFeatureChoiceSetRequestAction {
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