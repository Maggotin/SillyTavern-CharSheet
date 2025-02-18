import { AppEnvDimensionsState } from "../../stores/typings";
import * as actionTypes from "./actionTypes";
import {
  DataSetAction,
  DataSetPayload,
  DimensionsSetAction,
  MobileSetAction,
} from "./typings";

/**
 *
 * @param payload
 */
export function dataSet(payload: DataSetPayload): DataSetAction {
  return {
    type: actionTypes.DATA_SET,
    payload,
  };
}

/**
 *
 * @param isMobile
 */
export function mobileSet(isMobile: boolean): MobileSetAction {
  return {
    type: actionTypes.MOBILE_SET,
    payload: {
      isMobile,
    },
  };
}

/**
 *
 * @param dimensions
 */
export function dimensionsSet(
  dimensions: Omit<AppEnvDimensionsState, "styleSizeType">
): DimensionsSetAction {
  return {
    type: actionTypes.DIMENSIONS_SET,
    payload: {
      dimensions,
    },
  };
}
