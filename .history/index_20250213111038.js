import { eventSource, event_types } from "../../../../script.js";
import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";
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
    const settingsContainer = document.getElementById(`${settingsKey}_settings`);
    if (!settingsContainer) return;

    const html = `
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>${EXTENSION_NAME}</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down"></div>
            </div>
            <div class="inline-drawer-content">
                <label class="checkbox_label">
                    <input type="checkbox" id="${settingsKey}_enabled" ${context.extensionSettings[settingsKey].enabled ? 'checked' : ''}>
                    <span>Enabled</span>
                </label>
                <button id="${settingsKey}_toggle" class="menu_button" style="margin-top:10px">Toggle Character Sheet</button>
            </div>
        </div>
    `;

    settingsContainer.innerHTML = html;

    // Add event listeners
    document.getElementById(`${settingsKey}_enabled`).addEventListener('change', function() {
        context.extensionSettings[settingsKey].enabled = this.checked;
        context.saveSettingsDebounced();
        if (this.checked && sheetManager) {
            sheetManager.show();
        } else if (sheetManager) {
            sheetManager.hide();
        }
    });

    document.getElementById(`${settingsKey}_toggle`).addEventListener('click', () => {
        sheetManager?.toggle();
    });

    // Add drawer toggle functionality
    const toggleButton = settingsContainer.querySelector('.inline-drawer-toggle');
    const content = settingsContainer.querySelector('.inline-drawer-content');
    const icon = settingsContainer.querySelector('.inline-drawer-icon');

    toggleButton.addEventListener('click', function() {
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

    // Initially hide content
    content.style.display = 'none';
}

(function initExtension() {
    console.debug(`[${EXTENSION_NAME}]`, 'Initializing extension');
    const context = SillyTavern.getContext();


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