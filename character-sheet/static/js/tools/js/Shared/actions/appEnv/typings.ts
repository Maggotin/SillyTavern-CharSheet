import { AppEnvDimensionsState } from "../../stores/typings";

export interface DataSetPayload {
  username?: string;
  userId?: number;
  userRoles?: Array<string>;
  characterId?: number | null;
  authEndpoint?: string;
  redirect?: string;
  diceEnabled?: boolean;
  diceFeatureConfiguration?: any;
  gameLog?: any;
}

export interface DataSetAction {
  type: string;
  payload: DataSetPayload;
}

export interface MobileSetAction {
  type: string;
  payload: {
    isMobile: boolean;
  };
}

export interface DimensionsSetAction {
  type: string;
  payload: {
    dimensions: Omit<AppEnvDimensionsState, "styleSizeType">;
  };
} 