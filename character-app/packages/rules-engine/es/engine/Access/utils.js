import { AccessTypeEnum } from './constants';
export function isAccessible(accessType) {
    return (accessType === AccessTypeEnum.FREE ||
        accessType === AccessTypeEnum.OWNED ||
        accessType === AccessTypeEnum.SHARED);
}
