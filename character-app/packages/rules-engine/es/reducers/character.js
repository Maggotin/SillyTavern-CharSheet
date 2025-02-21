import * as actionTypes from '../actions/character/actionTypes';
import * as serviceDataActionTypes from '../actions/serviceData/actionTypes';
import { ActionAccessors } from '../engine/Action';
import { CreatureAccessors } from '../engine/Creature';
import { DataOriginTypeEnum } from '../engine/DataOrigin';
import { DefinitionHacks } from '../engine/Definition';
import { LimitedUseResetTypeEnum } from '../engine/LimitedUse';
import { SpellAccessors } from '../engine/Spell';
import { initialChoiceComponentState, } from '../generated';
import { updateSpellSlots } from './utils';
export const initialCoinState = {
    cp: 0,
    ep: 0,
    gp: 0,
    pp: 0,
    sp: 0,
};
export function currencies(state = initialCoinState, action) {
    let newCurrencies = state;
    if (newCurrencies === null) {
        newCurrencies = {
            cp: 0,
            ep: 0,
            gp: 0,
            pp: 0,
            sp: 0,
        };
    }
    switch (action.type) {
        case actionTypes.CURRENCIES_SET_COMMIT:
        case serviceDataActionTypes.PARTY_CURRENCIES_SET_COMMIT:
            return Object.assign({}, action.payload);
        case actionTypes.CURRENCY_COPPER_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_COPPER_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_COPPER_SET_COMMIT:
        case serviceDataActionTypes.PARTY_CURRENCY_COPPER_SET_COMMIT:
            return Object.assign(Object.assign({}, newCurrencies), { cp: action.payload.amount });
        case actionTypes.CURRENCY_ELECTRUM_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_ELECTRUM_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_ELECTRUM_SET_COMMIT:
        case serviceDataActionTypes.PARTY_CURRENCY_ELECTRUM_SET_COMMIT:
            return Object.assign(Object.assign({}, newCurrencies), { ep: action.payload.amount });
        case actionTypes.CURRENCY_GOLD_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_GOLD_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_GOLD_SET_COMMIT:
        case serviceDataActionTypes.PARTY_CURRENCY_GOLD_SET_COMMIT:
            return Object.assign(Object.assign({}, newCurrencies), { gp: action.payload.amount });
        case actionTypes.CURRENCY_PLATINUM_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_PLATINUM_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_PLATINUM_SET_COMMIT:
        case serviceDataActionTypes.PARTY_CURRENCY_PLATINUM_SET_COMMIT:
            return Object.assign(Object.assign({}, newCurrencies), { pp: action.payload.amount });
        case actionTypes.CURRENCY_SILVER_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_SILVER_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_SILVER_SET_COMMIT:
        case serviceDataActionTypes.PARTY_CURRENCY_SILVER_SET_COMMIT:
            return Object.assign(Object.assign({}, newCurrencies), { sp: action.payload.amount });
        case actionTypes.ITEM_CURRENCY_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_SET_COMMIT:
            return state
                ? Object.assign(Object.assign({}, state), action.payload.currency) : Object.assign({}, action.payload.currency);
        default:
        //not implemented
    }
    return newCurrencies;
}
const initialLimitedUseState = {
    maxNumberConsumed: 0,
    maxUses: 0,
    minNumberConsumed: 0,
    name: '',
    numberUsed: 0,
    operator: null,
    resetDice: null,
    resetType: LimitedUseResetTypeEnum.SHORT_REST,
    statModifierUsesId: null,
    proficiencyBonusOperator: null,
    useProficiencyBonus: false,
};
function limitedUse(state = initialLimitedUseState, action) {
    switch (action.type) {
        case actionTypes.ACTION_USE_SET_COMMIT:
        case actionTypes.SPELL_USE_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { numberUsed: action.payload.uses });
        default:
        // not implemented
    }
    return state;
}
const initialItemLimitedUseState = {
    maxUses: 0,
    numberUsed: 0,
    resetType: null,
    resetTypeDescription: null,
};
function itemLimitedUse(state = initialItemLimitedUseState, action) {
    switch (action.type) {
        case actionTypes.ITEM_CHARGES_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CHARGES_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { numberUsed: action.payload.uses });
        default:
        // not implemented
    }
    return state;
}
const initialStatEntityState = {
    id: -1,
    value: null,
    name: '',
};
function statEntity(state = initialStatEntityState, action) {
    switch (action.type) {
        case actionTypes.ABILITY_SCORE_BASE_SET_COMMIT:
        case actionTypes.ABILITY_SCORE_OVERRIDE_SET_COMMIT:
        case actionTypes.ABILITY_SCORE_BONUS_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { value: action.payload.value });
        default:
        // not implemented
    }
    return state;
}
function getKeyedComponentData(state, action, actionKey, key) {
    if (action.payload[actionKey].hasOwnProperty(key)) {
        return action.payload[actionKey][key];
    }
    return state[key];
}
const initialActionComponentState = {
    background: [],
    class: [],
    feat: [],
    item: [],
    race: [],
};
function actionComponents(state = initialActionComponentState, action) {
    if (!action.payload.hasOwnProperty('actions')) {
        return state;
    }
    switch (action.type) {
        case actionTypes.ACTIONS_SET_COMMIT:
        case actionTypes.CHARACTER_COMPONENTS_SET_COMMIT:
            return {
                background: getKeyedComponentData(state, action, 'actions', 'background'),
                class: getKeyedComponentData(state, action, 'actions', 'class'),
                feat: getKeyedComponentData(state, action, 'actions', 'feat'),
                item: getKeyedComponentData(state, action, 'actions', 'item'),
                race: getKeyedComponentData(state, action, 'actions', 'race'),
            };
        default:
        // not implemented
    }
    return state;
}
function choiceComponents(state = initialChoiceComponentState, action) {
    if (!action.payload.hasOwnProperty('choices')) {
        return state;
    }
    switch (action.type) {
        case actionTypes.CHOICES_SET_COMMIT:
        case actionTypes.CHARACTER_COMPONENTS_SET_COMMIT:
            return {
                background: getKeyedComponentData(state, action, 'choices', 'background'),
                class: getKeyedComponentData(state, action, 'choices', 'class'),
                feat: getKeyedComponentData(state, action, 'choices', 'feat'),
                item: getKeyedComponentData(state, action, 'choices', 'item'),
                race: getKeyedComponentData(state, action, 'choices', 'race'),
                choiceDefinitions: getKeyedComponentData(state, action, 'choices', 'choiceDefinitions'),
                definitionKeyNameMap: getKeyedComponentData(state, action, 'choices', 'definitionKeyNameMap'),
            };
        default:
        // not implemented
    }
    return state;
}
const initialModifierComponentState = {
    background: [],
    class: [],
    condition: [],
    feat: [],
    item: [],
    race: [],
};
function modifierComponents(state = initialModifierComponentState, action) {
    if (!action.payload.hasOwnProperty('modifiers')) {
        return state;
    }
    switch (action.type) {
        case actionTypes.MODIFIERS_SET_COMMIT:
        case actionTypes.CHARACTER_COMPONENTS_SET_COMMIT:
            return {
                background: getKeyedComponentData(state, action, 'modifiers', 'background'),
                class: getKeyedComponentData(state, action, 'modifiers', 'class'),
                condition: getKeyedComponentData(state, action, 'modifiers', 'condition'),
                feat: getKeyedComponentData(state, action, 'modifiers', 'feat'),
                item: getKeyedComponentData(state, action, 'modifiers', 'item'),
                race: getKeyedComponentData(state, action, 'modifiers', 'race'),
            };
        default:
        // not implemented
    }
    return state;
}
const initialOptionComponentState = {
    background: [],
    class: [],
    feat: [],
    item: [],
    race: [],
};
function optionComponents(state = initialOptionComponentState, action) {
    if (!action.payload.hasOwnProperty('options')) {
        return state;
    }
    switch (action.type) {
        case actionTypes.OPTIONS_SET_COMMIT:
        case actionTypes.CHARACTER_COMPONENTS_SET_COMMIT:
            return {
                background: getKeyedComponentData(state, action, 'options', 'background'),
                class: getKeyedComponentData(state, action, 'options', 'class'),
                feat: getKeyedComponentData(state, action, 'options', 'feat'),
                item: getKeyedComponentData(state, action, 'options', 'item'),
                race: getKeyedComponentData(state, action, 'options', 'race'),
            };
        default:
        // not implemented
    }
    return state;
}
const initialSpellComponentState = {
    background: [],
    class: [],
    feat: [],
    item: [],
    race: [],
};
function spellComponents(state = initialSpellComponentState, action) {
    if (!action.payload.hasOwnProperty('spells')) {
        return state;
    }
    switch (action.type) {
        case actionTypes.CHARACTER_SPELLS_SET_COMMIT:
        case actionTypes.CHARACTER_COMPONENTS_SET_COMMIT:
            return {
                background: getKeyedComponentData(state, action, 'spells', 'background'),
                class: getKeyedComponentData(state, action, 'spells', 'class'),
                feat: getKeyedComponentData(state, action, 'spells', 'feat'),
                item: getKeyedComponentData(state, action, 'spells', 'item'),
                race: getKeyedComponentData(state, action, 'spells', 'race'),
            };
        default:
        // not implemented
    }
    return state;
}
const initialItemState = {
    chargesUsed: 0,
    containerEntityId: -1,
    containerEntityTypeId: -1,
    containerDefinitionKey: '-1:-1',
    currency: null,
    definition: null,
    definitionId: -1,
    definitionTypeId: -1,
    displayAsAttack: null,
    entityTypeId: -1,
    equipped: null,
    equippedEntityId: null,
    equippedEntityTypeId: null,
    id: -1,
    isAttuned: null,
    limitedUse: null,
    quantity: -1,
};
export function itemReducer(state = initialItemState, action) {
    switch (action.type) {
        case actionTypes.ITEM_EQUIPPED_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_EQUIPPED_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { equipped: action.payload.value, equippedEntityId: action.payload.equippedEntityId, equippedEntityTypeId: action.payload.equippedEntityTypeId });
        case actionTypes.ITEM_ATTUNE_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_ATTUNE_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { isAttuned: action.payload.value });
        case actionTypes.ITEM_QUANTITY_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_QUANTITY_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { quantity: action.payload.quantity });
        case actionTypes.ITEM_CHARGES_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CHARGES_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { limitedUse: itemLimitedUse(state.limitedUse === null ? undefined : state.limitedUse, action) });
        case actionTypes.ITEM_MOVE_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_MOVE_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { containerEntityId: action.payload.containerEntityId, containerEntityTypeId: action.payload.containerEntityTypeId, containerDefinitionKey: DefinitionHacks.hack__generateDefinitionKey(action.payload.containerEntityTypeId, action.payload.containerEntityId) });
        case actionTypes.ITEM_CURRENCY_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_COPPER_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_ELECTRUM_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_GOLD_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_PLATINUM_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_SILVER_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_COPPER_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_ELECTRUM_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_GOLD_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_PLATINUM_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_SILVER_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { currency: currencies(state.currency, action) });
        default:
        // not implemented
    }
    return state;
}
const initialInventoryState = [];
export function inventory(state = initialInventoryState, action) {
    switch (action.type) {
        case serviceDataActionTypes.PARTY_ITEM_EQUIPPED_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_ATTUNE_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_QUANTITY_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CHARGES_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_MOVE_SET_COMMIT:
        case actionTypes.ITEM_EQUIPPED_SET_COMMIT:
        case actionTypes.ITEM_ATTUNE_SET_COMMIT:
        case actionTypes.ITEM_QUANTITY_SET_COMMIT:
        case actionTypes.ITEM_CHARGES_SET_COMMIT:
        case actionTypes.ITEM_MOVE_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_SET_COMMIT: {
            const itemIdx = state.findIndex((item) => item.id === action.payload.id);
            return itemIdx > -1
                ? [...state.slice(0, itemIdx), itemReducer(state[itemIdx], action), ...state.slice(itemIdx + 1)]
                : [...state];
        }
        case serviceDataActionTypes.PARTY_ITEM_REMOVE_COMMIT:
        case actionTypes.ITEM_REMOVE_COMMIT:
            return state.filter((entity) => entity.id !== action.payload.id);
        case serviceDataActionTypes.PARTY_ITEM_ADD_COMMIT:
        case actionTypes.ITEM_ADD_COMMIT: {
            const itemIdx = state.findIndex((item) => item.id === action.payload.item.id);
            if (itemIdx > -1) {
                return [...state.slice(0, itemIdx), action.payload.item, ...state.slice(itemIdx + 1)];
            }
            return [...state, action.payload.item];
        }
        case actionTypes.ITEM_CURRENCY_COPPER_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_SILVER_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_ELECTRUM_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_GOLD_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_PLATINUM_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_COPPER_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_SILVER_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_ELECTRUM_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_GOLD_SET_COMMIT:
        case serviceDataActionTypes.PARTY_ITEM_CURRENCY_PLATINUM_SET_COMMIT: {
            const itemIdx = state.findIndex((item) => item.id === action.payload.destinationEntityId);
            return itemIdx > -1
                ? [...state.slice(0, itemIdx), itemReducer(state[itemIdx], action), ...state.slice(itemIdx + 1)]
                : [...state];
        }
        default:
        // not implemented
    }
    return state;
}
const initialSpellState = {
    activation: null,
    additionalDescription: null,
    alwaysPrepared: false,
    atWillLimitedUseLevel: null,
    baseLevelAtWill: false,
    castAtLevel: null,
    castOnlyAsRitual: false,
    componentId: -1,
    componentTypeId: -1,
    countsAsKnownSpell: false,
    definition: null,
    definitionId: -1,
    displayAsAttack: null,
    entityTypeId: -1,
    id: -1,
    isSignatureSpell: false,
    limitedUse: null,
    overrideSaveDc: null,
    prepared: false,
    range: null,
    restriction: null,
    ritualCastingType: null,
    spellCastingAbilityId: null,
    spellListId: null,
    usesSpellSlot: false,
};
function spellEntity(state = initialSpellState, action) {
    switch (action.type) {
        case actionTypes.SPELL_PREPARED_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { prepared: action.payload.prepared });
        case actionTypes.SPELL_USE_SET_COMMIT:
            if (!state.limitedUse) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { limitedUse: limitedUse(state.limitedUse, action) });
        default:
        // not implemented
    }
    return state;
}
const initialSlotEntitiesState = [];
function slotEntities(state = initialSlotEntitiesState, action) {
    switch (action.type) {
        case actionTypes.SPELL_LEVEL_SPELL_SLOTS_SET_COMMIT: {
            let newSpellSlots = [...state];
            Object.keys(action.payload).forEach((key) => {
                let spellLevel = null;
                switch (key) {
                    case 'level1':
                        spellLevel = 1;
                        break;
                    case 'level2':
                        spellLevel = 2;
                        break;
                    case 'level3':
                        spellLevel = 3;
                        break;
                    case 'level4':
                        spellLevel = 4;
                        break;
                    case 'level5':
                        spellLevel = 5;
                        break;
                    case 'level6':
                        spellLevel = 6;
                        break;
                    case 'level7':
                        spellLevel = 7;
                        break;
                    case 'level8':
                        spellLevel = 8;
                        break;
                    case 'level9':
                        spellLevel = 9;
                        break;
                }
                const payloadLevelValue = action.payload[key];
                const slotsUsed = payloadLevelValue === undefined ? null : payloadLevelValue;
                newSpellSlots = updateSpellSlots(newSpellSlots, spellLevel, slotsUsed);
            });
            return newSpellSlots;
        }
        case actionTypes.SPELL_LEVEL_PACT_MAGIC_SLOTS_SET_COMMIT: {
            let newSpellSlots = [...state];
            Object.keys(action.payload).forEach((key) => {
                let spellLevel = null;
                switch (key) {
                    case 'level1':
                        spellLevel = 1;
                        break;
                    case 'level2':
                        spellLevel = 2;
                        break;
                    case 'level3':
                        spellLevel = 3;
                        break;
                    case 'level4':
                        spellLevel = 4;
                        break;
                    case 'level5':
                        spellLevel = 5;
                        break;
                }
                const payloadLevelValue = action.payload[key];
                const slotsUsed = payloadLevelValue === undefined ? null : payloadLevelValue;
                newSpellSlots = updateSpellSlots(newSpellSlots, spellLevel, slotsUsed);
            });
            return newSpellSlots;
        }
        default:
        // not implemented
    }
    return state;
}
const initialClassState = {
    definition: null,
    definitionId: -1,
    entityTypeId: -1,
    id: -1,
    isStartingClass: false,
    level: -1,
    subclassDefinition: null,
    subclassDefinitionId: -1,
    classFeatures: [],
    hitDiceUsed: 0,
};
function classEntity(state = initialClassState, action) {
    switch (action.type) {
        case actionTypes.CLASS_SET:
            return Object.assign({}, action.payload);
        default:
        // not implemented
    }
    return state;
}
const initialOptionalClassFeatureState = {
    affectedClassFeatureId: null,
    affectedClassFeatureDefinitionKey: null,
    classFeatureDefinitionKey: null,
    classFeatureId: -1,
};
function optionalClassFeature(state = initialOptionalClassFeatureState, action) {
    switch (action.type) {
        case actionTypes.OPTIONAL_CLASS_FEATURE_SET_COMMIT: {
            return Object.assign(Object.assign({}, state), action.payload);
        }
        default:
        //not implemented
    }
    return state;
}
const initialOptionalClassFeaturesState = [];
function optionalClassFeatures(state = initialOptionalClassFeaturesState, action) {
    switch (action.type) {
        case actionTypes.OPTIONAL_CLASS_FEATURE_ADD_COMMIT: {
            return [...state, action.payload.optionalClassFeature];
        }
        case actionTypes.OPTIONAL_CLASS_FEATURE_REMOVE_COMMIT: {
            return state.filter((featureMapping) => featureMapping.classFeatureId !== action.payload.classFeatureId);
        }
        case actionTypes.OPTIONAL_CLASS_FEATURE_SET_COMMIT: {
            const optionalFeatureIndex = state.findIndex((featureMapping) => featureMapping.classFeatureId === action.payload.classFeatureId);
            return [
                ...state.slice(0, optionalFeatureIndex),
                optionalClassFeature(state[optionalFeatureIndex], action),
                ...state.slice(optionalFeatureIndex + 1),
            ];
        }
        default:
        //not implemented
    }
    return state;
}
const initialOptionalOriginState = {
    affectedRacialTraitId: null,
    affectedRacialTraitDefinitionKey: null,
    racialTraitDefinitionKey: null,
    racialTraitId: -1,
};
function optionalOrigin(state = initialOptionalOriginState, action) {
    switch (action.type) {
        case actionTypes.OPTIONAL_ORIGIN_SET_COMMIT: {
            return Object.assign(Object.assign({}, state), action.payload);
        }
        default:
        //not implemented
    }
    return state;
}
const initialOptionalOriginsState = [];
function optionalOrigins(state = initialOptionalOriginsState, action) {
    switch (action.type) {
        case actionTypes.OPTIONAL_ORIGIN_ADD_COMMIT: {
            return [...state, action.payload.optionalOrigin];
        }
        case actionTypes.OPTIONAL_ORIGIN_REMOVE_COMMIT: {
            return state.filter((featureMapping) => featureMapping.racialTraitId !== action.payload.racialTraitId);
        }
        case actionTypes.OPTIONAL_ORIGIN_SET_COMMIT: {
            const optionalFeatureIndex = state.findIndex((featureMapping) => featureMapping.racialTraitId === action.payload.racialTraitId);
            return [
                ...state.slice(0, optionalFeatureIndex),
                optionalOrigin(state[optionalFeatureIndex], action),
                ...state.slice(optionalFeatureIndex + 1),
            ];
        }
        default:
        //not implemented
    }
    return state;
}
const initialCampaignSettingState = {
    campaignSettingId: 1,
    enabledSourceIds: [],
};
function campaignSetting(state = initialCampaignSettingState, action) {
    switch (action.type) {
        case actionTypes.CAMPAIGN_SETTING_SET_COMMIT: {
            return Object.assign(Object.assign({}, state), action.payload);
        }
        default:
        //not implemented
    }
    return state;
}
const initialActionState = {
    abilityModifierStatId: null,
    actionType: null,
    activation: null,
    ammunition: null,
    attackSubtype: null,
    attackTypeRange: null,
    componentId: -1,
    componentTypeId: -1,
    damageTypeId: null,
    description: '',
    dice: null,
    displayAsAttack: null,
    entityTypeId: null,
    fixedSaveDc: null,
    fixedToHit: null,
    id: null,
    isMartialArts: false,
    isProficient: false,
    limitedUse: null,
    name: '',
    numberOfTargets: null,
    onMissDescription: '',
    range: null,
    saveFailDescription: '',
    saveStatId: null,
    saveSuccessDescription: '',
    snippet: '',
    spellRangeType: null,
    value: null,
};
function characterAction(state = initialActionState, action) {
    switch (action.type) {
        case actionTypes.ACTION_USE_SET_COMMIT:
            if (!state.limitedUse) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { limitedUse: limitedUse(state.limitedUse, action) });
        default:
        // not implemented
    }
    return state;
}
const initialCreatureEntityState = {
    definition: null,
    description: null,
    entityTypeId: -1,
    groupId: -1,
    id: -1,
    isActive: false,
    name: '',
    removedHitPoints: 0,
    temporaryHitPoints: null,
};
function creatureEntity(state = initialCreatureEntityState, action) {
    switch (action.type) {
        case actionTypes.CREATURE_ACTIVE_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { isActive: action.payload.isActive });
        case actionTypes.CREATURE_HIT_POINTS_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { removedHitPoints: action.payload.removedHitPoints, temporaryHitPoints: action.payload.temporaryHitPoints });
        case actionTypes.CREATURE_DATA_SET_COMMIT:
            return Object.assign(Object.assign({}, state), action.payload.properties);
        default:
        // not implemented
    }
    return state;
}
const initialClassSpellsEntityState = {
    characterClassId: 0,
    spells: [],
    entityTypeId: -1,
};
function classSpellsEntity(state = initialClassSpellsEntityState, action) {
    switch (action.type) {
        case actionTypes.SPELL_ADD_COMMIT:
            if (state.spells === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { spells: [...state.spells, action.payload.spell] });
        case actionTypes.SPELL_REMOVE_COMMIT:
            if (state.spells === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { spells: state.spells.filter((spell) => !(SpellAccessors.getMappingEntityTypeId(spell) === action.payload.entityTypeId &&
                    SpellAccessors.getMappingId(spell) === action.payload.id)) });
        case actionTypes.SPELL_PREPARED_SET_COMMIT: {
            if (state.spells === null) {
                return state;
            }
            const spellIdx = state.spells.findIndex((spell) => SpellAccessors.getMappingEntityTypeId(spell) === action.payload.entityTypeId &&
                SpellAccessors.getMappingId(spell) === action.payload.id);
            if (spellIdx < 0) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { spells: [
                    ...state.spells.slice(0, spellIdx),
                    spellEntity(state.spells[spellIdx], action),
                    ...state.spells.slice(spellIdx + 1),
                ] });
        }
        default:
        // not implemented
    }
    return state;
}
function getComponentDataOriginKey(dataOriginType) {
    switch (dataOriginType) {
        case DataOriginTypeEnum.BACKGROUND:
            return 'background';
        case DataOriginTypeEnum.CLASS_FEATURE:
            return 'class';
        case DataOriginTypeEnum.FEAT:
            return 'feat';
        case DataOriginTypeEnum.ITEM:
            return 'item';
        case DataOriginTypeEnum.RACE:
            return 'race';
        default:
        // not implemented
    }
    return '';
}
const characterConfigInitialState = {
    abilityScoreType: null,
    showHelpText: false,
    startingEquipmentType: null,
};
function characterConfiguration(state = characterConfigInitialState, action) {
    switch (action.type) {
        case actionTypes.SHOW_HELP_TEXT_SET:
            return Object.assign(Object.assign({}, state), { showHelpText: action.payload.showHelpText });
        case actionTypes.ABILITY_SCORE_TYPE_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { abilityScoreType: action.payload.abilityScoreType });
        case actionTypes.STARTING_EQUIPMENT_TYPE_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { startingEquipmentType: action.payload.startingEquipmentType });
        default:
        // not implemented
    }
    return state;
}
export const initialState = {
    actions: null,
    activeSourceCategories: [],
    adjustmentXp: null,
    age: null,
    alignmentId: null,
    background: null,
    baseHitPoints: 0,
    bonusHitPoints: null,
    bonusStats: [],
    campaign: null,
    campaignSetting: null,
    canEdit: true,
    characterValues: [],
    choices: null,
    classSpells: [],
    classes: [],
    conditions: [],
    configuration: null,
    creatures: [],
    currencies: null,
    currentXp: 0,
    customActions: [],
    customDefenseAdjustments: [],
    customItems: [],
    customProficiencies: [],
    customSenses: [],
    customSpeeds: [],
    deathSaves: null,
    decorations: null,
    eyes: null,
    faith: '',
    feats: [],
    gender: null,
    hair: null,
    height: null,
    id: 0,
    inspiration: false,
    inventory: [],
    lifestyle: null,
    lifestyleId: null,
    modifiers: null,
    name: null,
    notes: null,
    optionalClassFeatures: [],
    optionalOrigins: [],
    options: null,
    overrideHitPoints: null,
    overrideStats: [],
    pactMagic: [],
    preferences: null,
    race: null,
    raceDefinitionId: null,
    raceDefinitionTypeId: null,
    readonlyUrl: '',
    removedHitPoints: 0,
    skin: null,
    socialName: '',
    spellSlots: [],
    spells: null,
    stats: [],
    temporaryHitPoints: 0,
    traits: null,
    userId: -1,
    username: '',
    weight: null,
    isAssignedToPlayer: false,
    premadeInfo: null,
    status: null,
    statusSlug: null,
};
function character(state = initialState, action) {
    switch (action.type) {
        case actionTypes.CHARACTER_SET:
            return Object.assign(Object.assign({}, state), action.payload);
        case actionTypes.ALIGNMENT_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { alignmentId: action.payload.alignmentId });
        case actionTypes.LIFESTYLE_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { lifestyleId: action.payload.lifestyleId });
        case actionTypes.FAITH_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { faith: action.payload.faith });
        case actionTypes.NAME_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { name: action.payload.name });
        case actionTypes.HAIR_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { hair: action.payload.hair });
        case actionTypes.SKIN_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { skin: action.payload.skin });
        case actionTypes.EYES_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { eyes: action.payload.eyes });
        case actionTypes.HEIGHT_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { height: action.payload.height });
        case actionTypes.WEIGHT_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { weight: action.payload.weight });
        case actionTypes.AGE_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { age: action.payload.age });
        case actionTypes.GENDER_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { gender: action.payload.gender });
        case actionTypes.RACE_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { race: action.payload.race });
        case actionTypes.CLASS_ADD:
            if (state.classes === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { classes: [...state.classes, action.payload.charClass] });
        case actionTypes.CLASSES_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { classes: action.payload.classes });
        case actionTypes.CLASS_SET: {
            if (state.classes === null) {
                return state;
            }
            const classIdx = state.classes.findIndex((charClass) => charClass.id === action.payload.id);
            return Object.assign(Object.assign({}, state), { classes: [
                    ...state.classes.slice(0, classIdx),
                    classEntity(state.classes[classIdx], action),
                    ...state.classes.slice(classIdx + 1),
                ] });
        }
        case actionTypes.OPTIONAL_CLASS_FEATURE_ADD_COMMIT:
        case actionTypes.OPTIONAL_CLASS_FEATURE_SET_COMMIT:
        case actionTypes.OPTIONAL_CLASS_FEATURE_REMOVE_COMMIT: {
            if (state.optionalClassFeatures === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { optionalClassFeatures: optionalClassFeatures(state.optionalClassFeatures, action) });
        }
        case actionTypes.OPTIONAL_ORIGIN_ADD_COMMIT:
        case actionTypes.OPTIONAL_ORIGIN_SET_COMMIT:
        case actionTypes.OPTIONAL_ORIGIN_REMOVE_COMMIT: {
            if (state.optionalOrigins === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { optionalOrigins: optionalOrigins(state.optionalOrigins, action) });
        }
        case actionTypes.CAMPAIGN_SETTING_SET_COMMIT:
            if (state.campaignSetting === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { campaignSetting: campaignSetting(state.campaignSetting, action) });
        case actionTypes.NOTE_SET_COMMIT:
            if (state.notes === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { notes: Object.assign(Object.assign({}, state.notes), { [action.payload.noteType]: action.payload.content }) });
        case actionTypes.TRAIT_SET_COMMIT:
            if (state.traits === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { traits: Object.assign(Object.assign({}, state.traits), { [action.payload.traitType]: action.payload.content }) });
        case actionTypes.ITEM_REMOVE_COMMIT:
        case actionTypes.ITEM_ADD_COMMIT:
        case actionTypes.ITEM_EQUIPPED_SET_COMMIT:
        case actionTypes.ITEM_ATTUNE_SET_COMMIT:
        case actionTypes.ITEM_QUANTITY_SET_COMMIT:
        case actionTypes.ITEM_CHARGES_SET_COMMIT:
        case actionTypes.ITEM_MOVE_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_COPPER_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_SILVER_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_ELECTRUM_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_GOLD_SET_COMMIT:
        case actionTypes.ITEM_CURRENCY_PLATINUM_SET_COMMIT:
            if (state.inventory === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { inventory: inventory(state.inventory, action) });
        case actionTypes.CUSTOM_ITEM_ADD_COMMIT:
            if (state.customItems === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { customItems: [...state.customItems, action.payload.item] });
        case actionTypes.CUSTOM_ITEM_SET_COMMIT: {
            if (state.customItems === null) {
                return state;
            }
            const itemIdx = state.customItems.findIndex((item) => item.id === action.payload.id);
            const item = Object.assign(Object.assign({}, state.customItems[itemIdx]), action.payload.properties);
            return Object.assign(Object.assign({}, state), { customItems: [...state.customItems.slice(0, itemIdx), item, ...state.customItems.slice(itemIdx + 1)] });
        }
        case actionTypes.CUSTOM_ITEM_REMOVE_COMMIT:
            if (state.customItems === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { customItems: state.customItems.filter((item) => item.id !== action.payload.id) });
        case actionTypes.XP_SET:
            return Object.assign(Object.assign({}, state), { currentXp: action.payload.currentXp });
        case actionTypes.BASE_HIT_POINTS_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { baseHitPoints: action.payload.baseHitPoints });
        case actionTypes.BONUS_HIT_POINTS_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { bonusHitPoints: action.payload.bonusHitPoints });
        case actionTypes.OVERRIDE_HIT_POINTS_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { overrideHitPoints: action.payload.overrideHitPoints });
        case actionTypes.ABILITY_SCORE_BASE_SET_COMMIT: {
            if (state.stats === null) {
                return state;
            }
            const statIdx = state.stats.findIndex((stat) => stat.id === action.payload.statId);
            return Object.assign(Object.assign({}, state), { stats: [
                    ...state.stats.slice(0, statIdx),
                    statEntity(state.stats[statIdx], action),
                    ...state.stats.slice(statIdx + 1),
                ] });
        }
        case actionTypes.ABILITY_SCORE_OVERRIDE_SET_COMMIT: {
            if (state.overrideStats === null) {
                return state;
            }
            const statIdx = state.overrideStats.findIndex((stat) => stat.id === action.payload.statId);
            return Object.assign(Object.assign({}, state), { overrideStats: [
                    ...state.overrideStats.slice(0, statIdx),
                    statEntity(state.overrideStats[statIdx], action),
                    ...state.overrideStats.slice(statIdx + 1),
                ] });
        }
        case actionTypes.ABILITY_SCORE_BONUS_SET_COMMIT: {
            if (state.bonusStats === null) {
                return state;
            }
            const statIdx = state.bonusStats.findIndex((stat) => stat.id === action.payload.statId);
            return Object.assign(Object.assign({}, state), { bonusStats: [
                    ...state.bonusStats.slice(0, statIdx),
                    statEntity(state.bonusStats[statIdx], action),
                    ...state.bonusStats.slice(statIdx + 1),
                ] });
        }
        case actionTypes.CURRENCIES_SET_COMMIT:
        case actionTypes.CURRENCY_COPPER_SET_COMMIT:
        case actionTypes.CURRENCY_ELECTRUM_SET_COMMIT:
        case actionTypes.CURRENCY_GOLD_SET_COMMIT:
        case actionTypes.CURRENCY_PLATINUM_SET_COMMIT:
        case actionTypes.CURRENCY_SILVER_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { currencies: currencies(state.currencies, action) });
        case actionTypes.SPELL_PREPARED_SET_COMMIT:
        case actionTypes.SPELL_ADD_COMMIT:
        case actionTypes.SPELL_REMOVE_COMMIT: {
            if (state.classSpells === null) {
                return state;
            }
            const classSpellIdx = state.classSpells.findIndex((classSpell) => classSpell.characterClassId === action.payload.characterClassId);
            if (classSpellIdx < 0) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { classSpells: [
                    ...state.classSpells.slice(0, classSpellIdx),
                    classSpellsEntity(state.classSpells[classSpellIdx], action),
                    ...state.classSpells.slice(classSpellIdx + 1),
                ] });
        }
        case actionTypes.BACKGROUND_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { background: action.payload.background });
        case actionTypes.BACKGROUND_HAS_CUSTOM_SET_COMMIT:
            if (state.background === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { background: Object.assign(Object.assign({}, state.background), { hasCustomBackground: action.payload.hasCustomBackground }) });
        case actionTypes.FEATS_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { feats: [...action.payload.feats] });
        case actionTypes.PREFERENCE_SET_COMMIT:
            if (state.preferences === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { preferences: Object.assign(Object.assign({}, state.preferences), action.payload) });
        case actionTypes.ACTIVE_SOURCE_CATEGORIES_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { activeSourceCategories: action.payload.activeSourceCategories });
        case actionTypes.PORTRAIT_SET_COMMIT:
            if (state.decorations === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { decorations: Object.assign(Object.assign({}, state.decorations), { avatarId: action.payload.avatarId, avatarUrl: action.payload.avatarUrl }) });
        case actionTypes.HIT_POINTS_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { removedHitPoints: action.payload.removedHitPoints, temporaryHitPoints: action.payload.temporaryHitPoints });
        case actionTypes.CONDITIONS_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { conditions: [...action.payload.conditions] });
        case actionTypes.XP_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { currentXp: action.payload.currentXp });
        case actionTypes.INSPIRATION_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { inspiration: action.payload.inspiration });
        case actionTypes.DEATHSAVES_SET_COMMIT:
            if (state.deathSaves === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { deathSaves: Object.assign(Object.assign({}, state.deathSaves), { failCount: action.payload.fails, successCount: action.payload.successes }) });
        case actionTypes.MOVEMENT_ADD_COMMIT:
            if (state.customSpeeds === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { customSpeeds: [...state.customSpeeds, action.payload] });
        case actionTypes.MOVEMENT_SET_COMMIT:
            if (state.customSpeeds === null) {
                return state;
            }
            const customSpeedIdx = state.customSpeeds.findIndex((speed) => speed.movementId === action.payload.movementId);
            return Object.assign(Object.assign({}, state), { customSpeeds: [
                    ...state.customSpeeds.slice(0, customSpeedIdx),
                    Object.assign({}, action.payload),
                    ...state.customSpeeds.slice(customSpeedIdx + 1),
                ] });
        case actionTypes.MOVEMENT_REMOVE_COMMIT:
            if (state.customSpeeds === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { customSpeeds: state.customSpeeds.filter((movement) => movement.movementId !== action.payload.movementId) });
        case actionTypes.SENSE_ADD_COMMIT:
            if (state.customSenses === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { customSenses: [...state.customSenses, action.payload] });
        case actionTypes.SENSE_SET_COMMIT:
            if (state.customSenses === null) {
                return state;
            }
            const customSenseIdx = state.customSenses.findIndex((sense) => sense.senseId === action.payload.senseId);
            return Object.assign(Object.assign({}, state), { customSenses: [
                    ...state.customSenses.slice(0, customSenseIdx),
                    Object.assign({}, action.payload),
                    ...state.customSenses.slice(customSenseIdx + 1),
                ] });
        case actionTypes.SENSE_REMOVE_COMMIT:
            if (state.customSenses === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { customSenses: state.customSenses.filter((sense) => sense.senseId !== action.payload.senseId) });
        case actionTypes.CUSTOM_ACTION_ADD_COMMIT:
            if (state.customActions === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { customActions: [...state.customActions, action.payload.action] });
        case actionTypes.CUSTOM_ACTION_REMOVE_COMMIT:
            if (state.customActions === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { customActions: state.customActions.filter((attack) => attack.id !== action.payload.id) });
        case actionTypes.CUSTOM_ACTION_SET_COMMIT: {
            if (state.customActions === null) {
                return state;
            }
            const customActionIdx = state.customActions.findIndex((attack) => attack.id === action.payload.id);
            return Object.assign(Object.assign({}, state), { customActions: [
                    ...state.customActions.slice(0, customActionIdx),
                    Object.assign(Object.assign({}, state.customActions[customActionIdx]), action.payload.properties),
                    ...state.customActions.slice(customActionIdx + 1),
                ] });
        }
        // TODO this needs data update
        case actionTypes.CUSTOM_PROFICIENCY_ADD_COMMIT:
            if (state.customProficiencies === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { customProficiencies: [...state.customProficiencies, action.payload.proficiency] });
        case actionTypes.CUSTOM_PROFICIENCY_REMOVE_COMMIT:
            if (state.customProficiencies === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { customProficiencies: state.customProficiencies.filter((proficiency) => proficiency.id !== action.payload.id) });
        case actionTypes.CUSTOM_PROFICIENCY_SET_COMMIT: {
            if (state.customProficiencies === null) {
                return state;
            }
            const customProfIdx = state.customProficiencies.findIndex((proficiency) => proficiency.id === action.payload.id);
            return Object.assign(Object.assign({}, state), { customProficiencies: [
                    ...state.customProficiencies.slice(0, customProfIdx),
                    Object.assign(Object.assign({}, state.customProficiencies[customProfIdx]), action.payload.properties),
                    ...state.customProficiencies.slice(customProfIdx + 1),
                ] });
        }
        case actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_ADD_COMMIT:
            if (state.customDefenseAdjustments === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { customDefenseAdjustments: [...state.customDefenseAdjustments, action.payload] });
        case actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_SET_COMMIT:
            if (state.customDefenseAdjustments === null) {
                return state;
            }
            const customDefenseIdx = state.customDefenseAdjustments.findIndex((adjustment) => adjustment.adjustmentId === action.payload.adjustmentId && adjustment.type === action.payload.type);
            return Object.assign(Object.assign({}, state), { customDefenseAdjustments: [
                    ...state.customDefenseAdjustments.slice(0, customDefenseIdx),
                    Object.assign({}, action.payload),
                    ...state.customDefenseAdjustments.slice(customDefenseIdx + 1),
                ] });
        case actionTypes.CUSTOM_DEFENSE_ADJUSTMENT_REMOVE_COMMIT:
            if (state.customDefenseAdjustments === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { customDefenseAdjustments: state.customDefenseAdjustments.filter((adjustment) => !(adjustment.type === action.payload.type &&
                    adjustment.adjustmentId === action.payload.adjustmentId)) });
        case actionTypes.FRAME_SET_COMMIT:
            if (state.decorations === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { decorations: Object.assign(Object.assign({}, state.decorations), { frameAvatarId: action.payload.frame.frameAvatarId, frameAvatarUrl: action.payload.frame.frameAvatarUrl, frameAvatarDecorationKey: action.payload.frame.decorationKey }) });
        case actionTypes.THEME_SET_COMMIT:
            if (state.decorations === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { decorations: Object.assign(Object.assign({}, state.decorations), { themeColor: action.payload.themeColor }) });
        case actionTypes.BACKDROP_SET_COMMIT: {
            const { backdropAvatarId, backdropAvatarUrl, largeBackdropAvatarId, largeBackdropAvatarUrl, smallBackdropAvatarId, smallBackdropAvatarUrl, thumbnailBackdropAvatarId, thumbnailBackdropAvatarUrl, } = action.payload.backdrop;
            if (state.decorations === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { decorations: Object.assign(Object.assign({}, state.decorations), { backdropAvatarId,
                    backdropAvatarUrl,
                    largeBackdropAvatarId,
                    largeBackdropAvatarUrl,
                    smallBackdropAvatarId,
                    smallBackdropAvatarUrl,
                    thumbnailBackdropAvatarId,
                    thumbnailBackdropAvatarUrl }) });
        }
        case actionTypes.SPELL_LEVEL_PACT_MAGIC_SLOTS_SET_COMMIT:
            if (state.pactMagic === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { pactMagic: slotEntities(state.pactMagic, action) });
        case actionTypes.SPELL_LEVEL_SPELL_SLOTS_SET_COMMIT:
            if (state.spellSlots === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { spellSlots: slotEntities(state.spellSlots, action) });
        case actionTypes.ACTION_USE_SET_COMMIT: {
            if (state.actions === null) {
                return state;
            }
            const componentDataOriginKey = getComponentDataOriginKey(action.payload.dataOriginType);
            const actionIdx = state.actions[componentDataOriginKey].findIndex((charAction) => ActionAccessors.getId(charAction) === action.payload.id &&
                ActionAccessors.getEntityTypeId(charAction) === action.payload.entityTypeId);
            return Object.assign(Object.assign({}, state), { actions: Object.assign(Object.assign({}, state.actions), { [componentDataOriginKey]: [
                        ...state.actions[componentDataOriginKey].slice(0, actionIdx),
                        characterAction(state.actions[componentDataOriginKey][actionIdx], action),
                        ...state.actions[componentDataOriginKey].slice(actionIdx + 1),
                    ] }) });
        }
        case actionTypes.SPELL_USE_SET_COMMIT: {
            if (state.spells === null) {
                return state;
            }
            const componentDataOriginKey = getComponentDataOriginKey(action.payload.dataOriginType);
            const spellIdx = state.spells[componentDataOriginKey].findIndex((spell) => SpellAccessors.getMappingId(spell) === action.payload.id &&
                SpellAccessors.getMappingEntityTypeId(spell) === action.payload.entityTypeId);
            return Object.assign(Object.assign({}, state), { spells: Object.assign(Object.assign({}, state.spells), { [componentDataOriginKey]: [
                        ...state.spells[componentDataOriginKey].slice(0, spellIdx),
                        spellEntity(state.spells[componentDataOriginKey][spellIdx], action),
                        ...state.spells[componentDataOriginKey].slice(spellIdx + 1),
                    ] }) });
        }
        case actionTypes.CHOICES_SET_COMMIT:
            if (state.choices === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { choices: choiceComponents(state.choices, action) });
        case actionTypes.MODIFIERS_SET_COMMIT:
            if (state.modifiers === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { modifiers: modifierComponents(state.modifiers, action) });
        case actionTypes.ACTIONS_SET_COMMIT:
            if (state.actions === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { actions: actionComponents(state.actions, action) });
        case actionTypes.PACT_MAGIC_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { pactMagic: action.payload.pactMagic });
        case actionTypes.SPELLS_SLOTS_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { spellSlots: action.payload.spellSlots });
        case actionTypes.CHARACTER_SPELLS_SET_COMMIT:
            if (state.spells === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { spells: spellComponents(state.spells, action) });
        case actionTypes.OPTIONS_SET_COMMIT:
            if (state.options === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { options: optionComponents(state.options, action) });
        case actionTypes.CHARACTER_COMPONENTS_SET_COMMIT: {
            let updatedState = Object.assign({}, state);
            if (state.actions !== null) {
                updatedState = Object.assign(Object.assign({}, updatedState), { actions: actionComponents(state.actions, action) });
            }
            if (state.choices !== null) {
                updatedState = Object.assign(Object.assign({}, updatedState), { choices: choiceComponents(state.choices, action) });
            }
            if (state.modifiers !== null) {
                updatedState = Object.assign(Object.assign({}, updatedState), { modifiers: modifierComponents(state.modifiers, action) });
            }
            if (state.options !== null) {
                updatedState = Object.assign(Object.assign({}, updatedState), { options: optionComponents(state.options, action) });
            }
            if (state.spells !== null) {
                updatedState = Object.assign(Object.assign({}, updatedState), { spells: spellComponents(state.spells, action) });
            }
            if (state.classSpells !== null && action.payload.classSpells) {
                updatedState = Object.assign(Object.assign({}, updatedState), { classSpells: [...action.payload.classSpells] });
            }
            return updatedState;
        }
        case actionTypes.VALUE_SET_COMMIT: {
            if (state.characterValues === null) {
                return state;
            }
            // TODO move this to a saga handler that uses an existing lookup to test for presence
            const { typeId, value, notes, valueId, valueTypeId, contextId, contextTypeId } = action.payload;
            const valueInfo = {
                typeId,
                value,
                notes,
                valueId,
                valueTypeId,
                contextId,
                contextTypeId,
            };
            const idx = state.characterValues.findIndex((charValue) => charValue.typeId === typeId &&
                charValue.valueId === valueId &&
                charValue.valueTypeId === valueTypeId &&
                charValue.contextId === contextId &&
                charValue.contextTypeId === contextTypeId);
            if (idx > -1 && value === null && notes === null) {
                return Object.assign(Object.assign({}, state), { characterValues: state.characterValues.filter((charValue, valueIdx) => valueIdx !== idx) });
            }
            let newCharacterValues;
            if (idx > -1) {
                newCharacterValues = [
                    ...state.characterValues.slice(0, idx),
                    valueInfo,
                    ...state.characterValues.slice(idx + 1),
                ];
            }
            else {
                newCharacterValues = [...state.characterValues, valueInfo];
            }
            return Object.assign(Object.assign({}, state), { characterValues: newCharacterValues });
        }
        case actionTypes.VALUE_REMOVE_COMMIT: {
            if (state.characterValues === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { characterValues: state.characterValues.filter((charValue) => !(charValue.typeId === action.payload.typeId &&
                    charValue.valueId === action.payload.valueId &&
                    charValue.valueTypeId === action.payload.valueTypeId &&
                    charValue.contextId === action.payload.contextId &&
                    charValue.contextTypeId === action.payload.contextTypeId)) });
        }
        case actionTypes.ENTITY_VALUES_REMOVE_COMMIT: {
            if (state.characterValues === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { characterValues: state.characterValues.filter((charValue) => !(charValue.valueId === action.payload.valueId &&
                    charValue.valueTypeId === action.payload.valueTypeId &&
                    charValue.contextId === action.payload.contextId &&
                    charValue.contextTypeId === action.payload.contextTypeId)) });
        }
        case actionTypes.CREATURE_ADD_COMMIT:
            if (state.creatures === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { creatures: [...state.creatures, action.payload.creature] });
        case actionTypes.CREATURE_REMOVE_COMMIT:
            if (state.creatures === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { creatures: state.creatures.filter((creature) => action.payload.id !== CreatureAccessors.getMappingId(creature)) });
        case actionTypes.CREATURE_DATA_SET_COMMIT:
        case actionTypes.CREATURE_ACTIVE_SET_COMMIT:
        case actionTypes.CREATURE_HIT_POINTS_SET_COMMIT: {
            if (state.creatures === null) {
                return state;
            }
            const idx = state.creatures.findIndex((creature) => action.payload.id === CreatureAccessors.getMappingId(creature));
            return Object.assign(Object.assign({}, state), { creatures: [
                    ...state.creatures.slice(0, idx),
                    creatureEntity(state.creatures[idx], action),
                    ...state.creatures.slice(idx + 1),
                ] });
        }
        case actionTypes.ABILITY_SCORE_TYPE_SET_COMMIT:
        case actionTypes.SHOW_HELP_TEXT_SET:
        case actionTypes.STARTING_EQUIPMENT_TYPE_SET_COMMIT:
            if (state.configuration === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { configuration: characterConfiguration(state.configuration, action) });
        case actionTypes.ACTIVE_SOURCES_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { campaignSetting: action.payload });
        case actionTypes.PREMADE_INFO_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { premadeInfo: action.payload });
        case actionTypes.PREMADE_INFO_REMOVE_COMMIT:
            return Object.assign(Object.assign({}, state), { premadeInfo: null });
        case actionTypes.STATUS_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { status: action.payload.status });
        case actionTypes.STATUS_SLUG_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { statusSlug: action.payload.statusSlug });
        default:
        // not implemented
    }
    return state;
}
export default character;
