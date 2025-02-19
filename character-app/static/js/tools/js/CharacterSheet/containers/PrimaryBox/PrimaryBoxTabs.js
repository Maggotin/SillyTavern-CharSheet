// primaryBoxTabs.js
class PrimaryBoxTabs {
    constructor() {
        this.tabList = document.querySelector('.styles_tabList__Q4CqK');
        this.tabs = [
            {id: 'ACTIONS', content: '.stcs-primary-box__tab--actions'},
            {id: 'EQUIPMENT', content: '.stcs-primary-box__tab--equipment'},
            {id: 'FEATURES', content: '.stcs-primary-box__tab--features'},
            {id: 'BACKGROUND', content: '.stcs-primary-box__tab--description'},
            {id: 'NOTES', content: '.stcs-primary-box__tab--notes'},
            {id: 'EXTRAS', content: '.stcs-primary-box__tab--extras'}
        ];

        this.initTabs();
    }

    initTabs() {
        if (!this.tabList) return;

        const buttons = this.tabList.querySelectorAll('.styles_tabButton__wvSLf');
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.setActiveTab(index);
            });
        });

        // Set initial tab (Equipment/Inventory is default)
        this.setActiveTab(1);
    }

    setActiveTab(index) {
        const buttons = this.tabList.querySelectorAll('.styles_tabButton__wvSLf');
        const tabInfo = this.tabs[index];

        // Update button states
        buttons.forEach((btn, i) => {
            btn.setAttribute('aria-checked', i === index);
        });

        // Show/hide content
        this.tabs.forEach(tab => {
            const content = document.querySelector(tab.content);
            if (content) {
                content.style.display = tab === tabInfo ? 'block' : 'none';
            }
        });
    }
}

// Initialize tabs
document.addEventListener('DOMContentLoaded', () => {
    new PrimaryBoxTabs();
});