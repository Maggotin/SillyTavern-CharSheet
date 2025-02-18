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

        /** @type {{[key: string]: HTMLElement}} */
        const tabNav = {
            core: undefined,
            inventory: undefined,
            spells: undefined
        };

        /** @type {{[key: string]: HTMLElement}} */
        const tabBody = {
            core: undefined,
            inventory: undefined,
            spells: undefined
        };

        // Create the tab navigation container using "charnav--" classes
        const tabs = document.createElement('div');
        tabs.classList.add('charnav--tabs');

        // Create the "Core" tab button
        const tabCoreButton = document.createElement('div');
        tabCoreButton.classList.add('charnav--tab', 'charnav--tabCore', 'charnav--active');
        tabCoreButton.setAttribute('data-tab', 'tab-core');
        tabCoreButton.title = 'Core Character Info';
        {
            const icon = document.createElement('i');
            icon.classList.add('fa-solid', 'fa-fw', 'fa-user');
            tabCoreButton.append(icon);
            const text = document.createElement('span');
            text.classList.add('charnav--text');
            text.textContent = 'Core';
            tabCoreButton.append(text);
        }
        tabCoreButton.addEventListener('click', async () => {
            await goToTab('core');
        });
        tabs.append(tabCoreButton);
        tabNav.core = tabCoreButton;

        // Create the "Inventory" tab button
        const tabInventoryButton = document.createElement('div');
        tabInventoryButton.classList.add('charnav--tab', 'charnav--tabInventory');
        tabInventoryButton.setAttribute('data-tab', 'tab-inventory');
        tabInventoryButton.title = 'Inventory Management';
        {
            const icon = document.createElement('i');
            icon.classList.add('fa-solid', 'fa-fw', 'fa-briefcase');
            tabInventoryButton.append(icon);
            const text = document.createElement('span');
            text.classList.add('charnav--text');
            text.textContent = 'Inventory';
            tabInventoryButton.append(text);
        }
        tabInventoryButton.addEventListener('click', async () => {
            await goToTab('inventory');
        });
        tabs.append(tabInventoryButton);
        tabNav.inventory = tabInventoryButton;

        // Create the "Spells" tab button
        const tabSpellsButton = document.createElement('div');
        tabSpellsButton.classList.add('charnav--tab', 'charnav--tabSpells');
        tabSpellsButton.setAttribute('data-tab', 'tab-spells');
        tabSpellsButton.title = 'Spells & Abilities';
        {
            const icon = document.createElement('i');
            icon.classList.add('fa-solid', 'fa-fw', 'fa-wand-sparkles');
            tabSpellsButton.append(icon);
            const text = document.createElement('span');
            text.classList.add('charnav--text');
            text.textContent = 'Spells';
            tabSpellsButton.append(text);
        }
        tabSpellsButton.addEventListener('click', async () => {
            await goToTab('spells');
        });
        tabs.append(tabSpellsButton);
        tabNav.spells = tabSpellsButton;

        // Insert the tabs into the DOM; for example, after a header element
        const header = this.dom.querySelector('header') || this.dom.firstElementChild;
        header.insertAdjacentElement('afterend', tabs);

        // Create the tab-body elements
        // Core tab body:
        const bodyCore = document.createElement('div');
        bodyCore.id = 'tab-core';
        bodyCore.classList.add('charnav--body', 'charnav--active'); // Active by default
        // (Insert your existing core content here)
        bodyCore.innerHTML = '<!-- Core tab content goes here -->';
        this.dom.appendChild(bodyCore);
        tabBody.core = bodyCore;

        // Inventory tab body:
        const bodyInventory = document.createElement('div');
        bodyInventory.id = 'tab-inventory';
        bodyInventory.classList.add('charnav--body');
        // (Insert your existing inventory content here)
        bodyInventory.innerHTML = '<!-- Inventory tab content goes here -->';
        this.dom.appendChild(bodyInventory);
        tabBody.inventory = bodyInventory;

        // Spells tab body:
        const bodySpells = document.createElement('div');
        bodySpells.id = 'tab-spells';
        bodySpells.classList.add('charnav--body');
        // (Insert your existing spells content here)
        bodySpells.innerHTML = '<!-- Spells tab content goes here -->';
        this.dom.appendChild(bodySpells);
        tabBody.spells = bodySpells;

        // This portion creates (or is inserted alongside) additional parts like filter panels.
        // For example, for the Inventory tab, you could add:
        {
            const filterPanel = document.createElement('div');
            filterPanel.classList.add('charnav--filters');
            const searchLabel = document.createElement('label');
            searchLabel.classList.add('charnav--search');
            const lbl = document.createElement('div');
            lbl.textContent = 'Search:';
            searchLabel.append(lbl);
            filterPanel.append(searchLabel);
            // Append the filter panel to the inventory body (or appropriate section)
            bodyInventory.insertAdjacentElement('afterbegin', filterPanel);
        }

        // Function to toggle active tab and its body using "charnav--active" class
        const goToTab = async (key) => {
            // Toggle tab bodies
            Object.entries(tabBody).forEach(([k, el]) => {
                if (k === key) {
                    el.classList.add('charnav--active');
                } else {
                    el.classList.remove('charnav--active');
                }
            });

            // Toggle tab navigation buttons
            Object.entries(tabNav).forEach(([k, el]) => {
                if (k === key) {
                    el.classList.add('charnav--active');
                } else {
                    el.classList.remove('charnav--active');
                }
            });
        };
    }
}