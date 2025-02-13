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

        const tabsContainer = this.dom.querySelector('#charsheet-tabs');
        if (!tabsContainer) {
            console.warn('Tabs container not found');
            return;
        }

        // Simplified tab switching
        tabsContainer.addEventListener('click', (e) => {
            const tabLink = e.target.closest('.nav-link');
            if (!tabLink) return;

            e.preventDefault();

            const targetId = tabLink.getAttribute('data-tab');
            if (!targetId) return;

            // Update tab links
            this.dom.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            tabLink.classList.add('active');

            // Update tab panes
            this.dom.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            const targetPane = this.dom.querySelector(`#${targetId}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }

            this.activeTab = targetId;
        });

        // Activate default tab
        const defaultTab = this.dom.querySelector('.nav-link.active');
        if (defaultTab) {
            defaultTab.click();
        }
    }
}