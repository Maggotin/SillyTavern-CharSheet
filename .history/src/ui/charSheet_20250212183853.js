import { getContext } from "../../extensions.js";

export class CharacterSheetManager {
    constructor() {
        this.dom = null;
        this.isActive = false;
    }

    async init() {
        const response = await fetch('/scripts/extensions/third-party/SillyTavern-CharSheet/html/charSheet.html');
        if (!response.ok) {
            console.warn('Failed to fetch charSheet.html');
            return;
        }

        const template = document.createRange()
            .createContextualFragment(await response.text())
            .querySelector('#character-sheet');

        this.dom = template.cloneNode(true);

        this.dom.querySelector('#character-sheet-close')
            .addEventListener('click', () => this.hide());

        document.body.append(this.dom);

        this.initializeSheetLogic();
    }

    // Fix the string template literal syntax
    updatePcAttackMacro() {
        const atkPrefix = this.dom.querySelector('#pc-atk-prefix')?.value || '';
        const itemNum = this.dom.querySelector('#pc-item-num')?.value || '1';
        let macroStr = `Attack Macro for item ${itemNum}`;
        if (atkPrefix.trim() !== '') {
            macroStr += ` (${atkPrefix})`;
        }
        this.dom.querySelector('#pc-atk-macro').value = macroStr;
    }