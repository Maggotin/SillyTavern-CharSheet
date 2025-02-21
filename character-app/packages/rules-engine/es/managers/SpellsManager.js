var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { characterActions, serviceDataActions } from "../actions";
import { ApiRequestHelpers } from "../api";
import { ApiAdapterUtils } from "../apiAdapter";
import { ClassAccessors } from "../engine/Class";
import { HelperUtils } from "../engine/Helper";
import { SourceUtils } from "../engine/Source";
import { SpellDerivers, SpellSimulators } from "../engine/Spell";
import { apiCreatorSelectors, rulesEngineSelectors } from "../selectors";
import { getOverallSpellInfo } from "../selectors/composite/engine";
import { TypeScriptUtils } from "../utils";
import { getLeveledSpellManager, LeveledSpellManager } from './LeveledSpellManager';
import { MessageManager } from './MessageManager';
import { getSpellManager, SpellManager } from './SpellManager';
let spellShoppe = null;
let apiResponses = {};
let spellsManager = null;
// TODO: this seems like a good pattern might want to implement else where
export function getSpellsManager(params) {
    if (spellsManager) {
        return spellsManager;
    }
    spellsManager = new SpellsManager(params);
    return spellsManager;
}
export class SpellsManager extends MessageManager {
    constructor(params) {
        super(params);
        this.handleSpellSlotSet = (used, castLevel) => {
            const spellLevelSpellSlotRequestsDataKey = ApiRequestHelpers.getSpellLevelSpellSlotRequestsDataKey(castLevel);
            if (spellLevelSpellSlotRequestsDataKey !== null) {
                this.dispatch(characterActions.spellLevelSpellSlotsSet({
                    [spellLevelSpellSlotRequestsDataKey]: used,
                }));
            }
        };
        this.handleSpellSlotChange = (changeAmount, castLevel) => {
            const spellSlots = rulesEngineSelectors.getSpellSlots(this.state);
            const usedAmount = this.getUsedSpellSlotLevelAmount(changeAmount, spellSlots, castLevel);
            if (usedAmount !== null) {
                this.handleSpellSlotSet(usedAmount, castLevel);
            }
        };
        this.handlePactSlotSet = (used, castLevel) => {
            const spellLevelPactMagicRequestsDataKey = ApiRequestHelpers.getSpellLevelPactMagicRequestsDataKey(castLevel);
            if (spellLevelPactMagicRequestsDataKey !== null) {
                this.dispatch(characterActions.spellLevelPactMagicSlotsSet({
                    [spellLevelPactMagicRequestsDataKey]: used,
                }));
            }
        };
        this.handlePactSlotChange = (changeAmount, castLevel) => {
            const pactMagicSlots = rulesEngineSelectors.getPactMagicSlots(this.state);
            const usedAmount = this.getUsedSpellSlotLevelAmount(changeAmount, pactMagicSlots, castLevel);
            if (usedAmount !== null) {
                this.handlePactSlotSet(usedAmount, castLevel);
            }
        };
        this.getUsedSpellSlotLevelAmount = (changeAmount, spellSlots, castLevel) => {
            const foundSlotLevel = spellSlots.find((spellSlot) => spellSlot.level === castLevel);
            if (!foundSlotLevel) {
                return null;
            }
            const usedAmount = foundSlotLevel.used + changeAmount;
            const maxAmount = foundSlotLevel.available;
            return HelperUtils.clampInt(usedAmount, 0, maxAmount);
        };
        this.handleAlwaysKnownLoad = (spells, classId) => {
            this.dispatch(serviceDataActions.classAlwaysKnownSpellsSet(spells, classId));
        };
        this.transformLoadedSpells = (data) => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const overallSpellInfo = getOverallSpellInfo(this.state);
            return data.map((definition) => SpellSimulators.simulateSpell(definition, overallSpellInfo, ruleData, null, null));
        };
        this.params = params;
        this.name = 'SpellsManager';
    }
    bustCache() {
        spellShoppe = null;
    }
    getLevelSpells() {
        const levelSpells = rulesEngineSelectors.getLevelSpells(this.state);
        return levelSpells.map((spells) => {
            return spells.map((spell) => getLeveledSpellManager(Object.assign(Object.assign({}, this.params), { spell })));
        });
    }
    getSpellCasterInfo() {
        return rulesEngineSelectors.getSpellCasterInfo(this.state);
    }
    getClassName(charClass) {
        const name = ClassAccessors.getName(charClass);
        return name ? name : '';
    }
    getCharacterClassId(classId) {
        const charClasses = rulesEngineSelectors.getClasses(this.state);
        const charClassFound = charClasses.find((clazz) => {
            return ClassAccessors.getActiveId(clazz) === classId;
        });
        if (charClassFound) {
            return ClassAccessors.getMappingId(charClassFound);
        }
        else {
            return null;
        }
    }
    getLeveledSpell(knownLevelKey) {
        const leveledSpellManager = LeveledSpellManager.getLeveledSpellManager(knownLevelKey);
        if (!leveledSpellManager) {
            throw new Error(`leveledSpellManager for spell ${knownLevelKey} is null`);
        }
        return leveledSpellManager;
    }
    getLeveledSpellManagerBySpell(spell) {
        const spellCasterInfo = rulesEngineSelectors.getSpellCasterInfo(this.state);
        const ruleData = rulesEngineSelectors.getRuleData(this.state);
        const minCastLevel = SpellDerivers.getMinCastLevel(spell, spellCasterInfo, ruleData);
        const leveledKnownKey = SpellDerivers.deriveLeveledKnownKey(spell, minCastLevel);
        let result = null;
        try {
            result = this.getLeveledSpell(leveledKnownKey);
        }
        catch (error) {
            // noop
        }
        return result;
    }
    getSpellManagers(spells, classId) {
        const managers = spells.map((spell) => getSpellManager(Object.assign(Object.assign({}, this.params), { spell, bustCache: this.bustCache, classId })));
        return managers.filter((manager, index) => managers.indexOf(manager) === index);
    }
    getSpell(knownKey) {
        const spellManager = SpellManager.getSpellManager(knownKey);
        if (!spellManager) {
            throw new Error(`spellManager for spell ${knownKey} is null`);
        }
        return spellManager;
    }
    getSpellShoppe(shouldBustCache) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!spellShoppe || shouldBustCache) {
                const classKnownSpells = apiCreatorSelectors.makeLoadClassAlwaysKnownSpells(this.state);
                const classRemainingSpells = apiCreatorSelectors.makeLoadClassRemainingSpells(this.state);
                const ruleData = rulesEngineSelectors.getRuleData(this.state);
                let classSpellLists = rulesEngineSelectors.getClassSpellLists(this.state);
                const classSpells = {};
                const availableSpellRequests = classSpellLists.map((classSpellList, i) => {
                    var _a;
                    const classId = ClassAccessors.getActiveId(classSpellList.charClass);
                    if (!shouldBustCache && ((_a = apiResponses === null || apiResponses === void 0 ? void 0 : apiResponses[classId]) === null || _a === void 0 ? void 0 : _a.availableSpells)) {
                        return Promise.resolve(apiResponses[classId].availableSpells);
                    }
                    const availableRequest = classRemainingSpells(classSpellList.charClass);
                    if (availableRequest) {
                        return availableRequest();
                    }
                    return Promise.resolve(null);
                });
                const knownSpellRequests = classSpellLists.map((classSpellList, i) => {
                    var _a;
                    const classId = ClassAccessors.getActiveId(classSpellList.charClass);
                    if (!shouldBustCache && ((_a = apiResponses === null || apiResponses === void 0 ? void 0 : apiResponses[classId]) === null || _a === void 0 ? void 0 : _a.knownSpells)) {
                        return Promise.resolve(apiResponses[classId].knownSpells);
                    }
                    const knownRequest = classKnownSpells(classSpellList.charClass);
                    if (knownRequest) {
                        return knownRequest();
                    }
                    return Promise.resolve(null);
                });
                const availableSpellResponses = yield Promise.all(availableSpellRequests);
                const knownSpellResponses = yield Promise.all(knownSpellRequests);
                classSpellLists.forEach((classSpellList, index) => {
                    // Dispatch any known spells into the store first
                    const classId = ClassAccessors.getActiveId(classSpellList.charClass);
                    apiResponses[classId] = (apiResponses === null || apiResponses === void 0 ? void 0 : apiResponses[classId]) ? apiResponses === null || apiResponses === void 0 ? void 0 : apiResponses[classId] : {};
                    const knownSpellResponse = knownSpellResponses[index];
                    if (knownSpellResponse) {
                        apiResponses[classId].knownSpells = knownSpellResponse;
                        const spellData = ApiAdapterUtils.getResponseData(knownSpellResponse);
                        if (spellData) {
                            this.dispatch(serviceDataActions.classAlwaysKnownSpellsSet(spellData, classId));
                        }
                    }
                });
                // Get new spelllists with properly generated spells
                classSpellLists = rulesEngineSelectors.getClassSpellLists(this.state);
                classSpellLists.forEach((classSpellList, index) => {
                    const knownSpellIds = classSpellList.knownSpellIds;
                    const availableSpellResponse = availableSpellResponses[index];
                    const classId = ClassAccessors.getActiveId(classSpellList.charClass);
                    apiResponses[classId] = (apiResponses === null || apiResponses === void 0 ? void 0 : apiResponses[classId]) ? apiResponses === null || apiResponses === void 0 ? void 0 : apiResponses[classId] : {};
                    let availableSpells = [];
                    if (availableSpellResponse) {
                        apiResponses[classId].availableSpells = availableSpellResponse;
                        const spellData = ApiAdapterUtils.getResponseData(availableSpellResponse);
                        const transformed = this.transformLoadedSpells(spellData || []);
                        const filtered = transformed.filter((spell) => !knownSpellIds.includes(SpellDerivers.deriveKnownKey(spell)));
                        availableSpells = this.getSpellManagers(filtered, classId);
                    }
                    const knownSpells = this.getSpellManagers(classSpellList.spells, classId);
                    const activeSpells = this.getSpellManagers(classSpellList.activeSpells, classId);
                    const availableSpellDefinitions = [...availableSpells, ...knownSpells, ...activeSpells]
                        .map((spellManager) => spellManager.getDefinition())
                        .filter(TypeScriptUtils.isNotNullOrUndefined);
                    const activeSourceCategories = rulesEngineSelectors.getActiveSourceCategories(this.state);
                    const sourceCategories = SourceUtils.getSimpleSourceCategoriesData(availableSpellDefinitions, ruleData, activeSourceCategories);
                    classSpells[classId] = {
                        availableSpells,
                        knownSpells,
                        activeSpells,
                        sourceCategories,
                    };
                });
                spellShoppe = classSpells;
                return spellShoppe;
            }
            else {
                return spellShoppe;
            }
        });
    }
    getSpellClasses() {
        return rulesEngineSelectors.getSpellClasses(this.state);
    }
    getClassSpellLists() {
        return rulesEngineSelectors.getClassSpellLists(this.state);
    }
    getCharClassByActiveId(activeId) {
        var _a;
        const spellClasses = this.getSpellClasses();
        return (_a = spellClasses.find((charClass) => charClass.activeId === activeId)) !== null && _a !== void 0 ? _a : null;
    }
    getClassSpellInfoByActiveId(activeId) {
        var _a;
        const spellClasses = this.getClassSpellLists();
        return (_a = spellClasses.find((classSpellInfo) => classSpellInfo.charClass.activeId === activeId)) !== null && _a !== void 0 ? _a : null;
    }
}
SpellsManager.getUsedSpellSlotLevelAmount = (changeAmount, spellSlots, castLevel) => {
    const foundSlotLevel = spellSlots.find((spellSlot) => spellSlot.level === castLevel);
    if (!foundSlotLevel) {
        return null;
    }
    const usedAmount = foundSlotLevel.used + changeAmount;
    const maxAmount = foundSlotLevel.available;
    return HelperUtils.clampInt(usedAmount, 0, maxAmount);
};
