import React, { useContext } from "react";
import { connect } from "react-redux";

import {
  rulesEngineSelectors,
  AbilityLookup,
  DataOriginRefData,
  InventoryManager,
  Item,
  ItemUtils,
  LimitedUseUtils,
  Spell,
  SpellUtils,
  RuleData,
  ItemManager,
} from "../../character-rules-engine/es";

import { SpellName } from "~/components/SpellName";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import SlotManager from "../../components/SlotManager";
import SlotManagerLarge from "../../components/SlotManagerLarge";
import { InventoryManagerContext } from "../../managers/InventoryManagerContext";
import { appEnvSelectors } from "../../selectors";
import { SharedAppState } from "../../stores/typings";
import { PaneIdentifierUtils } from "../../utils";

interface Props {
  item: Item;
  largePoolMinAmount: number;
  abilityLookup: AbilityLookup;
  ruleData: RuleData;
  dataOriginRefData: DataOriginRefData;
  isReadonly: boolean;
  proficiencyBonus: number;
  inventoryManager: InventoryManager;
  paneHistoryPush: PaneInfo["paneHistoryPush"];
}
class ItemDetailAbilities extends React.PureComponent<Props> {
  static defaultProps = {
    largePoolMinAmount: 11,
  };

  handleSlotUseSet = (uses: number): void => {
    const { item: itemData } = this.props;

    const item = ItemManager.getItem(ItemUtils.getMappingId(itemData));

    item.handleItemLimitedUseSet(uses);
  };

  handleSpellDetailClick = (id: number): void => {
    const { paneHistoryPush } = this.props;

    paneHistoryPush(
      PaneComponentEnum.CHARACTER_SPELL_DETAIL,
      PaneIdentifierUtils.generateCharacterSpell(id)
    );
  };

  renderSmallAmountSlotPool = (): React.ReactNode => {
    const { ruleData, abilityLookup, item, proficiencyBonus } = this.props;

    let limitedUse = ItemUtils.getLimitedUse(item);
    if (limitedUse === null) {
      return null;
    }

    const numberUsed = LimitedUseUtils.getNumberUsed(limitedUse);
    const maxUses = LimitedUseUtils.deriveMaxUses(
      limitedUse,
      abilityLookup,
      ruleData,
      proficiencyBonus
    );

    return (
      <SlotManager
        used={numberUsed}
        available={maxUses}
        size={"small"}
        onSet={this.handleSlotUseSet}
      />
    );
  };

  renderLargeAmountSlotPool = (): React.ReactNode => {
    const { ruleData, abilityLookup, item, isReadonly, proficiencyBonus } =
      this.props;

    let limitedUse = ItemUtils.getLimitedUse(item);
    if (limitedUse === null) {
      return null;
    }

    const numberUsed = LimitedUseUtils.getNumberUsed(limitedUse);
    const maxUses = LimitedUseUtils.deriveMaxUses(
      limitedUse,
      abilityLookup,
      ruleData,
      proficiencyBonus
    );

    return (
      <SlotManagerLarge
        available={maxUses}
        used={numberUsed}
        onSet={this.handleSlotUseSet}
        isReadonly={isReadonly}
      />
    );
  };

  renderLimitedUses = (): React.ReactNode => {
    const {
      item,
      largePoolMinAmount,
      abilityLookup,
      ruleData,
      proficiencyBonus,
      inventoryManager,
    } = this.props;

    let limitedUse = ItemUtils.getLimitedUse(item);
    if (!limitedUse) {
      return null;
    }

    let initialMaxUses = LimitedUseUtils.getInitialMaxUses(limitedUse);
    if (initialMaxUses === 0) {
      return null;
    }

    let maxUses = LimitedUseUtils.deriveMaxUses(
      limitedUse,
      abilityLookup,
      ruleData,
      proficiencyBonus
    );
    if (!maxUses) {
      return null;
    }

    const canUseCharges = inventoryManager.canUseItemCharges(item);

    return canUseCharges ? (
      <div className="ct-item-detail-abilities__limited-uses">
        <div className="ct-item-detail-abilities__limited-uses-label">
          Charges
        </div>
        <div className="ct-item-detail-abilities__limited-uses-manager">
          {maxUses >= largePoolMinAmount
            ? this.renderLargeAmountSlotPool()
            : this.renderSmallAmountSlotPool()}
        </div>
      </div>
    ) : null;
  };

  renderSpell = (spell: Spell): React.ReactNode => {
    const { dataOriginRefData } = this.props;

    let limitedUse = SpellUtils.getLimitedUse(spell);

    let limitedUseNode: React.ReactNode = "At Will";
    if (limitedUse) {
      let minConsumed = LimitedUseUtils.getMinNumberConsumed(limitedUse);
      let maxConsumed = LimitedUseUtils.getMaxNumberConsumed(limitedUse);

      if (minConsumed === maxConsumed || minConsumed === null) {
        limitedUseNode = `${maxConsumed} Charge${maxConsumed === 1 ? "" : "s"}`;
      } else {
        limitedUseNode = `${minConsumed}-${maxConsumed} Charges`;
      }
    }

    return (
      <div
        className="ct-item-detail-abilities__spell"
        key={SpellUtils.getUniqueKey(spell)}
      >
        <div
          className="ct-item-detail-abilities__spell-name"
          onClick={this.handleSpellDetailClick.bind(
            this,
            SpellUtils.getMappingId(spell)
          )}
        >
          <SpellName
            spell={spell}
            showLegacy={true}
            dataOriginRefData={dataOriginRefData}
          />
        </div>
        <div className="ct-item-detail-abilities__spell-usage">
          {limitedUseNode}
        </div>
      </div>
    );
  };

  renderSpells = (): React.ReactNode => {
    const { item } = this.props;

    const spells = ItemUtils.getSpells(item);
    if (!spells || !spells.length) {
      return null;
    }

    return (
      <div className="ct-item-detail-abilities__spells">
        {spells.map((spell) => this.renderSpell(spell))}
      </div>
    );
  };

  render() {
    let limitedUseNode = this.renderLimitedUses();
    let spellsNode = this.renderSpells();

    if (!limitedUseNode && !spellsNode) {
      return null;
    }

    return (
      <div className="ct-item-detail-abilities">
        {limitedUseNode}
        {spellsNode}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    abilityLookup: rulesEngineSelectors.getAbilityLookup(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    dataOriginRefData: rulesEngineSelectors.getDataOriginRefData(state),
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
  };
}

const ItemDetailAbilitiesWrapper = (props) => {
  const { inventoryManager } = useContext(InventoryManagerContext);
  const {
    pane: { paneHistoryPush },
  } = useSidebar();
  return (
    <ItemDetailAbilities
      inventoryManager={inventoryManager}
      paneHistoryPush={paneHistoryPush}
      {...props}
    />
  );
};

export default connect(mapStateToProps)(ItemDetailAbilitiesWrapper);
