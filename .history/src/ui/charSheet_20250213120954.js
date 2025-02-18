export class CharacterSheetManager {
    constructor() {
        /** @type {HTMLElement | null} */
        this.dom = null;
        this.isActive = false;
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
        
        const tabs = this.dom.querySelectorAll('.menu_button[data-tab]');
        const panes = this.dom.querySelectorAll('.tab-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panes
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(pane => pane.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');
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

        console.debug('Tab functionality initialized');
        console.debug('Character Sheet Logic Initialized');
    }
}