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
    // Header
    const drawerHeader = document.createElement('div');
    drawerHeader.className = 'inline-drawer-header';

    const headerText = document.createElement('b');
    headerText.textContent = EXTENSION_NAME;

    const headerIcon = document.createElement('div');
    headerIcon.className = 'inline-drawer-icon fa-solid fa-circle-chevron-down';

    drawerHeader.append(headerText, headerIcon);

    // Content
    const drawerContent = document.createElement('div');
    drawerContent.className = 'inline-drawer-content';

    // Enabled checkbox
    const enableLabel = document.createElement('label');
    enableLabel.className = 'checkbox_label';

    const enableCheckbox = document.createElement('input');
    enableCheckbox.type = 'checkbox';
    enableCheckbox.checked = context.extensionSettings[settingsKey].enabled;
    enableCheckbox.addEventListener('change', () => {
        context.extensionSettings[settingsKey].enabled = enableCheckbox.checked;
        context.saveSettingsDebounced();
        // If toggled on, ensure the char sheet is available
        if (enableCheckbox.checked) {
            initializeCharacterSheet();
        } else {
            characterSheetManager?.hide();
        }
    });

    const enableText = document.createElement('span');
    enableText.textContent = 'Enabled';

    enableLabel.append(enableCheckbox, enableText);

    // Toggle sheet button
    const sheetToggle = document.createElement('button');
    sheetToggle.className = 'menu_button';
    sheetToggle.style.marginTop = '10px';
    sheetToggle.textContent = 'Toggle Character Sheet';
    sheetToggle.addEventListener('click', () => {
        if (characterSheetManager) {
            characterSheetManager.toggle();
        }
    });

    // Build the drawer
    drawerContent.append(enableLabel, sheetToggle);
    inlineDrawer.append(drawerHeader, drawerContent);
    settingsContainer.append(inlineDrawer);
