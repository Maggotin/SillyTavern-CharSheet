export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface ToastMessageData {
  id: string;
  type: ToastType;
  message: string;
  timestamp: number;
  duration?: number;
}

export interface CreateAction {
  type: string;
  payload: {
    toast: ToastMessageData;
  };
}

export interface RemoveAction {
  type: string;
  payload: {
    id: string;
  };
}

export interface ClearAction {
  type: string;
} 