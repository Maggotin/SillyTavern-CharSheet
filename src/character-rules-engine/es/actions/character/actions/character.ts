import * as actionTypes from '../actionTypes';

interface CharacterLoadAction {
    type: typeof actionTypes.CHARACTER_LOAD;
    payload: {
        characterId: string | number;
        requestParams: Record<string, any>;
        config: {
            includeAlwaysKnownSpells: boolean;
            [key: string]: any;
        };
    };
    meta: {
        postAction: {
            type: typeof actionTypes.CHARACTER_LOAD_POST_ACTION[];
        };
    };
}

export function characterLoad(
    characterId: string | number,
    requestParams: Record<string, any> = {},
    config: Partial<CharacterLoadAction['payload']['config']> = {}
): CharacterLoadAction {
    return {
        type: actionTypes.CHARACTER_LOAD,
        payload: {
            characterId,
            requestParams,
            config: Object.assign({ includeAlwaysKnownSpells: false }, config),
        },
        meta: {
            postAction: {
                type: [actionTypes.CHARACTER_LOAD_POST_ACTION],
            },
        },
    };
}

interface LoadLazyCharacterDataAction {
    type: typeof actionTypes.LOAD_LAZY_CHARACTER_DATA;
    payload: {};
    meta: {};
}

export function loadLazyCharacterData(): LoadLazyCharacterDataAction {
    return {
        type: actionTypes.LOAD_LAZY_CHARACTER_DATA,
        payload: {},
        meta: {},
    };
}

interface XpSetRequestAction {
    type: typeof actionTypes.XP_SET_REQUEST;
    payload: {
        currentXp: number;
    };
    meta: {};
}

export function xpSetRequest(currentXp: number): XpSetRequestAction {
    return {
        type: actionTypes.XP_SET_REQUEST,
        payload: {
            currentXp,
        },
        meta: {},
    };
}

interface XpSetAction {
    type: typeof actionTypes.XP_SET;
    payload: {
        currentXp: number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.XP_SET_COMMIT;
        };
    };
}

export function xpSet(currentXp: number): XpSetAction {
    return {
        type: actionTypes.XP_SET,
        payload: {
            currentXp,
        },
        meta: {
            commit: {
                type: actionTypes.XP_SET_COMMIT,
            },
        },
    };
}

interface RandomNameRequestAction {
    type: typeof actionTypes.RANDOM_NAME_REQUEST;
    payload: {};
    meta: {};
}

export function randomNameRequest(): RandomNameRequestAction {
    return {
        type: actionTypes.RANDOM_NAME_REQUEST,
        payload: {},
        meta: {},
    };
}

interface NameSetAction {
    type: typeof actionTypes.NAME_SET;
    payload: {
        name: string;
    };
    meta: {
        commit: {
            type: typeof actionTypes.NAME_SET_COMMIT;
        };
    };
}

export function nameSet(name: string): NameSetAction {
    return {
        type: actionTypes.NAME_SET,
        payload: {
            name,
        },
        meta: {
            commit: {
                type: actionTypes.NAME_SET_COMMIT,
            },
        },
    };
}

interface RestoreLifeAction {
    type: typeof actionTypes.RESTORE_LIFE;
    payload: {
        restoreType: string;
    };
    meta: {};
}

export function restoreLife(restoreType: string): RestoreLifeAction {
    return {
        type: actionTypes.RESTORE_LIFE,
        payload: {
            restoreType,
        },
        meta: {},
    };
}

interface CustomProficiencyCreateAction {
    type: typeof actionTypes.CUSTOM_PROFICIENCY_CREATE;
    payload: {
        name: string;
        type: string;
    };
    meta: {};
}

export function customProficiencyCreate(name: string, type: string): CustomProficiencyCreateAction {
    return {
        type: actionTypes.CUSTOM_PROFICIENCY_CREATE,
        payload: {
            name,
            type,
        },
        meta: {},
    };
}

interface ShortRestAction {
    type: typeof actionTypes.SHORT_REST;
    payload: {
        classHitDiceUsed: Record<string, number>;
        resetMaxHpModifier: boolean;
    };
    meta: {};
}

export function shortRest(classHitDiceUsed: Record<string, number>, resetMaxHpModifier: boolean): ShortRestAction {
    return {
        type: actionTypes.SHORT_REST,
        payload: {
            classHitDiceUsed,
            resetMaxHpModifier,
        },
        meta: {},
    };
}

