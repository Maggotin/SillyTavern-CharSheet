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
        this.initializeSheetLogic();
    }

    show() {
        if (!this.dom) return;
        this.dom.style.display = 'block';
        this.isActive = true;
    }

    hide() {
        if (!this.dom) return;
        this.dom.style.display = 'none';
        this.isActive = false;
    }

    toggle() {
        if (this.isActive) {
            this.hide();
        } else {
            this.show();
        }
    }

    initializeSheetLogic() {
        if (!this.dom) return;

        /** @type {{[key: string]: HTMLElement}} */
        const tabTab = {
            core: undefined,
            inventory: undefined,
            spells: undefined
        };

        /** @type {{[key: string]: HTMLElement}} */
        const tabBody = {
            core: undefined,
            inventory: undefined,
            spells: undefined
        };

        const goToTab = async (key) => {
            for (const [k, v] of Object.entries(tabBody)) {
                if (k == key) continue;
                v.classList.remove('active');
            }
            tabBody[key].classList.add('active');

            for (const [k, v] of Object.entries(tabTab)) {
                if (k == key) continue;
                v.classList.remove('active');
            }
            tabTab[key].classList.add('active');
        };

        // Initialize tab references
        tabTab.core = this.dom.querySelector('[data-tab="tab-core"]');
        tabTab.inventory = this.dom.querySelector('[data-tab="tab-inventory"]');
        tabTab.spells = this.dom.querySelector('[data-tab="tab-spells"]');

        tabBody.core = this.dom.querySelector('#tab-core');
        tabBody.inventory = this.dom.querySelector('#tab-inventory');
        tabBody.spells = this.dom.querySelector('#tab-spells');

        // Add click listeners
        tabTab.core.addEventListener('click', () => goToTab('core'));
        tabTab.inventory.addEventListener('click', () => goToTab('inventory'));