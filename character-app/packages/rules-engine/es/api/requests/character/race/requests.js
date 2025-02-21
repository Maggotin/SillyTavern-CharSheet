import * as ApiAdapterUtils from '../../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../../constants';
/**
 *
 */
export const putCharacterRace = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'race');
/**
 *
 */
export const putCharacterRaceRacialTraitChoice = ApiAdapterUtils.makePut(ApiTypeEnum.CHARACTER_SERVICE, 'race/trait/choice');
