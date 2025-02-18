import React, { useContext } from "react";

import {
  Collapsible,
  CollapsibleHeaderContent,
  CollapsibleHeading,
} from "../../character-components/es";
import {
  CampaignUtils,
  CharacterTheme,
  Container,
  ContainerUtils,
  InventoryManager,
  CharacterCurrencyContract,
  Item,
  ItemUtils,
  PartyInfo,
  RuleData,
  CoinManager,
} from "../../character-rules-engine/es";

import { ItemName } from "~/components/ItemName";
import { NumberDisplay } from "~/components/NumberDisplay";

import CurrencyCollapsible from "../../../CharacterSheet/components/CurrencyCollapsible";
import { CurrencyErrorTypeEnum } from "../../containers/panes/CurrencyPane/CurrencyPaneConstants";
import { CoinManagerContext } from "../../managers/CoinManagerContext";
import { InventoryManagerContext } from "../../managers/InventoryManagerContext";
import { CustomItemCreator } from "../CustomItemCreator";
import EquipmentShop from "../EquipmentShop";
import ItemDetail from "../ItemDetail";
import { ItemSlotManager } from "../ItemSlotManager";
import { ThemeButtonWithMenu } from "../common/Button";

interface Props {
  currentContainer: Container;
  theme: CharacterTheme;
  onItemMove?: (item: Item, containerDefinitionKey: string) => void;
  onItemEquip?: (item: Item, uses: number) => void;
  ruleData: RuleData;
  proficiencyBonus: number;
  inventory: Array<Item>;
  containers: Array<Container>;
  shopOpenInitially?: boolean;
  isReadonly: boolean;
  partyInfo: PartyInfo | null;
  inventoryManager: InventoryManager;
  coinManager: CoinManager;
  handleCurrencyChangeError: (
    currencyName: string,
    errorType: CurrencyErrorTypeEnum
  ) => void;
  handleCurrencyAdjust: (
    coin: Partial<CharacterCurrencyContract>,
    multiplier: 1 | -1,
    containerDefinitionKey: string
  ) => void;
  handleAmountSet: (
    containerDefinitionKey: string,
    key: keyof CharacterCurrencyContract,
    amount: number
  ) => void;
}

export const ContainerActionsComponent: React.FC<Props> = ({
  currentContainer,
  theme,
  ruleData,
  onItemMove,
  onItemEquip,
  proficiencyBonus,
  inventory,
  containers,
  shopOpenInitially = false,
  isReadonly,
  partyInfo,
  inventoryManager,
  coinManager,
  handleCurrencyAdjust,
  handleAmountSet,
  handleCurrencyChangeError,
}) => {
  let showEquipmentShop = true;
  if (
    ContainerUtils.isShared(currentContainer) &&
    partyInfo &&
    CampaignUtils.isSharingStateInactive(
      CampaignUtils.getSharingState(partyInfo)
    )
  ) {
    showEquipmentShop = false;
  }

  let headerNode: React.ReactNode = (
    <CollapsibleHeaderContent
      heading={
        <CollapsibleHeading>{`Contents (${inventory.length})`}</CollapsibleHeading>
      }
      callout={
        <div className="ct-equipment-manage-pane__callout">
          <NumberDisplay
            type="weightInLb"
            number={ContainerUtils.getWeightInfo(currentContainer).total}
          />
        </div>
      }
    />
  );

  return (
    <div className="ct-container-manager">
      {showEquipmentShop && (
        <Collapsible
          header="Add Items"
          initiallyCollapsed={!shopOpenInitially}
          overrideCollapsed={!shopOpenInitially}
        >
          <EquipmentShop
            limitAddToCurrentContainer={currentContainer}
            partyInfo={partyInfo}
            containers={containers}
            theme={theme}
            ruleData={ruleData}
            proficiencyBonus={proficiencyBonus}
          />
          <CustomItemCreator containers={[currentContainer]} />
        </Collapsible>
      )}
      {coinManager.canUseCointainers() && (
        <CurrencyCollapsible
          heading={`${ContainerUtils.getName(currentContainer)} Coin`}
          initiallyCollapsed={true}
          isReadonly={isReadonly}
          container={currentContainer}
          handleCurrencyChangeError={handleCurrencyChangeError}
          handleCurrencyAdjust={handleCurrencyAdjust}
          handleAmountSet={handleAmountSet}
        />
      )}
      <Collapsible
        header={headerNode}
        initiallyCollapsed={shopOpenInitially}
        overrideCollapsed={shopOpenInitially}
      >
        <div className="ct-container-manager__inventory">
          {inventory.map((item, idx) => {
            const canEquip = inventoryManager.canEquipUnequipItem(item);
            const key = ItemUtils.getUniqueKey(item);

            return (
              <Collapsible
                key={`${key}-${idx}`}
                className="ct-container-manager__item"
                layoutType={"minimal"}
                header={
                  <CollapsibleHeaderContent
                    heading={
                      <div className="ct-container-manager__item-header">
                        <div className="ct-container-manager__item-header-action">
                          <ItemSlotManager
                            isUsed={!!ItemUtils.isEquipped(item)}
                            isReadonly={isReadonly}
                            canUse={canEquip}
                            onSet={(uses) => {
                              if (onItemEquip) {
                                onItemEquip(item, uses);
                              }
                            }}
                            theme={theme}
                            useTooltip={false}
                          />
                        </div>
                        <div className="ct-container-manager__item-header-name">
                          <ItemName item={item} showLegacy={true} />
                        </div>
                      </div>
                    }
                    callout={
                      !isReadonly &&
                      partyInfo &&
                      inventoryManager.canMoveItem(item) ? (
                        <ThemeButtonWithMenu
                          showSingleOption={true}
                          containerEl={
                            document.querySelector(
                              ".ct-sidebar__portal"
                            ) as HTMLElement
                          }
                          groupedOptions={ContainerUtils.getGroupedOptions(
                            ItemUtils.getContainerDefinitionKey(item),
                            containers,
                            "Move To:",
                            CampaignUtils.getSharingState(partyInfo)
                          )}
                          buttonStyle="outline"
                          onSelect={(definitionKey) => {
                            if (onItemMove) {
                              onItemMove(item, definitionKey);
                            }
                          }}
                        >
                          Move
                        </ThemeButtonWithMenu>
                      ) : null
                    }
                  />
                }
              >
                <ItemDetail
                  theme={theme}
                  item={item}
                  ruleData={ruleData}
                  showCustomize={false}
                  showImage={false}
                  proficiencyBonus={proficiencyBonus}
                />
              </Collapsible>
            );
          })}
          {ContainerUtils.getItemMappingIds(currentContainer).length === 0 && (
            <div className="ct-container-manager__empty">
              There are no items in your{" "}
              {ContainerUtils.getName(currentContainer)}
            </div>
          )}
        </div>
      </Collapsible>
    </div>
  );
};

export const ContainerActions = (props) => {
  const { inventoryManager } = useContext(InventoryManagerContext);
  const { coinManager } = useContext(CoinManagerContext);
  return (
    <ContainerActionsComponent
      inventoryManager={inventoryManager}
      coinManager={coinManager}
      {...props}
    />
  );
};

export default ContainerActions;