interface LongRestAction {
    type: typeof actionTypes.LONG_REST;
    payload: {
        resetMaxHpModifier: boolean;
        adjustConditionLevel: boolean;
    };
    meta: {};
}

export function longRest(resetMaxHpModifier: boolean, adjustConditionLevel: boolean): LongRestAction {
    return {
        type: actionTypes.LONG_REST,
        payload: {
            resetMaxHpModifier,
            adjustConditionLevel,
        },
        meta: {},
    };
}

interface NoteSetAction {
    type: typeof actionTypes.NOTE_SET;
    payload: {
        noteType: string;
        content: string;
    };
    meta: {
        commit: {
            type: typeof actionTypes.NOTE_SET_COMMIT;
        };
    };
}

export function noteSet(noteType: string, content: string): NoteSetAction {
    return {
        type: actionTypes.NOTE_SET,
        payload: {
            noteType,
            content,
        },
        meta: {
            commit: {
                type: actionTypes.NOTE_SET_COMMIT,
            },
        },
    };
}

interface TraitSetAction {
    type: typeof actionTypes.TRAIT_SET;
    payload: {
        traitType: string;
        content: string;
    };
    meta: {
        commit: {
            type: typeof actionTypes.TRAIT_SET_COMMIT;
        };
    };
}

export function traitSet(traitType: string, content: string): TraitSetAction {
    return {
        type: actionTypes.TRAIT_SET,
        payload: {
            traitType,
            content,
        },
        meta: {
            commit: {
                type: actionTypes.TRAIT_SET_COMMIT,
            },
        },
    };
}

interface BaseHitPointsSetAction {
    type: typeof actionTypes.BASE_HIT_POINTS_SET;
    payload: {
        baseHitPoints: number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.BASE_HIT_POINTS_SET_COMMIT;
        };
    };
}

export function baseHitPointsSet(baseHitPoints: number): BaseHitPointsSetAction {
    return {
        type: actionTypes.BASE_HIT_POINTS_SET,
        payload: {
            baseHitPoints,
        },
        meta: {
            commit: {
                type: actionTypes.BASE_HIT_POINTS_SET_COMMIT,
            },
        },
    };
}

interface BonusHitPointsSetAction {
    type: typeof actionTypes.BONUS_HIT_POINTS_SET;
    payload: {
        bonusHitPoints: number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.BONUS_HIT_POINTS_SET_COMMIT;
        };
    };
}

export function bonusHitPointsSet(bonusHitPoints: number): BonusHitPointsSetAction {
    return {
        type: actionTypes.BONUS_HIT_POINTS_SET,
        payload: {
            bonusHitPoints,
        },
        meta: {
            commit: {
                type: actionTypes.BONUS_HIT_POINTS_SET_COMMIT,
            },
        },
    };
}

interface OverrideHitPointsSetAction {
    type: typeof actionTypes.OVERRIDE_HIT_POINTS_SET;
    payload: {
        overrideHitPoints: number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.OVERRIDE_HIT_POINTS_SET_COMMIT;
        };
    };
}

export function overrideHitPointsSet(overrideHitPoints: number): OverrideHitPointsSetAction {
    return {
        type: actionTypes.OVERRIDE_HIT_POINTS_SET,
        payload: {
            overrideHitPoints,
        },
        meta: {
            commit: {
                type: actionTypes.OVERRIDE_HIT_POINTS_SET_COMMIT,
            },
        },
    };
}

interface AbilityScoreSetAction {
    type: typeof actionTypes.ABILITY_SCORE_SET;
    payload: {
        statId: string;
        type: string;
        value: number;
    };
    meta: {};
}

export function abilityScoreSet(statId: string, type: string, value: number): AbilityScoreSetAction {
    return {
        type: actionTypes.ABILITY_SCORE_SET,
        payload: {
            statId,
            type,
            value,
        },
        meta: {},
    };
}

interface HairSetAction {
    type: typeof actionTypes.HAIR_SET;
    payload: {
        hair: string;
    };
    meta: {
        commit: {
            type: typeof actionTypes.HAIR_SET_COMMIT;
        };
    };
}

