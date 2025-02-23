import type { classAlwaysKnownSpellsSet } from './actions/classAlwaysKnownSpells';
import type { classAlwaysPreparedSpellsSet } from './actions/classAlwaysPreparedSpells';
import type { definitionPoolAdd } from './actions/definitionPool';
import type {
    infusionMappingCreate,
    infusionMappingAdd,
    infusionMappingDestroy,
    infusionMappingsDestroy,
    infusionMappingRemove
} from './actions/infusionMapping';
import type {
    knownInfusionMappingCreate,
    knownInfusionMappingAdd,
    knownInfusionMappingDestroy,
    knownInfusionMappingSet,
    knownInfusionMappingRemove
} from './actions/knownInfusionMapping';
import type { ruleDataPoolKeySet } from './actions/ruleDataPool';
import type {
    vehicleComponentMappingAdd,
    vehicleComponentMappingRemove,
    vehicleComponentMappingHitPointsSet
} from './actions/vehicleComponentMapping';
import type {
    vehicleMappingCreate,
    vehicleMappingAdd,
    vehicleMappingRemove,
    vehicleMappingDataSet,
    vehicleMappingRemainingFuelSet,
    vehicleMappingConditionSet,
    vehicleMappingConditionAdd,
    vehicleMappingConditionRemove
} from './actions/vehicleMapping';

export interface Action<T = unknown, M = unknown> {
    type: string;
    payload: T;
    meta?: M;
}

export type ServiceDataAction = ReturnType<
    | typeof classAlwaysKnownSpellsSet
    | typeof classAlwaysPreparedSpellsSet
    | typeof definitionPoolAdd
    | typeof infusionMappingCreate
    | typeof infusionMappingAdd
    | typeof infusionMappingDestroy
    | typeof infusionMappingsDestroy
    | typeof infusionMappingRemove
    | typeof knownInfusionMappingCreate
    | typeof knownInfusionMappingAdd
    | typeof knownInfusionMappingDestroy
    | typeof knownInfusionMappingSet
    | typeof knownInfusionMappingRemove
    | typeof ruleDataPoolKeySet
    | typeof vehicleComponentMappingAdd
    | typeof vehicleComponentMappingRemove
    | typeof vehicleComponentMappingHitPointsSet
    | typeof vehicleMappingCreate
    | typeof vehicleMappingAdd
    | typeof vehicleMappingRemove
    | typeof vehicleMappingDataSet
    | typeof vehicleMappingRemainingFuelSet
    | typeof vehicleMappingConditionSet
    | typeof vehicleMappingConditionAdd
    | typeof vehicleMappingConditionRemove
>;
