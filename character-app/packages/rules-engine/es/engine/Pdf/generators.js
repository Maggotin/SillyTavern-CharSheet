import { orderBy, uniqBy } from 'lodash';
import { TypeScriptUtils } from '../../utils';
import { AbilityAccessors } from '../Ability';
import { ActionAccessors, ActionNotes, ActionTypeEnum } from '../Action';
import { ActivationAccessors, ActivationRenderers, ActivationTypeEnum } from '../Activation';
import { BackgroundAccessors } from '../Background';
import { AttackSourceTypeEnum, CharacterValidators, CharacterGenerators, } from '../Character';
import { ChoiceAccessors } from '../Choice';
import { ClassAccessors } from '../Class';
import { ClassFeatureAccessors, ClassFeatureUtils } from '../ClassFeature';
import { ActivatableTypeEnum, BuilderChoiceTypeEnum, PreferenceAbilityScoreDisplayTypeEnum, PreferenceEncumbranceTypeEnum, PreferenceProgressionTypeEnum, SaveTypeEnum, } from '../Core';
import { CreatureAccessors, CreatureNotes } from '../Creature';
import { DataOriginTypeEnum } from '../DataOrigin';
import { DiceRenderers } from '../Dice';
import { DurationRenderers } from '../Duration';
import { EntityUtils } from '../Entity';
import { FeatAccessors } from '../Feat';
import { FormatUtils } from '../Format';
import { ItemAccessors, ItemNotes, ItemValidators } from '../Item';
import { LimitedUseAccessors, LimitedUseDerivers } from '../LimitedUse';
import { ModifierAccessors, ModifierValidators } from '../Modifier';
import { NoteUtils } from '../Note';
import { OptionAccessors, OptionUtils } from '../Option';
import { RaceAccessors } from '../Race';
import { RacialTraitAccessors, RacialTraitDerivers } from '../RacialTrait';
import { RuleDataAccessors, RuleDataUtils } from '../RuleData';
import { SkillAccessors } from '../Skill';
import { SnippetUtils } from '../Snippet';
import { SpellAccessors, SpellDerivers, SpellNotes, SpellUtils, } from '../Spell';
import { getScaleType } from '../Spell/accessors';
import { PdfGenerators } from './index';
/**
 *
 * @param action
 */
export function generateContext(action) {
    let classLevel = 0;
    let levelScale = null;
    let dataOrigin = ActionAccessors.getDataOrigin(action);
    let dataOriginType = ActionAccessors.getDataOriginType(action);
    switch (dataOriginType) {
        case DataOriginTypeEnum.CLASS_FEATURE:
            classLevel = ClassAccessors.getLevel(dataOrigin.parent);
            levelScale = ClassFeatureAccessors.getLevelScale(dataOrigin.primary);
            break;
        case DataOriginTypeEnum.RACE:
        case DataOriginTypeEnum.FEAT:
        default:
        // not implemented
    }
    return {
        classLevel,
        levelScale,
        limitedUse: ActionAccessors.getLimitedUse(action),
    };
}
/**
 *
 * @param limitedUse
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateLimitedUse(limitedUse, abilityLookup, ruleData, proficiencyBonus) {
    let limitedUseInfo = null;
    if (limitedUse) {
        limitedUseInfo = {
            resetType: LimitedUseAccessors.getResetType(limitedUse),
            maxUses: LimitedUseDerivers.deriveMaxUses(limitedUse, abilityLookup, ruleData, proficiencyBonus),
        };
    }
    return limitedUseInfo;
}
/**
 *
 * @param spell
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateFeatureSpell(spell, abilityLookup, ruleData, proficiencyBonus) {
    // TODO fix once spells are updated
    return {
        name: SpellAccessors.getName(spell),
        level: SpellAccessors.getLevel(spell),
        limitedUse: generateLimitedUse(SpellAccessors.getLimitedUse(spell), abilityLookup, ruleData, proficiencyBonus),
    };
}
/**
 *
 * @param spells
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateFeatureSpells(spells, abilityLookup, ruleData, proficiencyBonus) {
    return spells.map((spell) => generateFeatureSpell(spell, abilityLookup, ruleData, proficiencyBonus));
}
/**
 *
 * @param action
 * @param snippetData
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateAction(action, snippetData, abilityLookup, ruleData, proficiencyBonus) {
    let limitedUse = ActionAccessors.getLimitedUse(action);
    let activation = ActionAccessors.getActivation(action);
    return {
        name: ActionAccessors.getName(action),
        limitedUse: generateLimitedUse(limitedUse, abilityLookup, ruleData, proficiencyBonus),
        snippet: SnippetUtils.convertSnippetToText(ActionAccessors.getSnippet(action), generateContext(action), snippetData, proficiencyBonus),
        type: ActionAccessors.getActionTypeId(action),
        activation: activation ? ActivationRenderers.renderActivation(activation, ruleData) : null,
    };
}
/**
 *
 * @param actions
 * @param snippetData
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateActions(actions, snippetData, abilityLookup, ruleData, proficiencyBonus) {
    return actions.map((action) => generateAction(action, snippetData, abilityLookup, ruleData, proficiencyBonus));
}
/**
 *
 * @param choice
 * @param ruleData
 */
