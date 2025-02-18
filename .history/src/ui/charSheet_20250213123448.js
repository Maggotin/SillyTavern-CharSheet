export class CharacterSheetManager {
    constructor() {
        /** @type {HTMLElement | null} */
        this.dom = null;
        this.isActive = false;
        this.activeTab = 'tab-core';
        this.tabs = {};
    }

    async init() {
        if (this.dom) return; // Already loaded

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
        this.initializeTabs();
        this.initializeEventListeners();
    }

    initializeTabs() {
        if (!this.dom) return;

        // Get all tab buttons and panes
        const tabButtons = this.dom.querySelectorAll('.menu_button[data-tab]');
        const tabPanes = this.dom.querySelectorAll('.tab-pane');

        // Store references to tabs and panes
        tabButtons.forEach(button => {
            const tabId = button.getAttribute('data-tab');
            if (tabId) {
                this.tabs[tabId] = {
                    button: button,
                    pane: this.dom.querySelector(`#${tabId}`),
                    isActive: button.classList.contains('active')
                };
            }
        });
    }

    initializeEventListeners() {
        if (!this.dom) return;

        // Tab switching
        Object.entries(this.tabs).forEach(([tabId, tab]) => {
            tab.button.addEventListener('click', () => {
                this.switchTab(tabId);
            });
        });

        // Close button
        const closeButton = this.dom.querySelector('#character-sheet-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hide());
        }

        // Other event listeners
        this.dom.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        });
    }

    switchTab(tabId) {
        if (!this.tabs[tabId]) return;

        // Deactivate all tabs
        Object.values(this.tabs).forEach(tab => {
            tab.button.classList.remove('active');
            tab.pane.classList.remove('active');
            tab.isActive = false;
        });

        // Activate selected tab
        this.tabs[tabId].button.classList.add('active');
        this.tabs[tabId].pane.classList.add('active');
        this.tabs[tabId].isActive = true;
        this.activeTab = tabId;

        // Trigger any tab-specific initialization if needed
        this.onTabChanged(tabId);
    }

    onTabChanged(tabId) {
        // Handle any tab-specific logic here
        console.debug(`Tab changed to: ${tabId}`);
    }

    show() {
        if (!this.dom) return;
        this.dom.style.display = 'block';
        this.isActive = true;
        // Switch to last active tab or default
        this.switchTab(this.activeTab);
    }

    hide() {
        if (!this.dom) return;
        this.dom.style.display = 'none';
        this.isActive = false;
    }

    toggle() {
        this.isActive ? this.hide() : this.show();
    }
}