export function hairSet(hair: string): HairSetAction {
    return {
        type: actionTypes.HAIR_SET,
        payload: {
            hair,
        },
        meta: {
            commit: {
                type: actionTypes.HAIR_SET_COMMIT,
            },
        },
    };
}

interface SkinSetAction {
    type: typeof actionTypes.SKIN_SET;
    payload: {
        skin: string;
    };
    meta: {
        commit: {
            type: typeof actionTypes.SKIN_SET_COMMIT;
        };
    };
}

export function skinSet(skin: string): SkinSetAction {
    return {
        type: actionTypes.SKIN_SET,
        payload: {
            skin,
        },
        meta: {
            commit: {
                type: actionTypes.SKIN_SET_COMMIT,
            },
        },
    };
}

interface EyesSetAction {
    type: typeof actionTypes.EYES_SET;
    payload: {
        eyes: string;
    };
    meta: {
        commit: {
            type: typeof actionTypes.EYES_SET_COMMIT;
        };
    };
}

export function eyesSet(eyes: string): EyesSetAction {
    return {
        type: actionTypes.EYES_SET,
        payload: {
            eyes,
        },
        meta: {
            commit: {
                type: actionTypes.EYES_SET_COMMIT,
            },
        },
    };
}

interface HeightSetAction {
    type: typeof actionTypes.HEIGHT_SET;
    payload: {
        height: string;
    };
    meta: {
        commit: {
            type: typeof actionTypes.HEIGHT_SET_COMMIT;
        };
    };
}

export function heightSet(height: string): HeightSetAction {
    return {
        type: actionTypes.HEIGHT_SET,
        payload: {
            height,
        },
        meta: {
            commit: {
                type: actionTypes.HEIGHT_SET_COMMIT,
            },
        },
    };
}

interface WeightSetAction {
    type: typeof actionTypes.WEIGHT_SET;
    payload: {
        weight: string;
    };
    meta: {
        commit: {
            type: typeof actionTypes.WEIGHT_SET_COMMIT;
        };
    };
}

export function weightSet(weight: string): WeightSetAction {
    return {
        type: actionTypes.WEIGHT_SET,
        payload: {
            weight,
        },
        meta: {
            commit: {
                type: actionTypes.WEIGHT_SET_COMMIT,
            },
        },
    };
}

interface AgeSetAction {
    type: typeof actionTypes.AGE_SET;
    payload: {
        age: number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.AGE_SET_COMMIT;
        };
    };
}

export function ageSet(age: number): AgeSetAction {
    return {
        type: actionTypes.AGE_SET,
        payload: {
            age,
        },
        meta: {
            commit: {
                type: actionTypes.AGE_SET_COMMIT,
            },
        },
    };
}

interface GenderSetAction {
    type: typeof actionTypes.GENDER_SET;
    payload: {
        gender: string;
    };
    meta: {
        commit: {
            type: typeof actionTypes.GENDER_SET_COMMIT;
        };
    };
}

export function genderSet(gender: string): GenderSetAction {
    return {
        type: actionTypes.GENDER_SET,
        payload: {
            gender,
        },
        meta: {
            commit: {
                type: actionTypes.GENDER_SET_COMMIT,
            },
        },
    };
}

interface AlignmentSetAction {
    type: typeof actionTypes.ALIGNMENT_SET;
    payload: {
        alignmentId: string | number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ALIGNMENT_SET_COMMIT;
        };
    };
}

export function alignmentSet(alignmentId: string | number): AlignmentSetAction {
    return {
        type: actionTypes.ALIGNMENT_SET,
        payload: {
            alignmentId,
        },
        meta: {
            commit: {
                type: actionTypes.ALIGNMENT_SET_COMMIT,
            },
        },
    };
}

interface LifestyleSetAction {
    type: typeof actionTypes.LIFESTYLE_SET;
    payload: {
        lifestyleId: string | number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.LIFESTYLE_SET_COMMIT;
        };
    };
}

export function lifestyleSet(lifestyleId: string | number): LifestyleSetAction {
    return {
        type: actionTypes.LIFESTYLE_SET,
        payload: {
            lifestyleId,
        },
        meta: {
            commit: {
                type: actionTypes.LIFESTYLE_SET_COMMIT,
            },
        },
    };
}

