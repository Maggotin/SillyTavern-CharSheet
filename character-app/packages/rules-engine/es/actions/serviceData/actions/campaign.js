import * as actionTypes from '../actionTypes';
/**
 *
 * @param item
 */
export function partyItemAdd(item) {
    return {
        type: actionTypes.PARTY_ITEM_ADD,
        payload: {
            item,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_ITEM_ADD_COMMIT,
            },
        },
    };
}
export function partyItemEquippedSet(id, value, equippedEntityId, equippedEntityTypeId, accept, reject) {
    return {
        type: actionTypes.PARTY_ITEM_EQUIPPED_SET,
        payload: {
            id,
            value,
            equippedEntityId,
            equippedEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_ITEM_EQUIPPED_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}
export function partyItemAttuneSet(id, value, accept, reject) {
    return {
        type: actionTypes.PARTY_ITEM_ATTUNE_SET,
        payload: {
            id,
            value,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_ITEM_ATTUNE_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}
export function partyItemQuantitySet(id, quantity, accept, reject) {
    return {
        type: actionTypes.PARTY_ITEM_QUANTITY_SET,
        payload: {
            id,
            quantity,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_ITEM_QUANTITY_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}
export function partyItemChargesSet(id, uses, accept, reject) {
    return {
        type: actionTypes.PARTY_ITEM_CHARGES_SET,
        payload: {
            id,
            uses,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_ITEM_CHARGES_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}
/**
 *
 * @param id
 */
export function partyItemRemove(id, removeContainerContents) {
    return {
        type: actionTypes.PARTY_ITEM_REMOVE,
        payload: {
            id,
            removeContainerContents,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_ITEM_REMOVE_COMMIT,
            },
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
export function partyItemMoveSet(id, containerEntityId, containerEntityTypeId, accept, reject) {
    return {
        type: actionTypes.PARTY_ITEM_MOVE_SET,
        payload: {
            id,
            containerEntityId,
            containerEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_ITEM_MOVE_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}
/**
 *
 */
export function partyInventoryRequest() {
    return {
        type: actionTypes.PARTY_INVENTORY_REQUEST,
        payload: null,
        meta: {},
    };
}
/**
 * @param campaignInfo
 */
export function partyCampaignInfoSet(campaignInfo) {
    return {
        type: actionTypes.PARTY_CAMPAIGN_INFO_SET,
        payload: campaignInfo,
        meta: {},
    };
}
/**
 *
 * @param currencies
 * @param destinationEntityTypeId
 * @param destinationEntityId
 */
export function partyCurrenciesSet(currencies, destinationEntityTypeId, destinationEntityId, accept, reject) {
    return {
        type: actionTypes.PARTY_CURRENCIES_SET,
        payload: Object.assign(Object.assign({}, currencies), { destinationEntityTypeId,
            destinationEntityId }),
        meta: {
            commit: {
                type: actionTypes.PARTY_CURRENCIES_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}
/**
 *
 * @param transactionPayload
 * @param accept
 * @param reject
 */
export function partyCurrencyTransactionSet(transactionPayload, accept, reject) {
    return {
        type: actionTypes.PARTY_CURRENCY_TRANSACTION_SET,
        payload: Object.assign({}, transactionPayload),
        meta: {
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
export function partyCurrencyCopperSet(amount, destinationEntityTypeId, destinationEntityId, accept, reject) {
    return {
        type: actionTypes.PARTY_CURRENCY_COPPER_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_CURRENCY_COPPER_SET_COMMIT,
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
export function partyCurrencyElectrumSet(amount, destinationEntityTypeId, destinationEntityId, accept, reject) {
    return {
        type: actionTypes.PARTY_CURRENCY_ELECTRUM_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_CURRENCY_ELECTRUM_SET_COMMIT,
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
export function partyCurrencyGoldSet(amount, destinationEntityTypeId, destinationEntityId, accept, reject) {
    return {
        type: actionTypes.PARTY_CURRENCY_GOLD_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_CURRENCY_GOLD_SET_COMMIT,
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
export function partyCurrencyPlatinumSet(amount, destinationEntityTypeId, destinationEntityId, accept, reject) {
    return {
        type: actionTypes.PARTY_CURRENCY_PLATINUM_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_CURRENCY_PLATINUM_SET_COMMIT,
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
export function partyCurrencySilverSet(amount, destinationEntityTypeId, destinationEntityId, accept, reject) {
    return {
        type: actionTypes.PARTY_CURRENCY_SILVER_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_CURRENCY_SILVER_SET_COMMIT,
            },
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
export function partyItemCurrencySet(currency, id, accept, reject) {
    return {
        type: actionTypes.PARTY_ITEM_CURRENCY_SET,
        payload: {
            currency,
            id,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_ITEM_CURRENCY_SET_COMMIT,
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
export function partyItemCurrencyCopperSet(amount, destinationEntityTypeId, destinationEntityId, accept, reject) {
    return {
        type: actionTypes.PARTY_ITEM_CURRENCY_COPPER_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_ITEM_CURRENCY_COPPER_SET_COMMIT,
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
export function partyItemCurrencySilverSet(amount, destinationEntityTypeId, destinationEntityId, accept, reject) {
    return {
        type: actionTypes.PARTY_ITEM_CURRENCY_SILVER_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_ITEM_CURRENCY_SILVER_SET_COMMIT,
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
export function partyItemCurrencyElectrumSet(amount, destinationEntityTypeId, destinationEntityId, accept, reject) {
    return {
        type: actionTypes.PARTY_ITEM_CURRENCY_ELECTRUM_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_ITEM_CURRENCY_ELECTRUM_SET_COMMIT,
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
export function partyItemCurrencyGoldSet(amount, destinationEntityTypeId, destinationEntityId, accept, reject) {
    return {
        type: actionTypes.PARTY_ITEM_CURRENCY_GOLD_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_ITEM_CURRENCY_GOLD_SET_COMMIT,
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
export function partyItemCurrencyPlatinumSet(amount, destinationEntityTypeId, destinationEntityId, accept, reject) {
    return {
        type: actionTypes.PARTY_ITEM_CURRENCY_PLATINUM_SET,
        payload: {
            amount,
            destinationEntityId,
            destinationEntityTypeId,
        },
        meta: {
            commit: {
                type: actionTypes.PARTY_ITEM_CURRENCY_PLATINUM_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}
