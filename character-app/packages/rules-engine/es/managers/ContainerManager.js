import { sortBy } from 'lodash';
import { SourceUtils } from "../engine/Source";
import { TypeScriptUtils } from "../utils";
import { ContainerAccessors, ContainerUtils, ContainerValidators } from '../engine/Container';
import { ItemUtils, ItemAccessors } from '../engine/Item';
import { rulesEngineSelectors } from '../selectors';
import { getItemManager } from './ItemManager';
import { MessageManager } from './MessageManager';
import * as FilterUtils from './utils/Filter';
const containerManagerMap = new Map();
export const getContainerManager = (params) => {
    const { container } = params;
    const containerId = ContainerAccessors.getDefinitionKey(container);
    if (containerManagerMap.has(containerId)) {
        const containerManager = containerManagerMap.get(containerId);
        if (!containerManager) {
            throw new Error(`ContainerManager for container ${containerId} is null`);
        }
        if (containerManager.container === container) {
            return containerManager;
        }
    }
    const newContainerManger = new ContainerManager(params);
    containerManagerMap.set(containerId, newContainerManger);
    return newContainerManger;
};
export class ContainerManager extends MessageManager {
    constructor(params) {
        super(params);
        this.getContainerItem = () => {
            const item = ContainerAccessors.getItem(this.container);
            return item ? this.generateItemManager(item) : null;
        };
        this.getFilteredItems = (filterOptions, items) => {
            const { filterTypes = [], filterQuery = '', filterProficient = false, filterBasic = false, filterMagic = false, filterContainer = false, filterSourceCategories = [], } = filterOptions;
            return items.filter((item) => {
                if (filterSourceCategories.length !== 0) {
                    const itemSourceCategories = ItemUtils.getAllSourceCategoryIds(item);
                    if (!filterSourceCategories.some((id) => itemSourceCategories.includes(id))) {
                        return false;
                    }
                }
                if (filterProficient &&
                    (ItemUtils.isWeaponContract(item) || ItemUtils.isArmorContract(item)) &&
                    !item.proficiency) {
                    return false;
                }
                let filterType = ItemAccessors.getDefintionFilterType(item);
                if (filterTypes.length !== 0 && filterType !== null && !filterTypes.includes(filterType)) {
                    return false;
                }
                let searchTags = [];
                if (ItemUtils.isGearContract(item)) {
                    let subType = ItemAccessors.getSubType(item);
                    if (subType) {
                        searchTags.push(subType);
                    }
                }
                if (filterQuery !== '' &&
                    !FilterUtils.doesQueryMatchData(filterQuery, ItemAccessors.getName(item), searchTags)) {
                    return false;
                }
                if (filterMagic && !filterBasic && !ItemAccessors.isMagic(item)) {
                    return false;
                }
                if (filterBasic && !filterMagic && ItemAccessors.isMagic(item)) {
                    return false;
                }
                if (filterContainer && !filterBasic && !filterMagic && !ItemAccessors.isContainer(item)) {
                    return false;
                }
                return true;
            });
        };
        // get the items from a list of items...
        // this logic needs to be consolidated in the incentory manager via
        // the filter logic
        /**
         * TODO IMS: filtering and sorting as params then no need to inventory to be passed
         * @returns Array<ItemManager>
         */
        this.getInventoryItems = (controls) => {
            const { filteredInventory = null, includeContainer = false, filterOptions = {
                filterTypes: [],
                filterQuery: '',
                filterProficient: false,
                filterBasic: false,
                filterMagic: false,
                filterContainer: false,
                filterSourceCategories: [],
            }, paginationOptions = {
                currentPage: 0,
                pageSize: null,
            }, isShoppe, } = controls || {};
            const { currentPage = 0, pageSize = null } = paginationOptions || {};
            const allItems = rulesEngineSelectors.getAllInventoryItems(this.state);
            const items = this.overrideItems
                ? this.overrideItems
                : ContainerUtils.getInventoryItems(this.container, filteredInventory ? filteredInventory : allItems);
            if (includeContainer) {
                const containerItem = ContainerAccessors.getItem(this.container);
                if (containerItem) {
                    items.push(containerItem);
                }
            }
            let filteredItems = filterOptions ? this.getFilteredItems(filterOptions, items) : items;
            if (isShoppe) {
                filteredItems = sortBy(filteredItems, [
                    (item) => ItemUtils.getRarityLevel(item),
                    (item) => ItemAccessors.getName(item),
                ]);
            }
            else {
                filteredItems = ItemUtils.sortInventoryItems(filteredItems, includeContainer);
            }
            let paginatedItems = pageSize === null ? filteredItems : filteredItems.slice(0, (currentPage + 1) * pageSize);
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const activeSourceCategories = rulesEngineSelectors.getActiveSourceCategories(this.state);
            const itemDefinitions = items
                .map((item) => ItemAccessors.getDefinition(item))
                .filter(TypeScriptUtils.isNotNullOrUndefined);
            const sourceCategories = SourceUtils.getSimpleSourceCategoriesData(itemDefinitions, ruleData, activeSourceCategories);
            return {
                items: paginatedItems.map((item) => this.generateItemManager(item)),
                totalItems: filteredItems.length,
                sourceCategories,
            };
        };
        this.getInventoryItemsCount = () => {
            return rulesEngineSelectors.getAllInventoryItems(this.state).length;
        };
        // TODO should we make a new one that has coin? or rework the current one?
        // generateCoinManager = () => {
        //     return new CoinManager()
        // }
        // Accessors
        this.getDefinitionKey = () => ContainerAccessors.getDefinitionKey(this.container);
        this.getMappingId = () => ContainerAccessors.getMappingId(this.container);
        this.getName = () => ContainerAccessors.getName(this.container);
        this.isShared = () => ContainerAccessors.isShared(this.container);
        this.getWeightInfo = () => ContainerAccessors.getWeightInfo(this.container);
        this.isEquipped = () => ContainerAccessors.isEquipped(this.container);
        this.hasInfusions = () => ContainerAccessors.hasInfusions(this.container);
        this.getCoin = () => ContainerAccessors.getCoin(this.container);
        // Validators
        this.isCharacterContainer = () => ContainerValidators.isCharacterContainer(this.container);
        this.isSharedOtherContainerDefinitionKey = (otherContainerDefinitionKey) => {
            const containerLookup = rulesEngineSelectors.getContainerLookup(this.state);
            return ContainerValidators.validateIsShared(otherContainerDefinitionKey, containerLookup);
        };
        this.params = params;
        this.container = params.container;
        this.overrideItems = (params === null || params === void 0 ? void 0 : params.overrideItems) || null;
    }
    generateItemManager(item) {
        return getItemManager(Object.assign(Object.assign({}, this.params), { container: this, item }));
    }
}
// Static Helpers ... not sure I like this but this might be better?
ContainerManager.isSharedContainerDefinitionKey = (state, containerDefinitionKey) => {
    const containerLookup = rulesEngineSelectors.getContainerLookup(state);
    return ContainerValidators.validateIsShared(containerDefinitionKey, containerLookup);
};
