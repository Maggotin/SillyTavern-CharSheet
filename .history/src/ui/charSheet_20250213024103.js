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
        this.setupTabs(sheetContent);
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

        const tabsContainer = this.dom.querySelector('#charsheet-tabs');
        if (!tabsContainer) {
            console.warn('Tabs container not found');
            return;
        }

        tabsContainer.addEventListener('click', (e) => {
            const tabLink = e.target.closest('.nav-link');
            if (!tabLink) return;

            e.preventDefault();

            const targetId = tabLink.getAttribute('data-tab');
            if (!targetId) return;

            // Update tab-links: remove active class from all, add it to clicked one.
            this.dom.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            tabLink.classList.add('active');

            // Update tab panes: remove active and show classes from all, then add to target.
            this.dom.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active', 'show');
            });
            const targetPane = this.dom.querySelector(`#${targetId}`);
            if (targetPane) {
                targetPane.classList.add('active', 'show');
            }

            this.activeTab = targetId;
        });

        // Ensure default tab content is visible.
        const defaultTab = this.dom.querySelector('.nav-link.active');
        if (defaultTab) {
            const targetId = defaultTab.getAttribute('data-tab');
            if (targetId) {
                const targetPane = this.dom.querySelector(`#${targetId}`);
                if (targetPane) {
                    targetPane.classList.add('active', 'show');
                }
            }
        }
    }

    /**
     * Switches to the desired tab based on key.
     * @param {string} key
     */
    async goToTab(key) {
        // Remove active class from all content panes
        for (const [tabKey, pane] of Object.entries(this.tabContents)) {
            if (tabKey !== key) {
                pane?.classList.remove('char-nav--active');
            }
        }
        // Activate the chosen content pane
        this.tabContents[key]?.classList.add('char-nav--active');

        // Update tab headers similarly
        for (const [tabKey, header] of Object.entries(this.tabHeaders)) {
            if (tabKey !== key) {
                header?.classList.remove('char-nav--active');
            }
        }
        this.tabHeaders[key]?.classList.add('char-nav--active');
    }

    setupTabs(container) {
        // Look for the RiftCharSheet tab container
        const tabs = container.querySelector('.toptabs');
        if (!tabs) {
            console.warn('Tabs container not found');
            return;
        }

        // Reference the content panes (unchanged)
        this.tabContents.pc = container.querySelector('#content-pc');
        this.tabContents.npc = container.querySelector('#content-npc');
        this.tabContents.stats = container.querySelector('#content-stats');

        // Reference the tab headers using the new data attributes:
        this.tabHeaders.pc = container.querySelector('.tabwrapper[data-tab="pc"]');
        this.tabHeaders.npc = container.querySelector('.tabwrapper[data-tab="npc"]');
        this.tabHeaders.stats = container.querySelector('.tabwrapper[data-tab="stats"]');

        // Add click event listener on the new toptabs container
        tabs.addEventListener('click', (e) => {
            const tabWrapper = e.target.closest('.tabwrapper');
            if (!tabWrapper) return;
            const key = tabWrapper.getAttribute('data-tab');
            if (!key) return;
            this.goToTab(key);
        });

        // Activate default tab (Core)
        this.goToTab('pc');
    }
}