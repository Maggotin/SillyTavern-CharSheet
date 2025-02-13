export class CharacterSheetManager {
    constructor() {
        /** @type {HTMLElement | null} */
        this.dom = null;
        /** @type {string} */
        this.activeTab = 'core';
        this.isActive = false;
    }

    async init() {
        if (this.dom) return; // Already loaded

        // Use ST's draggable window template
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

        /** @type {HTMLElement | null} */
        const tabsContainer = this.dom.querySelector('.toptabs');
        if (!tabsContainer) {
            console.warn('Tabs container not found');
            return;
        }

        /** @type {NodeListOf<HTMLElement>} */
        const tabPanes = this.dom.querySelectorAll('.tabpane');

        // Show first tab by default
        if (tabPanes.length > 0) {
            tabPanes[0].style.display = 'block';
        }

        // Add click handlers to tab wrappers
        tabsContainer.addEventListener('click', (e) => {
            const tabWrapper = /** @type {HTMLElement} */ (e.target.closest('.tabwrapper'));
            if (!tabWrapper) return;

            const targetId = tabWrapper.getAttribute('data-tab');
            if (!targetId) return;

            // Hide all panes
            tabPanes.forEach(pane => {
                pane.style.display = 'none';
            });

            // Show target pane
            const targetPane = /** @type {HTMLElement | null} */ (
                this.dom.querySelector(`#${targetId}`)
            );
            if (targetPane) {
                targetPane.style.display = 'block';
            }

            // Update active states on tabs
            this.dom.querySelectorAll('.tabwrapper').forEach(wrapper => {
                wrapper.classList.remove('active');
            });
            tabWrapper.classList.add('active');
        });

        console.debug('Tab functionality initialized');
        console.debug('Character Sheet Logic Initialized');
    }
}