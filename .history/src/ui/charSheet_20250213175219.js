export class CharacterSheetManager {
    constructor() {
        /** @type {HTMLDivElement | null} */
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
            if (key) tabTab[key] = /** @type {HTMLElement} */ (btn);
        });

        tabPanes.forEach(pane => {
            const key = pane.id;
            if (key) tabBody[key] = /** @type {HTMLElement} */ (pane);
        });

        const goToTab = async (key: string) => {
            console.debug('Switching to tab:', key);
            
            // Hide all panes first
            Object.values(tabBody).forEach(pane => {
                pane.style.display = 'none';
                pane.classList.remove('active');
            });
            
            // Show selected pane
            if (tabBody[key]) {
                tabBody[key].style.display = 'block';
                tabBody[key].classList.add('active');
            }

            // Update tab buttons
            Object.values(tabTab).forEach(btn => {
                btn.classList.remove('active');
            });
            if (tabTab[key]) {
                tabTab[key].classList.add('active');
            }
        };

        // Add click handlers
        Object.keys(tabTab).forEach(key => {
            tabTab[key].addEventListener('click', () => goToTab(key));
        });

        console.debug('Tab functionality initialized with:', Object.keys(tabTab));
    }
    }
}

function requestLessCompile() {
    // This is an imaginary function that you'd call if SillyTavern exposed some compile endpoint or event
    // Typically SillyTavern handles it automatically on extension load.
    console.debug('Requesting LESS compilation…');
    SillyTavern.compileLess('/scripts/extensions/third-party/SillyTavern-CharSheet/style.less');
}

// You might call this once after your extension is fully initialized:
requestLessCompile();