interface FaithSetAction {
    type: typeof actionTypes.FAITH_SET;
    payload: {
        faith: string;
    };
    meta: {
        commit: {
            type: typeof actionTypes.FAITH_SET_COMMIT;
        };
    };
}

export function faithSet(faith: string): FaithSetAction {
    return {
        type: actionTypes.FAITH_SET,
        payload: {
            faith,
        },
        meta: {
            commit: {
                type: actionTypes.FAITH_SET_COMMIT,
            },
        },
    };
}

interface HitPointsSetAction {
    type: typeof actionTypes.HIT_POINTS_SET;
    payload: {
        removedHitPoints: number;
        temporaryHitPoints: number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.HIT_POINTS_SET_COMMIT;
        };
    };
}

export function hitPointsSet(removedHitPoints: number, temporaryHitPoints: number): HitPointsSetAction {
    return {
        type: actionTypes.HIT_POINTS_SET,
        payload: {
            removedHitPoints,
            temporaryHitPoints,
        },
        meta: {
            commit: {
                type: actionTypes.HIT_POINTS_SET_COMMIT,
            },
        },
    };
}

interface InspirationSetAction {
    type: typeof actionTypes.INSPIRATION_SET;
    payload: {
        inspiration: boolean;
    };
    meta: {
        commit: {
            type: typeof actionTypes.INSPIRATION_SET_COMMIT;
        };
    };
}

export function inspirationSet(inspiration: boolean): InspirationSetAction {
    return {
        type: actionTypes.INSPIRATION_SET,
        payload: {
            inspiration,
        },
        meta: {
            commit: {
                type: actionTypes.INSPIRATION_SET_COMMIT,
            },
        },
    };
}

interface CurrenciesSetAction {
    type: typeof actionTypes.CURRENCIES_SET;
    payload: {
        [key: string]: any;
        destinationEntityTypeId: string | number;
        destinationEntityId: string | number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CURRENCIES_SET_COMMIT;
        };
        accept?: () => void;
        reject?: () => void;
    };
}

export function currenciesSet(
    currencies: Record<string, any>,
    destinationEntityTypeId: string | number,
    destinationEntityId: string | number,
    accept?: () => void,
    reject?: () => void
): CurrenciesSetAction {
    return {
        type: actionTypes.CURRENCIES_SET,
        payload: {
            ...currencies,
            destinationEntityTypeId,
            destinationEntityId,
        },
        meta: {
            commit: {
                type: actionTypes.CURRENCIES_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}

interface CurrencyCopperSetAction {
    type: typeof actionTypes.CURRENCY_COPPER_SET;
    payload: {
        amount: number;
        destinationEntityId: string | number;
        destinationEntityTypeId: string | number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CURRENCY_COPPER_SET_COMMIT;
        };
    };
}

export function currencyCopperSet(
    amount: number,
    destinationEntityTypeId: string | number,
    destinationEntityId: string | number
): CurrencyCopperSetAction {
    return {
        type: actionTypes.CURRENCY_COPPER_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.CURRENCY_COPPER_SET_COMMIT,
            },
        },
    };
}

interface CurrencyElectrumSetAction {
    type: typeof actionTypes.CURRENCY_ELECTRUM_SET;
    payload: {
        amount: number;
        destinationEntityId: string | number;
        destinationEntityTypeId: string | number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CURRENCY_ELECTRUM_SET_COMMIT;
        };
    };
}

export function currencyElectrumSet(
    amount: number,
    destinationEntityTypeId: string | number,
    destinationEntityId: string | number
): CurrencyElectrumSetAction {
    return {
        type: actionTypes.CURRENCY_ELECTRUM_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.CURRENCY_ELECTRUM_SET_COMMIT,
            },
        },
    };
}

interface CurrencyTransactionSetAction {
    type: typeof actionTypes.CURRENCY_TRANSACTION_SET;
    payload: Record<string, any>;
    meta: {
        accept?: () => void;
        reject?: () => void;
    };
}

export function currencyTransactionSet(
    transactionPayload: Record<string, any>,
    accept?: () => void,
    reject?: () => void
): CurrencyTransactionSetAction {
    return {
        type: actionTypes.CURRENCY_TRANSACTION_SET,
        payload: { ...transactionPayload },
        meta: {
            accept,
            reject,
        },
    };
}

