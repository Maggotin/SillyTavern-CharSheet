import { groupBy, orderBy } from "lodash";
import React, { useContext } from "react";
import { connect } from "react-redux";

import { AttunementSlot } from "@dndbeyond/character-components/es";
import {
  rulesEngineSelectors,
  Item,
  ItemUtils,
  CampaignUtils,
  CharacterTheme,
  InventoryManager,
  serviceDataSelectors,
  PartyInfo,
} from "@dndbeyond/character-rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { InventoryManagerContext } from "../../../Shared/managers/InventoryManagerContext";
import { PaneIdentifierUtils } from "../../../Shared/utils";
import { SheetAppState } from "../../typings";
import AttunementItem from "./AttunementItem";

interface Props {
  items: Array<Item>;
  attunedSlots: Array<Item | null>;
  isFiltered: boolean;
  isMobile: boolean;
  theme: CharacterTheme;
  inventoryManager: InventoryManager;
  partyInfo: PartyInfo | null;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class Attunement extends React.PureComponent<Props> {
  static defaultProps = {
    isFiltered: false,
    isMobile: false,
  };

  handleItemShow = (item: Item): void => {
    const { paneHistoryStart } = this.props;

    paneHistoryStart(
      PaneComponentEnum.ITEM_DETAIL,
      PaneIdentifierUtils.generateItem(ItemUtils.getMappingId(item))
    );
  };

  renderItems = (): React.ReactNode => {
    const { items, theme, inventoryManager, partyInfo } = this.props;

    const attunableItems = items.filter((item) => ItemUtils.canAttune(item));
    const sortedItems = groupBy(
      orderBy(
        attunableItems,
        [
          (item) => ItemUtils.getRarityLevel(item),
          (item) => ItemUtils.getName(item),
          (item) => ItemUtils.getMappingId(item),
        ],
        ["desc", "asc"]
      ),
      (item) => {
        if (inventoryManager.isShared(item)) {
          return "party";
        } else {
          return "character";
        }
      }
    );

    return (
      <div className="ct-attunement__group ct-attunement__group--items">
        <div className="ct-attunement__group-header">
          Items Requiring Attunement
        </div>
        <div className="ct-attunement__group-items">
          {sortedItems.character?.length > 0 ? (
            sortedItems.character?.map((item) => (
              <AttunementItem
                key={ItemUtils.getUniqueKey(item)}
                item={item}
                onItemShow={this.handleItemShow}
                theme={theme}
              />
            ))
          ) : (
            <div className="ct-attunement__group-empty">
              Items that you can attune to will display here as you make them
              active.
            </div>
          )}
        </div>
        {partyInfo &&
          CampaignUtils.isSharingStateActive(
            CampaignUtils.getSharingState(partyInfo)
          ) && (
            <>
              <div className="ct-attunement__group-header">
                Party Items Requiring Attunement
              </div>
              <div className="ct-attunement__group-items">
                {sortedItems.party?.length > 0 ? (
                  sortedItems.party?.map((item) => (
                    <AttunementItem
                      key={ItemUtils.getUniqueKey(item)}
                      item={item}
                      onItemShow={this.handleItemShow}
                      theme={theme}
                    />
                  ))
                ) : (
                  <div className="ct-attunement__group-empty">
                    Party items that you can attune to will display here as you
                    make them active.
                  </div>
                )}
              </div>
            </>
          )}
      </div>
    );
  };

  renderAttuned = (): React.ReactNode => {
    const { attunedSlots, isMobile, theme } = this.props;

    return (
      <div className="ct-attunement__group ct-attunement__group--attuned">
        <div className="ct-attunement__group-header">Attuned Items</div>
        <div className="ct-attunement__group-items">
          {attunedSlots.map((slot, idx) => (
            <AttunementSlot
              theme={theme}
              key={`slot-${idx}-${slot ? ItemUtils.getUniqueKey(slot) : ""}`}
              slot={slot}
              onClick={this.handleItemShow}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="ct-attunement">
        {this.renderAttuned()}
        {this.renderItems()}
      </div>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    attunedSlots: rulesEngineSelectors.getAttunedSlots(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    items: rulesEngineSelectors.getEquippedItems(state),
    partyInfo: serviceDataSelectors.getPartyInfo(state),
  };
}

const AttunementContainer = (props) => {
  const { inventoryManager } = useContext(InventoryManagerContext);
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return (
    <Attunement
      inventoryManager={inventoryManager}
      paneHistoryStart={paneHistoryStart}
      {...props}
    />
  );
};

export default connect(mapStateToProps)(AttunementContainer);
