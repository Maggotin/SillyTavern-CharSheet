import { getContext } from '../../../extensions.js';

export class CharacterSheetManager {
    constructor() { // The DOM node for the entire sheet UI this.dom = null; this.isActive = false; }

async init() { // Load the HTML snippet for our extension (charSheet.html) const response = await fetch('/scripts/extensions/third-party/SillyTavern-CharSheet/charSheet.html'); if (!response.ok) { console.warn('Failed to fetch charSheet.html'); return; } // Parse the HTML snippet const template = document.createRange() .createContextualFragment(await response.text()) .querySelector('#character-sheet');

            // Clone it into our extension DOM
            this.dom = template.cloneNode(true);

            // Add a close button handler
            this.dom.querySelector('#character-sheet-close').addEventListener('click', () => this.hide());

            // Append to the body so it is present in the DOM
            document.body.append(this.dom);

            // Set up event listeners or “macro” logic here
            this.initializeSheetLogic();
            // Clone it into our extension DOM
            this.dom = template.cloneNode(true);

            // Add a close button handler
            this.dom.querySelector('#character-sheet-close').addEventListener('click', () => this.hide());

            // Append to the body so it is present in the DOM
            document.body.append(this.dom);

            // Set up event listeners or “macro” logic here
            this.initializeSheetLogic();

        }

        initializeSheetLogic() { // This is where you attach logic from the snippet (like your jQuery code). // As an example, we’ll replicate the “pcAttackMacro” logic from the snippet: 
        
        const pcAttackInputs = this.dom.querySelector('#pc-attack-inputs'); if (pcAttackInputs) { pcAttackInputs.addEventListener('change', () => this.updatePcAttackMacro()); pcAttackInputs.addEventListener('keyup', () => this.updatePcAttackMacro()); this.updatePcAttackMacro(); }
            // … attach more events for NPC or math tabs, as needed …
        }
            updatePcAttackMacro() {
                const atkPrefix = this.dom.querySelector('#pc-atk-prefix')?.value || ''; const itemNum = this.dom.querySelector('#pc-item-num')?.value || '1'; let macroStr = Attack Macro for item ${ itemNum }; if (atkPrefix.trim() !== '') { macroStr += (${ atkPrefix }); } // Display the result in the “pc-atk-macro” textarea this.dom.querySelector('#pc-atk-macro').value = macroStr; }

                show() { if (!this.dom) return; this.dom.classList.add('character-sheet--active'); this.dom.style.display = 'block'; this.isActive = true; }

                hide() { if (!this.dom) return; this.dom.classList.remove('character-sheet--active'); this.dom.style.display = 'none'; this.isActive = false; }

                toggle() { if (this.isActive) this.hide(); else this.show(); }
            }
            // Export the CharacterSheetManager class for use in other modules export default CharacterSheetManager;