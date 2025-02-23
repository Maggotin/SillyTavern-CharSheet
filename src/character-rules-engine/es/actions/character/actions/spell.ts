import { SpellAccessors } from '../../../engine/Spell';
import * as actionTypes from '../actionTypes/spell';

interface Spell {
    // Define the structure of spell here
    // For now, we'll use Record<string, unknown>
}

interface SpellCreateAction {
    type: typeof actionTypes.SPELL_CREATE;
    payload: {
        spell: Spell;
        characterClassId: unknown;
    };
    meta: {
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param spell
 * @param characterClassId
 * @param accept
 * @param reject
 */
export function spellCreate(
    spell: Spell,
    characterClassId: unknown,
    accept: unknown,
    reject: unknown
): SpellCreateAction {
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

interface SpellAddAction {
    type: typeof actionTypes.SPELL_ADD;
    payload: {
        spell: Spell;
        characterClassId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.SPELL_ADD_COMMIT;
        };
    };
}

/**
 *
 * @param spell
 * @param characterClassId
 */
export function spellAdd(spell: Spell, characterClassId: unknown): SpellAddAction {
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

interface SpellPreparedSetAction {
    type: typeof actionTypes.SPELL_PREPARED_SET;
    payload: {
        spellId: unknown;
        characterClassId: unknown;
        entityTypeId: unknown;
        id: unknown;
        prepared: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.SPELL_PREPARED_SET_COMMIT;
        };
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param spell
 * @param characterClassId
 * @param prepared
 */
export function spellPreparedSet(
    spell: Spell,
    characterClassId: unknown,
    prepared: unknown,
    accept: unknown,
    reject: unknown
): SpellPreparedSetAction {
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

interface SpellRemoveAction {
    type: typeof actionTypes.SPELL_REMOVE;
    payload: {
        spellId: unknown;
        characterClassId: unknown;
        entityTypeId: unknown;
        id: unknown;
        spell: Spell;
    };
    meta: {
        commit: {
            type: typeof actionTypes.SPELL_REMOVE_COMMIT;
        };
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param spell
 * @param characterClassId
 */
export function spellRemove(
    spell: Spell,
    characterClassId: unknown,
    accept: unknown,
    reject: unknown
): SpellRemoveAction {
    const payload = {
        spellId: SpellAccessors.getId(spell),
        characterClassId,
        entityTypeId: SpellAccessors.getMappingEntityTypeId(spell),
        id: SpellAccessors.getMappingId(spell),
    };
    return {
        type: actionTypes.SPELL_REMOVE,
        payload: { ...payload, spell },
        meta: {
            commit: {
                type: actionTypes.SPELL_REMOVE_COMMIT,
            },
            accept,
            reject,
        },
    };
}

interface SpellUseSetAction {
    type: typeof actionTypes.SPELL_USE_SET;
    payload: {
        id: unknown;
        entityTypeId: unknown;
        uses: unknown;
        dataOriginType: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.SPELL_USE_SET_COMMIT;
        };
    };
}

/**
 *
 * @param id
 * @param entityTypeId
 * @param uses
 * @param dataOriginType
 */
export function spellUseSet(
    id: unknown,
    entityTypeId: unknown,
    uses: unknown,
    dataOriginType: unknown
): SpellUseSetAction {
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

interface PactMagicSetAction {
    type: typeof actionTypes.PACT_MAGIC_SET;
    payload: {
        pactMagic: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.PACT_MAGIC_SET_COMMIT;
        };
    };
}

/**
 *
 * @param pactMagic
 */
export function pactMagicSet(pactMagic: unknown): PactMagicSetAction {
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

interface SpellSlotsSetAction {
    type: typeof actionTypes.SPELLS_SLOTS_SET;
    payload: {
        spellSlots: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.SPELLS_SLOTS_SET_COMMIT;
        };
    };
}

/**
 *
 * @param spellSlots
 */
export function spellSlotsSet(spellSlots: unknown): SpellSlotsSetAction {
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

interface SpellLevelSpellSlotsSetAction {
    type: typeof actionTypes.SPELL_LEVEL_SPELL_SLOTS_SET;
    payload: unknown;
    meta: {
        commit: {
            type: typeof actionTypes.SPELL_LEVEL_SPELL_SLOTS_SET_COMMIT;
        };
    };
}

/**
 *
 * @param levels
 */
export function spellLevelSpellSlotsSet(levels: unknown): SpellLevelSpellSlotsSetAction {
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

interface SpellLevelPactMagicSlotsSetAction {
    type: typeof actionTypes.SPELL_LEVEL_PACT_MAGIC_SLOTS_SET;
    payload: unknown;
    meta: {
        commit: {
            type: typeof actionTypes.SPELL_LEVEL_PACT_MAGIC_SLOTS_SET_COMMIT;
        };
    };
}

/**
 *
 * @param levels
 */
export function spellLevelPactMagicSlotsSet(levels: unknown): SpellLevelPactMagicSlotsSetAction {
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

interface SpellCustomizationsDeleteAction {
    type: typeof actionTypes.SPELL_CUSTOMIZATIONS_DELETE;
    payload: {
        mappingId: unknown;
        mappingEntityTypeId: unknown;
        contextId: unknown | null;
        contextTypeId: unknown | null;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param mappingId
 * @param mappingEntityTypeId
 * @param contextId
 * @param contextTypeId
 */
export function spellCustomizationsDelete(
    mappingId: unknown,
    mappingEntityTypeId: unknown,
    contextId: unknown | null = null,
    contextTypeId: unknown | null = null
): SpellCustomizationsDeleteAction {
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

interface CharacterSpellsSetAction {
    type: typeof actionTypes.CHARACTER_SPELLS_SET;
    payload: {
        spells: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CHARACTER_SPELLS_SET_COMMIT;
        };
    };
}

/**
 *
 * @param spells
 */
export function characterSpellsSet(spells: unknown): CharacterSpellsSetAction {
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