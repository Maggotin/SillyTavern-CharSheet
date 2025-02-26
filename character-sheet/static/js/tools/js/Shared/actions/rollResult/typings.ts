export interface RollResultData {
  id: string;
  title: string;
  result: number;
  formula: string;
  timestamp: number;
  breakdown?: string;
  context?: string;
}

export interface CreateAction {
  type: string;
  payload: {
    rollResult: RollResultData;
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