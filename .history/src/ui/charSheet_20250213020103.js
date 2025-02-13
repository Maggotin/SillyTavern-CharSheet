export class CharacterSheetManager {
    constructor() {
        /** @type {HTMLElement | null} */
        this.dom = null;
        /** @type {boolean} */
        this.isActive = false;
        
        /** @type {{[key: string]: HTMLElement}} */
        this.tabHeaders = {
            pc: undefined,
            npc: undefined,
            stats: undefined
        };

        /** @type {{[key: string]: HTMLElement}} */
        this.tabContents = {
            pc: undefined,
            npc: undefined,
            stats: undefined
        };
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

        const fragment = /** @type {DocumentFragment} */ (
            draggableTemplate.content.cloneNode(true)
        );
        const draggable = /** @type {HTMLElement} */ (
            fragment.querySelector('.draggable')
        );
        if (!draggable) {
            console.warn('Failed to find draggable element');
            return;
        }

        // Set up the draggable window
        draggable.id = 'character-sheet-window';
        draggable.classList.add('character-sheet-draggable');
        const closeButton = /** @type {HTMLElement} */ (
            draggable.querySelector('.dragClose')
        );
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
        const sheetContent = /** @type {HTMLElement} */ (
            templateFragment.querySelector('#character-sheet')
        );
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
        this.setupTabs(sheetContent);
    }

    show() {
        if (!this.dom) return;
        this.dom.classList.add('visible');
        this.isActive = true;
    }

    hide() {
        if (!this.dom) return;
        this.dom.classList.remove('visible');
        this.isActive = false;
    }

    toggle() {
        if (this.isActive) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * @param {string} key
     */
    async goToTab(key) {
        // Hide all other tabs
        for (const [k, v] of Object.entries(this.tabContents)) {
            if (k === key) continue;
            v?.classList.remove('char-nav--active');
        }
        this.tabContents[key]?.classList.add('char-nav--active');

        // Update tab headers
        for (const [k, v] of Object.entries(this.tabHeaders)) {
            if (k === key) continue;
            v?.classList.remove('char-nav--active');
        }
        this.tabHeaders[key]?.classList.add('char-nav--active');
    }

    setupTabs(container) {
        // Create tabs container
        const tabs = container.querySelector('.char-nav--tabs');
        if (!tabs) {
            console.warn('Tabs container not found');
            return;
        }

        // Store content references
        this.tabContents.pc = container.querySelector('#content-pc');
        this.tabContents.npc = container.querySelector('#content-npc');
        this.tabContents.stats = container.querySelector('#content-stats');

        // Store tab headers
        this.tabHeaders.pc = container.querySelector('#tab-pc');
        this.tabHeaders.npc = container.querySelector('#tab-npc');
        this.tabHeaders.stats = container.querySelector('#tab-stats');

        // Add click handlers to tabs
        tabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.char-nav--tab');
            if (!tab) return;

            const key = tab.getAttribute('data-tab');
            if (!key) return;

            this.goToTab(key);
        });

        // Activate default tab
        this.goToTab('pc');
    }
}