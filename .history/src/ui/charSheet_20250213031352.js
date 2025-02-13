export class CharacterSheetManager {
    constructor() {
        /** @type {HTMLElement | null} */
        this.dom = null;
        this.isActive = false;
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
        function spelltabclick() {
            inventory.style.display = "none";
            core.style.display = "none";
            spells.style.display = "block";
        }

        function inventorytabclick() {
            inventory.style.display = "block";
            core.style.display = "none";
            spells.style.display = "none";
        }

        function maintabclick() {
            details.style.display = "none";
            core.style.display = "block";
            spells.style.display = "none";
        }


        const goToTab = async (key) => {
            for (const [k, v] of Object.entries(tabBody)) {
                if (k == key) continue;
                v.classList.remove('char-nav--active');
            }
            tabBody[key].classList.add('stem--active');
            for (const [k, v] of Object.entries(tabTab)) {
                if (k == key) continue;
                v.classList.remove('char-nav--active');
            }
            tabTab[key].classList.add('char-nav--active');
        };

        const tabTab = {
            /**@type {HTMLElement} */
            settings: undefined,
            /**@type {HTMLElement} */
            extensions: undefined,
            /**@type {HTMLElement} */
            plugins: undefined,
            /**@type {HTMLElement} */
            catalog: undefined,
            /**@type {HTMLElement} */
            raw: undefined,
            /**@type {HTMLElement} */
            config: undefined,
        };
        const tabBody = {
            /**@type {HTMLElement} */
            settings: settingsBody,
            /**@type {HTMLElement} */
            extensions: undefined,
            /**@type {HTMLElement} */
            plugins: undefined,
            /**@type {HTMLElement} */
            catalog: undefined,
            /**@type {HTMLElement} */
            raw: undefined,
            /**@type {HTMLElement} */
            config: undefined,
        };

        const tabs = document.createElement('div'); {
            tabs.classList.add('stem--tabs');
            const tabSettings = document.createElement('div'); {
                tabTab.settings = tabSettings;
                tabSettings.classList.add('stem--tab');
                tabSettings.classList.add('stem--tabSettings');
                tabSettings.classList.add('stem--active');
                tabSettings.title = 'Extension settings';
                const i = document.createElement('i'); {
                    i.classList.add('fa-solid', 'fa-fw', 'fa-wrench');
                    tabSettings.append(i);
                }
                const t = document.createElement('span'); {
                    t.classList.add('stem--text');
                    t.textContent = 'Extension Settings';
                    tabSettings.append(t);
                }
                tabSettings.addEventListener('click', async () => {
                    await goToTab('settings');
                });
                tabs.append(tabSettings);
            }
            const tabExtensions = document.createElement('div'); {
                tabTab.extensions = tabExtensions;
                tabExtensions.classList.add('stem--tab');
                tabExtensions.classList.add('stem--tabExtensions');
                tabExtensions.title = 'Manage installed UI extensions';
                const i = document.createElement('i'); {
                    i.classList.add('fa-solid', 'fa-fw', 'fa-cubes');
                    tabExtensions.append(i);
                }
                const t = document.createElement('span'); {
                    t.classList.add('stem--text');
                    t.textContent = 'Extensions';
                    tabExtensions.append(t);
                }
                tabExtensions.addEventListener('click', async () => {
                    await goToTab('extensions');
                });
                tabs.append(tabExtensions);
            }
            const tabPlugins = document.createElement('div'); {
                tabTab.plugins = tabPlugins;
                tabPlugins.classList.add('stem--tab');
                tabPlugins.classList.add('stem--tabPlugins');
                tabPlugins.title = 'Manage installed server plugins';
                const i = document.createElement('i'); {
                    i.classList.add('fa-solid', 'fa-fw', 'fa-puzzle-piece');
                    tabPlugins.append(i);
                }
                const t = document.createElement('span'); {
                    t.classList.add('stem--text');
                    t.textContent = 'Plugins';
                    tabPlugins.append(t);
                }
                tabPlugins.addEventListener('click', async () => {
                    await goToTab('plugins');
                });
                tabs.append(tabPlugins);
            }
            const tabCatalog = document.createElement('div'); {
                tabTab.catalog = tabCatalog;
                tabCatalog.classList.add('stem--tab');
                tabCatalog.classList.add('stem--tabCatalog');
                tabCatalog.title = 'Install extensions and plugins from catalog';
                const i = document.createElement('i'); {
                    i.classList.add('fa-solid', 'fa-fw', 'fa-book-open');
                    tabCatalog.append(i);
                }
                const t = document.createElement('span'); {
                    t.classList.add('stem--text');
                    t.textContent = 'Catalog';
                    tabCatalog.append(t);
                }
                tabCatalog.addEventListener('click', async () => {
                    await goToTab('catalog');
                });
                tabs.append(tabCatalog);
            }
            const tabManual = document.createElement('div'); {
                tabManual.classList.add('stem--tab');
                tabManual.classList.add('stem--button');
                tabManual.classList.add('stem--tabManual');
                tabManual.title = 'Install extension or plugin from URL';
                const i = document.createElement('i'); {
                    i.classList.add('fa-solid', 'fa-fw', 'fa-plus');
                    tabManual.append(i);
                }
                tabManual.addEventListener('click', async () => {
                    //TODO use custom dlg that accepts plugins and extensions
                    await openThirdPartyExtensionMenu();
                    await updates.extensions();
                    await updates.plugins();
                    updates.catalog();
                });
                tabs.append(tabManual);
            }
            const sep = document.createElement('div'); {
                sep.classList.add('stem--sep');
                tabs.append(sep);
            }
            const tabRaw = document.createElement('div'); {
                tabTab.raw = tabRaw;
                tabRaw.classList.add('stem--tab');
                tabRaw.classList.add('stem--tabRaw');
                tabRaw.title = 'Edit extension settings JSON';
                const i = document.createElement('i'); {
                    i.classList.add('fa-solid', 'fa-fw', 'fa-pen-to-square');
                    tabRaw.append(i);
                }
                tabRaw.addEventListener('click', async () => {
                    await goToTab('raw');
                });
                tabs.append(tabRaw);
            }
            const tabConfig = document.createElement('div'); {
                tabTab.config = tabConfig;
                tabConfig.classList.add('stem--tab');
                tabConfig.classList.add('stem--tabConfig');
                tabConfig.title = 'Extension manager settings';
                const i = document.createElement('i'); {
                    i.classList.add('fa-solid', 'fa-fw', 'fa-gear');
                    tabConfig.append(i);
                }
                tabConfig.addEventListener('click', async () => {
                    await goToTab('config');
                });
                tabs.append(tabConfig);
            }
            header.insertAdjacentElement('afterend', tabs);
        }
     
 });

        console.debug('Tab functionality initialized');
        console.debug('Character Sheet Logic Initialized');
    }
}