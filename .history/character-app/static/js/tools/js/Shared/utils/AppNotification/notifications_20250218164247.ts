import {
  CharClass,
  ClassUtils,
  Extra,
  ExtraUtils,
  Item,
  ItemUtils,
  Spell,
  SpellUtils,
} from "../../character-rules-engine/es";

import { AppNotificationUtils } from "../../utils";

export function handleItemAddAccepted(item: Item, amount: number): void {
  if (ItemUtils.isPack(item)) {
    AppNotificationUtils.dispatchSuccess(
      "Equipment Pack Added",
      `${ItemUtils.getName(item)} items added to your inventory`
    );
  } else {
    if (amount >= 1) {
      let itemName = ItemUtils.getDefinitionName(item);
      let displayName = itemName ? `"${itemName}"` : "unknown";
      let toastMessage = `Added ${displayName} item`;
      if (amount > 1) {
        toastMessage = `Added ${amount} ${displayName} items`;
      }
      AppNotificationUtils.dispatchSuccess("Equipment Added", toastMessage);
    }
  }
}
export function handleItemAddRejected(item: Item, amount: number): void {
  AppNotificationUtils.dispatchError(
    "Equipment Not Added",
    `${ItemUtils.getName(item)} could not be added to your inventory`
  );
}

export function handleStartingEquipmentAccepted(): void {
  AppNotificationUtils.dispatchSuccess(
    "Equipment Chosen",
    "Starting Equipment Added to Inventory"
  );
}

export function handleStartingEquipmentRejected(): void {
  AppNotificationUtils.dispatchSuccess(
    "Starting Equipment Skipped",
    "No items added to inventory"
  );
}

export function handleStartingGoldAccepted(): void {
  AppNotificationUtils.dispatchSuccess(
    "Gold Added",
    "Starting Gold Added to Currencies Section"
  );
}

export function handleSpellCreateAccepted(
  spell: Spell,
  charClass: CharClass
): void {
  AppNotificationUtils.dispatchSuccess(
    "Spell Added",
    `Added ${SpellUtils.getName(spell)} spell to your ${ClassUtils.getName(
      charClass
    )}`
  );
}

//TODO Extras - move into manager somehow?
export function handleExtraCreateAccepted(extra: Extra): void {
  AppNotificationUtils.dispatchSuccess(
    `${ExtraUtils.getExtraType(extra)} Added`,
    `Added "${ExtraUtils.getName(extra)}"`
  );
}
