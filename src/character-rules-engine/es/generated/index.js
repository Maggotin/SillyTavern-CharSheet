// shouldn't the above be here, suffixed Contract?
const _WATERDEEP_ENTITLEMENT_FILTER = '1.1.0';
const _WATERDEEP_DATA_CONTRACTS = '2.1.0-alpha9.74';
export const initialChoiceComponentState = {
    background: [],
    class: [],
    feat: [],
    item: [],
    race: [],
    choiceDefinitions: [],
    definitionKeyNameMap: {},
};
export var PremadeInfoStatus;
(function (PremadeInfoStatus) {
    PremadeInfoStatus["DRAFT"] = "Draft";
    PremadeInfoStatus["PUBLISHED"] = "Published";
    PremadeInfoStatus["ARCHIVED"] = "Archived";
})(PremadeInfoStatus || (PremadeInfoStatus = {}));
export var CharacterStatusSlug;
(function (CharacterStatusSlug) {
    CharacterStatusSlug["ACTIVE"] = "active";
    CharacterStatusSlug["DELETED"] = "deleted";
    CharacterStatusSlug["LOCKED"] = "locked";
    CharacterStatusSlug["PREMADE"] = "premade";
})(CharacterStatusSlug || (CharacterStatusSlug = {}));
