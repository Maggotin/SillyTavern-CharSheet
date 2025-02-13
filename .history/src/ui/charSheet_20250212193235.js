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

        const template = document.createRange()
            .createContextualFragment(await response.text())
            .querySelector('#character-sheet');

        this.dom = /** @type {HTMLElement} */ (template?.cloneNode(true));

        if (this.dom) {
            this.dom.querySelector('#character-sheet-close')
                ?.addEventListener('click', () => this.hide());

            document.body.append(this.dom);
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