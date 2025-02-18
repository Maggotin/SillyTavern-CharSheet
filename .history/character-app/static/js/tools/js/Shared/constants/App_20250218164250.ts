import { Constants } from "../../character-rules-engine/es";

import { SIGNED_32BIT_INT_MAX_VALUE } from "~/subApps/sheet/constants";

export enum PaneHistoryInitTypeEnum {
  START = "START",
  PUSH = "PUSH",
}

export const SENSE_TYPE_LIST: Array<Constants.SenseTypeEnum> = [
  Constants.SenseTypeEnum.BLINDSIGHT,
  Constants.SenseTypeEnum.DARKVISION,
  Constants.SenseTypeEnum.TREMORSENSE,
  Constants.SenseTypeEnum.TRUESIGHT,
];

export const MOVEMENT_TYPE_LIST: Array<Constants.MovementTypeEnum> = [
  Constants.MovementTypeEnum.BURROW,
  Constants.MovementTypeEnum.CLIMB,
  Constants.MovementTypeEnum.FLY,
  Constants.MovementTypeEnum.SWIM,
  Constants.MovementTypeEnum.WALK,
];

export const CURRENCY_VALUE = {
  MAX: SIGNED_32BIT_INT_MAX_VALUE,
  MIN: 0,
};
export const CHARACTER_DESCRIPTION_NUMBER_VALUE = {
  MAX: SIGNED_32BIT_INT_MAX_VALUE,
  MIN: 0,
};
