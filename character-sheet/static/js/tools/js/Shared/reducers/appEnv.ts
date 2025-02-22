import {
  DESKTOP_COMPONENT_START_WIDTH,
  DESKTOP_LARGE_COMPONENT_START_WIDTH,
  TABLET_COMPONENT_START_WIDTH,
} from "../../CharacterSheet/config";
import * as actionTypes from "../actions/appEnv/actionTypes";
import { AppEnvAction } from "../actions/appEnv/typings";
import { AppEnvState } from "../stores/typings";

export enum StyleSizeTypeEnum {
  NONE = 0,
  MOBILE = 1,
  TABLET = 2,
  DESKTOP = 3,
  DESKTOP_LARGE = 4,
}

export const initialEnvState: AppEnvState = {
  authEndpoint: null,
  username: null,
  userId: -1,
  userRoles: [],
  characterId: null,
  characterEndpoint: "",
  characterServiceBaseUrl: null,
  isMobile: true,
  isReadonly: true,
  canOverrideReadOnly: false,
  redirect: "",
  diceEnabled: false,
  diceFeatureConfiguration: {
    enabled: true,
    menu: true,
    assetBaseLocation: "",
    trackingId: "",
    apiEndpoint: "",
  },
  gameLog: {
    isOpen: false,
    lastMessageTime: 0,
    apiEndpoint: "",
    ddbApiEndpoint: "",
  },
  dimensions: {
    styleSizeType: StyleSizeTypeEnum.NONE,
    window: {
      width: 0,
      height: 0,
    },
    sheet: {
      width: 0,
      height: 0,
    },
  },
  characterSlots: {
    characterSlotLimit: null,
    activeCharacterCount: 0,
    lockedCharacterCount: 0,
    allCharactersLocked: false,
  },
};
function appEnv(
  state: AppEnvState = initialEnvState,
  action: AppEnvAction
): AppEnvState {
  switch (action.type) {
    case actionTypes.DATA_SET:
      return {
        ...state,
        ...action.payload,
      };

    case actionTypes.MOBILE_SET:
      return {
        ...state,
        isMobile: action.payload.isMobile,
      };

    case actionTypes.DIMENSIONS_SET: {
      let styleSizeType: StyleSizeTypeEnum = StyleSizeTypeEnum.NONE;
      const windowWidth = action.payload.dimensions.window.width;

      if (windowWidth >= DESKTOP_LARGE_COMPONENT_START_WIDTH) {
        styleSizeType = StyleSizeTypeEnum.DESKTOP_LARGE;
      } else if (windowWidth >= DESKTOP_COMPONENT_START_WIDTH) {
        styleSizeType = StyleSizeTypeEnum.DESKTOP;
      } else if (windowWidth >= TABLET_COMPONENT_START_WIDTH) {
        styleSizeType = StyleSizeTypeEnum.TABLET;
      } else {
        styleSizeType = StyleSizeTypeEnum.MOBILE;
      }

      return {
        ...state,
        dimensions: {
          ...action.payload.dimensions,
          styleSizeType,
        },
      };
    }

    default:
    // not implemented
  }

  return state;
}

export default appEnv;
