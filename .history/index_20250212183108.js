import { eventSource, event_types } from "../../../../script.js";
import { getContext } from "../../../extensions.js";
import { CharacterSheetManager } from "./src/ui/charSheet.js";

const settingsKey = 'SillyTavernCharSheet';
const EXTENSION_NAME = 'Character Sheet D&D5e';

/**
 * @typedef {Object} CharSheetSettings
 * @property {boolean} enabled Whether the extension is enabled
 */
const defaultSettings = Object.freeze({
    enabled: true,
});

let sheetManager = null;

function renderExtensionSettings() {
    const context = getContext();
    const settingsContainer = document.getElementById('extensions_settings2');
    if (!settingsContainer) return;

    const inlineDrawer = document.createElement('div');
    inlineDrawer.classList.add('inline-drawer');
    settingsContainer.append(inlineDrawer);

    const drawerHeader = document.createElement('div');
    drawerHeader.classList.add('inline-drawer-header');

    const headerText = document.createElement('b');
    headerText.textContent = EXTENSION_NAME;

    const headerIcon = document.createElement('div');
    headerIcon.classList.add('inline-drawer-icon', 'fa-solid', 'fa-circle-chevron-down');

    drawerHeader.append(headerText, headerIcon);

    const drawerContent = document.createElement('div');
    drawerContent.classList.add('inline-drawer-content');

    // Settings controls
    const settings = context.extensionSettings[settingsKey];

    // Enabled toggle
    const enabledLabel = document.createElement('label');
    enabledLabel.classList.add('checkbox_label');
    const enabledInput = document.createElement('input');
    enabledInput.type = 'checkbox';
    enabledInput.checked = settings.enabled;
    enabledInput.addEventListener('change', () => {
        settings.enabled = enabledInput.checked;
        context.saveSettingsDebounced();
        if (settings.enabled) {
            sheetManager?.show();
        } else {
            sheetManager?.hide();
        }
    });
    const enabledText = document.createElement('span');
    enabledText.textContent = 'Enabled';
    enabledLabel.append(enabledInput, enabledText);

    // Toggle sheet button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'menu_button';
    toggleButton.textContent = 'Toggle Character Sheet';
    toggleButton.addEventListener('click', () => sheetManager?.toggle());

    drawerContent.append(enabledLabel, toggleButton);
    inlineDrawer.append(drawerHeader, drawerContent);
}

// Initialize the extension
(function initExtension() {
    const context = getContext();

    // Initialize settings
    if (!context.extensionSettings[settingsKey]) {
        context.extensionSettings[settingsKey] = structuredClone(defaultSettings);
    }

    // Create sheet manager
    sheetManager = new CharacterSheetManager();

    // Register event handlers
    eventSource.on(event_types.CHAT_CHANGED, () => {
        if (!context.extensionSettings[settingsKey].enabled) return;
        sheetManager?.init();
    });

    // Render settings UI
    renderExtensionSettings();
})();