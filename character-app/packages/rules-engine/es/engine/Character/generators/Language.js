import { TypeScriptUtils } from '../../../utils';
import { ModifierAccessors, ModifierValidators } from '../../Modifier';
/**
 *
 * @param modifiers
 */
export function generateLanguages(modifiers) {
    return modifiers
        .filter((modifier) => ModifierValidators.isLanguageModifier(modifier))
        .map((modifier) => ModifierAccessors.getFriendlySubtypeName(modifier))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
