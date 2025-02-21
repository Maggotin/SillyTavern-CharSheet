import { ChoiceGenerators } from '../Choice';
import { DataOriginDataInfoKeyEnum, DataOriginTypeEnum } from '../DataOrigin';
import { FeatList } from '../FeatList';
import { ModifierGenerators } from '../Modifier';
import { getCustomBackground, getEntityTypeId, getHasCustomBackground, getId, getModifiers, getSpellListIds, } from './accessors';
import { deriveUniqueKey } from './derivers';
/**
 *
 * @param background
 * @param modifierLookup
 * @param choiceLookup
 * @param choiceComponents
 * @param baseFeats
 */
export function generateBackground(background, modifierLookup, choiceLookup, choiceComponents, baseFeats) {
    var _a, _b;
    if (!background || (background && !getHasCustomBackground(background) && background.definition === null)) {
        return null;
    }
    let backgroundInfo;
    if (getHasCustomBackground(background) && background.customBackground) {
        const { featuresBackground, characteristicsBackground, name, description, id, entityTypeId } = background.customBackground;
        let featureName = '';
        let featureDescription = '';
        if (featuresBackground) {
            featureName = featuresBackground.featureName ? featuresBackground.featureName : '';
            featureDescription = featuresBackground.featureDescription ? featuresBackground.featureDescription : '';
        }
        let bonds = [];
        let flaws = [];
        let ideals = [];
        let personalityTraits = [];
        if (characteristicsBackground) {
            bonds = characteristicsBackground.bonds === null ? [] : characteristicsBackground.bonds;
            flaws = characteristicsBackground.flaws === null ? [] : characteristicsBackground.flaws;
            ideals = characteristicsBackground.ideals === null ? [] : characteristicsBackground.ideals;
            personalityTraits =
                characteristicsBackground.personalityTraits === null ? [] : characteristicsBackground.personalityTraits;
        }
        backgroundInfo = {
            hasCustomBackground: getHasCustomBackground(background),
            customBackground: getCustomBackground(background),
            definitionId: id,
            definition: {
                avatarUrl: '',
                largeAvatarUrl: '',
                organization: null,
                snippet: '',
                contractsDescription: null,
                equipmentDescription: '',
                languagesDescription: '',
                skillProficienciesDescription: '',
                spellsPreDescription: null,
                spellsPostDescription: null,
                toolProficienciesDescription: '',
                suggestedCharacteristicsDescription: '',
                suggestedLanguages: [],
                suggestedProficiencies: [],
                id,
                entityTypeId,
                name,
                description,
                shortDescription: description,
                featureName,
                featureDescription,
                bonds,
                flaws,
                ideals,
                personalityTraits,
                isHomebrew: false,
                sources: [],
                spellListIds: [],
                grantedFeats: [],
            },
        };
    }
    else {
        backgroundInfo = background;
    }
    const backgroundId = getId(backgroundInfo);
    const backgroundTypeId = getEntityTypeId(backgroundInfo);
    const choices = ChoiceGenerators.generateBaseChoices(backgroundId, backgroundTypeId, choiceLookup, DataOriginTypeEnum.BACKGROUND, backgroundInfo);
    const modifiers = ModifierGenerators.generateModifiers(backgroundId, backgroundTypeId, modifierLookup, DataOriginTypeEnum.BACKGROUND, backgroundInfo);
    const featLists = ((_b = (_a = backgroundInfo.definition) === null || _a === void 0 ? void 0 : _a.grantedFeats) === null || _b === void 0 ? void 0 : _b.map((featListContract) => new FeatList(featListContract, choiceComponents.definitionKeyNameMap, baseFeats))) || [];
    return Object.assign(Object.assign({}, backgroundInfo), { choices,
        modifiers,
        featLists });
}
/**
 *
 * @param background
 */
export function generateBackgroundModifiers(background) {
    return background ? getModifiers(background) : [];
}
/**
 *
 * @param background
 */
export function generateRefBackgroundData(background) {
    let data = {};
    if (background !== null) {
        data[deriveUniqueKey(background)] = {
            [DataOriginDataInfoKeyEnum.PRIMARY]: background,
            [DataOriginDataInfoKeyEnum.PARENT]: null,
        };
    }
    return data;
}
/**
 *
 * @param background
 */
export function generateGlobalSpellListIds(background) {
    return background ? getSpellListIds(background) : [];
}
