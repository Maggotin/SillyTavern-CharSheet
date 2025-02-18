import PreferenceUpdateLocation from "./tools/js/Shared/constants/PreferenceUpdateLocation";

// Export all types from rules engine to minimize touchpoints
export * from "../../character-rules-engine/es/aliases/Typings";

export interface QueryResponseData {
  data: CharacterListContract;
}
export interface CharacterListContract {
  characters: Array<ShortCharacterContract>;
  characterSlotLimit: number | null;
  canUnlockCharacters: boolean;
}

// TODO this is also the same short character as the RE genereted.. that one is outedate.. can we share?
export interface ShortCharacterContract {
  avatarUrl: string;
  backdropUrl: string;
  campaignId: number | null;
  campaignName: string | null;
  characterSecondaryInfo: string;
  classDescription: string;
  coverImageUrl: string;
  createdDate: number;
  id: number;
  isAssigned: boolean;
  isReady: boolean;
  lastModifiedDate: number;
  level: number;
  name: string;
  raceName: string;
  status: CharacterStatusEnum;
  statusSlug: string;
}
export enum CharacterStatusEnum {
  Active = 1,
  Deleted = 2,
  Locked = 3,
}

export interface CharacterData extends ShortCharacterContract {
  userName: string | null;
}
export interface AppData {
  characters: Array<CharacterData>;
  maxCharacterSlotsAllowed: number | null;
  hasLockedCharacters: boolean;
}

//SORTING TYPES
export enum SortTypeEnum {
  Created = "created",
  Name = "name",
  Level = "level",
  Modified = "modified",
}

export enum SortOrderEnum {
  Ascending = "asc",
  Descending = "desc",
}

export interface LogEventOptions {
  category: string;
  action: string;
  label?: string;
  value?: string;
}

export type NumberDisplayType = "weightInLb" | "distanceInFt" | "signed";

/**
 * These types are cuz typescript 4.4 is not compatible with babylon.js v4
 * waiting for v5
 */

export interface WebGLObject {}

// export declare var WebGLObject: {
//   prototype: WebGLObject;
//   new (): WebGLObject;
// };

export interface ImageEncodeOptions {
  quality?: number;
  type?: string;
}

export interface OffscreenCanvas extends EventTarget {
  height: number;
  width: number;
  convertToBlob: any;
  getContext: any;
  transferToImageBitmap: any;
}

export interface MSGesture {
  target: Element;
  addPointer(pointerId: number): void;
  stop(): void;
}

// declare var MSGesture: {
//   prototype: MSGesture;
//   new (): MSGesture;
// };

export interface NavigatorUserMediaSuccessCallback {
  (stream: MediaStream): void;
}

export interface NavigatorUserMediaErrorCallback {
  (error: any): void;
}

export interface OffscreenCanvasRenderingContext2D
  extends CanvasCompositing,
    CanvasDrawImage,
    CanvasDrawPath,
    CanvasFillStrokeStyles,
    CanvasFilters,
    CanvasImageData,
    CanvasImageSmoothing,
    CanvasPath,
    CanvasPathDrawingStyles,
    CanvasRect,
    CanvasShadowStyles,
    CanvasState,
    CanvasText,
    CanvasTextDrawingStyles,
    CanvasTransform {
  readonly canvas: OffscreenCanvas;
  commit(): void;
}

// declare var OffscreenCanvasRenderingContext2D: {
//   prototype: OffscreenCanvasRenderingContext2D;
//   new (): OffscreenCanvasRenderingContext2D;
// };

export type MouseWheelEvent = WheelEvent;

export interface UserPreferences {
  abilityScoreDisplayType: number;
  privacyType: number;
  isDarkModeEnabled: boolean;
  isDiceRollingEnabled?: boolean;
  updateLocation?: PreferenceUpdateLocation;
  defaultEnabledSourceCategories: Record<number, boolean>;
  isHomebrewEnabled: boolean;
}

export type ThemeMode = "light" | "dark";
