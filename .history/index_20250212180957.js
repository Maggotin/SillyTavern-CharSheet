import { eventSource, event_types } from '../../../../script.js'; import { getContext } from '../../../extensions.js'; import { CharacterSheetManager } from './charSheet.js';

const settingsKey = 'SillyTavernCharSheet'; const EXTENSION_NAME = 'Character Sheet D&D5e';

const defaultSettings = Object.freeze({ enabled: true });

let characterSheetManager;

/**

Renders a minimal “drawer” in the ST settings area for controlling
your extension. Similar to SillyTavern-Tracker’s approach. */ function renderExtensionSettings() {
    const context = getContext();
    const settingsContainer = document.getElementById('extensions_settings'); if (!settingsContainer) return;
// Check if we already placed our inline drawer let inlineDrawer = document.getElementById(${settingsKey}-drawer); if (!inlineDrawer) { // Create container inlineDrawer = document.createElement('div'); inlineDrawer.id = ${settingsKey}-drawer; inlineDrawer.className = 'inline-drawer';

