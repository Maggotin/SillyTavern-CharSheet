import { eventSource, event_types } from '../../../../script.js';
import { getContext } from '../../../extensions.js';

export class CharacterSheetManager {
    constructor() {
        this.dom = null;
        this.isActive = false;
    }

    async init() {
        const response = await fetch('/scripts/extensions/third-party/SillyTavern-CharSheet/html/charSheet.html');
        if (!response.ok) {
            console.warn('Failed to fetch template: character_sheet.html');
            return;
        }
        const template = document.createRange().createContextualFragment(await response.text()).querySelector('#character-sheet');
        this.dom = template.cloneNode(true);
        this.dom.querySelector('#character-sheet-close').addEventListener('click', () => this.hide());
        document.body.append(this.dom);

        // Initialize any character sheet specific logic here
        this.initializeSheetLogic();
    }

    initializeSheetLogic() {
        // Add event listeners and initialize logic from app.js here
        // For example:
        this.dom.querySelector('#pc-attack-inputs').addEventListener('change', this.updatePcAttackMacro.bind(this));
        // ... other initializations
    }

    updatePcAttackMacro() {
        // Logic from app.js
        const atkPrefix = this.dom.querySelector('#pc-atk-prefix').value;
        const itemNum = this.dom.querySelector('#pc-item-num').value;
        let macro = `Attack Macro for item ${itemNum}`;
        if (atkPrefix) {
            macro += ` (${atkPrefix})`;
        }
        this.dom.querySelector('#pc-atk-macro').value = macro;
    }

    // ... other methods from app.js

    show() {
        if (!this.dom) return;
        this.dom.classList.add('character-sheet--active');
        this.isActive = true;
    }

    hide() {
        if (!this.dom) return;
        this.dom.classList.remove('character-sheet--active');
        this.isActive = false;
    }

    toggle() {
        if (this.isActive) {
            this.hide();
        } else {
            this.show();
        }
    }
}