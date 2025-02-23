import * as actionTypes from '../actionTypes/item';

interface ItemCreateAction {
    type: typeof actionTypes.ITEM_CREATE;
    payload: {
        item: unknown;
        quantity: unknown;
        containerDefinitionKey: unknown;
    };
    meta: {
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param item
 * @param quantity
 * @param accept
 * @param reject
 * @param containerDefinitionKey
 */
export function itemCreate(
    item: unknown,
    quantity: unknown,
    accept: unknown,
    reject: unknown,
    containerDefinitionKey: unknown
): ItemCreateAction {
    return {
        type: actionTypes.ITEM_CREATE,
        payload: {
            item,
            quantity,
            containerDefinitionKey,
        },
        meta: {
            accept,
            reject,
        },
    };
}

interface CustomItemCreateAction {
    type: typeof actionTypes.CUSTOM_ITEM_CREATE;
    payload: {
        name: unknown;
        description: unknown | null;
        cost: unknown | null;
        quantity: unknown | null;
        weight: unknown | null;
        notes: unknown | null;
        containerDefinitionKey: unknown;
        partyId: unknown | null;
    };
    meta: {
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param name
 * @param description
 * @param cost
 * @param quantity
 * @param weight
 * @param notes
 * @param containerDefinitionKey
 * @param partyId
 * @param accept
 * @param reject
 */
export function customItemCreate(
    name: unknown,
    description: unknown | null = null,
    cost: unknown | null = null,
    quantity: unknown | null = null,
    weight: unknown | null = null,
    notes: unknown | null = null,
    containerDefinitionKey: unknown,
    partyId: unknown | null = null,
    accept: unknown,
    reject: unknown
): CustomItemCreateAction {
    return {
        type: actionTypes.CUSTOM_ITEM_CREATE,
        payload: {
            name,
            description,
            cost,
            quantity,
            weight,
            notes,
            containerDefinitionKey,
            partyId,
        },
        meta: {
            accept,
            reject,
        },
    };
}

interface CustomItemDestroyAction {
    type: typeof actionTypes.CUSTOM_ITEM_DESTROY;
    payload: {
        id: unknown;
        mappingId: unknown;
        partyId: unknown | null;
    };
    meta: {
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param id
 * @param mappingId
 * @param partyId
 * @param accept
 * @param reject
 */
export function customItemDestroy(
    id: unknown,
    mappingId: unknown,
    partyId: unknown | null = null,
    accept: unknown,
    reject: unknown
): CustomItemDestroyAction {
    return {
        type: actionTypes.CUSTOM_ITEM_DESTROY,
        payload: {
            id,
            mappingId,
            partyId,
        },
        meta: {
            accept,
            reject,
        },
    };
}

interface CustomItemAddAction {
    type: typeof actionTypes.CUSTOM_ITEM_ADD;
    payload: {
        item: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CUSTOM_ITEM_ADD_COMMIT;
        };
    };
}

/**
 *
 * @param item
 */
export function customItemAdd(item: unknown): CustomItemAddAction {
    return {
        type: actionTypes.CUSTOM_ITEM_ADD,
        payload: {
            item,
        },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_ITEM_ADD_COMMIT,
            },
        },
    };
}

interface CustomItemRemoveAction {
    type: typeof actionTypes.CUSTOM_ITEM_REMOVE;
    payload: {
        id: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CUSTOM_ITEM_REMOVE_COMMIT;
        };
    };
}

/**
 *
 * @param id
 */
export function customItemRemove(id: unknown): CustomItemRemoveAction {
    return {
        type: actionTypes.CUSTOM_ITEM_REMOVE,
        payload: {
            id,
        },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_ITEM_REMOVE_COMMIT,
            },
        },
    };
}

interface CustomItemSetAction {
    type: typeof actionTypes.CUSTOM_ITEM_SET;
    payload: {
        id: unknown;
        properties: unknown;
        mappingId: unknown;
        partyId: unknown | null;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CUSTOM_ITEM_SET_COMMIT;
        };
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param id
 * @param properties
 * @param mappingId
 * @param partyId
 * @param accept
 * @param reject
 */
export function customItemSet(
    id: unknown,
    properties: unknown,
    mappingId: unknown,
    partyId: unknown | null = null,
    accept: unknown,
    reject: unknown
): CustomItemSetAction {
    return {
        type: actionTypes.CUSTOM_ITEM_SET,
        payload: {
            id,
            properties,
            mappingId,
            partyId,
        },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_ITEM_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}

interface ItemAddAction {
    type: typeof actionTypes.ITEM_ADD;
    payload: {
        item: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ITEM_ADD_COMMIT;
        };
    };
}

/**
 *
 * @param item
 */
export function itemAdd(item: unknown): ItemAddAction {
    return {
        type: actionTypes.ITEM_ADD,
        payload: {
            item,
        },
        meta: {
            commit: {
                type: actionTypes.ITEM_ADD_COMMIT,
            },
        },
    };
}

interface ItemRemoveAction {
    type: typeof actionTypes.ITEM_REMOVE;
    payload: {
        id: unknown;
        removeContainerContents: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ITEM_REMOVE_COMMIT;
        };
    };
}

