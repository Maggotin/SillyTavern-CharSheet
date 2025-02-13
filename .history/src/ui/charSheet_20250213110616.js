export class CharacterSheetManager {
    constructor() {
        /** @type {HTMLElement | null} */
        this.dom = null;
        /** @type {string} */
        this.activeTab = 'core';
        this.isActive = false;
    }

    async init() {
        if (this.dom) return;

      

        const draggableTemplate = /** @type {HTMLTemplateElement} */ (document.getElementById('generic_draggable_template'));
        if (!draggableTemplate) {
            console.warn('Failed to find draggable template');
            return;
        }

        const fragment = /** @type {DocumentFragment} */ (draggableTemplate.content.cloneNode(true));
        const draggable = fragment.querySelector('.draggable');
        if (!draggable) {
            console.warn('Failed to find draggable element');
            return;
        }

        // Set up the draggable window
        draggable.id = 'character-sheet-window';
        const closeButton = draggable.querySelector('.dragClose');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hide());
        }

        // Load the character sheet content
        const response = await fetch('/scripts/extensions/third-party/SillyTavern-CharSheet/html/charSheet.html');
        if (!response.ok) {
            console.warn('Failed to fetch charSheet.html');
            return;
        }

        const template = document.createRange()
            .createContextualFragment(await response.text())
            .querySelector('#character-sheet');

        if (!template) {
            console.warn('Failed to find character sheet content');
            return;
        }

        // Add the sheet content to the draggable window
        const contentArea = document.createElement('div');
        contentArea.id = 'character-sheet-content';
        contentArea.style.padding = '20px';
        contentArea.style.height = '100%';
        contentArea.style.overflowY = 'auto';
        contentArea.appendChild(template.cloneNode(true));
        draggable.appendChild(contentArea);

        // Add to ST's moving divs container
        const movingDivs = document.getElementById('movingDivs');
        if (!movingDivs) {
            console.warn('Moving divs container not found');
            return;
        }

        movingDivs.appendChild(draggable);
        this.dom = draggable;
        this.initializeSheetLogic();
        this.initializeTabs();
    }
    

    show() {
        if (!this.dom) return;
        this.dom.style.display = 'block';
        this.isActive = true;
    }

    hide() {
        if (!this.dom) {
            return;
        }
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
        // Add tab switching functionality
        const tabs = document.querySelectorAll('.char-nav-tabs[data-tab]');
        const tabPanes = {
            'coretab': document.getElementById('pc'),
            'inventorytab': document.getElementById('npc'),
            'spellstab': document.getElementById('stats')
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panes
                tabs.forEach(t => t.classList.remove('active'));
                Object.values(tabPanes).forEach(pane => pane.classList.remove('active'));

                // Add active class to clicked tab and corresponding pane
                tab.classList.add('active');
                const paneId = tab.getAttribute('data-tab');
                if (tabPanes[paneId]) {
                    tabPanes[paneId].classList.add('active');
                }
            });
        });

        console.debug('Tab functionality initialized');
        console.debug('Character Sheet Logic Initialized');
    }

    initializeTabs() {
        if (!this.dom) return;

        // Get all tab buttons and content panes using your provided markup.
        const tabs = /** @type {NodeListOf<HTMLElement>} */ (
            this.dom.querySelectorAll('.toptabs .tabwrapper')
        );
        const panes = /** @type {NodeListOf<HTMLElement>} */ (
            this.dom.querySelectorAll('.tab-content .tabpane')
        );

        // Function to switch tabs.
        const switchTab = (tabId) => {
            // Mark the clicked tab as active.
            tabs.forEach((tab) => {
                if (tab.getAttribute('data-tab') === tabId) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            // Show the matching pane and hide others.
            panes.forEach((pane) => {
                if (pane.id === tabId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
            this.activeTab = tabId;
        };

        // Attach click events.
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                if (tabId) {
                    switchTab(tabId);
                }
            });
        });

        // Set default active tab.
        switchTab(this.activeTab);
    }

 
    }
}