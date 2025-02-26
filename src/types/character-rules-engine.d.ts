declare module './character-rules-engine/es' {
  export const Constants: any;
  export interface DecorationInfo {}
  export const DecorationUtils: {
    isDarkMode: (info: DecorationInfo) => boolean;
    getCharacterTheme: (info: DecorationInfo) => { themeColor: string; isDefault: boolean };
  };
} 