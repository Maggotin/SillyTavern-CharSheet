import * as actionTypes from '../actionTypes';

interface ActionMeta {
  commit?: {
    type: string;
  };
  accept?: () => void;
  reject?: () => void;
}

interface ActionPayload {
  name?: string;
  actionType?: string;
  actions?: any[];
  id?: string | number;
  entityTypeId?: number;
  uses?: number;
  dataOriginType?: string;
  action?: any;
  properties?: Record<string, any>;
  mappingId?: string | number;
  mappingEntityTypeId?: number;
}

interface ActionResponse {
  type: string;
  payload: ActionPayload;
  meta: ActionMeta;
}

export function customActionCreate(name: string, actionType: string): ActionResponse {
  return {
    type: actionTypes.CUSTOM_ACTION_CREATE,
    payload: {
      name,
      actionType,
    },
    meta: {},
  };
}

export function actionsSet(actions: any[]): ActionResponse {
  return {
    type: actionTypes.ACTIONS_SET,
    payload: {
      actions,
    },
    meta: {
      commit: {
        type: actionTypes.ACTIONS_SET_COMMIT,
      },
    },
  };
}

export function actionUseSet(
  id: string | number,
  entityTypeId: number,
  uses: number,
  dataOriginType: string
): ActionResponse {
  return {
    type: actionTypes.ACTION_USE_SET,
    payload: {
      id,
      entityTypeId,
      uses,
      dataOriginType,
    },
    meta: {
      commit: {
        type: actionTypes.ACTION_USE_SET_COMMIT,
      },
    },
  };
}

export function customActionAdd(action: any): ActionResponse {
  return {
    type: actionTypes.CUSTOM_ACTION_ADD,
    payload: {
      action,
    },
    meta: {
      commit: {
        type: actionTypes.CUSTOM_ACTION_ADD_COMMIT,
      },
    },
  };
}

export function customActionRemove(id: string | number): ActionResponse {
  return {
    type: actionTypes.CUSTOM_ACTION_REMOVE,
    payload: {
      id,
    },
    meta: {
      commit: {
        type: actionTypes.CUSTOM_ACTION_REMOVE_COMMIT,
      },
    },
  };
}

export function customActionSet(
  id: string | number,
  properties: Record<string, any>
): ActionResponse {
  return {
    type: actionTypes.CUSTOM_ACTION_SET,
    payload: {
      id,
      properties,
    },
    meta: {
      commit: {
        type: actionTypes.CUSTOM_ACTION_SET_COMMIT,
      },
    },
  };
}

export function actionCustomizationsDelete(
  mappingId: string | number,
  mappingEntityTypeId: number
): ActionResponse {
  return {
    type: actionTypes.ACTION_CUSTOMIZATIONS_DELETE,
    payload: {
      mappingId,
      mappingEntityTypeId,
    },
    meta: {},
  };
}
