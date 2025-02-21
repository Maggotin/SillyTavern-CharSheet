import { orderBy } from 'lodash';
import { ActionAccessors } from '../../Action';
import { ActivationAccessors } from '../../Activation';
import { ClassAccessors } from '../../Class';
import { ClassFeatureAccessors } from '../../ClassFeature';
import { ActivatableTypeEnum } from '../../Core';
import { FeatAccessors } from '../../Feat';
import { ItemAccessors, ItemValidators } from '../../Item';
import { RaceAccessors } from '../../Race';
import { RacialTraitAccessors } from '../../RacialTrait';
import { SpellAccessors } from '../../Spell';
import { deriveActivatableActions, deriveActivatableOptions } from '../derivers';
/**
 *
 * @param characterSpells
 * @param classSpells
 * @param classes
 * @param race
 * @param feats
 * @param innateActions
 * @param customActions
 * @param equippedItems
 */
export function generateActivatables(characterSpells, classSpells, classes, race, feats, innateActions, // TODO might need to change to InnateAction
customActions, // TODO might need to change to CustomAction
equippedItems) {
    const activatables = [];
    characterSpells.forEach((spell) => {
        const activation = SpellAccessors.getActivation(spell);
        if (activation !== null && ActivationAccessors.getType(activation) !== null) {
            activatables.push({
                type: ActivatableTypeEnum.CHARACTER_SPELL,
                sortText: SpellAccessors.getName(spell),
                key: SpellAccessors.getUniqueKey(spell),
                activation,
                limitedUse: SpellAccessors.getLimitedUse(spell),
                entity: spell,
                parentEntity: null,
            });
        }
    });
    classSpells.forEach((spell) => {
        const activation = SpellAccessors.getActivation(spell);
        if (activation !== null && ActivationAccessors.getType(activation) !== null) {
            activatables.push({
                type: ActivatableTypeEnum.CLASS_SPELL,
                sortText: SpellAccessors.getName(spell),
                key: SpellAccessors.getUniqueKey(spell),
                activation,
                limitedUse: null,
                entity: spell,
                parentEntity: null,
            });
        }
    });
    classes.forEach((charClass) => {
        ClassAccessors.getUniqueClassFeatures(charClass).forEach((feature) => {
            const actions = ClassFeatureAccessors.getActions(feature);
            const options = ClassFeatureAccessors.getOptions(feature);
            if (actions.length) {
                activatables.push(...deriveActivatableActions(actions, charClass));
            }
            if (options.length) {
                activatables.push(...deriveActivatableOptions(options, charClass));
            }
        });
    });
    if (race) {
        RaceAccessors.getRacialTraits(race).forEach((racialTrait) => {
            const actions = RacialTraitAccessors.getActions(racialTrait);
            const options = RacialTraitAccessors.getOptions(racialTrait);
            if (actions.length) {
                activatables.push(...deriveActivatableActions(actions, race));
            }
            if (options.length) {
                activatables.push(...deriveActivatableOptions(options, race));
            }
        });
    }
    feats.forEach((feat) => {
        const actions = FeatAccessors.getActions(feat);
        const options = FeatAccessors.getOptions(feat);
        if (actions.length) {
            activatables.push(...deriveActivatableActions(actions, race));
        }
        if (options.length) {
            activatables.push(...deriveActivatableOptions(options, race));
        }
    });
    innateActions.forEach((action) => {
        const activation = ActionAccessors.getActivation(action);
        if (activation !== null) {
            activatables.push({
                type: ActivatableTypeEnum.ACTION,
                sortText: ActionAccessors.getName(action),
                activation,
                key: ActionAccessors.getUniqueKey(action),
                limitedUse: null,
                entity: action,
                parentEntity: null,
            });
        }
    });
    customActions.forEach((action) => {
        const activation = ActionAccessors.getActivation(action);
        if (activation !== null && ActivationAccessors.getType(activation) !== null) {
            activatables.push({
                type: ActivatableTypeEnum.ACTION,
                sortText: ActionAccessors.getName(action),
                activation,
                key: ActionAccessors.getUniqueKey(action),
                limitedUse: null,
                entity: action,
                parentEntity: null,
            });
        }
    });
    equippedItems.filter(ItemValidators.validateCanContributeActions).forEach((item) => {
        activatables.push(...deriveActivatableActions(ItemAccessors.getInfusionActions(item), item));
    });
    return orderBy(activatables, ['sortText']);
}
