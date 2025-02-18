import { FC, HTMLAttributes, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ActionName } from "../../character-components/es";
import {
  ActionUtils,
  characterActions,
  InfusionUtils,
  HelperUtils,
  ItemUtils,
  EntityUtils,
  ItemManager,
} from "../../character-rules-engine/es";

import { ItemName } from "~/components/ItemName";
import { DataOriginTypeEnum } from "~/constants";
import { useSidebar } from "~/contexts/Sidebar";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { BaseInventoryContract } from "~/types";

import { ActionDetail } from "../../../../../../tools/js/Shared/components/ActionDetail";
import { appEnvSelectors } from "../../../../../../tools/js/Shared/selectors";
import { PaneInitFailureContent } from "../../components/PaneInitFailureContent";
import { getDataOriginComponentInfo } from "../../helpers/paneUtils";
import { PaneComponentEnum, PaneIdentifiersAction } from "../../types";

/*
ActionPane is the Sidebar content that displays the details and usages of actions. If the Action is directly represented as an Item in the Actions section - it will display the ItemPane in the Sidebar. Some Items contain actions (reactions or bonus actions) when attuned - These will display seperately from the Item and when clicked they use the ActionPane with special data depending on the DataOrigin.
*/

interface ActionPaneProps extends HTMLAttributes<HTMLDivElement> {
  identifiers: PaneIdentifiersAction | null;
}
export const ActionPane: FC<ActionPaneProps> = ({ identifiers, ...props }) => {
  const {
    actions,
    abilityLookup,
    ruleData,
    entityValueLookup,
    proficiencyBonus,
    inventoryLookup,
    characterTheme,
  } = useCharacterEngine();
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const dispatch = useDispatch();
  const {
    pane: { paneHistoryPush },
  } = useSidebar();

  const action = actions.find(
    (action) =>
      identifiers?.id === ActionUtils.getMappingId(action) &&
      identifiers?.entityTypeId === ActionUtils.getMappingEntityTypeId(action)
  );

  const handleCustomDataUpdate = (
    key: number,
    value: string,
    source: string
  ): void => {
    if (action) {
      dispatch(
        characterActions.valueSet(
          key,
          value,
          source,
          ActionUtils.getMappingId(action),
          ActionUtils.getMappingEntityTypeId(action)
        )
      );
    }
  };

  const handleRemoveCustomizations = (): void => {
    if (action) {
      const mappingId = ActionUtils.getMappingId(action);
      const mappingEntityTypeId = ActionUtils.getMappingEntityTypeId(action);

      if (mappingId !== null && mappingEntityTypeId !== null) {
        dispatch(
          characterActions.actionCustomizationsDelete(
            mappingId,
            mappingEntityTypeId
          )
        );
      }
    }
  };

  const handleLimitedUseSet = (uses: number): void => {
    if (action) {
      const mappingId = ActionUtils.getMappingId(action);
      const mappingEntityTypeId = ActionUtils.getMappingEntityTypeId(action);

      if (mappingId === null || mappingEntityTypeId === null) {
        return;
      }

      let dataOriginType = ActionUtils.getDataOriginType(action);

      if (dataOriginType === DataOriginTypeEnum.ITEM) {
        const dataOrigin = ActionUtils.getDataOrigin(action);
        const itemData = dataOrigin.primary as BaseInventoryContract;

        const item = ItemManager.getItem(ItemUtils.getMappingId(itemData));
        item.handleItemLimitedUseSet(uses);
      } else {
        dispatch(
          characterActions.actionUseSet(
            mappingId,
            mappingEntityTypeId,
            uses,
            dataOriginType
          )
        );
      }
    }
  };

  const handleParentClick = (): void => {
    if (action) {
      let dataOrigin = ActionUtils.getDataOrigin(action);
      let component = getDataOriginComponentInfo(dataOrigin);
      if (component.type !== PaneComponentEnum.ERROR_404) {
        paneHistoryPush(component.type, component.identifiers);
      }
    }
  };

  if (!action) {
    return <PaneInitFailureContent />;
  }

  //We could do the dataOrigin stuff better, this could be refactored
  //Check ItemPane and InfusionPanes for similar usages of DataOrigin
  const dataOrigin = ActionUtils.getDataOrigin(action);
  const dataOriginType = ActionUtils.getDataOriginType(action);

  let name: ReactNode = null;
  if (ActionUtils.getName(action) !== "") {
    name = <ActionName theme={characterTheme} action={action} />;
  }

  let parentName: string | null = null;
  let parentClick: (() => void) | undefined = undefined;

  if (dataOriginType === DataOriginTypeEnum.ITEM) {
    const itemContract = dataOrigin.primary as BaseInventoryContract;
    const itemMappingId = ItemUtils.getMappingId(itemContract);
    const item = HelperUtils.lookupDataOrFallback(
      inventoryLookup,
      itemMappingId
    );

    if (item !== null) {
      let infusion = ItemUtils.getInfusion(item);
      if (infusion) {
        parentName = `Infusion: ${InfusionUtils.getName(infusion)}`;
        parentClick = handleParentClick;
      }

      if (name === null) {
        name = <ItemName item={item} onClick={handleParentClick} />;
      }
    }
  } else {
    if (dataOrigin.primary) {
      parentName = EntityUtils.getDataOriginName(dataOrigin);
      parentClick = handleParentClick;
    }
  }

  return (
    <div key={ActionUtils.getUniqueKey(action)} {...props}>
      <Header parent={parentName} onClick={parentClick}>
        {name}
      </Header>
      <ActionDetail
        theme={characterTheme}
        action={action}
        abilityLookup={abilityLookup}
        showCustomize={dataOriginType !== DataOriginTypeEnum.ITEM}
        onCustomDataUpdate={handleCustomDataUpdate}
        onCustomizationsRemove={handleRemoveCustomizations}
        ruleData={ruleData}
        entityValueLookup={entityValueLookup}
        inventoryLookup={inventoryLookup}
        isReadonly={isReadonly}
        onLimitedUseSet={handleLimitedUseSet}
        proficiencyBonus={proficiencyBonus}
      />
    </div>
  );
};
