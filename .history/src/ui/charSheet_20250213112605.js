export class CharacterSheetManager {
    constructor() {
        /** @type {HTMLElement | null} */
        this.dom = null;
        this.isActive = false;
    }

    async init() {
        if (this.dom) return; // Already loaded

        // Create main container
        const container = document.createElement('div');
        container.id = 'character-sheet-window';
        container.classList.add('character-sheet-container');

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
        container.appendChild(contentArea);

        // Add to document
        document.body.appendChild(container);
        this.dom = container;
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
        
        const tabs = this.dom.querySelectorAll('.char-tab');
        const panes = this.dom.querySelectorAll('.tab-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panes
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(pane => pane.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');

                // Find and activate corresponding pane
                const targetId = tab.getAttribute('data-tab');
                const targetPane = this.dom.querySelector(`#${targetId}`);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });

        // Initialize close button
        const closeButton = this.dom.querySelector('#character-sheet-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hide());
        }

        console.debug('Character Sheet Logic Initialized');
    }
}
