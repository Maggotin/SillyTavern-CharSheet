import { CoreUtils, DisplayConfigurationValueEnum } from '../Core';
import { getDisplayConfiguration } from './accessors';
export function filterRacialTraitsByDisplayConfigurationType(racialTraits, displayConfigurationTypes) {
    return racialTraits.filter((racialTrait) => {
        const displayConfiguration = getDisplayConfiguration(racialTrait);
        if (!displayConfiguration) {
            return true;
        }
        const displayConfigurationValues = displayConfigurationTypes.map((displayConfigurationType) => CoreUtils.getDisplayConfigurationValue(displayConfigurationType, displayConfiguration));
        return displayConfigurationValues.some((displayConfigurationValue) => displayConfigurationValue === DisplayConfigurationValueEnum.ON);
    });
}
