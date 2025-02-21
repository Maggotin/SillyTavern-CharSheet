import { characterActions } from "../actions";
import { ClassAccessors } from "../engine/Class";
import { HelperUtils } from "../engine/Helper";
import { RuleDataAccessors } from "../engine/RuleData";
import { SpellAccessors, SpellDerivers, SpellUtils } from "../engine/Spell";
import { rulesEngineSelectors } from "../selectors";
import { TypeScriptUtils } from "../utils";
import { BaseManager } from './BaseManager';
export const spellManagerMap = new Map();
export const getSpellManager = (params) => {
    const { spell, classId } = params;
    const spellId = SpellDerivers.deriveKnownKey(spell);
    let spellKey = spellId;
    if (classId) {
        spellKey = `${spellId}-${classId}`;
    }
    if (spellManagerMap.has(spellKey)) {
        const spellManager = spellManagerMap.get(spellKey);
        if (!spellManager) {
            throw new Error(`SpellManager for spell ${spellId} is null`);
        }
        if (spellManager.spell === spell) {
            return spellManager;
        }
        else {
            spellManager.updateSpell(params);
            spellManagerMap.set(spellKey, spellManager);
            return spellManager;
        }
    }
    const newSpellManager = new SpellManager(params);
    spellManagerMap.set(spellKey, newSpellManager);
    return newSpellManager;
};
export class SpellManager extends BaseManager {
    constructor(params) {
        super(params);
        // Handlers
        this.handlePrepare = ({ characterClassId }, onSuccess, onError) => {
            this.bustCache();
            this.dispatch(characterActions.spellPreparedSet(this.spell, characterClassId, true, onSuccess));
        };
        this.handleUnprepare = ({ characterClassId }, onSuccess, onError) => {
            this.bustCache();
            this.dispatch(characterActions.spellPreparedSet(this.spell, characterClassId, false, onSuccess));
        };
        this.handleRemove = ({ characterClassId }, onSuccess, onError) => {
            this.bustCache();
            this.dispatch(characterActions.spellRemove(this.spell, characterClassId, onSuccess));
        };
        this.handleAdd = ({ characterClassId }, onSuccess, onError) => {
            this.bustCache();
            this.dispatch(characterActions.spellCreate(this.spell, characterClassId, onSuccess));
        };
        // Accessors
        this.getLevel = () => SpellAccessors.getLevel(this.spell);
        this.getName = () => SpellAccessors.getName(this.spell);
        this.getExpandedDataOriginRef = () => SpellAccessors.getExpandedDataOriginRef(this.spell);
        this.getUniqueKey = () => SpellAccessors.getUniqueKey(this.spell);
        this.getId = () => SpellAccessors.getId(this.spell);
        this.getDataOrigin = () => SpellAccessors.getDataOrigin(this.spell);
        this.isPrepared = () => SpellAccessors.isPrepared(this.spell);
        this.isAlwaysPrepared = () => SpellAccessors.isAlwaysPrepared(this.spell);
        this.isCantrip = () => SpellAccessors.isCantrip(this.spell);
        this.canRemove = () => SpellAccessors.canRemove(this.spell);
        this.canPrepare = () => SpellAccessors.canPrepare(this.spell);
        this.canAdd = () => SpellAccessors.canAdd(this.spell);
        this.isCustomized = () => SpellAccessors.isCustomized(this.spell);
        this.getConcentration = () => SpellAccessors.getConcentration(this.spell);
        this.isRitual = () => SpellAccessors.isRitual(this.spell);
        this.isLegacy = () => SpellAccessors.isLegacy(this.spell);
        this.getSources = () => SpellAccessors.getSources(this.spell);
        this.getDefinition = () => SpellAccessors.getDefinition(this.spell);
        this.getPrimarySourceCategoryId = () => {
            var _a, _b;
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const sources = this.getSources()
                .map((source) => HelperUtils.lookupDataOrFallback(RuleDataAccessors.getSourceDataLookup(ruleData), source.sourceId))
                .filter(TypeScriptUtils.isNotNullOrUndefined);
            return ((_b = (_a = sources[0]) === null || _a === void 0 ? void 0 : _a.sourceCategory) === null || _b === void 0 ? void 0 : _b.id) || 0;
        };
        /*
        Temporary solution, until Spells and Spell Managers dependence get fixed
         */
        this.getSpell = () => this.spell;
        // Utils
        this.isSpellbookCaster = () => {
            return ClassAccessors.isSpellbookSpellcaster(this.getDataOrigin().primary);
        };
        this.deriveKnownKey = () => {
            return SpellDerivers.deriveKnownKey(this.spell);
        };
        this.deriveLeveledKnownKey = (castLevel) => {
            return SpellDerivers.deriveLeveledKnownKey(this.spell, castLevel);
        };
        this.params = params;
        this.spell = params.spell;
        this.bustCache = params.bustCache || function NOOP() { };
        this.name = 'SpellManager';
    }
    updateSpell(params) {
        this.params = params;
        this.spell = params.spell;
        this.bustCache = params.bustCache || function NOOP() { };
        this.name = 'SpellManager';
    }
    static getSpellManager(knownKey) {
        const spellManager = spellManagerMap.get(knownKey);
        if (!spellManager) {
            throw new Error(`SpellManager for spell ${knownKey} is null`);
        }
        return spellManager;
    }
    static makeKnownKey(mappingId, mappingEntityTypeId) {
        return SpellUtils.makeKnownKey(mappingId, mappingEntityTypeId);
    }
    static makeLeveledKnownKey(mappingId, mappingEntityTypeId, castLevel) {
        return SpellUtils.makeLeveledKnownKey(mappingId, mappingEntityTypeId, castLevel);
    }
}
