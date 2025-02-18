import { FormatUtils } from '../Format';
import { RuleDataUtils } from '../RuleData';
import { getTime, getType } from './accessors';
import { ActivationTypeEnum } from './constants';
/**
 *
 * @param time
 * @param type
 */
export function renderActivationPluralSuffix(time, type) {
    let pluralSuffix = '';
    if (time !== null && time !== 1) {
        switch (type) {
            case ActivationTypeEnum.REACTION:
            case ActivationTypeEnum.ACTION:
            case ActivationTypeEnum.HOUR:
            case ActivationTypeEnum.MINUTE:
            case ActivationTypeEnum.BONUS_ACTION:
                pluralSuffix = 's';
                break;
            default:
            // not implemented
        }
    }
    return pluralSuffix;
}
/**
 *
 * @param activation
 * @param ruleData
 * @param defaultTime
 */
export function renderActivation(activation, ruleData, defaultTime = 1) {
    const activationTime = getTime(activation);
    const activationType = getType(activation);
    if (!activationType) {
        return '';
    }
    const activationTypeInfo = RuleDataUtils.getActivationTypeInfo(activationType, ruleData);
    const activationTypeName = activationTypeInfo ? activationTypeInfo.name : '';
    let time = activationTime === null ? defaultTime : activationTime;
    if (activationType === ActivationTypeEnum.SPECIAL || activationType === ActivationTypeEnum.NO_ACTION) {
        time = null;
    }
    return `${time ? `${time} ` : ''}${activationTypeName}${renderActivationPluralSuffix(time, activationType)}`;
}
/**
 *
 * @param activation
 * @param additionalTime
 * @param ruleData
 */
export function renderCastingTime(activation, additionalTime, ruleData) {
    const activationTime = getTime(activation);
    const activationType = getType(activation);
    let activationTypeInfo = null;
    if (activationType) {
        activationTypeInfo = RuleDataUtils.getActivationTypeInfo(activationType, ruleData);
    }
    additionalTime = additionalTime ? additionalTime : 0;
    let castingTimeString = '';
    if (activationTime && activationTypeInfo) {
        if (additionalTime > 0) {
            if (activationType === ActivationTypeEnum.MINUTE) {
                const totalTime = activationTime + additionalTime;
                castingTimeString = `${totalTime} Minute${totalTime !== 1 ? 's' : ''}`;
            }
            else {
                castingTimeString = `${activationTime} ${activationTypeInfo.name} + ${additionalTime} Minute${additionalTime !== 1 ? 's' : ''}`;
            }
        }
        else {
            castingTimeString = `${activationTime} ${activationTypeInfo.name}${renderActivationPluralSuffix(activationTime, activationType)}`;
        }
    }
    else if (activationTypeInfo) {
        castingTimeString = activationTypeInfo.name ? activationTypeInfo.name : '';
    }
    return FormatUtils.upperCaseFirstLetterOnly(castingTimeString);
}
/**
 *
 * @param activation
 * @param additionalTime
 */
export function renderCastingTimeAbbreviation(activation, additionalTime = 0) {
    const activationTime = getTime(activation);
    const activationType = getType(activation);
    let castingTimeString = '';
    if (activationTime) {
        if (additionalTime > 0) {
            if (activationType === ActivationTypeEnum.MINUTE) {
                const totalTime = activationTime + additionalTime;
                castingTimeString = `${totalTime}${renderActivationAbbreviation(ActivationTypeEnum.MINUTE)}`;
            }
            else {
                castingTimeString = `${activationTime}${renderActivationAbbreviation(activationType)} + ${additionalTime}${renderActivationAbbreviation(ActivationTypeEnum.MINUTE)}`;
            }
        }
        else {
            castingTimeString = `${activationTime}${renderActivationAbbreviation(activationType)}`;
        }
    }
    else {
        castingTimeString = renderActivationAbbreviation(activationType);
    }
    return castingTimeString;
}
/**
 * Gets the abbreviation for the specified activation type
 * @param activationType The activation type to abbreviate
 */
export function renderActivationAbbreviation(activationType) {
    switch (activationType) {
        case ActivationTypeEnum.BONUS_ACTION:
            return 'BA';
        case ActivationTypeEnum.ACTION:
            return 'A';
        case ActivationTypeEnum.REACTION:
            return 'R';
        case ActivationTypeEnum.SPECIAL:
            return 'S';
        case ActivationTypeEnum.HOUR:
            return 'h';
        case ActivationTypeEnum.MINUTE:
            return 'm';
        default:
        // not implemented
    }
    return '';
}
