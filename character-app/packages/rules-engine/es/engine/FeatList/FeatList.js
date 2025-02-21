import { sortBy } from 'lodash';
import { characterActions } from "../../actions";
import { getDispatch } from '../../config/utils';
import { EntityTypeEnum } from '../Core';
import { DataOriginTypeEnum } from '../DataOrigin';
export class FeatList {
    constructor(definition, definitionKeyNameMap, baseFeats) {
        this.definition = definition;
        this.baseFeatLookup = this.buildBaseFeatLookup(baseFeats);
        this.availableChoices = this.buildChoices(definitionKeyNameMap);
        this.chosenFeatId = this.findChosenFeatId(baseFeats);
    }
    buildBaseFeatLookup(baseFeats) {
        var _a;
        // Group the character's feats by id
        const baseFeatLookup = {};
        for (const baseFeat of baseFeats) {
            const featId = ((_a = baseFeat.definition) === null || _a === void 0 ? void 0 : _a.id) || baseFeat.definitionId;
            baseFeatLookup[featId] = baseFeat;
        }
        return baseFeatLookup;
    }
    buildChoices(definitionKeyNameMap) {
        let choices = [];
        for (const featId of this.definition.featIds) {
            // If the character already has a feat from somewhere else, don't include it in the list of choices.
            // Do include the feat if the character has the feat because of this feat list.
            if (!this.baseFeatLookup.hasOwnProperty(featId) ||
                (this.baseFeatLookup.hasOwnProperty(featId) &&
                    this.baseFeatLookup[featId].componentTypeId === EntityTypeEnum.FEAT_LIST &&
                    this.baseFeatLookup[featId].componentId === this.definition.id)) {
                const defKey = `${DataOriginTypeEnum.FEAT}:${featId}`;
                if (definitionKeyNameMap.hasOwnProperty(defKey)) {
                    choices.push({ value: featId, label: definitionKeyNameMap[defKey] });
                }
            }
        }
        choices = sortBy(choices, (x) => x.label);
        return choices;
    }
    findChosenFeatId(baseFeats) {
        var _a;
        for (const baseFeat of baseFeats) {
            if (baseFeat.componentTypeId === EntityTypeEnum.FEAT_LIST && baseFeat.componentId === this.definition.id) {
                return ((_a = baseFeat.definition) === null || _a === void 0 ? void 0 : _a.id) || baseFeat.definitionId;
            }
        }
        return null;
    }
    hasChoiceToMake() {
        return this.chosenFeatId === null && this.availableChoices.length > 0;
    }
    isSingleFeat() {
        // Sometimes FeatLists only have one Feat in them. In that case, the backend
        // would have already assigned the Feat to the Character.
        // In that case, there's no choice to make - just show the Feat to the user.
        return (this.chosenFeatId !== null &&
            this.definition.featIds.length === 1 &&
            this.definition.featIds[0] === this.chosenFeatId);
    }
    isEmpty() {
        // Due to entitlements, it is possible that all of the choices got filtered out.
        // Or, the feat list was configured incorrectly, with no feats!
        return this.chosenFeatId === null && this.definition.featIds.length === 0;
    }
    alreadyHasEveryFeat() {
        // Since you can get Feats from various places, it is possible that there is nothing to
        // show to the user because they already have the feat(s).
        return this.definition.featIds.every((x) => this.baseFeatLookup.hasOwnProperty(x));
    }
    handleChoiceSelected(newValue, oldValue, accept, reject) {
        const featId = parseInt(newValue, 10);
        this.chosenFeatId = featId !== -1 ? featId : null;
        const action = characterActions.setEntityFeat(this.chosenFeatId, this.definition.id, EntityTypeEnum.FEAT_LIST);
        getDispatch()(action);
        accept();
    }
}