/**
 *
 * @param id
 * @param removeContainerContents
 */
export function itemRemove(id: unknown, removeContainerContents: unknown): ItemRemoveAction {
    return {
        type: actionTypes.ITEM_REMOVE,
        payload: {
            id,
            removeContainerContents,
        },
        meta: {
            commit: {
                type: actionTypes.ITEM_REMOVE_COMMIT,
            },
        },
    };
}

interface ItemDestroyAction {
    type: typeof actionTypes.ITEM_DESTROY;
    payload: {
        id: unknown;
        removeContainerContents: unknown;
    };
    meta: {
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param id
 * @param removeContainerContents
 */
export function itemDestroy(
    id: unknown,
    removeContainerContents: unknown,
    accept: unknown,
    reject: unknown
): ItemDestroyAction {
    return {
        type: actionTypes.ITEM_DESTROY,
        payload: {
            id,
            removeContainerContents,
        },
        meta: {
            accept,
            reject,
        },
    };
}

interface ItemEquippedSetAction {
    type: typeof actionTypes.ITEM_EQUIPPED_SET;
    payload: {
        id: unknown;
        value: unknown;
        equippedEntityId: unknown;
        equippedEntityTypeId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ITEM_EQUIPPED_SET_COMMIT;
        };
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param id
 * @param value
 */
export function itemEquippedSet(
    id: unknown,
    value: unknown,
    equippedEntityId: unknown,
    equippedEntityTypeId: unknown,
    accept: unknown,
    reject: unknown
): ItemEquippedSetAction {
    return {
        type: actionTypes.ITEM_EQUIPPED_SET,
        payload: {
            id,
            value,
            equippedEntityId,
            equippedEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.ITEM_EQUIPPED_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}

interface ItemAttuneSetAction {
    type: typeof actionTypes.ITEM_ATTUNE_SET;
    payload: {
        id: unknown;
        value: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ITEM_ATTUNE_SET_COMMIT;
        };
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param id
 * @param value
 * @param accept
 * @param reject
 */
export function itemAttuneSet(
    id: unknown,
    value: unknown,
    accept: unknown,
    reject: unknown
): ItemAttuneSetAction {
    return {
        type: actionTypes.ITEM_ATTUNE_SET,
        payload: {
            id,
            value,
        },
        meta: {
            commit: {
                type: actionTypes.ITEM_ATTUNE_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}

interface ItemMoveSetAction {
    type: typeof actionTypes.ITEM_MOVE_SET;
    payload: {
        id: unknown;
        containerEntityId: unknown;
        containerEntityTypeId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ITEM_MOVE_SET_COMMIT;
        };
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param id
 * @param containerEntityId
 * @param containerEntityTypeId
 * @param accept
 * @param reject
 */
export function itemMoveSet(
    id: unknown,
    containerEntityId: unknown,
    containerEntityTypeId: unknown,
    accept: unknown,
    reject: unknown
): ItemMoveSetAction {
    return {
        type: actionTypes.ITEM_MOVE_SET,
        payload: {
            id,
            containerEntityId,
            containerEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.ITEM_MOVE_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}

interface ItemQuantitySetAction {
    type: typeof actionTypes.ITEM_QUANTITY_SET;
    payload: {
        id: unknown;
        quantity: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ITEM_QUANTITY_SET_COMMIT;
        };
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param id
 * @param quantity
 * @param containerEntityId
 * @param containerEntityTypeId
 */
export function itemQuantitySet(
    id: unknown,
    quantity: unknown,
    accept: unknown,
    reject: unknown
): ItemQuantitySetAction {
    return {
        type: actionTypes.ITEM_QUANTITY_SET,
        payload: {
            id,
            quantity,
        },
        meta: {
            commit: {
                type: actionTypes.ITEM_QUANTITY_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}

interface ItemChargesSetAction {
    type: typeof actionTypes.ITEM_CHARGES_SET;
    payload: {
        id: unknown;
        uses: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ITEM_CHARGES_SET_COMMIT;
        };
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param id
 * @param uses
 * @param accept
 * @param reject
 */
export function itemChargesSet(
    id: unknown,
    uses: unknown,
    accept: unknown,
    reject: unknown
): ItemChargesSetAction {
    return {
        type: actionTypes.ITEM_CHARGES_SET,
        payload: {
            id,
            uses,
        },
        meta: {
            commit: {
                type: actionTypes.ITEM_CHARGES_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}

interface ItemCustomizationsDeleteAction {
    type: typeof actionTypes.ITEM_CUSTOMIZATIONS_DELETE;
    payload: {
        mappingId: unknown;
        mappingEntityTypeId: unknown;
        partyId: unknown;
    };
    meta: {
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param mappingId
 * @param mappingEntityTypeId
 * @param partyId
 * @param accept
 * @param reject
 */
export function itemCustomizationsDelete(
    mappingId: unknown,
    mappingEntityTypeId: unknown,
    partyId: unknown,
    accept: unknown,
    reject: unknown
): ItemCustomizationsDeleteAction {
    return {
        type: actionTypes.ITEM_CUSTOMIZATIONS_DELETE,
        payload: {
            mappingId,
            mappingEntityTypeId,
            partyId,
        },
        meta: {
            accept,
            reject,
        },
    };
}

interface ItemCurrencySetAction {
    type: typeof actionTypes.ITEM_CURRENCY_SET;
    payload: {
        currency: unknown;
        id: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ITEM_CURRENCY_SET_COMMIT;
        };
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param currencies
 * @param destinationEntityTypeId
 * @param destinationEntityId
 * @param accept
 * @param reject
 */
export function itemCurrencySet(
    currency: unknown,
    id: unknown,
    accept: unknown,
    reject: unknown
): ItemCurrencySetAction {
    return {
        type: actionTypes.ITEM_CURRENCY_SET,
        payload: {
            currency,
            id,
        },
        meta: {
            commit: {
                type: actionTypes.ITEM_CURRENCY_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}

interface ItemCurrencyCopperSetAction {
    type: typeof actionTypes.ITEM_CURRENCY_COPPER_SET;
    payload: {
        amount: unknown;
        destinationEntityTypeId: unknown;
        destinationEntityId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ITEM_CURRENCY_COPPER_SET_COMMIT;
        };
    };
}

/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function itemCurrencyCopperSet(
    amount: unknown,
    destinationEntityTypeId: unknown,
    destinationEntityId: unknown
): ItemCurrencyCopperSetAction {
    return {
        type: actionTypes.ITEM_CURRENCY_COPPER_SET,
        payload: {
            amount,
            destinationEntityTypeId,
            destinationEntityId,
        },
        meta: {
            commit: {
                type: actionTypes.ITEM_CURRENCY_COPPER_SET_COMMIT,
            },
        },
    };
}

interface ItemCurrencySilverSetAction {
    type: typeof actionTypes.ITEM_CURRENCY_SILVER_SET;
    payload: {
        amount: unknown;
        destinationEntityTypeId: unknown;
        destinationEntityId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ITEM_CURRENCY_SILVER_SET_COMMIT;
        };
    };
}

/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function itemCurrencySilverSet(
    amount: unknown,
    destinationEntityTypeId: unknown,
    destinationEntityId: unknown
): ItemCurrencySilverSetAction {
    return {
        type: actionTypes.ITEM_CURRENCY_SILVER_SET,
        payload: {
            amount,
            destinationEntityTypeId,
            destinationEntityId,
        },
        meta: {
            commit: {
                type: actionTypes.ITEM_CURRENCY_SILVER_SET_COMMIT,
            },
        },
    };
}

interface ItemCurrencyElectrumSetAction {
    type: typeof actionTypes.ITEM_CURRENCY_ELECTRUM_SET;
    payload: {
        amount: unknown;
        destinationEntityTypeId: unknown;
        destinationEntityId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ITEM_CURRENCY_ELECTRUM_SET_COMMIT;
        };
    };
}

/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function itemCurrencyElectrumSet(
    amount: unknown,
    destinationEntityTypeId: unknown,
    destinationEntityId: unknown
): ItemCurrencyElectrumSetAction {
    return {
        type: actionTypes.ITEM_CURRENCY_ELECTRUM_SET,
        payload: {
            amount,
            destinationEntityTypeId,
            destinationEntityId,
        },
        meta: {
            commit: {
                type: actionTypes.ITEM_CURRENCY_ELECTRUM_SET_COMMIT,
            },
        },
    };
}

interface ItemCurrencyGoldSetAction {
    type: typeof actionTypes.ITEM_CURRENCY_GOLD_SET;
    payload: {
        amount: unknown;
        destinationEntityTypeId: unknown;
        destinationEntityId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ITEM_CURRENCY_GOLD_SET_COMMIT;
        };
    };
}

/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function itemCurrencyGoldSet(
    amount: unknown,
    destinationEntityTypeId: unknown,
    destinationEntityId: unknown
): ItemCurrencyGoldSetAction {
    return {
        type: actionTypes.ITEM_CURRENCY_GOLD_SET,
        payload: {
            amount,
            destinationEntityTypeId,
            destinationEntityId,
        },
        meta: {
            commit: {
                type: actionTypes.ITEM_CURRENCY_GOLD_SET_COMMIT,
            },
        },
    };
}

interface ItemCurrencyPlatinumSetAction {
    type: typeof actionTypes.ITEM_CURRENCY_PLATINUM_SET;
    payload: {
        amount: unknown;
        destinationEntityTypeId: unknown;
        destinationEntityId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ITEM_CURRENCY_PLATINUM_SET_COMMIT;
        };
    };
}

/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function itemCurrencyPlatinumSet(
    amount: unknown,
    destinationEntityTypeId: unknown,
    destinationEntityId: unknown
): ItemCurrencyPlatinumSetAction {
    return {
        type: actionTypes.ITEM_CURRENCY_PLATINUM_SET,
        payload: {
            amount,
            destinationEntityTypeId,
            destinationEntityId,
        },
        meta: {
            commit: {
                type: actionTypes.ITEM_CURRENCY_PLATINUM_SET_COMMIT,
            },
        },
    };
}