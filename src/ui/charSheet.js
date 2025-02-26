import React from 'react';
import { createRoot } from 'react-dom/client';
import { TabFilter } from '../../character-sheet/static/js/components/TabFilter/TabFilter.tsx';
import { charSheetTemplates } from './templates/charSheetTemplates.js';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../character-sheet/static/js/theme/theme';


export class CharacterSheetManager {
    constructor() {
        /** @type {HTMLElement | null} */
        this.dom = null;
        this.isActive = false;
        this.initialized = false;
        this.actionManager = null;
        this.inventoryManager = null;
        this.featuresManager = null;
        this.tabRoot = null;
        this.tabState = {
            currentTab: 'inventory',
            tabs: new Map(),
        };
        console.debug('[CharSheet] Constructor called');
    }

    async init() {
        if (this.initialized) {
            console.debug('[CharSheet] Already initialized');
            return;
        }

        console.debug('[CharSheet] Starting initialization...');

        if (this.dom) {
            console.debug('Sheet already initialized');
            return;
        }

        console.debug('Initializing character sheet...');

        // Use ST's draggable window template
        const draggableTemplate = /** @type {HTMLTemplateElement} */ (
            document.getElementById('generic_draggable_template')
        );
        if (!draggableTemplate) {
            console.warn('Failed to find draggable template');
            return;
        }

        // Clone the template
        const fragment = /** @type {DocumentFragment} */ (
            draggableTemplate.content.cloneNode(true)
        );
        const draggable = fragment.querySelector('.draggable');
        if (!draggable) {
            console.warn('Failed to find draggable element');
            return;
        }

        // Set up the draggable window
        draggable.id = 'character-sheet-window';
        draggable.classList.add('character-sheet-draggable');
        const closeButton = draggable.querySelector('.dragClose');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hide());
        }

        // Load the integrated character sheet HTML
        const response = await fetch('/scripts/extensions/third-party/SillyTavern-CharSheet/html/charSheet.html');
        if (!response.ok) {
            console.warn('Failed to fetch charSheet.html');
            return;
        }

        const templateFragment = document.createRange().createContextualFragment(await response.text());
        const sheetContent = templateFragment.querySelector('#character-sheet');
        if (!sheetContent) {
            console.warn('Failed to find character sheet content');
            return;
        }

        // Create a content container and add the loaded HTML
        const contentArea = document.createElement('div');
        contentArea.id = 'character-sheet-content';
        contentArea.classList.add('character-sheet-content');
        contentArea.appendChild(sheetContent.cloneNode(true));
        draggable.appendChild(contentArea);

        // Append the draggable window to ST's moving div container
        const movingDivs = document.getElementById('movingDivs');
        if (!movingDivs) {
            console.warn('Moving divs container not found');
            return;
        }
        movingDivs.appendChild(draggable);

        this.dom = draggable;

        draggable.id = 'character-sheet-window';
        draggable.classList.add('character-sheet-draggable');

        // Add this line to make it draggable
        $(draggable).draggable({
            handle: '.drag-grabber',
            containment: 'window',
        });

        this.dom.style.width = '2100px';
        this.dom.style.height = '1180px';
        this.dom.style.zIndex = '10000';

        // Hide the sheet initially
        this.dom.style.display = 'none';

        // Add font loading check
        const fontLoader = new FontFace('Old Fenris',
            'url(https://maggotin.github.io/hosted-assets/fonts/OldFenris-Regular.woff2)');

        try {
            await fontLoader.load();
            document.fonts.add(fontLoader);
            console.debug('Old Fenris font loaded successfully');
        } catch (error) {
            console.warn('Failed to load Old Fenris font:', error);
        }

        this.initializeSheetLogic();

        this.initialized = true;
        console.debug('[CharSheet] Initialization complete', {
            dom: this.dom,
            isActive: this.isActive,
            initialized: this.initialized,
        });
    }

    show() {
        if (!this.initialized || !this.dom) {
            console.warn('[CharSheet] Cannot show - not initialized');
            return;
        }
        console.debug('[CharSheet] Showing character sheet');
        this.dom.style.display = 'block';
        this.isActive = true;
    }

    hide() {
        if (!this.initialized || !this.dom) {
            console.warn('[CharSheet] Cannot hide - not initialized');
            return;
        }
        console.debug('[CharSheet] Hiding character sheet');
        this.dom.style.display = 'none';
        this.isActive = false;
    }

    toggle() {
        console.debug('[CharSheet] Toggle called', {
            initialized: this.initialized,
            dom: this.dom,
            isActive: this.isActive,
            currentDisplay: this.dom?.style.display,
        });

        if (!this.initialized) {
            console.warn('[CharSheet] Cannot toggle - not initialized');
            return;
        }

        if (this.isActive) {
            this.hide();
        } else {
            this.show();
        }
    }

    initializeSheetLogic() {
        if (!this.dom) {
            console.warn('[CharSheet] Cannot initialize sheet logic - DOM not ready');
            return;
        }

        // Initialize tab system
        this.initializeTabs();
        this.initializeInventorySystem();
        this.initializeClassFeatures();
        this.bindEventListeners();

        console.debug('[CharSheet] Sheet logic initialized');
    }

    initializeTabs() {
        const contentContainer = this.dom.querySelector('.stcs-primary-box__content');
        const tabContainer = this.dom.querySelector('.stcs-tabs-container');

        if (!contentContainer || !tabContainer) {
            console.warn('Required containers not found');
            return;
        }

        const filters = [
            {
                label: 'Actions',
                content: this.renderTabContent('actions'),
                badge: this.getActionCount(),
            },
            {
                label: 'Inventory',
                content: this.renderTabContent('inventory'),
            },
            {
                label: 'Spells',
                content: this.renderTabContent('spells'),
            },
            {
                label: 'Features',
                content: this.renderTabContent('features'),
            },
        ];

        // Create React root if it doesn't exist
        if (!this.tabRoot) {
            this.tabRoot = createRoot(tabContainer);
        }

        // Render TabFilter component with the correct class name
        this.tabRoot.render(
            React.createElement(ThemeProvider, { theme: theme },
                React.createElement(TabFilter, {
                    filters: filters,
                    showAllTab: false,
                    className: 'stcs-tabs',
                }),
            ),
        );
    }


    renderTabContent(tabId) {
        // Return a React element or DOM element for the tab content
        const content = document.createElement('div');
        content.innerHTML = this.loadTabContent(tabId);
        return content;
    }

    getActionCount() {
        // Optional: Return a number for the actions badge
        return this.actions?.length || 0;
    }

    loadTabContent(tabId) {
        return charSheetTemplates[tabId] || '';
    }

    initializeInventorySystem() {
        const inventoryTab = this.tabState.tabs.get('inventory');
        if (!inventoryTab) return;

        const filters = ['all', 'weapons', 'armor', 'equipment', 'consumables'];
        filters.forEach(filter => {
            inventoryTab.filters.add(filter);
        });

        const self = this;
        this.inventoryManager = {
            items: new Map(),
            addItem(item) {
                this.items.set(item.id, item);
                this.updateDisplay();
            },

            removeItem(itemId) {
                this.items.delete(itemId);
                this.updateDisplay();
            },

            updateDisplay() {
                const inventoryContainer = self.dom.querySelector('.stcs-inventory-container');
                if (!inventoryContainer) return;
                console.debug('[CharSheet] Inventory display updated');
            },
        };
    }

    initializeClassFeatures() {
        const featuresTab = this.tabState.tabs.get('features');
        if (!featuresTab) return;

        const self = this;
        this.featuresManager = {
            features: new Map(),

            addFeature(feature) {
                this.features.set(feature.id, feature);
                this.updateDisplay();
            },

            removeFeature(featureId) {
                this.features.delete(featureId);
                this.updateDisplay();
            },

            updateDisplay() {
                const featuresContainer = self.dom.querySelector('.stcs-features-container');
                if (!featuresContainer) return;
                console.debug('[CharSheet] Features display updated');
            },
        };
    }
    bindEventListeners() {
        // Global event listeners
        this.dom.addEventListener('charsheet:update', (event) => {
            const { type } = event.detail;
            switch (type) {
                case 'action':
                    this.actionManager?.updateDisplay();
                    break;
                case 'inventory':
                    this.inventoryManager?.updateDisplay();
                    break;
                case 'features':
                    this.featuresManager?.updateDisplay();
                    break;
                default:
                    console.debug('[CharSheet] Unhandled update type:', type);
                    break;
            }
        });

        const closeButton = this.dom.querySelector('#character-sheet-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hide());
        }
    }
}
