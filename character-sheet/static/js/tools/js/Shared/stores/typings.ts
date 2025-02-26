export interface AppEnvDimensionsState {
  width: number;
  height: number;
  styleSizeType: string;
}

export interface DiceFeatureConfigurationState {
  enabled: boolean;
  menu: boolean;
  assetBaseLocation: string;
  apiEndpoint: string;
  trackingId: string;
}

export interface GameLogState {
  isOpen: boolean;
  lastMessageTime: number;
  apiEndpoint: string;
  ddbApiEndpoint: string;
}

export interface SharedAppState {
  appEnv: {
    dimensions: AppEnvDimensionsState;
    diceEnabled: boolean;
    diceFeatureConfiguration: DiceFeatureConfigurationState;
    gameLog: GameLogState;
  };
}

export interface ConfirmModalData {
  id: number;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
} 