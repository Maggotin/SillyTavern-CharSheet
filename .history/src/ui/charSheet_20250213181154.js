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

        // Changed from contentArea to this.dom since we need to search the entire draggable window
        const tabButtons = [...this.dom.querySelectorAll('.tab-button')];
        const tabPanes = [...this.dom.querySelectorAll('.tab-pane')];

        console.debug('Found tabs:', tabButtons.length, tabButtons);
        console.debug('Found panes:', tabPanes.length, tabPanes);
        console.debug('Tab pane styles:', 
            [...tabPanes].map(pane => ({
                id: pane.id,
                display: window.getComputedStyle(pane).display
            }))
        );

        /** @type {{[key: string]: HTMLElement}} */
        const tabTab = {};
        /** @type {{[key: string]: HTMLElement}} */
        const tabBody = {};

        // Build our tab references
        tabButtons.forEach(btn => {
            const key = btn.getAttribute('data-tab');
            if (key) tabTab[key] = btn;
        });

        tabPanes.forEach(pane => {
            const key = pane.id;
            if (key) tabBody[key] = pane;
        });

        const goToTab = async (key) => {
            console.debug('Switching to tab:', key);
            
            // Hide all except current
            for (const [k, v] of Object.entries(tabBody)) {
                if (k == key) continue;
                v.classList.remove('active');
            }
            tabBody[key].classList.add('active');

            // Update tab buttons
            for (const [k, v] of Object.entries(tabTab)) {
                if (k == key) continue;
                v.classList.remove('active');
            }
            tabTab[key].classList.add('active');
        };

        // Add click handlers
        Object.keys(tabTab).forEach(key => {
            tabTab[key].addEventListener('click', () => goToTab(key));
        });

        console.debug('Tab functionality initialized with:', Object.keys(tabTab));
    }
}