import { characterActions, serviceDataActions } from '../actions';
import { ConfigUtils } from '../config';
import { rulesEngineConfig } from '../config/utils';
import { ContainerAccessors } from '../engine/Container';
import { CoreUtils, CURRENCY_VALUE } from '../engine/Core';
import { DefinitionHacks } from '../engine/Definition';
import { FormatUtils } from '../engine/Format';
import { HelperUtils } from '../engine/Helper';
import { NotificationTypeEnum } from '../notification';
import { rulesEngineSelectors } from '../selectors';
import { InventoryManager } from './InventoryManager';
export class CoinManager extends InventoryManager {
    constructor(params) {
        super(params);
        //Coin Action Handlers
        this.handleTransaction = ({ coin, containerDefinitionKey, multiplier }, onSuccess, onError) => {
            var _a, _b;
            const adjustedCurrency = CoreUtils.getCurrencyTransactionAdjustment(multiplier, coin);
            const containerLookup = rulesEngineSelectors.getContainerLookup(this.state);
            const container = HelperUtils.lookupDataOrFallback(containerLookup, containerDefinitionKey);
            const isEmpty = Object.keys(coin).length === 0;
            if (!isEmpty && container) {
                const destinationEntityTypeId = ContainerAccessors.getContainerType(container);
                const destinationEntityId = ContainerAccessors.getMappingId(container);
                const currentCoins = this.getContainerCoin(containerDefinitionKey);
                if (multiplier === 1) {
                    const validAddCoin = this.calculateAddCoinPayload(currentCoins, coin.cp || 0, coin.ep || 0, coin.gp || 0, coin.pp || 0, coin.sp || 0);
                    if (!validAddCoin) {
                        (_a = rulesEngineConfig === null || rulesEngineConfig === void 0 ? void 0 : rulesEngineConfig.onNotification) === null || _a === void 0 ? void 0 : _a.call(rulesEngineConfig, 'Failed to add coins', `The max amount allowed for each currency type is ${FormatUtils.renderLocaleNumber(CURRENCY_VALUE.MAX)}`, NotificationTypeEnum.ERROR);
                        return;
                    }
                }
                else {
                    const validRemoveCoin = this.calculateRemoveCoinPayload(currentCoins, coin.cp || 0, coin.ep || 0, coin.gp || 0, coin.pp || 0, coin.sp || 0);
                    if (!validRemoveCoin) {
                        (_b = rulesEngineConfig === null || rulesEngineConfig === void 0 ? void 0 : rulesEngineConfig.onNotification) === null || _b === void 0 ? void 0 : _b.call(rulesEngineConfig, 'Failed to remove coins', `The min amount allowed for each currency type is ${FormatUtils.renderLocaleNumber(CURRENCY_VALUE.MIN)}`, NotificationTypeEnum.ERROR);
                        return;
                    }
                }
                this.dispatch(characterActions.currencyTransactionSet(Object.assign(Object.assign({}, adjustedCurrency), { destinationEntityId: destinationEntityId, destinationEntityTypeId: destinationEntityTypeId }), () => {
                    typeof onSuccess === 'function' && onSuccess();
                }, () => {
                    typeof onError === 'function' && onError();
                }));
            }
        };
        this.handleCoinSet = ({ coin, containerDefinitionKey }, onSuccess, onError) => {
            const destinationEntityId = DefinitionHacks.hack__getDefinitionKeyId(containerDefinitionKey);
            const destinationEntityTypeId = DefinitionHacks.hack__getDefinitionKeyType(containerDefinitionKey);
            if (destinationEntityId && destinationEntityTypeId) {
                if (containerDefinitionKey === this.getCharacterContainerDefinitionKey()) {
                    this.dispatch(characterActions.currenciesSet(coin, destinationEntityTypeId, destinationEntityId));
                }
                else if (containerDefinitionKey === this.getPartyEquipmentContainerDefinitionKey()) {
                    this.dispatch(serviceDataActions.partyCurrenciesSet(coin, destinationEntityTypeId, destinationEntityId, () => {
                        typeof onSuccess === 'function' && onSuccess();
                        const data = {};
                        const eventType = this.EVENT_TYPES.ITEM_SHARED_FULFILLED;
                        this.sendMessage({ data, eventType });
                    }));
                }
            }
        };
        this.handleAmountSet = ({ key, amount, containerDefinitionKey }, onSuccess, onError) => {
            switch (key) {
                case 'pp':
                    this.handlePlatinumSet({ amount, containerDefinitionKey }, onSuccess, onError);
                    break;
                case 'gp':
                    this.handleGoldSet({ amount, containerDefinitionKey }, onSuccess, onError);
                    break;
                case 'sp':
                    this.handleSilverSet({ amount, containerDefinitionKey }, onSuccess, onError);
                    break;
                case 'ep':
                    this.handleElectrumSet({ amount, containerDefinitionKey }, onSuccess, onError);
                    break;
                case 'cp':
                    this.handleCopperSet({ amount, containerDefinitionKey }, onSuccess, onError);
                    break;
                default:
                //not implemented
            }
        };
        this.handlePlatinumSet = ({ amount, containerDefinitionKey }, onSuccess, onError) => {
            const destinationEntityId = DefinitionHacks.hack__getDefinitionKeyId(containerDefinitionKey);
            const destinationEntityTypeId = DefinitionHacks.hack__getDefinitionKeyType(containerDefinitionKey);
            if (destinationEntityId && destinationEntityTypeId) {
                if (containerDefinitionKey === this.getCharacterContainerDefinitionKey()) {
                    this.dispatch(characterActions.currencyPlatinumSet(amount, destinationEntityTypeId, destinationEntityId));
                }
                else if (containerDefinitionKey === this.getPartyEquipmentContainerDefinitionKey()) {
                    this.dispatch(serviceDataActions.partyCurrencyPlatinumSet(amount, destinationEntityTypeId, destinationEntityId, () => {
                        typeof onSuccess === 'function' && onSuccess();
                        const data = {};
                        const eventType = this.EVENT_TYPES.ITEM_SHARED_FULFILLED;
                        this.sendMessage({ data, eventType });
                    }));
                }
                else {
                    const isShared = this.isSharedContainerDefinitionKey(containerDefinitionKey);
                    if (isShared) {
                        this.dispatch(serviceDataActions.partyItemCurrencyPlatinumSet(amount, destinationEntityTypeId, destinationEntityId, () => {
                            typeof onSuccess === 'function' && onSuccess();
                            const data = {};
                            const eventType = this.EVENT_TYPES.ITEM_SHARED_FULFILLED;
                            this.sendMessage({ data, eventType });
                        }));
                    }
                    else {
                        this.dispatch(characterActions.itemCurrencyPlatinumSet(amount, destinationEntityTypeId, destinationEntityId));
                    }
                }
            }
        };
        this.handleGoldSet = ({ amount, containerDefinitionKey }, onSuccess, onError) => {
            const destinationEntityId = DefinitionHacks.hack__getDefinitionKeyId(containerDefinitionKey);
            const destinationEntityTypeId = DefinitionHacks.hack__getDefinitionKeyType(containerDefinitionKey);
            if (destinationEntityId && destinationEntityTypeId) {
                if (containerDefinitionKey === this.getCharacterContainerDefinitionKey()) {
                    this.dispatch(characterActions.currencyGoldSet(amount, destinationEntityTypeId, destinationEntityId));
                }
                else if (containerDefinitionKey === this.getPartyEquipmentContainerDefinitionKey()) {
                    this.dispatch(serviceDataActions.partyCurrencyGoldSet(amount, destinationEntityTypeId, destinationEntityId, () => {
                        typeof onSuccess === 'function' && onSuccess();
                        const data = {};
                        const eventType = this.EVENT_TYPES.ITEM_SHARED_FULFILLED;
                        this.sendMessage({ data, eventType });
                    }));
                }
                else {
                    const isShared = this.isSharedContainerDefinitionKey(containerDefinitionKey);
                    if (isShared) {
                        this.dispatch(serviceDataActions.partyItemCurrencyGoldSet(amount, destinationEntityTypeId, destinationEntityId, () => {
                            typeof onSuccess === 'function' && onSuccess();
                            const data = {};
                            const eventType = this.EVENT_TYPES.ITEM_SHARED_FULFILLED;
                            this.sendMessage({ data, eventType });
                        }));
                    }
                    else {
                        this.dispatch(characterActions.itemCurrencyGoldSet(amount, destinationEntityTypeId, destinationEntityId));
                    }
                }
            }
        };
        this.handleElectrumSet = ({ amount, containerDefinitionKey }, onSuccess, onError) => {
            const destinationEntityId = DefinitionHacks.hack__getDefinitionKeyId(containerDefinitionKey);
            const destinationEntityTypeId = DefinitionHacks.hack__getDefinitionKeyType(containerDefinitionKey);
            if (destinationEntityId && destinationEntityTypeId) {
                if (containerDefinitionKey === this.getCharacterContainerDefinitionKey()) {
                    this.dispatch(characterActions.currencyElectrumSet(amount, destinationEntityTypeId, destinationEntityId));
                }
                else if (containerDefinitionKey === this.getPartyEquipmentContainerDefinitionKey()) {
                    this.dispatch(serviceDataActions.partyCurrencyElectrumSet(amount, destinationEntityTypeId, destinationEntityId, () => {
                        typeof onSuccess === 'function' && onSuccess();
                        const data = {};
                        const eventType = this.EVENT_TYPES.ITEM_SHARED_FULFILLED;
                        this.sendMessage({ data, eventType });
                    }));
                }
                else {
                    const isShared = this.isSharedContainerDefinitionKey(containerDefinitionKey);
                    if (isShared) {
                        this.dispatch(serviceDataActions.partyItemCurrencyElectrumSet(amount, destinationEntityTypeId, destinationEntityId, () => {
                            typeof onSuccess === 'function' && onSuccess();
                            const data = {};
                            const eventType = this.EVENT_TYPES.ITEM_SHARED_FULFILLED;
                            this.sendMessage({ data, eventType });
                        }));
                    }
                    else {
                        this.dispatch(characterActions.itemCurrencyElectrumSet(amount, destinationEntityTypeId, destinationEntityId));
                    }
                }
            }
        };
        this.handleSilverSet = ({ amount, containerDefinitionKey }, onSuccess, onError) => {
            const destinationEntityId = DefinitionHacks.hack__getDefinitionKeyId(containerDefinitionKey);
            const destinationEntityTypeId = DefinitionHacks.hack__getDefinitionKeyType(containerDefinitionKey);
            if (destinationEntityId && destinationEntityTypeId) {
                if (containerDefinitionKey === this.getCharacterContainerDefinitionKey()) {
                    this.dispatch(characterActions.currencySilverSet(amount, destinationEntityTypeId, destinationEntityId));
                }
                else if (containerDefinitionKey === this.getPartyEquipmentContainerDefinitionKey()) {
                    this.dispatch(serviceDataActions.partyCurrencySilverSet(amount, destinationEntityTypeId, destinationEntityId, () => {
                        typeof onSuccess === 'function' && onSuccess();
                        const data = {};
                        const eventType = this.EVENT_TYPES.ITEM_SHARED_FULFILLED;
                        this.sendMessage({ data, eventType });
                    }));
                }
                else {
                    const isShared = this.isSharedContainerDefinitionKey(containerDefinitionKey);
                    if (isShared) {
                        this.dispatch(serviceDataActions.partyItemCurrencySilverSet(amount, destinationEntityTypeId, destinationEntityId, () => {
                            typeof onSuccess === 'function' && onSuccess();
                            const data = {};
                            const eventType = this.EVENT_TYPES.ITEM_SHARED_FULFILLED;
                            this.sendMessage({ data, eventType });
                        }));
                    }
                    else {
                        this.dispatch(characterActions.itemCurrencySilverSet(amount, destinationEntityTypeId, destinationEntityId));
                    }
                }
            }
        };
        this.handleCopperSet = ({ amount, containerDefinitionKey }, onSuccess, onError) => {
            const destinationEntityId = DefinitionHacks.hack__getDefinitionKeyId(containerDefinitionKey);
            const destinationEntityTypeId = DefinitionHacks.hack__getDefinitionKeyType(containerDefinitionKey);
            if (destinationEntityId && destinationEntityTypeId) {
                if (containerDefinitionKey === this.getCharacterContainerDefinitionKey()) {
                    this.dispatch(characterActions.currencyCopperSet(amount, destinationEntityTypeId, destinationEntityId));
                }
                else if (containerDefinitionKey === this.getPartyEquipmentContainerDefinitionKey()) {
                    this.dispatch(serviceDataActions.partyCurrencyCopperSet(amount, destinationEntityTypeId, destinationEntityId, () => {
                        typeof onSuccess === 'function' && onSuccess();
                        const data = {};
                        const eventType = this.EVENT_TYPES.ITEM_SHARED_FULFILLED;
                        this.sendMessage({ data, eventType });
                    }));
                }
                else {
                    const isShared = this.isSharedContainerDefinitionKey(containerDefinitionKey);
                    if (isShared) {
                        this.dispatch(serviceDataActions.partyItemCurrencyCopperSet(amount, destinationEntityTypeId, destinationEntityId, () => {
                            typeof onSuccess === 'function' && onSuccess();
                            const data = {};
                            const eventType = this.EVENT_TYPES.ITEM_SHARED_FULFILLED;
                            this.sendMessage({ data, eventType });
                        }));
                    }
                    else {
                        this.dispatch(characterActions.itemCurrencyCopperSet(amount, destinationEntityTypeId, destinationEntityId));
                    }
                }
            }
        };
        // Validators
        this.canAddCoin = (coin, containerDefinitionKey) => {
            const containerLookup = rulesEngineSelectors.getContainerLookup(this.state);
            const container = HelperUtils.lookupDataOrFallback(containerLookup, containerDefinitionKey);
            const isShared = container ? ContainerAccessors.isShared(container) : false;
            if (isShared && this.isSharingTurnedDeleteOnly()) {
                return false;
            }
            return true;
        };
        this.canRemoveCoin = (coin, containerDefinitionKey) => {
            const containerLookup = rulesEngineSelectors.getContainerLookup(this.state);
            const container = HelperUtils.lookupDataOrFallback(containerLookup, containerDefinitionKey);
            const isShared = container ? ContainerAccessors.isShared(container) : false;
            if (isShared && this.isSharingTurnedDeleteOnly()) {
                let hasNegatives = Object.values(coin).some((value) => value < 0);
                return !hasNegatives;
            }
            return true;
        };
        this.canUseCointainers = () => {
            const rulesEngineConfig = ConfigUtils.getCurrentRulesEngineConfig();
            const preferences = rulesEngineSelectors.getPreferences(this.state);
            return !!((preferences === null || preferences === void 0 ? void 0 : preferences.enableContainerCurrency) && (rulesEngineConfig === null || rulesEngineConfig === void 0 ? void 0 : rulesEngineConfig.canUseCurrencyContainers));
        };
        //Utils
        this.getTotalContainerCoinInGold = (containerDefinitionKey) => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const coin = this.getContainerCoin(containerDefinitionKey);
            return coin ? CoreUtils.convertTotalCoinToGold(coin, ruleData) : 0;
        };
        this.getContainerCoin = (containerDefinitionKey) => {
            const containerLookup = rulesEngineSelectors.getContainerLookup(this.state);
            const container = HelperUtils.lookupDataOrFallback(containerLookup, containerDefinitionKey);
            return container ? ContainerAccessors.getCoin(container) : null;
        };
        this.getAllPartyCoin = () => {
            const partyContainers = rulesEngineSelectors.getPartyInventoryContainers(this.state);
            return partyContainers.reduce((acc, container) => {
                const containerCoin = ContainerAccessors.getCoin(container);
                return containerCoin
                    ? {
                        cp: containerCoin.cp ? acc.cp + containerCoin.cp : acc.cp,
                        sp: containerCoin.sp ? acc.sp + containerCoin.sp : acc.sp,
                        ep: containerCoin.ep ? acc.ep + containerCoin.ep : acc.ep,
                        gp: containerCoin.gp ? acc.gp + containerCoin.gp : acc.gp,
                        pp: containerCoin.pp ? acc.pp + containerCoin.pp : acc.pp,
                    }
                    : acc;
            }, { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });
        };
        this.getAllCharacterCoin = () => {
            const characterContainers = rulesEngineSelectors.getCharacterInventoryContainers(this.state);
            return characterContainers.reduce((acc, container) => {
                const containerCoin = ContainerAccessors.getCoin(container);
                return containerCoin
                    ? {
                        cp: containerCoin.cp ? acc.cp + containerCoin.cp : acc.cp,
                        sp: containerCoin.sp ? acc.sp + containerCoin.sp : acc.sp,
                        ep: containerCoin.ep ? acc.ep + containerCoin.ep : acc.ep,
                        gp: containerCoin.gp ? acc.gp + containerCoin.gp : acc.gp,
                        pp: containerCoin.pp ? acc.pp + containerCoin.pp : acc.pp,
                    }
                    : acc;
            }, { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });
        };
    }
    calculateAddCoinPayload(currentCoins, copper, electrum, gold, platinum, silver) {
        const cp = copper !== 0 ? this.calculateModifiedMaxValue(currentCoins === null || currentCoins === void 0 ? void 0 : currentCoins.cp, copper) : 0;
        const ep = electrum !== 0 ? this.calculateModifiedMaxValue(currentCoins === null || currentCoins === void 0 ? void 0 : currentCoins.ep, electrum) : 0;
        const gp = gold !== 0 ? this.calculateModifiedMaxValue(currentCoins === null || currentCoins === void 0 ? void 0 : currentCoins.gp, gold) : 0;
        const pp = platinum !== 0 ? this.calculateModifiedMaxValue(currentCoins === null || currentCoins === void 0 ? void 0 : currentCoins.pp, platinum) : 0;
        const sp = silver !== 0 ? this.calculateModifiedMaxValue(currentCoins === null || currentCoins === void 0 ? void 0 : currentCoins.sp, silver) : 0;
        return this.calculateCoinPayload(cp, ep, gp, pp, sp);
    }
    calculateRemoveCoinPayload(currentCoins, copper, electrum, gold, platinum, silver) {
        const cp = copper !== 0 ? this.calculateModifiedMinValue(currentCoins === null || currentCoins === void 0 ? void 0 : currentCoins.cp, copper) : 0;
        const ep = electrum !== 0 ? this.calculateModifiedMinValue(currentCoins === null || currentCoins === void 0 ? void 0 : currentCoins.ep, electrum) : 0;
        const gp = gold !== 0 ? this.calculateModifiedMinValue(currentCoins === null || currentCoins === void 0 ? void 0 : currentCoins.gp, gold) : 0;
        const pp = platinum !== 0 ? this.calculateModifiedMinValue(currentCoins === null || currentCoins === void 0 ? void 0 : currentCoins.pp, platinum) : 0;
        const sp = silver !== 0 ? this.calculateModifiedMinValue(currentCoins === null || currentCoins === void 0 ? void 0 : currentCoins.sp, silver) : 0;
        return this.calculateCoinPayload(cp, ep, gp, pp, sp);
    }
    calculateCoinPayload(cp, ep, gp, pp, sp) {
        const coinPayload = {};
        if (cp === null || ep === null || gp === null || pp === null || sp === null)
            return null;
        if (cp !== 0)
            coinPayload.cp = cp;
        if (ep !== 0)
            coinPayload.ep = ep;
        if (gp !== 0)
            coinPayload.gp = gp;
        if (pp !== 0)
            coinPayload.pp = pp;
        if (sp !== 0)
            coinPayload.sp = sp;
        return coinPayload;
    }
    calculateModifiedMinValue(baseValue, value) {
        const result = (baseValue || 0) - value;
        if (result >= CURRENCY_VALUE.MIN) {
            return value;
        }
        else {
            return null;
        }
    }
    calculateModifiedMaxValue(baseValue, value) {
        const result = (baseValue || 0) + value;
        if (result <= CURRENCY_VALUE.MAX) {
            return value;
        }
        else {
            return null;
        }
    }
}
