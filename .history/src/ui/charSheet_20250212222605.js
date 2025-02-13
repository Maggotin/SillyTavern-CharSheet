export class CharacterSheetManager {
    constructor() {
        /** @type {HTMLElement | null} */
        this.dom = null;
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
        draggable.classList.add('character-sheet-draggable');

        // Set title
        const title = draggable.querySelector('.dragHeader');
        if (title) {
            title.innerHTML = 'D&D 5E Character Sheet';
        }

        // Add close button handler
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

        draggable.appendChild(template.cloneNode(true));

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

    initializeSheetLogic() {
        if (!this.dom) return;

        // Set up tab switching
        this.dom.querySelectorAll('.nav-link').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = tab.getAttribute('data-tab');
                if (targetTab) this.switchTab(targetTab);
            });
        });

        // Initialize other event listeners
        this.initializeAbilityScores();
        this.initializeSkills();
    }

    // ... rest of the methods remain the same ...
}