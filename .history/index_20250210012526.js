import { eventSource, event_types } from '../../../../script.js';
import { getContext } from '../../../extensions.js';
import { CharacterSheetManager } from './charSheet.js';

const settingsKey = 'SillyTavernCharSheet';
const EXTENSION_NAME = 'Character Sheet D&D5e';

const defaultSettings = Object.freeze({
    enabled: true,
});

let characterSheetManager;

function renderExtensionSettings() {
    const context = getContext();
    const settingsContainer = document.getElementById('extensions_settings');
    if (!settingsContainer) return;

    // Check if the drawer already exists
    let inlineDrawer = document.getElementById(`${settingsKey}-drawer`);
    if (!inlineDrawer) {
        // Create drawer container
        inlineDrawer = document.createElement('div');
        inlineDrawer.id = `${settingsKey}-drawer`;
        inlineDrawer.className = 'inline-drawer';

        // Drawer header
        const drawerHeader = document.createElement('div');
        drawerHeader.className = 'inline-drawer-header inline-drawer-toggle';
        
        const headerText = document.createElement('b');
        headerText.textContent = EXTENSION_NAME;
        
        const headerIcon = document.createElement('div');
        headerIcon.className = 'inline-drawer-icon fa-solid fa-circle-chevron-down';
        
        drawerHeader.append(headerText, headerIcon);

        // Drawer content
        const drawerContent = document.createElement('div');
        drawerContent.className = 'inline-drawer-content';

        // Enabled toggle
        const enableLabel = document.createElement('label');
        enableLabel.className = 'checkbox_label';
        
        const enableCheckbox = document.createElement('input');
        enableCheckbox.type = 'checkbox';
        enableCheckbox.checked = context.extensionSettings[settingsKey].enabled;
        enableCheckbox.addEventListener('change', () => {
            context.extensionSettings[settingsKey].enabled = enableCheckbox.checked;
            context.saveSettingsDebounced();
        });
        
        const enableText = document.createElement('span');
        enableText.textContent = 'Enabled';
        enableLabel.append(enableCheckbox, enableText);

        // Toggle button
        const sheetToggle = document.createElement('button');
        sheetToggle.className = 'menu_button';
        sheetToggle.style.marginTop = '10px';
        sheetToggle.textContent = 'Toggle Character Sheet';
        sheetToggle.addEventListener('click', () => {
            if (characterSheetManager) {
                characterSheetManager.toggle();
            }
        });

        // Assemble components
        drawerContent.append(enableLabel, sheetToggle);
        inlineDrawer.append(drawerHeader, drawerContent);
        settingsContainer.append(inlineDrawer);
    } else {
        // If it already exists, ensure it's visible
        inlineDrawer.style.display = '';
    }

    // Initialize character sheet if enabled.
    if (context.extensionSettings[settingsKey].enabled) {
        initializeCharacterSheet();
    }
}

function initializeCharacterSheet() {
    if (!characterSheetManager) {
        characterSheetManager = new CharacterSheetManager();
        characterSheetManager.init();
    }
}

(function initExtension() {
    const context = getContext();
    
    // Initialize settings
    if (!context.extensionSettings[settingsKey]) {
        context.extensionSettings[settingsKey] = structuredClone(defaultSettings);
    }

    // Chat changed handler
    eventSource.on(event_types.CHAT_CHANGED, () => {
        if (context.extensionSettings[settingsKey].enabled) {
            initializeCharacterSheet();
            toastr.info('Character sheet loaded', EXTENSION_NAME);
        }
    });

    // Create UI elements
    renderExtensionSettings();

    // Cleanup on extension unload - hide character sheet UI but do not remove the drawer container
    eventSource.on(event_types.EXTENSION_UNLOADED, (extName) => {
        if (extName === EXTENSION_NAME) {
            characterSheetManager?.hide();
            // Instead of removing the drawer container, we hide it so it will show again on load
            const drawer = document.getElementById(`${settingsKey}-drawer`);
            if (drawer) {
                drawer.style.display = 'none';
            }
        }
    });
})();