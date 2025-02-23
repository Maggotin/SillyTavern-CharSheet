import React from "react";

import {
  Item,
  ItemUtils,
  RuleData,
  CharacterTheme,
  Container,
} from "@dndbeyond/character-rules-engine/es";

import { ItemName } from "~/components/ItemName";
import { LegacyBadge } from "~/components/LegacyBadge";

import ItemDetail from "../../ItemDetail";
import { ItemListInformationCollapsible } from "../../ItemListInformationCollapsible";
import EquipmentListItem, {
  EquipmentListItemActions,
  EquipmentListItemHeaderAction,
} from "../EquipmentListItem";
import SourceCollapsibleHeader from "../SourceCollapsibleHeader";
import { CollapsibleHeading } from "../common/Collapsible";

interface Props {
  item: Item;
  container: Container | null;

  onRemove?: (item: Item) => void;
  onRemoveInfusion: (item: Item) => void;
  onUnequip?: (item: Item) => void;
  onEquip?: (item: Item) => void;
  onAttune?: (item: Item) => void;
  onUnattune?: (item: Item) => void;
  onQuantitySet: (item: Item, quantity: number) => void;

  atAttuneMax: boolean;

  showRemove?: boolean;
  showEquip?: boolean;
  showUnequip?: boolean;
  showAttuning?: boolean;
  showHeaderAction: boolean;

  removeLabel: string;
  removeInfusionLabel: string;
  unequipLabel: string;
  equipLabel: string;
  attuneLabel: string;
  unattuneLabel: string;
  consumeLabel: string;

  ruleData: RuleData;
  proficiencyBonus: number;
  theme: CharacterTheme;
}
export class ArmorListItem extends React.PureComponent<Props> {
  renderHeader() {
    const { item, showHeaderAction, ruleData, proficiencyBonus } = this.props;
    const type = ItemUtils.getType(item);
    const baseArmorName = ItemUtils.getBaseArmorName(item);
    const isLegacy = ItemUtils.isLegacy(item);

    const heading = (
      <CollapsibleHeading>
        <div className="equipment-list-heading">
          <span className="equipment-list-heading-text">
            <ItemName item={item} />
          </span>
          {isLegacy && <LegacyBadge variant="margin-left" />}
        </div>
      </CollapsibleHeading>
    );

    let metaItems: Array<string> = [];
    if (type) {
      metaItems.push(type);
    }
    if (baseArmorName) {
      metaItems.push(baseArmorName);
    }

    let imageUrl = ItemUtils.getAvatarUrl(item);

    if (showHeaderAction) {
      return (
        <EquipmentListItemHeaderAction
          imageUrl={imageUrl}
          heading={heading}
          metaItems={metaItems}
          {...this.props}
        />
      );
    }

    return (
      <SourceCollapsibleHeader
        previewSrc={imageUrl}
        heading={heading}
        initialMetaItems={metaItems}
        slotTypeNameSingular="Charge"
        slotTypeNamePlural="Charges"
        item={item}
        ruleData={ruleData}
        proficiencyBonus={proficiencyBonus}
      />
    );
  }

  render() {
    const { item, ruleData, proficiencyBonus, theme, container } = this.props;

    return (
      <EquipmentListItem header={this.renderHeader()}>
        <ItemListInformationCollapsible ruleData={ruleData} item={item} />
        <ItemDetail
          container={container}
          theme={theme}
          item={item}
          ruleData={ruleData}
          showCustomize={false}
          showActions={false}
          proficiencyBonus={proficiencyBonus}
        />
        <EquipmentListItemActions {...this.props} />
      </EquipmentListItem>
    );
  }
}
