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
    const context = SillyTavern.getContext();
    const settingsContainer = document.getElementById(`${settingsKey}-container`) ?? document.getElementById('extensions_settings2');
    if (!settingsContainer) {
        return;
    }


    const inlineDrawer = document.createElement('div');
    inlineDrawer.classList.add('inline-drawer');
    settingsContainer.append(inlineDrawer);
    // Change drawerHeader to inlineDrawerToggle to match ST's pattern
    const inlineDrawerToggle = document.createElement('div');
    inlineDrawerToggle.classList.add('inline-drawer-toggle', 'inline-drawer-header');

    const extensionName = document.createElement('b');
    extensionName.textContent = context.t`${EXTENSION_NAME}`;

    const inlineDrawerIcon = document.createElement('div');
    inlineDrawerIcon.classList.add('inline-drawer-icon', 'fa-solid', 'fa-circle-chevron-down', 'down');

    inlineDrawerToggle.append(extensionName, inlineDrawerIcon);

    const inlineDrawerContent = document.createElement('div');
    inlineDrawerContent.classList.add('inline-drawer-content');

    inlineDrawer.append(inlineDrawerToggle, inlineDrawerContent);

    /** @type {SillyTaverncHAR} */
    const settings = context.extensionSettings[settingsKey];
    // Add click handler for toggle
    inlineDrawerToggle.addEventListener('click', function () {
        const content = this.nextElementSibling;
        const icon = this.querySelector('.inline-drawer-icon');
        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.classList.remove('fa-circle-chevron-down');
            icon.classList.add('fa-circle-chevron-up');
        } else {
            content.style.display = 'none';
            icon.classList.remove('fa-circle-chevron-up');
            icon.classList.add('fa-circle-chevron-down');
        }
    });

    // Rest of your drawer content setup
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
    inlineDrawer.append(inlineDrawerToggle, drawerContent);
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