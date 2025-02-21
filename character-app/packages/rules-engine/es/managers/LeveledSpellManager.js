import { characterActions } from "../actions";
import { ActivationAccessors } from "../engine/Activation";
import { ClassAccessors } from "../engine/Class";
import { ConditionAccessors } from "../engine/Condition";
import { DataOriginTypeEnum } from "../engine/DataOrigin";
import { DiceRenderers } from "../engine/Dice";
import { EntityUtils } from "../engine/Entity";
import { HelperUtils } from "../engine/Helper";
import { ItemAccessors } from "../engine/Item";
import { LimitedUseAccessors } from "../engine/LimitedUse";
import { ModifierAccessors, ModifierValidators } from "../engine/Modifier";
import { RuleDataUtils } from "../engine/RuleData";
import { SpellAccessors, SpellDerivers, SpellNotes, SpellUtils, SpellValidators } from "../engine/Spell";
import { FormatUtils } from "../index";
import { rulesEngineSelectors } from "../selectors";
import { ItemManager } from './ItemManager';
import { getSpellManager } from './SpellManager';
import { SpellsManager } from './SpellsManager';
export const leveledSpellManagerMap = new Map();
export const getLeveledSpellManager = (params) => {
    const { spell } = params;
    const spellManager = getSpellManager(params);
    const leveledKnownKey = spellManager.deriveLeveledKnownKey(SpellAccessors.getCastLevel(spell));
    if (leveledSpellManagerMap.has(leveledKnownKey)) {
        const leveledSpellManager = leveledSpellManagerMap.get(leveledKnownKey);
        if (!leveledSpellManager) {
            throw new Error(`leveledSpellManager for spell ${leveledKnownKey} is null`);
        }
        if (leveledSpellManager.spell === spell) {
            return leveledSpellManager;
        }
    }
    const newLeveledSpellManager = new LeveledSpellManager(params);
    leveledSpellManagerMap.set(leveledKnownKey, newLeveledSpellManager);
    return newLeveledSpellManager;
};
export class LeveledSpellManager extends SpellsManager {
    constructor(params) {
        super(params);
        // Handlers
        this.onSpellLimitedUseSet = (uses) => {
            const mappingId = this.getMappingId();
            const mappingTypeId = this.getMappingEntityTypeId();
            if (mappingId !== null && mappingTypeId !== null) {
                this.dispatch(characterActions.spellUseSet(mappingId, mappingTypeId, uses, this.getDataOriginType()));
            }
        };
        this.onUse = (useSpellSlot, usePactMagicSlot, dataOriginType, uses, mappingId, mappingTypeId) => {
            if (useSpellSlot) {
                this.handleSpellSlotChange(1, this.getCastLevel());
            }
            if (usePactMagicSlot) {
                this.handlePactSlotChange(1, this.getCastLevel());
            }
            if (uses !== null && mappingId !== null && mappingTypeId !== null) {
                switch (dataOriginType) {
                    case DataOriginTypeEnum.ITEM:
                        const item = ItemManager.getItem(mappingId);
                        item.handleItemLimitedUseSet(uses);
                        break;
                    default:
                        this.onSpellLimitedUseSet(uses);
                }
            }
        };
        this.handleSpellUse = (useSpellSlot, usePactMagicSlot) => {
            let dataOrigin = this.getDataOrigin();
            let dataOriginType = this.getDataOriginType();
            let limitedUse = this.getLimitedUse();
            let uses = null;
            let mappingId = null;
            let mappingTypeId = null;
            if (limitedUse) {
                let numberUsed = LimitedUseAccessors.getNumberUsed(limitedUse);
                let minConsumed = LimitedUseAccessors.getMinNumberConsumed(limitedUse);
                let consumedAmount = minConsumed + this.getScaledAmount();
                if (dataOriginType === DataOriginTypeEnum.ITEM) {
                    uses = numberUsed + consumedAmount;
                    mappingId = ItemAccessors.getMappingId(dataOrigin.primary);
                    mappingTypeId = ItemAccessors.getMappingEntityTypeId(dataOrigin.primary);
                }
                else {
                    uses = numberUsed + 1;
                    mappingId = this.getMappingId();
                    mappingTypeId = this.getMappingEntityTypeId();
                }
            }
            if (this.onUse) {
                this.onUse(useSpellSlot, usePactMagicSlot, dataOriginType, uses, mappingId, mappingTypeId);
            }
        };
        this.handleCastClick = (bothSlotsCallback) => {
            let usesSpellSlot = this.getUsesSpellSlot();
            let limitedUse = this.getLimitedUse();
            let spellSlotLevel = this.getSpellSlotInfo();
            let pactMagicLevel = this.getPactSlotInfo();
            let doesSpellSlotExist = !!spellSlotLevel && spellSlotLevel.available > 0;
            let doesPactSlotExist = !!pactMagicLevel && pactMagicLevel.available > 0;
            let isSpellSlotAvailable = false;
            if (doesSpellSlotExist && spellSlotLevel) {
                isSpellSlotAvailable = spellSlotLevel.used < spellSlotLevel.available;
            }
            let isPactSlotAvailable = false;
            if (doesPactSlotExist && pactMagicLevel) {
                isPactSlotAvailable = pactMagicLevel.used < pactMagicLevel.available;
            }
            if (usesSpellSlot) {
                if (limitedUse) {
                    const spellDataOrigin = this.getDataOrigin();
                    const spellDataOriginType = this.getDataOriginType();
                    if (spellDataOriginType === DataOriginTypeEnum.CLASS_FEATURE &&
                        ClassAccessors.isPactMagicActive(spellDataOrigin.parent)) {
                        if (isPactSlotAvailable) {
                            this.handleSpellUse(false, true);
                        }
                    }
                    else {
                        if (isSpellSlotAvailable) {
                            this.handleSpellUse(true, false);
                        }
                    }
                }
                else {
                    if (doesSpellSlotExist && doesPactSlotExist) {
                        if (!bothSlotsCallback) {
                            throw new Error('No callback passed for encountering both slots');
                        }
                        bothSlotsCallback();
                    }
                    else {
                        if (isSpellSlotAvailable) {
                            this.handleSpellUse(true, false);
                        }
                        else if (isPactSlotAvailable) {
                            this.handleSpellUse(false, true);
                        }
                    }
                }
            }
            else {
                this.handleSpellUse(false, false);
            }
        };
        // Accessors
        this.getId = () => SpellAccessors.getId(this.spell);
        this.getDataOrigin = () => SpellAccessors.getDataOrigin(this.spell);
        this.getDataOriginType = () => SpellAccessors.getDataOriginType(this.spell);
        this.getLimitedUse = () => SpellAccessors.getLimitedUse(this.spell);
        this.getScaledAmount = () => SpellAccessors.getScaledAmount(this.spell);
        this.getScaleType = () => SpellAccessors.getScaleType(this.spell);
        this.getMappingId = () => SpellAccessors.getMappingId(this.spell);
        this.getMappingEntityTypeId = () => SpellAccessors.getMappingEntityTypeId(this.spell);
        this.getUsesSpellSlot = () => SpellAccessors.getUsesSpellSlot(this.spell);
        this.getName = () => SpellAccessors.getName(this.spell);
        this.asPartOfWeaponAttack = () => SpellAccessors.asPartOfWeaponAttack(this.spell);
        this.getRequiresAttackRoll = () => SpellAccessors.getRequiresAttackRoll(this.spell);
        this.getRequiresSavingThrow = () => SpellAccessors.getRequiresSavingThrow(this.spell);
        this.getToHit = () => SpellAccessors.getToHit(this.spell);
        this.getAttackSaveValue = () => SpellAccessors.getAttackSaveValue(this.spell);
        this.getSaveDcAbilityKey = () => {
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            return SpellUtils.getSaveDcAbilityKey(this.spell, ruleData);
        };
        this.getRange = () => SpellAccessors.getRange(this.spell);
        this.getActivation = () => SpellAccessors.getActivation(this.spell);
        this.getCastLevel = () => SpellAccessors.getCastLevel(this.spell);
        this.getLevel = () => SpellAccessors.getLevel(this.spell);
        this.isAtWill = () => SpellAccessors.isAtWill(this.spell);
        this.getMaxUses = () => SpellAccessors.getMaxUses(this.spell);
        this.getConsumedUses = () => SpellAccessors.getConsumedUses(this.spell);
        this.isLimitedUseAvailableAtScaledAmount = () => SpellAccessors.isLimitedUseAvailableAtScaledAmount(this.spell);
        this.getLimitedUseNumberUsed = () => {
            const limitedUse = this.getLimitedUse();
            if (limitedUse) {
                return LimitedUseAccessors.getNumberUsed(limitedUse);
            }
            else {
                return null;
            }
        };
        this.getExpandedDataOriginRef = () => SpellAccessors.getExpandedDataOriginRef(this.spell);
        this.isCastAsRitual = () => SpellAccessors.isCastAsRitual(this.spell);
        this.getNoteComponents = () => {
            var _a;
            const castLevel = this.getCastLevel();
            const characterLevel = (_a = rulesEngineSelectors.getExperienceInfo(this.state)) === null || _a === void 0 ? void 0 : _a.currentLevel;
            const abilityLookup = rulesEngineSelectors.getAbilityLookup(this.state);
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const spellScaledAmount = this.getScaledAmount();
            const proficiencyBonus = rulesEngineSelectors.getProficiencyBonus(this.state);
            return SpellNotes.getNoteComponents(this.spell, castLevel, characterLevel, abilityLookup, ruleData, spellScaledAmount, proficiencyBonus);
        };
        this.isCustomized = () => SpellAccessors.isCustomized(this.spell);
        this.getConcentration = () => SpellAccessors.getConcentration(this.spell);
        this.isRitual = () => SpellAccessors.isRitual(this.spell);
        this.getCharacterLevel = () => SpellAccessors.getCharacterLevel(this.spell);
        this.getModifiers = () => SpellAccessors.getModifiers(this.spell);
        this.getTags = () => SpellAccessors.getTags(this.spell);
        this.getConditions = () => SpellAccessors.getConditions(this.spell);
        this.isLegacy = () => SpellAccessors.isLegacy(this.spell);
        this.isValidToUsePactSlots = () => SpellValidators.isValidToUsePactSlots(this.spell);
        // Utils
        this.getActivationTime = () => ActivationAccessors.getTime(this.getActivation());
        this.getActivationUnit = () => ActivationAccessors.getType(this.getActivation());
        this.getFriendlySubtypeName = (modifier) => { var _a; return (_a = ModifierAccessors.getFriendlySubtypeName(modifier)) !== null && _a !== void 0 ? _a : ''; };
        this.getPrimaryConditionName = () => {
            const spellCondition = this.getConditions()[0];
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            let condition = RuleDataUtils.getCondition(spellCondition.conditionId, ruleData);
            if (condition) {
                return ConditionAccessors.getName(condition);
            }
            return null;
        };
        this.getDamageModifiers = (modifiers) => {
            return modifiers.filter((modifier) => ModifierValidators.isSpellDamageModifier(modifier));
        };
        this.getHitPointHealingModifiers = (modifiers) => {
            return modifiers.filter((modifier) => ModifierValidators.isSpellHealingHitPointsModifier(modifier));
        };
        this.getTempHitPointHealingModifiers = (modifiers) => {
            return modifiers.filter((modifier) => ModifierValidators.isSpellHealingTempHitPointsModifier(modifier));
        };
        this.getEffectModifierDiceContract = (modifier) => {
            const scaleType = this.getScaleType();
            const points = this.getHigherLevelEntryContracts(modifier);
            const atHigherDamage = SpellDerivers.getSpellScaledAtHigher(this.spell, scaleType, points, this.getCharacterLevel(), this.getCastLevel());
            return SpellUtils.getSpellFinalScaledDie(this.spell, modifier, atHigherDamage);
        };
        this.getEffectRenderedDiceModifier = (modifier) => {
            const scaledDamageDie = this.getEffectModifierDiceContract(modifier);
            return DiceRenderers.renderDice(scaledDamageDie);
        };
        this.getHigherLevelEntryContracts = (modifier) => {
            const atHigherLevels = ModifierAccessors.getAtHigherLevels(modifier);
            let points = [];
            if (atHigherLevels && atHigherLevels.points !== null) {
                points = atHigherLevels.points;
            }
            return points;
        };
        this.getUsedSpellSlotLevelAmount = (changeAmount, spellSlots) => {
            const foundSlotLevel = spellSlots.find((spellSlot) => spellSlot.level === this.getCastLevel());
            if (!foundSlotLevel) {
                return null;
            }
            const usedAmount = foundSlotLevel.used + changeAmount;
            const maxAmount = foundSlotLevel.available;
            return HelperUtils.clampInt(usedAmount, 0, maxAmount);
        };
        this.getSpellSlotInfo = () => {
            const spellCasterInfo = rulesEngineSelectors.getSpellCasterInfo(this.state);
            const { spellSlots } = spellCasterInfo;
            let spellSlotInfo = spellSlots.find((spellSlotGroup) => spellSlotGroup.level === this.getCastLevel());
            return spellSlotInfo ? spellSlotInfo : null;
        };
        this.getPactSlotInfo = () => {
            const spellCasterInfo = rulesEngineSelectors.getSpellCasterInfo(this.state);
            const { pactMagicSlots } = spellCasterInfo;
            let spellSlotInfo = pactMagicSlots.find((pactSlotGroup) => pactSlotGroup.level === this.getCastLevel());
            return spellSlotInfo ? spellSlotInfo : null;
        };
        this.getExpandedDataOriginRefName = () => {
            const expandedDataOriginRef = this.getExpandedDataOriginRef();
            if (expandedDataOriginRef) {
                const dataOriginRefData = rulesEngineSelectors.getDataOriginRefData(this.state);
                return EntityUtils.getDataOriginRefName(expandedDataOriginRef, dataOriginRefData);
            }
            else {
                return null;
            }
        };
        this.getDataOriginName = () => EntityUtils.getDataOriginName(this.getDataOrigin());
        this.getClassId = () => {
            if (this.getDataOriginType() === DataOriginTypeEnum.CLASS) {
                return ClassAccessors.getMappingId(this.getDataOrigin().primary);
            }
            else {
                return null;
            }
        };
        this.getSchoolName = () => SpellAccessors.getSchool(this.spell);
        this.getSchoolIconSlug = () => {
            const school = this.getSchoolName();
            return FormatUtils.slugify(school);
        };
        this.getActionMetaItems = () => {
            const metaItems = [];
            metaItems.push(FormatUtils.renderSpellLevelName(this.getLevel()));
            const spellDataOrigin = this.getDataOrigin();
            if (spellDataOrigin) {
                const dataOriginName = this.getDataOriginName();
                metaItems.push(dataOriginName);
            }
            let expandedDataOriginRefName = this.getExpandedDataOriginRefName();
            if (expandedDataOriginRefName) {
                metaItems.push(expandedDataOriginRefName);
            }
            if (this.getConcentration()) {
                metaItems.push('Concentration');
            }
            if (this.isCustomized()) {
                metaItems.push('Customized');
            }
            return metaItems;
        };
        this.deriveKnownKey = () => {
            return SpellDerivers.deriveKnownKey(this.spell);
        };
        this.deriveLeveledKnownKey = (castLevel) => {
            return SpellDerivers.deriveLeveledKnownKey(this.spell, castLevel);
        };
        this.params = params;
        this.spell = params.spell;
    }
    static getLeveledSpellManager(knownLevelKey) {
        const leveledSpellManager = leveledSpellManagerMap.get(knownLevelKey);
        if (!leveledSpellManager) {
            throw new Error(`SpellManager for spell ${knownLevelKey} is null`);
        }
        return leveledSpellManager;
    }
    static makeKnownKey(mappingId, mappingEntityTypeId) {
        return SpellUtils.makeKnownKey(mappingId, mappingEntityTypeId);
    }
    static makeLeveledKnownKey(mappingId, mappingEntityTypeId, castLevel) {
        return SpellUtils.makeLeveledKnownKey(mappingId, mappingEntityTypeId, castLevel);
    }
}
