import { DEFAULT_FEATURE_FLAG_INFO, FeatureFlagInfoUtils, FeatureFlagEnum, } from '../engine/FeatureFlagInfo';
export class FeatureFlagManager {
    // TODO: let make this optional and just get it with the rules engine config...
    constructor(featureFlagInfo) {
        this.featureFlagInfo = DEFAULT_FEATURE_FLAG_INFO;
        this.FLAGS = FeatureFlagEnum;
        /**
         *
         * @param flag the name of a flag
         * @returns its current value
         *
         * Try featureFlagManager.getFlag(featureFlagManager.NAME_OF_FLAG)
         */
        this.getFlag = (flag) => {
            return FeatureFlagInfoUtils.getFeatureFlagInfoValue(flag, this.featureFlagInfo);
        };
        /**
         *
         * @param featureFlagInfo the new feature flags
         */
        this.update = (featureFlagInfo) => {
            this.featureFlagInfo = featureFlagInfo;
        };
        this.featureFlagInfo = featureFlagInfo;
    }
}
