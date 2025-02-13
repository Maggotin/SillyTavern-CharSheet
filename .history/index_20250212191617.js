import { eventSource, event_types } from "../../../../script.js";
import { getContext } from "../../../extensions.js";
import { CharacterSheetManager } from "./src/ui/charSheet.js";

const settingsKey = 'SillyTavernCharSheet';
const EXTENSION_NAME = 'Character Sheet D&D5e';

/**
 * @type {CharSheetSettings}
 * @typedef {Object} CharSheetSettings
 * @property {boolean} enabled Whether the extension is enabled
 */
const defaultSettings = Object.freeze({
    enabled: true,
});

let sheetManager = null;

function renderExtensionSettings() {
    const context = getContext();
    const settingsContainer = document.getElementById(`${settingsKey}-container`) ?? document.getElementById('extensions_settings2');
    if (!settingsContainer) {
        return;
    }

    const inlineDrawer = document.createElement('div');
    inlineDrawer.classList.add('inline-drawer');
    settingsContainer.append(inlineDrawer);

    const inlineDrawerToggle = document.createElement('div');
    inlineDrawerToggle.classList.add('inline-drawer-toggle', 'inline-drawer-header');

    const extensionName = document.createElement('b');
    extensionName.textContent = context.t`${EXTENSION_NAME}`;

    const inlineDrawerIcon = document.createElement('div');
    inlineDrawerIcon.classList.add('inline-drawer-icon', 'fa-solid', 'fa-circle-chevron-down');

    inlineDrawerToggle.append(extensionName, inlineDrawerIcon);

    const inlineDrawerContent = document.createElement('div');
    inlineDrawerContent.classList.add('inline-drawer-content');
    inlineDrawerContent.style.display = 'none';

    inlineDrawer.append(inlineDrawerToggle, inlineDrawerContent);

    /** @type {CharSheetSettings} */
    const settings = context.extensionSettings[settingsKey];

    // Enabled checkbox
    const enabledCheckboxLabel = document.createElement('label');
    enabledCheckboxLabel.classList.add('checkbox_label');
    enabledCheckboxLabel.htmlFor = `${settingsKey}-enabled`;

    const enabledCheckbox = document.createElement('input');
    enabledCheckbox.id = `${settingsKey}-enabled`;
    enabledCheckbox.type = 'checkbox';
    enabledCheckbox.checked = settings.enabled;
    enabledCheckbox.addEventListener('change', () => {
        settings.enabled = enabledCheckbox.checked;
        context.saveSettingsDebounced();
        if (settings.enabled && sheetManager) {
            sheetManager.show();
        } else if (sheetManager) {
            sheetManager.hide();
        }
    });

    const enabledCheckboxText = document.createElement('span');
    enabledCheckboxText.textContent = context.t`Enabled`;
    enabledCheckboxLabel.append(enabledCheckbox, enabledCheckboxText);

    // Toggle sheet button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'menu_button';
    toggleButton.style.marginTop = '10px';
    toggleButton.textContent = context.t`Toggle Character Sheet`;
    toggleButton.addEventListener('click', () => sheetManager?.toggle());

    inlineDrawerContent.append(enabledCheckboxLabel, toggleButton);

    // Drawer toggle functionality
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
}

(function initExtension() {
    console.debug(`[${EXTENSION_NAME}]`, 'Initializing extension');
    const context = getContext();

    if (!context.extensionSettings[settingsKey]) {
        context.extensionSettings[settingsKey] = structuredClone(defaultSettings);
    }

    // Fill missing settings
    for (const key of Object.keys(defaultSettings)) {
        if (context.extensionSettings[settingsKey][key] === undefined) {
            context.extensionSettings[settingsKey][key] = defaultSettings[key];
        }
    }

    // Initialize sheet manager
    sheetManager = new CharacterSheetManager();

    // Register event handlers
    eventSource.on(event_types.CHAT_CHANGED, () => {
        if (!context.extensionSettings[settingsKey].enabled) return;
        sheetManager?.init();
    });

    context.saveSettingsDebounced();
    renderExtensionSettings();

    console.debug(`[${EXTENSION_NAME}]`, 'Extension initialized');
})();