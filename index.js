import { CharacterSheetManager } from './src/ui/charSheet.js';

export class CharacterSheet extends CharacterSheetManager {}

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

// Event handling setup
let isProcessing = false;
const eventQueue = [];

const processEventQueue = async () => {
    if (isProcessing) return;
    isProcessing = true;
    while (eventQueue.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const { handler, resolve: eventResolve } = eventQueue.shift();
        try {
            await handler();
            eventResolve(true);
        } catch (error) {
            console.error('[CharSheet] Event handler error:', error);
            eventResolve(false);
        }
    }
    isProcessing = false;
};

const queueEvent = async (handler) => {
    const prom = new Promise(resolve => eventQueue.push({ handler, resolve }));
    processEventQueue();
    return prom;
};

// Avoid jQuery UI conflicts by using native touch handling where possible
const addPassiveEventListener = (element, eventName, handler) => {
    element.addEventListener(eventName, handler, { passive: true });
};

const removePassiveEventListener = (element, eventName, handler) => {
    element.removeEventListener(eventName, handler);
};

function renderExtensionSettings() {
    const context = SillyTavern.getContext();
    const settingsContainer = document.getElementById(`${settingsKey}-container`) ?? document.getElementById('extensions_settings2');
    if (!settingsContainer) return;

    // Use native DOM methods instead of jQuery where possible
    const inlineDrawer = document.createElement('div');
    inlineDrawer.classList.add('inline-drawer');
    settingsContainer.append(inlineDrawer);

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
        queueEvent(async () => {
            settings.enabled = enabledCheckbox.checked;
            context.saveSettingsDebounced();
            if (settings.enabled && sheetManager) {
                await sheetManager.show();
            } else if (sheetManager) {
                await sheetManager.hide();
            }
        });
    }, { passive: true });

    const enabledCheckboxText = document.createElement('span');
    enabledCheckboxText.textContent = context.t`Enabled`;
    enabledCheckboxLabel.append(enabledCheckbox, enabledCheckboxText);
    inlineDrawerContent.append(enabledCheckboxLabel);

    // Toggle sheet button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'menu_button';
    toggleButton.style.marginTop = '10px';
    toggleButton.textContent = context.t`Toggle Character Sheet`;
    toggleButton.addEventListener('click', () => {
        queueEvent(async () => {
            if (!sheetManager?.dom) {
                await sheetManager?.init();
            }
            await sheetManager?.toggle();
        });
    }, { passive: true });

    inlineDrawerContent.append(enabledCheckboxLabel, toggleButton);

    // Use passive listeners for touch events
    if ('ontouchstart' in window) {
        addPassiveEventListener(inlineDrawerToggle, 'touchstart', (e) => {
            e.stopPropagation();
            toggleDrawer(inlineDrawerContent, inlineDrawerIcon);
        });
    }

    // Regular click handler for non-touch devices
    inlineDrawerToggle.addEventListener('click', () => {
        toggleDrawer(inlineDrawerContent, inlineDrawerIcon);
    });

    // Helper function to toggle drawer
    function toggleDrawer(content, icon) {
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        icon.classList.toggle('down', !isHidden);
        icon.classList.toggle('up', isHidden);
    }
}

// Modify goToTab to be more resilient
function goToTab(tabId) {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            try {
                const container = document.getElementById('character-sheet-content');
                if (!container) {
                    console.debug('[CharSheet] Tab container not found');
                    resolve(false);
                    return;
                }

                const tab = container.querySelector(`#tab-${tabId}`);
                const button = container.querySelector(`[data-tab="${tabId}"]`);

                if (!tab || !button) {
                    console.debug('[CharSheet] Tab or button not found:', tabId);
                    resolve(false);
                    return;
                }

                // Remove active class from all tabs and buttons
                container.querySelectorAll('.tab-content').forEach(t => t?.classList?.remove('active'));
                container.querySelectorAll('.tab-button').forEach(b => b?.classList?.remove('active'));

                // Add active class to selected tab and button
                tab.classList.add('active');
                button.classList.add('active');

                resolve(true);
            } catch (error) {
                console.error('[CharSheet] Error switching tabs:', error);
                resolve(false);
            }
        });
    });
}

// Initialize tooltips with passive touch handling
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        let tooltipElement = null;

        const showTooltip = (event) => {
            const content = tooltip.getAttribute('data-tooltip');
            tooltipElement = document.createElement('div');
            tooltipElement.className = 'tooltip';
            tooltipElement.textContent = content;
            tooltipElement.style.position = 'absolute';
            document.body.appendChild(tooltipElement);

            const rect = tooltip.getBoundingClientRect();
            tooltipElement.style.top = `${rect.top - tooltipElement.offsetHeight - 8}px`;
            tooltipElement.style.left = `${rect.left + (rect.width - tooltipElement.offsetWidth) / 2}px`;
        };

        const hideTooltip = () => {
            if (tooltipElement) {
                tooltipElement.remove();
                tooltipElement = null;
            }
        };

        // Use passive listeners for touch events
        if ('ontouchstart' in window) {
            addPassiveEventListener(tooltip, 'touchstart', showTooltip);
            addPassiveEventListener(tooltip, 'touchend', hideTooltip);
        }

        // Regular mouse events for non-touch devices
        tooltip.addEventListener('mouseenter', showTooltip);
        tooltip.addEventListener('mouseleave', hideTooltip);
    });
}

// Initialize extension
(async function initExtension() {
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

    // Initialize sheet manager with error handling
    try {
        sheetManager = new CharacterSheetManager();
        await sheetManager.init();
    } catch (error) {
        console.error('[CharSheet] Failed to initialize sheet manager:', error);
    }

    // Register event handlers with error handling
    context.eventSource.on(context.event_types.CHAT_CHANGED, async () => {
        try {
            if (!context.extensionSettings[settingsKey].enabled) return;
            await sheetManager?.init();
        } catch (error) {
            console.error('[CharSheet] Error handling chat change:', error);
        }
    });

    context.saveSettingsDebounced();
    renderExtensionSettings();

    // Initialize tooltips after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTooltips);
    } else {
        initializeTooltips();
    }

    console.debug(`[${EXTENSION_NAME}]`, 'Extension initialized');
})();

export { goToTab };

jQuery.event.special.touchstart = {
    setup: function(_, ns, handle) {
        this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
    }
};

jQuery.event.special.touchmove = {
    setup: function(_, ns, handle) {
        this.addEventListener("touchmove", handle, { passive: !ns.includes("noPreventDefault") });
    }
};

jQuery.event.special.touchend = {
    setup: function(_, ns, handle) {
        this.addEventListener("touchend", handle, { passive: !ns.includes("noPreventDefault") });
    }
};