interface CurrencyGoldSetAction {
    type: typeof actionTypes.CURRENCY_GOLD_SET;
    payload: {
        amount: number;
        destinationEntityId: string | number;
        destinationEntityTypeId: string | number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CURRENCY_GOLD_SET_COMMIT;
        };
    };
}

export function currencyGoldSet(
    amount: number,
    destinationEntityTypeId: string | number,
    destinationEntityId: string | number
): CurrencyGoldSetAction {
    return {
        type: actionTypes.CURRENCY_GOLD_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.CURRENCY_GOLD_SET_COMMIT,
            },
        },
    };
}

interface CurrencyPlatinumSetAction {
    type: typeof actionTypes.CURRENCY_PLATINUM_SET;
    payload: {
        amount: number;
        destinationEntityId: string | number;
        destinationEntityTypeId: string | number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CURRENCY_PLATINUM_SET_COMMIT;
        };
    };
}

export function currencyPlatinumSet(
    amount: number,
    destinationEntityTypeId: string | number,
    destinationEntityId: string | number
): CurrencyPlatinumSetAction {
    return {
        type: actionTypes.CURRENCY_PLATINUM_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.CURRENCY_PLATINUM_SET_COMMIT,
            },
        },
    };
}

interface CurrencySilverSetAction {
    type: typeof actionTypes.CURRENCY_SILVER_SET;
    payload: {
        amount: number;
        destinationEntityId: string | number;
        destinationEntityTypeId: string | number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CURRENCY_SILVER_SET_COMMIT;
        };
    };
}

export function currencySilverSet(
    amount: number,
    destinationEntityTypeId: string | number,
    destinationEntityId: string | number
): CurrencySilverSetAction {
    return {
        type: actionTypes.CURRENCY_SILVER_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.CURRENCY_SILVER_SET_COMMIT,
            },
        },
    };
}

interface StartingEquipmentAddRequestAction {
    type: typeof actionTypes.STARTING_EQUIPMENT_ADD_REQUEST;
    payload: Record<string, any>;
    meta: {
        accept?: () => void;
        reject?: () => void;
    };
}

export function startingEquipmentAddRequest(
    starting: Record<string, any>,
    accept?: () => void,
    reject?: () => void
): StartingEquipmentAddRequestAction {
    return {
        type: actionTypes.STARTING_EQUIPMENT_ADD_REQUEST,
        payload: { ...starting },
        meta: {
            accept,
            reject,
        },
    };
}

interface StartingGoldAddRequestAction {
    type: typeof actionTypes.STARTING_GOLD_ADD_REQUEST;
    payload: {
        gold: number;
    };
    meta: {
        accept?: () => void;
        reject?: () => void;
    };
}

export function startingGoldAddRequest(
    gold: number,
    accept?: () => void,
    reject?: () => void
): StartingGoldAddRequestAction {
    return {
        type: actionTypes.STARTING_GOLD_ADD_REQUEST,
        payload: {
            gold,
        },
        meta: {
            accept,
            reject,
        },
    };
}

interface DeathSavesSetAction {
    type: typeof actionTypes.DEATHSAVES_SET;
    payload: {
        fails: number;
        successes: number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.DEATHSAVES_SET_COMMIT;
        };
    };
}

export function deathSavesSet(fails: number, successes: number): DeathSavesSetAction {
    return {
        type: actionTypes.DEATHSAVES_SET,
        payload: {
            fails,
            successes,
        },
        meta: {
            commit: {
                type: actionTypes.DEATHSAVES_SET_COMMIT,
            },
        },
    };
}

interface MovementAddAction {
    type: typeof actionTypes.MOVEMENT_ADD;
    payload: Record<string, any>;
    meta: {
        commit: {
            type: typeof actionTypes.MOVEMENT_ADD_COMMIT;
        };
    };
}

export function movementAdd(customSpeed: Record<string, any>): MovementAddAction {
    return {
        type: actionTypes.MOVEMENT_ADD,
        payload: { ...customSpeed },
        meta: {
            commit: {
                type: actionTypes.MOVEMENT_ADD_COMMIT,
            },
        },
    };
}

interface MovementSetAction {
    type: typeof actionTypes.MOVEMENT_SET;
    payload: Record<string, any>;
    meta: {
        commit: {
            type: typeof actionTypes.MOVEMENT_SET_COMMIT;
        };
    };
}

