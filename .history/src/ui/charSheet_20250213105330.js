export class CharacterSheetManager {
    constructor() {
        /** @type {HTMLElement | null} */
        this.dom = null;
        this.isActive = false;
    }

    async init() {
        // If already loaded, exit
        if (this.dom) return;

        // Use SillyTavern’s draggable window template
        const draggableTemplate = document.getElementById('generic_draggable_template');
        if (!draggableTemplate) return;

        const fragment = draggableTemplate.content.cloneNode(true);
        const draggable = fragment.querySelector('.draggable');
        if (!draggable) return;

        // Set up the draggable window
        draggable.id = 'character-sheet-window';
        draggable.classList.add('character-sheet-draggable');
        document.body.appendChild(fragment);

        this.dom = document.getElementById('character-sheet-window');
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

    /**
     * Attach event listeners to tab buttons and manage active states
     */
    initializeSheetLogic() {
        const tabButtons = document.querySelectorAll('.char-tab');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Clear active state from all
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));

                // Activate the clicked button
                button.classList.add('active');
                const targetPaneId = button.dataset.tab;
                const targetPane = document.getElementById(targetPaneId);

                // Show the target pane
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });

        // Close button
        const closeButton = document.getElementById('character-sheet-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hide());
        }
    }
}