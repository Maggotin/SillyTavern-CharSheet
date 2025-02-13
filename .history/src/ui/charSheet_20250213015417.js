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

    /**
     * @param {string} key
     */
    async goToTab(key) {
        // Hide all other tabs
        for (const [k, v] of Object.entries(this.tabContents)) {
            if (k === key) continue;
            v?.classList.remove('stem--active');
        }
        this.tabContents[key]?.classList.add('stem--active');

        // Update tab headers
        for (const [k, v] of Object.entries(this.tabHeaders)) {
            if (k === key) continue;
            v?.classList.remove('stem--active');
        }
        this.tabHeaders[key]?.classList.add('stem--active');
    }

    setupTabs(container) {
        // Create tabs container
        const tabs = document.createElement('div');
        tabs.classList.add('stem--tabs');

        // PC Tab
        const pcTab = document.createElement('div');
        this.tabHeaders.pc = pcTab;
        pcTab.classList.add('stem--tab', 'stem--active');
        pcTab.title = 'Player Character Sheet';
        
        const pcIcon = document.createElement('i');
        pcIcon.classList.add('fa-solid', 'fa-fw', 'fa-user');
        
        const pcText = document.createElement('span');
        pcText.classList.add('stem--text');
        pcText.textContent = 'PC';
        
        pcTab.append(pcIcon, pcText);
        pcTab.addEventListener('click', () => this.goToTab('pc'));
        tabs.append(pcTab);

        // NPC Tab
        const npcTab = document.createElement('div');
        this.tabHeaders.npc = npcTab;
        npcTab.classList.add('stem--tab');
        npcTab.title = 'NPC Sheet';
        
        const npcIcon = document.createElement('i');
        npcIcon.classList.add('fa-solid', 'fa-fw', 'fa-users');
        
        const npcText = document.createElement('span');
        npcText.classList.add('stem--text');
        npcText.textContent = 'NPC';
        
        npcTab.append(npcIcon, npcText);
        npcTab.addEventListener('click', () => this.goToTab('npc'));
        tabs.append(npcTab);

        // Stats Tab
        const statsTab = document.createElement('div');
        this.tabHeaders.stats = statsTab;
        statsTab.classList.add('stem--tab');
        statsTab.title = 'Character Stats';
        
        const statsIcon = document.createElement('i');
        statsIcon.classList.add('fa-solid', 'fa-fw', 'fa-dice-d20');
        
        const statsText = document.createElement('span');
        statsText.classList.add('stem--text');
        statsText.textContent = 'Stats';
        
        statsTab.append(statsIcon, statsText);
        statsTab.addEventListener('click', () => this.goToTab('stats'));
        tabs.append(statsTab);

        // Store content references
        this.tabContents.pc = container.querySelector('#pc');
        this.tabContents.npc = container.querySelector('#npc');
        this.tabContents.stats = container.querySelector('#stats');

        // Insert tabs before content
        container.insertBefore(tabs, container.firstChild);

        // Activate default tab
        this.goToTab('pc');
    }
}