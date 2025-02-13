import { getContext } from '../../../extensions.js';

export class CharacterSheetManager { constructor() { // The DOM node for the entire sheet UI this.dom = null; this.isActive = false; }

async init() { // Load the HTML snippet for our extension (charSheet.html) const response = await fetch('/scripts/extensions/third-party/SillyTavern-CharSheet/charSheet.html'); if (!response.ok) { console.warn('Failed to fetch charSheet.html'); return; } // Parse the HTML snippet const template = document.createRange() .createContextualFragment(await response.text()) .querySelector('#character-sheet');