export function movementSet(customSpeed: Record<string, any>): MovementSetAction {
    return {
        type: actionTypes.MOVEMENT_SET,
        payload: { ...customSpeed },
        meta: {
            commit: {
                type: actionTypes.MOVEMENT_SET_COMMIT,
            },
        },
    };
}

interface MovementRemoveAction {
    type: typeof actionTypes.MOVEMENT_REMOVE;
    payload: {
        movementId: string | number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.MOVEMENT_REMOVE_COMMIT;
        };
    };
}

export function movementRemove(movementId: string | number): MovementRemoveAction {
    return {
        type: actionTypes.MOVEMENT_REMOVE,
        payload: {
            movementId,
        },
        meta: {
            commit: {
                type: actionTypes.MOVEMENT_REMOVE_COMMIT,
            },
        },
    };
}

interface SenseAddAction {
    type: typeof actionTypes.SENSE_ADD;
    payload: Record<string, any>;
    meta: {
        commit: {
            type: typeof actionTypes.SENSE_ADD_COMMIT;
        };
    };
}

export function senseAdd(customSense: Record<string, any>): SenseAddAction {
    return {
        type: actionTypes.SENSE_ADD,
        payload: { ...customSense },
        meta: {
            commit: {
                type: actionTypes.SENSE_ADD_COMMIT,
            },
        },
    };
}

interface SenseSetAction {
    type: typeof actionTypes.SENSE_SET;
    payload: Record<string, any>;
    meta: {
        commit: {
            type: typeof actionTypes.SENSE_SET_COMMIT;
        };
    };
}

export function senseSet(customSense: Record<string, any>): SenseSetAction {
    return {
        type: actionTypes.SENSE_SET,
        payload: { ...customSense },
        meta: {
            commit: {
                type: actionTypes.SENSE_SET_COMMIT,
            },
        },
    };
}

interface SenseRemoveAction {
    type: typeof actionTypes.SENSE_REMOVE;
    payload: {
        senseId: string | number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.SENSE_REMOVE_COMMIT;
        };
    };
}

export function senseRemove(senseId: string | number): SenseRemoveAction {
    return {
        type: actionTypes.SENSE_REMOVE,
        payload: {
            senseId,
        },
        meta: {
            commit: {
                type: actionTypes.SENSE_REMOVE_COMMIT,
            },
        },
    };
}

interface CustomProficiencyAddAction {
    type: typeof actionTypes.CUSTOM_PROFICIENCY_ADD;
    payload: {
        proficiency: Record<string, any>;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CUSTOM_PROFICIENCY_ADD_COMMIT;
        };
    };
}

export function customProficiencyAdd(proficiency: Record<string, any>): CustomProficiencyAddAction {
    return {
        type: actionTypes.CUSTOM_PROFICIENCY_ADD,
        payload: {
            proficiency,
        },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_PROFICIENCY_ADD_COMMIT,
            },
        },
    };
}

interface CustomProficiencyRemoveAction {
    type: typeof actionTypes.CUSTOM_PROFICIENCY_REMOVE;
    payload: {
        id: string | number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CUSTOM_PROFICIENCY_REMOVE_COMMIT;
        };
    };
}

export function customProficiencyRemove(id: string | number): CustomProficiencyRemoveAction {
    return {
        type: actionTypes.CUSTOM_PROFICIENCY_REMOVE,
        payload: {
            id,
        },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_PROFICIENCY_REMOVE_COMMIT,
            },
        },
    };
}

interface CustomProficiencySetAction {
    type: typeof actionTypes.CUSTOM_PROFICIENCY_SET;
    payload: {
        id: string | number;
        properties: Record<string, any>;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CUSTOM_PROFICIENCY_SET_COMMIT;
        };
    };
}

export function customProficiencySet(id: string | number, properties: Record<string, any>): CustomProficiencySetAction {
    return {
        type: actionTypes.CUSTOM_PROFICIENCY_SET,
        payload: {
            id,
            properties,
        },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_PROFICIENCY_SET_COMMIT,
            },
        },
    };
}

interface CustomDefenseAdjustmentAddAction {
    type: typeof actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_ADD;
    payload: Record<string, any>;
    meta: {
        commit: {
            type: typeof actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_ADD_COMMIT;
        };
    };
}

