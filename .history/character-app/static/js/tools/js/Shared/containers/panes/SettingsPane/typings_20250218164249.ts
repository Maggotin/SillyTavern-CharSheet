import { HtmlSelectOption } from "../../character-rules-engine/es";

export enum SettingsContextsEnum {
  COIN = "COIN",
  ENCUMBRANCE = "ENCUMBRANCE",
  FEATURES = "FEATURES",
}

export enum SettingsTypeEnum {
  TOGGLE = "TOGGLE",
  SELECT = "SELECT",
}

export interface SettingsToggle {
  heading: string;
  description: string;
  key: string;
  type: SettingsTypeEnum;
}

export interface SettingsSelect extends SettingsToggle {
  options: Array<HtmlSelectOption>;
  initialOptionRemoved: boolean;
  block: boolean;
}

export type SettingsContexts = {
  [key in SettingsContextsEnum]: Array<SettingsToggle | SettingsSelect>;
};
