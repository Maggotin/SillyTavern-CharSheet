export interface OpenAction {
  type: string;
  payload: {
    key: string;
  };
}

export interface CloseAction {
  type: string;
  payload: {
    key: string;
  };
} 