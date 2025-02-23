import { ClassValidators } from '../Class';
import { getClassId } from './accessors';
/**
 *
 * @param charClass
 * @param classFeature
 */
export function isValidClassClassFeature(charClass, classFeature) {
    return ClassValidators.isValidClassId(charClass, getClassId(classFeature));
}
