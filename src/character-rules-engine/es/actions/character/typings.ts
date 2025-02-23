import type { 
    actionUseSet, 
    customActionAdd, 
    customActionCreate, 
    actionsSet
} from './actions/action';
import type { 
    backgroundChoose, 
    backgroundSet,
    backgroundCustomSetRequest,
    backgroundHasCustomSet,
    backgroundHasCustomSetRequest
} from './actions/background';
import type { 
    characterLoad, 
    loadLazyCharacterData,
    customProficiencySet
} from './actions/character';
import type { 
    classAddRequest, 
    classRemoveRequest, 
    classAdd,
    classesSet
} from './actions/class';
import type { 
    classFeatureChoiceSetRequest
} from './actions/classFeature';
import type { 
    conditionSet, 
    conditionAdd, 
    conditionsSet,
    conditionRemove
} from './actions/conditions';
import type { 
    itemAdd,
    itemRemove,
    itemEquippedSet,
    itemQuantitySet
} from './actions/item';
import type { 
    optionsSet
} from './actions/option';
import type { 
    raceChoose, 
    raceSet
} from './actions/race';
import type { 
    spellCreate, 
    spellAdd, 
    spellPreparedSet,
    spellRemove,
    spellSlotsSet
} from './actions/spell';
import type { 
    valueSet, 
    valueRemove
} from './actions/value';

export interface Action<T = unknown, M = unknown> {
    type: string;
    payload: T;
    meta?: M;
}

export type CharacterAction = ReturnType<
    | typeof actionUseSet
    | typeof customActionAdd
    | typeof customActionCreate
    | typeof actionsSet
    | typeof backgroundChoose
    | typeof backgroundSet
    | typeof backgroundCustomSetRequest
    | typeof backgroundHasCustomSet
    | typeof backgroundHasCustomSetRequest
    | typeof characterLoad
    | typeof loadLazyCharacterData
    | typeof customProficiencySet
    | typeof classAddRequest
    | typeof classRemoveRequest
    | typeof classAdd
    | typeof classesSet
    | typeof classFeatureChoiceSetRequest
    | typeof conditionSet
    | typeof conditionAdd
    | typeof conditionsSet
    | typeof conditionRemove
    | typeof itemAdd
    | typeof itemRemove
    | typeof itemEquippedSet
    | typeof itemQuantitySet
    | typeof optionsSet
    | typeof raceChoose
    | typeof raceSet
    | typeof spellCreate
    | typeof spellAdd
    | typeof spellPreparedSet
    | typeof spellRemove
    | typeof spellSlotsSet
    | typeof valueSet
    | typeof valueRemove
>;
