const windowPositions = Object.freeze({
    TOP_LEFT: 'topLeft',
    TOP_RIGHT: 'topRight',
    BOTTOM_LEFT: 'bottomLeft',
    BOTTOM_RIGHT: 'bottomRight',
    CENTER: 'center'
});

const windowSizes = Object.freeze({
    COMPACT: 'compact',
    NORMAL: 'normal',
    LARGE: 'large'
});

const elementParentSelectors = Object.freeze({
    CHAT: '#chat',
    RIGHT_PANEL: '#right-nav-panel',
    LEFT_PANEL: '#left-nav-panel',
    MOVABLE: '#movingDivs'
});

const defaultSettings = {
    position: windowPositions.CENTER,
    size: windowSizes.NORMAL,
    visible: false,
    parentSelector: elementParentSelectors.MOVABLE
};

/**
 * @type {CharacterSheetManagerSettings}
 * @typedef {Object} CharacterSheetManagerSettings
 * @property {boolean} enabled Whether the extension is enabled
 * @property {boolean} showIfEmpty Whether to show the element if there are no injects
 * @property {string} positionClass The position class of the element
 * @property {string} zIndexClass The z-index class of the element
 * @property {string} sizeClass The size class of the element
 * @property {string} parentSelector The selector of the parent element
 */
const defaultSettings = Object.freeze({
    enabled: true,
    showIfEmpty: false,
    positionClass: elementPositionClasses.TOP_LEFT,
    zIndexClass: elementZIndexClasses.ABOVE_PANELS,
    sizeClass: elementSizeClasses.NORMAL,
    parentSelector: elementParentSelectors.CHAT,
});

export class CharacterSheetManager {
    constructor() {
        this.settings = {
            parentSelector: elementParentSelectors.MOVABLE,
            positionClass: 'topRight',
            sizeClass: 'normal',
            zIndexClass: 'abovePanels'
        };
        this.dom = null;
        this.isActive = false;
    }

    async init() {
        if (this.dom) return; // Already loaded

        // Load saved settings
        this.loadSettings();

        // Get parent container
        const parentContainer = document.querySelector(this.settings.parentSelector);
        if (!parentContainer) {
            console.warn(`Parent container ${this.settings.parentSelector} not found`);
            return;
        }

        // Create draggable window
        const draggable = document.createElement('div');
        draggable.className = 'character-sheet-draggable';
        draggable.classList.add(
            this.settings.positionClass,
            this.settings.sizeClass,
            this.settings.zIndexClass,
            `parent${this.settings.parentSelector.replace('#', '').charAt(0).toUpperCase()}${this.settings.parentSelector.slice(2)}`
        );

        // Add content
        const content = document.createElement('div');
        content.className = 'character-sheet-content';
        draggable.appendChild(content);

        // Add to DOM
        parentContainer.appendChild(draggable);
        this.dom = draggable;

        this.initializeSheetLogic();
        this.initializeSettings();
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

    initializeSettings() {
        if (!this.dom) return;

        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'sheet-settings';

        // Parent selector
        const parentSelect = document.createElement('select');
        parentSelect.className = 'parent-select text_pole';
        Object.entries(elementParentSelectors).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = key.toLowerCase().replace(/_/g, ' ');
            parentSelect.appendChild(option);
        });
        parentSelect.value = this.settings.parentSelector;
        parentSelect.addEventListener('change', () => {
            const oldParent = document.querySelector(this.settings.parentSelector);
            const newParent = document.querySelector(parentSelect.value);
            if (oldParent && newParent && this.dom) {
                this.settings.parentSelector = parentSelect.value;
                oldParent.removeChild(this.dom);
                newParent.appendChild(this.dom);
                this.saveSettings();
            }
        });

        settingsContainer.appendChild(parentSelect);
        
        // Position selector
        const positionSelect = document.createElement('select');
        positionSelect.className = 'sheet-position text_pole';
        Object.entries(windowPositions).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = key.toLowerCase().replace(/_/g, ' ');
            positionSelect.appendChild(option);
        });
        positionSelect.value = this.settings.position;
        positionSelect.addEventListener('change', () => {
            this.settings.position = positionSelect.value;
            this.updatePosition();
        });

        // Size selector
        const sizeSelect = document.createElement('select');
        sizeSelect.className = 'sheet-size text_pole';
        Object.entries(windowSizes).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = key.toLowerCase();
            sizeSelect.appendChild(option);
        });
        sizeSelect.value = this.settings.size;
        sizeSelect.addEventListener('change', () => {
            this.settings.size = sizeSelect.value;
            this.updateSize();
        });

        settingsContainer.appendChild(positionSelect);
        settingsContainer.appendChild(sizeSelect);
        
        // Add settings to the header
        const header = this.dom.querySelector('.dragHeader');
        if (header) {
            header.appendChild(settingsContainer);
        }
    }

    updatePosition() {
        if (!this.dom) return;
        
        // Remove all position classes
        Object.values(windowPositions).forEach(pos => {
            this.dom.classList.remove(pos);
        });
        
        // Add new position class
        this.dom.classList.add(this.settings.position);
    }

    updateSize() {
        if (!this.dom) return;
        
        // Remove all size classes
        Object.values(windowSizes).forEach(size => {
            this.dom.classList.remove(size);
        });
        
        // Add new size class
        this.dom.classList.add(this.settings.size);
    }

    saveSettings() {
        // Save settings to localStorage
        const key = 'SillyTavernCharSheet';
        localStorage.setItem(key, JSON.stringify(this.settings));
    }

    loadSettings() {
        // Load settings from localStorage
        const key = 'SillyTavernCharSheet';
        const saved = localStorage.getItem(key);
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    updateClasses() {
        if (!this.dom) return;
        
        // Update parent
        const oldParent = document.querySelector(this.settings.parentSelector);
        const newParent = document.querySelector(this.settings.parentSelector);
        if (oldParent !== newParent) {
            oldParent?.removeChild(this.dom);
            newParent?.appendChild(this.dom);
        }

        // Update classes
        this.dom.className = 'character-sheet-draggable';
        this.dom.classList.add(
            this.settings.positionClass,
            this.settings.sizeClass,
            this.settings.zIndexClass,
            `parent${this.settings.parentSelector.replace('#', '').charAt(0).toUpperCase()}${this.settings.parentSelector.slice(2)}`
        );
    }
}