export function generateChoice(choice, ruleData) {
    if (ChoiceAccessors.getType(choice) !== BuilderChoiceTypeEnum.SUB_CLASS_OPTION) {
        return null;
    }
    let optionValue = ChoiceAccessors.getOptionValue(choice);
    if (optionValue === null) {
        return null;
    }
    let dataOrigin = ChoiceAccessors.getDataOrigin(choice);
    let value = null;
    if (optionValue && dataOrigin.parent !== null) {
        value = ClassAccessors.getSubclassName(dataOrigin.parent);
    }
    return {
        type: ChoiceAccessors.getType(choice),
        value,
    };
}
/**
 *
 * @param choices
 * @param ruleData
 */
export function generateChoices(choices, ruleData) {
    return choices.map((choice) => generateChoice(choice, ruleData)).filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param options
 * @param snippetData
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateOptions(options, snippetData, abilityLookup, ruleData, proficiencyBonus) {
    let optionSummaries = options.map((option) => ({
        name: OptionAccessors.getName(option),
        page: generatePageRef(OptionAccessors.getSourceId(option), OptionAccessors.getSourcePage(option), ruleData),
        snippet: SnippetUtils.convertSnippetToText(OptionAccessors.getSnippet(option), OptionUtils.getContextData(option), snippetData, proficiencyBonus),
        spells: generateFeatureSpells(OptionAccessors.getSpells(option), abilityLookup, ruleData, proficiencyBonus),
        actions: generateActions(OptionAccessors.getActions(option), snippetData, abilityLookup, ruleData, proficiencyBonus),
    }));
    return orderBy(optionSummaries, 'name');
}
/**
 *
 * @param label
 * @param type
 * @param activatables
 * @param snippetData
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateActionGroup(label, type, activatables, snippetData, abilityLookup, ruleData, proficiencyBonus) {
    let actions = [];
    let spells = [];
    activatables.forEach((activatable) => {
        if (ActivationAccessors.getType(activatable.activation) === type) {
            switch (activatable.type) {
                case ActivatableTypeEnum.ACTION:
                    actions.push(generateAction(activatable.entity, snippetData, abilityLookup, ruleData, proficiencyBonus));
                    break;
                case ActivatableTypeEnum.CLASS_SPELL:
                case ActivatableTypeEnum.CHARACTER_SPELL:
                default:
                // not implemented
            }
        }
    });
    return {
        type,
        label,
        actions,
        spells,
    };
}
/**
 *
 * @param activatables
 * @param snippetData
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateActionGroups(activatables, snippetData, abilityLookup, ruleData, proficiencyBonus) {
    return [
        generateActionGroup('Actions', ActivationTypeEnum.ACTION, activatables, snippetData, abilityLookup, ruleData, proficiencyBonus),
        generateActionGroup('Bonus Actions', ActivationTypeEnum.BONUS_ACTION, activatables, snippetData, abilityLookup, ruleData, proficiencyBonus),
        generateActionGroup('Reactions', ActivationTypeEnum.REACTION, activatables, snippetData, abilityLookup, ruleData, proficiencyBonus),
        generateActionGroup('Special', ActivationTypeEnum.SPECIAL, activatables, snippetData, abilityLookup, ruleData, proficiencyBonus),
    ];
}
/**
 *
 * @param sourceId
 * @param pageNumber
 * @param ruleData
 */
export function generatePageRef(sourceId, pageNumber, ruleData) {
    let pageString = '';
    if (sourceId !== null) {
        let sourceDataLookup = RuleDataAccessors.getSourceDataLookup(ruleData);
        let pageSourceInfo = sourceDataLookup[sourceId];
        if (pageSourceInfo) {
            pageString = `${pageSourceInfo.name} ${pageNumber ? pageNumber : ''}`;
        }
    }
    return pageString.trim();
}
/**
 *
 * @param sources
 * @param ruleData
 */
export function generateSourcesString(sources, ruleData) {
    return sources
        .filter(CharacterValidators.isPrimarySource)
        .map((source) => generatePageRef(source.sourceId, source.pageNumber, ruleData))
        .join(', ');
}
/**
 *
 * @param senseInfo
 * @param senseKey
 * @param ruleData
 */
export function generateSense(senseInfo, senseKey, ruleData) {
    let senseValue = null;
    if (senseInfo.hasOwnProperty(senseKey)) {
        senseValue = senseInfo[senseKey];
    }
    let configSenseInfo = RuleDataUtils.getSenseInfo(parseInt(senseKey), ruleData);
    return {
        label: configSenseInfo !== null && configSenseInfo.name !== null ? configSenseInfo.name : '',
        distance: senseValue,
    };
}
/**
 *
 * @param senseInfo
 * @param ruleData
 */
export function generateSenses(senseInfo, ruleData) {
    return Object.keys(senseInfo).map((senseKey) => generateSense(senseInfo, senseKey, ruleData));
}
/**
 *
 * @param charClass
 */
export function generateClass(charClass) {
    const name = ClassAccessors.getName(charClass);
    return {
        name: name === null ? '' : name,
        level: ClassAccessors.getLevel(charClass),
    };
}
/**
 *
 * @param ability
 * @param preferences
 */
export function generateAbility(ability, preferences) {
    const score = AbilityAccessors.getScore(ability);
    const modifier = AbilityAccessors.getModifier(ability);
    const save = AbilityAccessors.getSave(ability);
    const statKey = AbilityAccessors.getStatKey(ability);
    const label = AbilityAccessors.getLabel(ability);
    const proficiencyLevel = AbilityAccessors.getProficiencyLevel(ability);
    let primary = modifier === null ? '' : FormatUtils.renderSignedNumber(modifier);
    let secondary = score === null ? '' : '' + score;
    if (preferences.abilityScoreDisplayType === PreferenceAbilityScoreDisplayTypeEnum.SCORES_TOP) {
        [primary, secondary] = [secondary, primary];
    }
    return {
        display: {
            primary,
            secondary,
        },
        score: score,
        modifier: modifier,
        savingThrow: save,
        savingThrowProficiencyLevel: proficiencyLevel,
        key: statKey,
        name: label === null ? '' : label,
    };
}
/**
 *
 * @param bonusSavingThrowModifiers
 * @param advantageSavingThrowModifiers
 * @param disadvantageSavingThrowModifiers
 */
export function generateSavingThrowSummaries(bonusSavingThrowModifiers, advantageSavingThrowModifiers, disadvantageSavingThrowModifiers) {
    let summaries = [];
    bonusSavingThrowModifiers.forEach((modifier) => {
        summaries.push(CharacterGenerators.generateSavingThrowModifierSummary(SaveTypeEnum.BONUS, modifier));
    });
    advantageSavingThrowModifiers.forEach((modifier) => {
        summaries.push(CharacterGenerators.generateSavingThrowModifierSummary(SaveTypeEnum.ADVANTAGE, modifier));
    });
    disadvantageSavingThrowModifiers.forEach((modifier) => {
        summaries.push(CharacterGenerators.generateSavingThrowModifierSummary(SaveTypeEnum.DISADVANTAGE, modifier));
    });
    return summaries;
}
/**
 *
 * @param skill
 * @param ruleData
 */
export function generateSkill(skill, ruleData) {
    const name = SkillAccessors.getName(skill);
    const statId = SkillAccessors.getStat(skill);
    let statKey = '';
    if (statId !== null) {
        const statName = RuleDataUtils.getStatNameById(statId, ruleData);
        if (statName !== null) {
            statKey = statName;
        }
    }
    return {
        proficiencyLevel: SkillAccessors.getProficiencyLevel(skill),
        name: name === null ? '' : name,
        modifier: SkillAccessors.getModifier(skill),
        statKey,
    };
}
/**
 *
 * @param defenseAdjustmentGroup
 */
export function generateDefense(defenseAdjustmentGroup) {
    return {
        name: defenseAdjustmentGroup.name,
        source: defenseAdjustmentGroup.sources.join(', '),
        isCustom: defenseAdjustmentGroup.hasCustom,
    };
}
/**
 *
 * @param resistances
 * @param immunities
 * @param vulnerabilities
 */
export function generateDefenses(resistances, immunities, vulnerabilities) {
    return {
        resistances: resistances.map((defenseGroup) => generateDefense(defenseGroup)),
        immunities: immunities.map((defenseGroup) => generateDefense(defenseGroup)),
        vulnerabilities: vulnerabilities.map((defenseGroup) => generateDefense(defenseGroup)),
    };
}
/**
 *
 * @param ruleData
 */
export function generateBasicActions(ruleData) {
    return RuleDataAccessors.getBasicActions(ruleData)
        .map((basicAction) => basicAction.name)
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param hitPointInfo
 */
export function generateHitDice(hitPointInfo) {
    return hitPointInfo.classesHitDice.map((classHitDice) => ({
        dice: classHitDice.dice,
        diceString: DiceRenderers.renderDie(classHitDice.dice),
    }));
}
/**
 *
 * @param charClass
 * @param classSpellInfoLookup
 * @param propertyKey
 * @param fallback
 */
export function generateSpellcastingInfoValue(charClass, classSpellInfoLookup, propertyKey, fallback) {
    let spellInfoLookup = classSpellInfoLookup[ClassAccessors.getId(charClass)];
    if (!spellInfoLookup) {
        return fallback;
    }
    if (!spellInfoLookup.hasOwnProperty(propertyKey)) {
        return fallback;
    }
    return spellInfoLookup[propertyKey];
}
/**
 *
 * @param classSpellLists
 * @param classSpellInfoLookup
 */
export function generateSpellcastingInfo(classSpellLists, classSpellInfoLookup) {
    return {
        classNames: classSpellLists.map((classSpellList) => {
            let name = ClassAccessors.getName(classSpellList.charClass);
            return name === null ? '' : name;
        }),
        spellcastingAbilities: classSpellLists.map((classSpellList) => classSpellList.spellcastingAbility === null ? '' : classSpellList.spellcastingAbility),
        spellSaveDifficulties: classSpellLists.map((classSpellList) => generateSpellcastingInfoValue(classSpellList.charClass, classSpellInfoLookup, 'spellSaveDc', 0)),
        spellAttackBonuses: classSpellLists.map((classSpellList) => generateSpellcastingInfoValue(classSpellList.charClass, classSpellInfoLookup, 'toHit', 0)),
    };
}
/**
 *
 * @param action
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
function generateAttack_Action(action, abilityLookup, ruleData, proficiencyBonus) {
    if (ActionAccessors.getActionTypeId(action) !== ActionTypeEnum.WEAPON ||
        !ActionAccessors.requiresAttackRoll(action)) {
        return null;
    }
    let damage = ActionAccessors.getDamage(action);
    let damageDisplay = '';
    if (damage.value !== null) {
        damageDisplay = typeof damage.value === 'number' ? damage.value : DiceRenderers.renderDice(damage.value);
    }
    let damageString = `${damageDisplay} ${damage.type ? damage.type.name : ''}`;
    let noteComponents = ActionNotes.getNoteComponents(action, ruleData, abilityLookup, proficiencyBonus);
    const toHit = ActionAccessors.getToHit(action);
    return {
        name: ActionAccessors.getName(action),
        toHit: toHit === null ? 0 : toHit,
        damageString: damageString.trim(),
        notes: NoteUtils.renderNoteComponents(noteComponents),
    };
}
/**
 *
 * @param item
 * @param weaponSpellDamageGroups
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
function generateAttack_Item(item, weaponSpellDamageGroups, abilityLookup, ruleData, proficiencyBonus) {
    if (!ItemValidators.validateIsWeaponLike(item)) {
        return null;
    }
    let damage = ItemAccessors.getDamage(item);
    let damageDisplay = '';
    if (damage !== null) {
        damageDisplay = typeof damage === 'number' ? damage : DiceRenderers.renderDice(damage);
    }
    let damageString = `${damageDisplay} ${ItemAccessors.getDamageType(item)}`;
    let noteComponents = ItemNotes.getNoteComponents(item, weaponSpellDamageGroups, ruleData, abilityLookup, proficiencyBonus);
    const toHit = ItemAccessors.getToHit(item);
    return {
        name: ItemAccessors.getName(item),
        toHit: toHit === null ? 0 : toHit,
        damageString: damageString.trim(),
        notes: NoteUtils.renderNoteComponents(noteComponents),
    };
}
/**
 *
 * @param spell
 * @param characterLevel
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
function generateAttack_Spell(spell, characterLevel, abilityLookup, ruleData, proficiencyBonus) {
    if (!SpellAccessors.isCantrip(spell) || !SpellAccessors.getRequiresAttackRoll(spell)) {
        return null;
    }
    let damageString = '';
    const modifiers = SpellAccessors.getModifiers(spell);
    let damageModifiers = modifiers.filter((modifier) => ModifierValidators.isSpellDamageModifier(modifier));
    if (damageModifiers.length) {
        let modifier = damageModifiers[0];
        const atHigherLevels = ModifierAccessors.getAtHigherLevels(modifier);
        // TODO: V5 do we need this extra check julie/brian for context
        let scaleType = atHigherLevels ? getScaleType(spell) : null;
        let points = atHigherLevels && atHigherLevels.points ? atHigherLevels.points : [];
        let atHigherDamage = SpellDerivers.getSpellScaledAtHigher(spell, scaleType, points, characterLevel, 0);
        let scaledDamageDie = SpellUtils.getSpellFinalScaledDie(spell, modifier, atHigherDamage);
        if (scaledDamageDie !== null) {
            damageString = `${DiceRenderers.renderDice(scaledDamageDie)} ${modifier.friendlySubtypeName}`;
        }
    }
    const startingCastLevel = SpellDerivers.deriveStartingCastLevel(spell);
    let noteComponents = SpellNotes.getNoteComponents(spell, startingCastLevel, characterLevel, abilityLookup, ruleData, 0, proficiencyBonus);
    const toHit = SpellAccessors.getToHit(spell);
    return {
        name: SpellAccessors.getName(spell),
        toHit: toHit === null ? 0 : toHit,
        damageString: damageString.trim(),
        notes: NoteUtils.renderNoteComponents(noteComponents),
    };
}
/**
 *
 * @param attack
 * @param characterLevel
 * @param weaponSpellDamageGroups
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateAttack(attack, characterLevel, weaponSpellDamageGroups, abilityLookup, ruleData, proficiencyBonus) {
    switch (attack.type) {
        case AttackSourceTypeEnum.ACTION:
        case AttackSourceTypeEnum.CUSTOM:
            return generateAttack_Action(attack.data, abilityLookup, ruleData, proficiencyBonus);
        case AttackSourceTypeEnum.ITEM:
            return generateAttack_Item(attack.data, weaponSpellDamageGroups, abilityLookup, ruleData, proficiencyBonus);
        case AttackSourceTypeEnum.SPELL:
            return generateAttack_Spell(attack.data, characterLevel, abilityLookup, ruleData, proficiencyBonus);
        default:
        // not implemented
    }
    return null;
}
/**
 *
 * @param attacks
 * @param characterLevel
 * @param weaponSpellDamageGroups
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateAttacks(attacks, characterLevel, weaponSpellDamageGroups, abilityLookup, ruleData, proficiencyBonus) {
    return attacks
        .map((attack) => generateAttack(attack, characterLevel, weaponSpellDamageGroups, abilityLookup, ruleData, proficiencyBonus))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param item
 */
export function generateItem(item) {
    return {
        name: ItemAccessors.getName(item),
        quantity: ItemAccessors.getQuantity(item),
        weight: ItemAccessors.getWeight(item),
    };
}
/**
 *
 * @param items
 * @param customItems
 */
export function generateItems(items, customItems) {
    return [...items, ...customItems].map((item) => generateItem(item));
}
/**
 *
 * @param items
 */
export function generateAttunedItems(items) {
    return items.filter((item) => ItemAccessors.isAttuned(item)).map((item) => generateItem(item));
}
/**
 *
 * @param feat
 * @param snippetData
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateFeat(feat, snippetData, abilityLookup, ruleData, proficiencyBonus) {
    return {
        name: FeatAccessors.getName(feat),
        page: generateSourcesString(FeatAccessors.getSources(feat), ruleData),
        snippet: SnippetUtils.convertSnippetToText(FeatAccessors.getSnippet(feat), {}, snippetData, proficiencyBonus),
        options: generateOptions(feat.options, snippetData, abilityLookup, ruleData, proficiencyBonus),
        spells: generateFeatureSpells(feat.spells, abilityLookup, ruleData, proficiencyBonus),
        actions: generateActions(feat.actions, snippetData, abilityLookup, ruleData, proficiencyBonus),
    };
}
/**
 *
 * @param charClass
 * @param classFeature
 * @param snippetData
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateClassFeature(charClass, classFeature, snippetData, abilityLookup, ruleData, proficiencyBonus) {
    return {
        name: ClassFeatureAccessors.getName(classFeature),
        page: generatePageRef(ClassFeatureAccessors.getSourceId(classFeature), ClassFeatureAccessors.getSourcePage(classFeature), ruleData),
        levelScale: ClassFeatureAccessors.getLevelScale(classFeature),
        snippet: SnippetUtils.convertSnippetToText(ClassFeatureAccessors.getSnippet(classFeature), ClassFeatureUtils.getContextData(classFeature, charClass), snippetData, proficiencyBonus),
        options: generateOptions(ClassFeatureAccessors.getOptions(classFeature), snippetData, abilityLookup, ruleData, proficiencyBonus),
        spells: generateFeatureSpells(ClassFeatureAccessors.getSpells(classFeature), abilityLookup, ruleData, proficiencyBonus),
        actions: generateActions(ClassFeatureAccessors.getActions(classFeature), snippetData, abilityLookup, ruleData, proficiencyBonus),
        choices: generateChoices(ClassFeatureAccessors.getChoices(classFeature), ruleData),
    };
}
/**
 *
 * @param charClass
 * @param snippetData
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateClassFeatureClass(charClass, snippetData, abilityLookup, ruleData, proficiencyBonus) {
    const mappedClassFeatures = ClassAccessors.getUniqueClassFeatures(charClass).map((feature) => generateClassFeature(charClass, feature, snippetData, abilityLookup, ruleData, proficiencyBonus));
    const name = ClassAccessors.getName(charClass);
    return {
        className: name === null ? '' : name,
        level: ClassAccessors.getLevel(charClass),
        features: uniqBy(mappedClassFeatures, (feature) => feature.name),
    };
}
/**
 *
 * @param racialTrait
 * @param snippetData
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateRacialTrait(racialTrait, snippetData, abilityLookup, ruleData, proficiencyBonus) {
    return {
        name: RacialTraitAccessors.getName(racialTrait),
        page: generatePageRef(RacialTraitAccessors.getSourceId(racialTrait), RacialTraitAccessors.getSourcePage(racialTrait), ruleData),
        snippet: SnippetUtils.convertSnippetToText(RacialTraitAccessors.getSnippet(racialTrait), RacialTraitDerivers.deriveContextData(racialTrait), snippetData, proficiencyBonus),
        options: generateOptions(racialTrait.options, snippetData, abilityLookup, ruleData, proficiencyBonus),
        spells: generateFeatureSpells(racialTrait.spells, abilityLookup, ruleData, proficiencyBonus),
        actions: generateActions(racialTrait.actions, snippetData, abilityLookup, ruleData, proficiencyBonus),
    };
}
/**
 *
 * @param race
 * @param snippetData
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateRacialTraits(race, snippetData, abilityLookup, ruleData, proficiencyBonus) {
    if (race === null) {
        return [];
    }
    return RaceAccessors.getVisibleRacialTraits(race).map((racialTrait) => generateRacialTrait(racialTrait, snippetData, abilityLookup, ruleData, proficiencyBonus));
}
/**
 *
 * @param race
 */
export function generateRace(race) {
    if (race === null) {
        return '';
    }
    const fullName = RaceAccessors.getFullName(race);
    return fullName === null ? '' : fullName;
}
/**
 *
 * @param background
 */
export function generateBackground(background) {
    if (background === null) {
        return null;
    }
    if (BackgroundAccessors.getHasCustomBackground(background)) {
        return 'Custom Background';
    }
    return BackgroundAccessors.getName(background);
}
/**
 *
 * @param spell
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateSpell(spell, abilityLookup, ruleData, proficiencyBonus) {
    const level = SpellAccessors.getLevel(spell);
    const components = SpellAccessors.getComponents(spell)
        .map((componentId) => {
        const spellComponentInfo = RuleDataUtils.getSpellComponentInfo(componentId, ruleData);
        return spellComponentInfo ? spellComponentInfo.shortName : null;
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
    let activation = SpellAccessors.getActivation(spell);
    let duration = SpellAccessors.getDuration(spell);
    let durationString = '';
    if (duration) {
        durationString = DurationRenderers.renderDuration(duration, SpellAccessors.getConcentration(spell));
    }
    let dataOriginName = EntityUtils.getDataOriginName(SpellAccessors.getDataOrigin(spell));
    let requiresSavingThrow = SpellAccessors.getRequiresSavingThrow(spell);
    let requiresAttackRoll = SpellAccessors.getRequiresAttackRoll(spell);
    let range = SpellAccessors.getRange(spell);
    let rangeAreas = [];
    // TODO need to change origin to id and then use constants here for comparison
    if (range && range.origin && range.origin !== 'Ranged') {
        rangeAreas.push(range.origin);
    }
    if (range && range.rangeValue) {
        rangeAreas.push(FormatUtils.renderDistance(range.rangeValue));
    }
    if (range && range.aoeValue) {
        rangeAreas.push(`${FormatUtils.renderDistance(range.aoeValue)} ${range.aoeType}`.trim());
    }
    const startingCastLevel = SpellDerivers.deriveStartingCastLevel(spell);
    // TODO "level" seems to be incorrect here, but it wont matter with this update and will be removed once we make the updates in DCP-1412
    let noteComponents = SpellNotes.getNoteComponents(spell, startingCastLevel, level, abilityLookup, ruleData, 0, proficiencyBonus);
    let isCastAsRitual = SpellAccessors.isCastAsRitual(spell);
    let attackType = SpellAccessors.getAttackType(spell);
    return {
        name: SpellAccessors.getName(spell),
        canPrepare: SpellAccessors.canPrepare(spell),
        alwaysPrepared: SpellAccessors.isAlwaysPrepared(spell),
        requiresSavingThrow,
        attackSaveStatKey: requiresSavingThrow ? SpellUtils.getSaveDcAbilityShortName(spell, ruleData) : null,
        attackSaveValue: requiresSavingThrow ? SpellAccessors.getAttackSaveValue(spell) : null,
        requiresAttackRoll,
        toHit: requiresAttackRoll ? SpellAccessors.getToHit(spell) : null,
        attackType: attackType ? RuleDataUtils.getAttackTypeRangeName(attackType) : null,
        components: components.join(','),
        castingTime: activation
            ? ActivationRenderers.renderCastingTimeAbbreviation(activation, isCastAsRitual ? 10 : 0)
            : null,
        duration: durationString.trim(),
        page: generateSourcesString(SpellAccessors.getSources(spell), ruleData),
        source: dataOriginName.trim(),
        range: rangeAreas.join('/'),
        isRitual: SpellAccessors.isRitual(spell),
        isConcentration: SpellAccessors.getConcentration(spell),
        notes: NoteUtils.renderNoteComponents(noteComponents),
    };
}
/**
 *
 * @param classSpells
 * @param characterSpells
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function generateSpells(classSpells, characterSpells, abilityLookup, ruleData, proficiencyBonus) {
    let exportSpells = [];
    for (let i = 0; i <= RuleDataAccessors.getMaxSpellLevel(ruleData); i++) {
        exportSpells.push([]);
    }
    [...classSpells, ...characterSpells].forEach((spell) => {
        const startingCastLevel = SpellDerivers.deriveStartingCastLevel(spell);
        exportSpells[startingCastLevel].push(generateSpell(spell, abilityLookup, ruleData, proficiencyBonus));
    });
    return exportSpells;
}
/**
 *
 * @param spellSlots
 * @param pactMagicSlots
 * @param ruleData
 */
export function generateSpellSlots(spellSlots, pactMagicSlots, ruleData) {
    let exportSpellSlots = [];
    for (let i = 0; i <= RuleDataAccessors.getMaxSpellLevel(ruleData); i++) {
        let spellLevelSlots = spellSlots.find((slotLevel) => slotLevel.level === i);
        let pactMagicLevelSlots = pactMagicSlots.find((slotLevel) => slotLevel.level === i);
        let combined = [];
        if (spellLevelSlots) {
            combined.push(spellLevelSlots.available);
        }
        if (pactMagicLevelSlots) {
            combined.push(pactMagicLevelSlots.available);
        }
        exportSpellSlots.push({
            combined,
            spell: spellLevelSlots ? spellLevelSlots.available : 0,
            pactMagic: pactMagicLevelSlots ? pactMagicLevelSlots.available : 0,
        });
    }
    return exportSpellSlots;
}
/**
 *
 * @param proficiencyModifiers
 */
export function generateProficiencies(proficiencyModifiers) {
    let proficiencies = proficiencyModifiers
        .map((modifier) => ModifierAccessors.getFriendlySubtypeName(modifier))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
    return orderBy(proficiencies);
}
/**
 *
 * @param proficiencyGroups
 */
export function generateProficiencyGroups(proficiencyGroups) {
    return proficiencyGroups.map((proficiencyGroup) => {
        return {
            label: proficiencyGroup.label === null ? '' : proficiencyGroup.label,
            proficiencies: proficiencyGroup.modifierGroups.map((modifierGroup) => modifierGroup.label),
        };
    });
}
/**
 *
 * @param currentXp
 * @param preferences
 */
export function generateXp(currentXp, preferences) {
    if (preferences.progressionType === PreferenceProgressionTypeEnum.MILESTONE) {
        return '(Milestone)';
    }
    return currentXp.toLocaleString();
}
/**
 *
 * @param creature
 * @param ruleData
 */
export function generateCreature(creature, ruleData) {
    let hitPointInfo = CreatureAccessors.getHitPointInfo(creature);
    let groupInfo = CreatureAccessors.getGroupInfo(creature);
    return {
        name: CreatureAccessors.getName(creature),
        hitPoints: hitPointInfo.totalHp,
        groupInfo: {
            isPrimary: groupInfo ? groupInfo.isPrimary : null,
            isMisc: groupInfo ? groupInfo.isMisc : null,
            id: groupInfo ? groupInfo.id : null,
            name: groupInfo ? groupInfo.name : null,
        },
        notes: NoteUtils.renderNoteComponents(CreatureNotes.getNoteComponents(creature, ruleData)),
    };
}
/**
 * TODO evaluate whether this logic isn't somewhere else?
 * @param carryCapactiy
 * @param encumberedWeight
 * @param preferences
 */
export function generateEncumberedWeightInfo(carryCapactiy, encumberedWeight, preferences) {
    if (preferences.encumbranceType === PreferenceEncumbranceTypeEnum.VARIANT) {
        return encumberedWeight;
    }
    else if (preferences.encumbranceType === PreferenceEncumbranceTypeEnum.NONE) {
        return 0;
    }
    return carryCapactiy;
}
/**
 * TODO evaluate whether this logic isn't somewhere else?
 * @param pushDragLiftWeight
 * @param preferences
 */
export function generatePushDragLiftWeight(pushDragLiftWeight, preferences) {
    if (preferences.encumbranceType === PreferenceEncumbranceTypeEnum.NONE) {
        return 0;
    }
    return pushDragLiftWeight;
}
/**
 *
 * @param alignment
 */
export function generateAlignment(alignment) {
    return alignment === null ? null : alignment.name;
}
/**
 *
 * @param size
 */
export function generateSize(size) {
    return size === null ? null : size.name;
}
/**
 *
 * @param skills
 * @param customSkills
 * @param spellSlots
 * @param pactMagicSlots
 * @param creatures
 * @param attacks
 * @param weaponSpellDamageGroups
 * @param classSpells
 * @param characterSpells
 * @param characterLevel
 * @param abilityLookup
 * @param ruleData
 * @param hack__pdfDataBucket1AndBucket2Parts
 */
export function generatePdfDataBucket1(skills, customSkills, spellSlots, pactMagicSlots, creatures, attacks, weaponSpellDamageGroups, classSpells, characterSpells, characterLevel, hack__pdfDataBucket1AndBucket2Parts) {
    const { abilityLookup, ruleData, proficiencyBonus } = hack__pdfDataBucket1AndBucket2Parts;
    return {
        attacks: PdfGenerators.generateAttacks(attacks, characterLevel, weaponSpellDamageGroups, abilityLookup, ruleData, proficiencyBonus),
        basicActions: PdfGenerators.generateBasicActions(ruleData),
        creatures: creatures.map((creature) => PdfGenerators.generateCreature(creature, ruleData)),
        customSkills: customSkills.map((skill) => PdfGenerators.generateSkill(skill, ruleData)),
        level: characterLevel,
        skills: skills.map((skill) => PdfGenerators.generateSkill(skill, ruleData)),
        spells: PdfGenerators.generateSpells(classSpells, characterSpells, abilityLookup, ruleData, proficiencyBonus),
        spellSlots: PdfGenerators.generateSpellSlots(spellSlots, pactMagicSlots, ruleData),
    };
}
/**
 *
 * @param activatables
 * @param classes
 * @param race
 * @param feats
 * @param bonusSavingThrowModifiers
 * @param advantageSavingThrowModifiers
 * @param disadvantageSavingThrowModifiers
 * @param items
 * @param customItems
 * @param snippetData
 * @param abilityLookup
 * @param ruleData
 */
export function generatePdfDataBucket2(activatables, classes, race, feats, bonusSavingThrowModifiers, advantageSavingThrowModifiers, disadvantageSavingThrowModifiers, items, customItems, snippetData, hack__pdfDataBucket1AndBucket2Parts) {
    const { abilityLookup, ruleData, proficiencyBonus } = hack__pdfDataBucket1AndBucket2Parts;
    return {
        actions: PdfGenerators.generateActionGroups(activatables, snippetData, abilityLookup, ruleData, proficiencyBonus),
        attunedItems: PdfGenerators.generateAttunedItems(items),
        classes: classes.map((charClass) => PdfGenerators.generateClass(charClass)),
        classFeatures: classes.map((charClass) => PdfGenerators.generateClassFeatureClass(charClass, snippetData, abilityLookup, ruleData, proficiencyBonus)),
        feats: feats.map((feat) => PdfGenerators.generateFeat(feat, snippetData, abilityLookup, ruleData, proficiencyBonus)),
        items: PdfGenerators.generateItems(items, customItems),
        race: PdfGenerators.generateRace(race),
        racialTraits: PdfGenerators.generateRacialTraits(race, snippetData, abilityLookup, ruleData, proficiencyBonus),
        savingThrowSummaries: PdfGenerators.generateSavingThrowSummaries(bonusSavingThrowModifiers, advantageSavingThrowModifiers, disadvantageSavingThrowModifiers),
    };
}
/**
 *
 * @param resistances
 * @param immunities
 * @param vulnerabilities
 * @param hitPointInfo
 * @param classSpellLists
 * @param classSpellInfoLookup
 * @param background
 * @param proficiencyGroups
 * @param proficiencyModifiers
 * @param passivePerception
 * @param passiveInsight
 * @param passiveInvestigation
 */
export function generatePdfDataBucket3(resistances, immunities, vulnerabilities, hitPointInfo, classSpellLists, classSpellInfoLookup, background, proficiencyGroups, proficiencyModifiers, passivePerception, passiveInsight, passiveInvestigation) {
    return {
        background: PdfGenerators.generateBackground(background),
        defenses: PdfGenerators.generateDefenses(resistances, immunities, vulnerabilities),
        hitDice: PdfGenerators.generateHitDice(hitPointInfo),
        hitPointMax: hitPointInfo.totalHp,
        passivePerception,
        passiveInsight,
        passiveInvestigation,
        proficiencies: PdfGenerators.generateProficiencies(proficiencyModifiers),
        proficiencyGroups: PdfGenerators.generateProficiencyGroups(proficiencyGroups),
        spellcastingInfo: PdfGenerators.generateSpellcastingInfo(classSpellLists, classSpellInfoLookup),
    };
}
/**
 *
 * @param abilities
 * @param currentXp
 * @param carryCapacity
 * @param encumberedWeight
 * @param pushDragLiftWeight
 * @param totalWeight
 * @param armorClass
 * @param initiative
 * @param speeds
 * @param senseInfo
 * @param ruleData
 * @param preferences
 */
export function generatePdfDataBucket4(abilities, currentXp, carryCapacity, encumberedWeight, pushDragLiftWeight, totalWeight, armorClass, initiative, speeds, senseInfo, ruleData, preferences) {
    return {
        armorClass,
        encumberedWeight: PdfGenerators.generateEncumberedWeightInfo(carryCapacity, encumberedWeight, preferences),
        initiative,
        pushDragLiftWeight: PdfGenerators.generatePushDragLiftWeight(pushDragLiftWeight, preferences),
        senses: PdfGenerators.generateSenses(senseInfo, ruleData),
        speeds,
        stats: abilities.map((ability) => PdfGenerators.generateAbility(ability, preferences)),
        totalWeight,
        xp: PdfGenerators.generateXp(currentXp, preferences),
    };
}
/**
 *
 * @param age
 * @param height
 * @param weight
 * @param eyes
 * @param skin
 * @param hair
 * @param size
 * @param faith
 * @param gender
 * @param alignment
 */
export function generatePdfDataBucket5(age, height, weight, eyes, skin, hair, size, faith, gender, alignment) {
    return {
        characteristics: {
            age,
            height,
            weight,
            eyes,
            skin,
            hair,
            size: PdfGenerators.generateSize(size),
            faith,
            gender,
            alignment: PdfGenerators.generateAlignment(alignment),
        },
    };
}
/**
 *
 * @param currencies
 * @param languages
 * @param name
 * @param notes
 * @param proficiencyBonus
 * @param traits
 */
export function generatePdfDataBucket6(currencies, languages, name, notes, proficiencyBonus, traits) {
    return {
        currencies,
        languages,
        name,
        notes,
        proficiencyBonus,
        traits,
    };
}
/**
 *
 * @param pdfDataBucket1
 * @param pdfDataBucket2
 * @param pdfDataBucket3
 * @param pdfDataBucket4
 * @param pdfDataBucket5
 * @param pdfDataBucket6
 */
export function generatePdfData(pdfDataBucket1, pdfDataBucket2, pdfDataBucket3, pdfDataBucket4, pdfDataBucket5, pdfDataBucket6) {
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, pdfDataBucket1), pdfDataBucket2), pdfDataBucket3), pdfDataBucket4), pdfDataBucket5), pdfDataBucket6);
}
