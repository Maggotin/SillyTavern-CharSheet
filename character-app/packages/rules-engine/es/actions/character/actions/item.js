import * as actionTypes from '../actionTypes';
/**
 *
 * @param item
 * @param quantity
 * @param accept
 * @param reject
 * @param containerDefinitionKey
 */
export function itemCreate(item, quantity, accept, reject, containerDefinitionKey) {
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
export function customItemCreate(name, description = null, cost = null, quantity = null, weight = null, notes = null, containerDefinitionKey, partyId = null, accept, reject) {
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
/**
 *
 * @param id
 * @param mappingId
 * @param partyId
 * @param accept
 * @param reject
 */
export function customItemDestroy(id, mappingId, partyId = null, accept, reject) {
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
/**
 *
 * @param item
 */
export function customItemAdd(item) {
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
/**
 *
 * @param id
 */
export function customItemRemove(id) {
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
/**
 *
 * @param id
 * @param properties
 * @param mappingId
 * @param partyId
 * @param accept
 * @param reject
 */
export function customItemSet(id, properties, mappingId, partyId = null, accept, reject) {
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
/**
 *
 * @param item
 */
export function itemAdd(item) {
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
/**
 *
 * @param id
 * @param removeContainerContents
 */
export function itemRemove(id, removeContainerContents) {
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
/**
 *
 * @param id
 * @param removeContainerContents
 */
export function itemDestroy(id, removeContainerContents, accept, reject) {
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
/**
 *
 * @param id
 * @param value
 */
export function itemEquippedSet(id, value, equippedEntityId, equippedEntityTypeId, accept, reject) {
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
/**
 *
 * @param id
 * @param value
 * @param accept
 * @param reject
 */
export function itemAttuneSet(id, value, accept, reject) {
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
/**
 *
 * @param id
 * @param containerEntityId
 * @param containerEntityTypeId
 * @param accept
 * @param reject
 */
export function itemMoveSet(id, containerEntityId, containerEntityTypeId, accept, reject) {
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
/**
 *
 * @param id
 * @param quantity
 * @param containerEntityId
 * @param containerEntityTypeId
 */
export function itemQuantitySet(id, quantity, accept, reject) {
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
/**
 *
 * @param id
 * @param uses
 * @param accept
 * @param reject
 */
export function itemChargesSet(id, uses, accept, reject) {
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
/**
 *
 * @param mappingId
 * @param mappingEntityTypeId
 * @param partyId
 * @param accept
 * @param reject
 */
export function itemCustomizationsDelete(mappingId, mappingEntityTypeId, partyId, accept, reject) {
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
/**
 *
 * @param currencies
 * @param destinationEntityTypeId
 * @param destinationEntityId
 * @param accept
 * @param reject
 */
export function itemCurrencySet(currency, id, accept, reject) {
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
/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function itemCurrencyCopperSet(amount, destinationEntityTypeId, destinationEntityId) {
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
/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function itemCurrencySilverSet(amount, destinationEntityTypeId, destinationEntityId) {
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
/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function itemCurrencyElectrumSet(amount, destinationEntityTypeId, destinationEntityId) {
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
/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function itemCurrencyGoldSet(amount, destinationEntityTypeId, destinationEntityId) {
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
/**
 *
 * @param amount
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function itemCurrencyPlatinumSet(amount, destinationEntityTypeId, destinationEntityId) {
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
