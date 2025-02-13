export class CharacterSheetManager {
    constructor() {
        /** @type {HTMLElement | null} */
        this.dom = null;
        this.isActive = false;
    }

    async init() {
        const response = await fetch('/scripts/extensions/third-party/SillyTavern-CharSheet/html/charSheet.html');
        if (!response.ok) {
            console.warn('Failed to fetch charSheet.html');
            return;
        }

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
    }
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
        // Implementation of sheet logic initialization
    }

    updatePcAttackMacro() {
        if (!this.dom) return;
        
        const atkPrefix = /** @type {HTMLInputElement} */ (this.dom.querySelector('#pc-atk-prefix'))?.value || '';
        const itemNum = /** @type {HTMLInputElement} */ (this.dom.querySelector('#pc-item-num'))?.value || '1';
        let macroStr = `Attack Macro for item ${itemNum}`;
        if (atkPrefix.trim() !== '') {
            macroStr += ` (${atkPrefix})`;
        }
        /** @type {HTMLInputElement} */ (this.dom.querySelector('#pc-atk-macro')).value = macroStr;
    }
}