import * as actionTypes from '../actionTypes/racialTrait';

interface RacialTraitChoiceSetRequestAction {
    type: typeof actionTypes.RACIAL_TRAIT_CHOICE_SET_REQUEST;
    payload: {
        racialTraitId: unknown;
        choiceType: unknown;
        choiceId: unknown;
        optionValue: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param racialTraitId
 * @param choiceType
 * @param choiceId
 * @param optionValue
 */
export function racialTraitChoiceSetRequest(
    racialTraitId: unknown,
    choiceType: unknown,
    choiceId: unknown,
    optionValue: unknown
): RacialTraitChoiceSetRequestAction {
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