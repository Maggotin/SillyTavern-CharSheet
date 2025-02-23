import * as ApiAdapterUtils from '../../../apiAdapter/utils';
import { ApiTypeEnum } from '../../constants';
/**
 *
 */
export const getGameDataRuleDataVehicle = ApiAdapterUtils.makeGet(ApiTypeEnum.GAME_DATA_SERVICE, 'vehicles/v3/rule-data');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterNameRandom = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'name/random');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getSuggestedNames = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'name/random/list');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataBackgrounds = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/backgrounds');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataBackdrops = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/backdrops');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataFeats = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/feats');
// /features/v1/features/collection?category=blessing
export const getCharacterGameDataFeatures = ApiAdapterUtils.makeGet(ApiTypeEnum.GAME_DATA_SERVICE, 'features/v1/features/collection');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataFrames = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/frames');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataPortraits = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/portraits');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataSubclasses = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/subclasses');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataThemeColors = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/themes');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataClasses = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/classes');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataSpells = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/spells');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataAlwaysKnownSpells = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/always-known-spells');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataAlwaysPreparedSpells = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/always-prepared-spells');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataRaces = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/races');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataBackgroundStartingEquipment = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/background-starting-equipment');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataClassStartingEquipment = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/class-starting-equipment');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataItems = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/items');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataMonsters = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/monsters');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataRacialTraits = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/racial-trait/collection');
/**
 * This is a temporary character service endpoint and will eventually be moved to the game data service
 */
export const getCharacterGameDataClassFeatures = ApiAdapterUtils.makeGet(ApiTypeEnum.HACK__CHARACTER_SERVICE_GAME_DATA, 'game-data/class-feature/collection');
