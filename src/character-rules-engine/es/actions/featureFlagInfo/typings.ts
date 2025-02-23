import * as actionTypes from './actionTypes';

export interface Action<T = unknown, M = unknown> {
    type: string;
    payload: T;
    meta?: M;
}

export interface FeatureFlagInfoSetAction extends Action<unknown> {
    type: typeof actionTypes.DATA_SET;
}

export type FeatureFlagInfoAction = FeatureFlagInfoSetAction;
