export class CharacterSheetManager {
    constructor() {
        /** @type {HTMLElement | null} */
        this.dom = null;
        this.isActive = false;
        console.debug('CharacterSheetManager constructed');
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
        
        // Hide the sheet initially
        this.dom.style.display = 'none';
        
        // Add font loading check
        const fontLoader = new FontFace('Old Fenris', 
            'url(https://maggotin.github.io/hosted-assets/fonts/OldFenris-Regular.woff2)');
        
        try {
            await fontLoader.load();
            document.fonts.add(fontLoader);
            console.debug('Old Fenris font loaded successfully');
        } catch (error) {
            console.warn('Failed to load Old Fenris font:', error);
        }

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

    // Find the existing tab buttons (with the style you want)
    const tabButtons = [...this.dom.querySelectorAll('.tab-button')];
    // Find the tab panes that match those buttons
    const tabPanes = [...this.dom.querySelectorAll('.tab-pane')];

    // Toggling function
    const goToTab = (key) => {
        tabButtons.forEach((btn) => {
            if (btn.dataset.tab === key) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        tabPanes.forEach((pane) => {
            if (pane.id === key) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
    };

    // Attach event listeners to each button
    tabButtons.forEach((btn) => {
        const tabTarget = btn.dataset.tab;
        btn.addEventListener('click', () => goToTab(tabTarget));
    });

        let closeButton = this.dom.querySelector('#character-sheet-close');
        console.debug('Tab functionality initialized');
        console.debug('Character Sheet Logic Initialized');
    }
}