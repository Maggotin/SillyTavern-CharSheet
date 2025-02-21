import { SaveTypeEnum } from '../../Core';
/**
 *
 * @param type
 */
export function deriveSaveTypeName(type) {
    let name = '';
    switch (type) {
        case SaveTypeEnum.ADVANTAGE:
            name = 'Advantage';
            break;
        case SaveTypeEnum.DISADVANTAGE:
            name = 'Disadvantage';
            break;
        case SaveTypeEnum.BONUS:
            name = 'Bonus';
            break;
        default:
        //not implemented
    }
    return name;
}
