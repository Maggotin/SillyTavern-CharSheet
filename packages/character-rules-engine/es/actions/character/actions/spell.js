import { SpellAccessors } from '../../../engine/Spell';
import * as actionTypes from '../actionTypes';
/**
 *
 * @param spell
 * @param characterClassId
 * @param accept
 * @param reject
 */
export function spellCreate(spell, characterClassId, accept, reject) {
    return {
        type: actionTypes.SPELL_CREATE,
        payload: {
            spell,
            characterClassId,
        },
        meta: {
            accept,
            reject,
        },
    };
}
/**
 *
 * @param spell
 * @param characterClassId
 */
export function spellAdd(spell, characterClassId) {
    return {
        type: actionTypes.SPELL_ADD,
        payload: {
            spell,
            characterClassId,
        },
        meta: {
            commit: {
                type: actionTypes.SPELL_ADD_COMMIT,
            },
        },
    };
}
/**
 *
 * @param spell
 * @param characterClassId
 * @param prepared
 */
export function spellPreparedSet(spell, characterClassId, prepared, accept, reject) {
    return {
        type: actionTypes.SPELL_PREPARED_SET,
        payload: {
            spellId: SpellAccessors.getId(spell),
            characterClassId,
            entityTypeId: SpellAccessors.getMappingEntityTypeId(spell),
            id: SpellAccessors.getMappingId(spell),
            prepared,
        },
        meta: {
            commit: {
                type: actionTypes.SPELL_PREPARED_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}
/**
 *
 * @param spell
 * @param characterClassId
 */
export function spellRemove(spell, characterClassId, accept, reject) {
    const payload = {
        spellId: SpellAccessors.getId(spell),
        characterClassId,
        entityTypeId: SpellAccessors.getMappingEntityTypeId(spell),
        id: SpellAccessors.getMappingId(spell),
    };
    return {
        type: actionTypes.SPELL_REMOVE,
        payload: Object.assign(Object.assign({}, payload), { spell }),
        meta: {
            commit: {
                type: actionTypes.SPELL_REMOVE_COMMIT,
            },
            accept,
            reject,
        },
    };
}
/**
 *
 * @param id
 * @param entityTypeId
 * @param uses
 * @param dataOriginType
 */
export function spellUseSet(id, entityTypeId, uses, dataOriginType) {
    return {
        type: actionTypes.SPELL_USE_SET,
        payload: {
            id,
            entityTypeId,
            uses,
            dataOriginType,
        },
        meta: {
            commit: {
                type: actionTypes.SPELL_USE_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param pactMagic
 */
export function pactMagicSet(pactMagic) {
    return {
        type: actionTypes.PACT_MAGIC_SET,
        payload: {
            pactMagic,
        },
        meta: {
            commit: {
                type: actionTypes.PACT_MAGIC_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param spellSlots
 */
export function spellSlotsSet(spellSlots) {
    return {
        type: actionTypes.SPELLS_SLOTS_SET,
        payload: {
            spellSlots,
        },
        meta: {
            commit: {
                type: actionTypes.SPELLS_SLOTS_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param levels
 */
export function spellLevelSpellSlotsSet(levels) {
    return {
        type: actionTypes.SPELL_LEVEL_SPELL_SLOTS_SET,
        payload: levels,
        meta: {
            commit: {
                type: actionTypes.SPELL_LEVEL_SPELL_SLOTS_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param levels
 */
export function spellLevelPactMagicSlotsSet(levels) {
    return {
        type: actionTypes.SPELL_LEVEL_PACT_MAGIC_SLOTS_SET,
        payload: levels,
        meta: {
            commit: {
                type: actionTypes.SPELL_LEVEL_PACT_MAGIC_SLOTS_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param mappingId
 * @param mappingEntityTypeId
 * @param contextId
 * @param contextTypeId
 */
export function spellCustomizationsDelete(mappingId, mappingEntityTypeId, contextId = null, contextTypeId = null) {
    return {
        type: actionTypes.SPELL_CUSTOMIZATIONS_DELETE,
        payload: {
            mappingId,
            mappingEntityTypeId,
            contextId,
            contextTypeId,
        },
        meta: {},
    };
}
/**
 *
 * @param spells
 */
export function characterSpellsSet(spells) {
    return {
        type: actionTypes.CHARACTER_SPELLS_SET,
        payload: {
            spells,
        },
        meta: {
            commit: {
                type: actionTypes.CHARACTER_SPELLS_SET_COMMIT,
            },
        },
    };
}
