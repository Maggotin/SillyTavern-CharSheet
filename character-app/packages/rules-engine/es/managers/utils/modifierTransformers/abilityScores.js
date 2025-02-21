import { ExpressionOperators, StatementOperators } from '@dndbeyond/character-gfs';
import { ModifierAccessors, ModifierTypeEnum, ModifierValidators } from "../../../engine/Modifier";
import { RuleDataUtils } from "../../../engine/RuleData";
export function transformAbilityScores(validGlobalModifiers, baseStats, ruleData) {
    const abilityScoreModifiers = validGlobalModifiers.filter((modifier) => {
        return (ModifierValidators.isValidStatScoreModifier(modifier, 1) ||
            ModifierValidators.isValidStatScoreModifier(modifier, 2) ||
            ModifierValidators.isValidStatScoreModifier(modifier, 3) ||
            ModifierValidators.isValidStatScoreModifier(modifier, 4) ||
            ModifierValidators.isValidStatScoreModifier(modifier, 5) ||
            ModifierValidators.isValidStatScoreModifier(modifier, 6));
    });
    const baseAbilityScores = baseStats.flatMap((stat) => {
        var _a, _b, _c;
        if (stat.id) {
            const statName = (_b = (_a = RuleDataUtils.getStatNameById(stat.id, ruleData, true)) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : '';
            stat.value = (_c = stat.value) !== null && _c !== void 0 ? _c : 0;
            // Math.floor((stat.value - 10) / 2)
            return [
                {
                    precedence: 0.5,
                    target: ['attributes', statName, 'value'],
                    operator: StatementOperators.SET,
                    operand: {
                        operator: ExpressionOperators.STATIC_VALUE,
                        values: [stat.value],
                        operands: null,
                    },
                },
                {
                    precedence: 0.5,
                    target: ['attributes', statName, 'modifier'],
                    operator: StatementOperators.SET,
                    operand: {
                        operator: ExpressionOperators.FLOOR,
                        values: null,
                        operands: [
                            {
                                operator: ExpressionOperators.MULTIPLY,
                                values: null,
                                operands: [
                                    {
                                        operator: ExpressionOperators.STATIC_VALUE,
                                        values: [0.5],
                                        operands: null,
                                    },
                                    {
                                        operator: ExpressionOperators.ADD,
                                        values: null,
                                        operands: [
                                            {
                                                operator: ExpressionOperators.STATIC_VALUE,
                                                values: [-10],
                                                operands: null,
                                            },
                                            {
                                                operator: ExpressionOperators.DYNAMIC_VALUE,
                                                values: ['attributes', statName, 'value'],
                                                operands: null,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    precedence: 0.5,
                    target: ['attributes', statName, 'max'],
                    operator: StatementOperators.SET,
                    operand: {
                        operator: ExpressionOperators.STATIC_VALUE,
                        values: [20],
                        operands: null,
                    },
                },
            ];
        }
        return [];
    });
    const gfsAbilityScores = abilityScoreModifiers.map((abilityScoreModifier) => {
        var _a, _b, _c, _d;
        const modifierType = ModifierAccessors.getType(abilityScoreModifier);
        switch (modifierType) {
            case ModifierTypeEnum.SET:
                return {
                    precedence: 0.5,
                    target: [
                        'attributes',
                        (_a = ModifierAccessors.getSubType(abilityScoreModifier)) === null || _a === void 0 ? void 0 : _a.replace('-score', ''),
                        'value',
                    ],
                    operator: StatementOperators.SET,
                    operand: {
                        operator: ExpressionOperators.STATIC_VALUE,
                        values: [ModifierAccessors.getValue(abilityScoreModifier)],
                    },
                };
            case ModifierTypeEnum.BONUS:
            default:
                return {
                    precedence: 0.5,
                    target: [
                        'attributes',
                        (_b = ModifierAccessors.getSubType(abilityScoreModifier)) === null || _b === void 0 ? void 0 : _b.replace('-score', ''),
                        'value',
                    ],
                    operator: StatementOperators.SET,
                    operand: {
                        operator: ExpressionOperators.ADD,
                        values: null,
                        operands: [
                            {
                                operator: ExpressionOperators.DYNAMIC_VALUE,
                                operands: null,
                                values: [
                                    'attributes',
                                    (_c = ModifierAccessors.getSubType(abilityScoreModifier)) === null || _c === void 0 ? void 0 : _c.replace('-score', ''),
                                    'value',
                                ],
                            },
                            {
                                operator: ExpressionOperators.STATIC_VALUE,
                                values: [(_d = ModifierAccessors.getValue(abilityScoreModifier)) !== null && _d !== void 0 ? _d : 0],
                                operands: null,
                            },
                        ],
                    },
                };
        }
    });
    const generatedFeature = {
        meta: {
            name: 'Generated Ability Scores',
            category: 'Generated',
        },
        statements: [...baseAbilityScores, ...gfsAbilityScores],
        featureId: 'generated-ability-scores',
        labels: [],
        sources: [],
        subfeatures: [],
        acceptableInputs: {},
        primarySource: null,
        secondarySources: [],
    };
    return { baseAbilityScores, gfsAbilityScores, generatedFeature };
}