export function customDefenseAdjustmentAdd(customDefenseAdjustment: Record<string, any>): CustomDefenseAdjustmentAddAction {
    return {
        type: actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_ADD,
        payload: { ...customDefenseAdjustment },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_ADD_COMMIT,
            },
        },
    };
}

interface CustomDefenseAdjustmentSetAction {
    type: typeof actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_SET;
    payload: Record<string, any>;
    meta: {
        commit: {
            type: typeof actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_SET_COMMIT;
        };
    };
}

export function customDefenseAdjustmentSet(customDefenseAdjustment: Record<string, any>): CustomDefenseAdjustmentSetAction {
    return {
        type: actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_SET,
        payload: { ...customDefenseAdjustment },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_SET_COMMIT,
            },
        },
    };
}

interface CustomDefenseAdjustmentRemoveAction {
    type: typeof actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_REMOVE;
    payload: {
        type: string;
        adjustmentId: string | number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_REMOVE_COMMIT;
        };
    };
}

export function customDefenseAdjustmentRemove(type: string, adjustmentId: string | number): CustomDefenseAdjustmentRemoveAction {
    return {
        type: actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_REMOVE,
        payload: {
            type,
            adjustmentId,
        },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_REMOVE_COMMIT,
            },
        },
    };
}

interface AbilityScoreBonusSetAction {
    type: typeof actionTypes.ABILITY_SCORE_BONUS_SET;
    payload: {
        statId: string;
        value: number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ABILITY_SCORE_BONUS_SET_COMMIT;
        };
    };
}

export function abilityScoreBonusSet(statId: string, value: number): AbilityScoreBonusSetAction {
    return {
        type: actionTypes.ABILITY_SCORE_BONUS_SET,
        payload: {
            statId,
            value,
        },
        meta: {
            commit: {
                type: actionTypes.ABILITY_SCORE_BONUS_SET_COMMIT,
            },
        },
    };
}

interface AbilityScoreOverrideSetAction {
    type: typeof actionTypes.ABILITY_SCORE_OVERRIDE_SET;
    payload: {
        statId: string;
        value: number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ABILITY_SCORE_OVERRIDE_SET_COMMIT;
        };
    };
}

export function abilityScoreOverrideSet(statId: string, value: number): AbilityScoreOverrideSetAction {
    return {
        type: actionTypes.ABILITY_SCORE_OVERRIDE_SET,
        payload: {
            statId,
            value,
        },
        meta: {
            commit: {
                type: actionTypes.ABILITY_SCORE_OVERRIDE_SET_COMMIT,
            },
        },
    };
}

interface AbilityScoreBaseSetAction {
    type: typeof actionTypes.ABILITY_SCORE_BASE_SET;
    payload: {
        statId: string;
        value: number;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ABILITY_SCORE_BASE_SET_COMMIT;
        };
    };
}

export function abilityScoreBaseSet(statId: string, value: number): AbilityScoreBaseSetAction {
    return {
        type: actionTypes.ABILITY_SCORE_BASE_SET,
        payload: {
            statId,
            value,
        },
        meta: {
            commit: {
                type: actionTypes.ABILITY_SCORE_BASE_SET_COMMIT,
            },
        },
    };
}

interface StatusSetAction {
    type: typeof actionTypes.STATUS_SET;
    payload: {
        status: string;
    };
    meta: {
        commit: {
            type: typeof actionTypes.STATUS_SET_COMMIT;
        };
    };
}

export function statusSet(status: string): StatusSetAction {
    return {
        type: actionTypes.STATUS_SET,
        payload: {
            status,
        },
        meta: {
            commit: {
                type: actionTypes.STATUS_SET_COMMIT,
            },
        },
    };
}

interface StatusSlugSetAction {
    type: typeof actionTypes.STATUS_SLUG_SET;
    payload: {
        statusSlug: string;
    };
    meta: {
        commit: {
            type: typeof actionTypes.STATUS_SLUG_SET_COMMIT;
        };
    };
}

export function statusSlugSet(statusSlug: string): StatusSlugSetAction {
    return {
        type: actionTypes.STATUS_SLUG_SET,
        payload: {
            statusSlug,
        },
        meta: {
            commit: {
                type: actionTypes.STATUS_SLUG_SET_COMMIT,
            },
        },
    };
}