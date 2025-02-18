import React, { useContext } from "react";
import { connect } from "react-redux";

import {
  Action,
  ActionUtils,
  CharacterTheme,
  Constants,
  ContainerLookup,
  DataOrigin,
  EntityValueLookup,
  HelperUtils,
  Infusion,
  InfusionChoiceLookup,
  InfusionUtils,
  InventoryManager,
  Item,
  ItemUtils,
  PartyInfo,
  RuleData,
  rulesEngineSelectors,
  serviceDataSelectors,
  SnippetData,
  Spell,
  WeaponSpellDamageGroup,
} from "../../rules-engine/es";

import { EditableName } from "~/components/EditableName";
import { ItemName } from "~/components/ItemName";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Preview } from "~/subApps/sheet/components/Sidebar/components/Preview";
import {
  getDataOriginComponentInfo,
  getSpellComponentInfo,
} from "~/subApps/sheet/components/Sidebar/helpers/paneUtils";
import {
  PaneComponentEnum,
  PaneIdentifiersItem,
} from "~/subApps/sheet/components/Sidebar/types";

import { PaneInitFailureContent } from "../../../../../../subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import ItemDetail from "../../../components/ItemDetail";
import ItemListInformationCollapsible from "../../../components/ItemListInformationCollapsible";
import { InventoryManagerContext } from "../../../managers/InventoryManagerContext";
import { appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";
import { PaneIdentifierUtils } from "../../../utils";

interface Props {
  items: Array<Item>;
  weaponSpellDamageGroups: Array<WeaponSpellDamageGroup>;
  ruleData: RuleData;
  snippetData: SnippetData;
  entityValueLookup: EntityValueLookup;
  infusionChoiceLookup: InfusionChoiceLookup;
  identifiers: PaneIdentifiersItem | null;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
  containerLookup: ContainerLookup;
  inventoryManager: InventoryManager;
  partyInfo: PartyInfo;
  paneHistoryPush: PaneInfo["paneHistoryPush"];
}
interface State {
  item: Item | null;
  isCustomizeClosed: boolean;
}
class ItemPane extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = this.generateStateData(props, true);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { items, identifiers } = this.props;

    if (items !== prevProps.items || identifiers !== prevProps.identifiers) {
      this.setState(
        this.generateStateData(this.props, prevState.isCustomizeClosed)
      );
    }
  }

  generateStateData = (props: Props, isCustomizeClosed: boolean): State => {
    const { items, identifiers } = props;

    let foundItem: Item | null | undefined = null;
    if (identifiers !== null) {
      foundItem = items.find(
        (item) => identifiers.id === ItemUtils.getMappingId(item)
      );
    }

    return {
      item: foundItem ? foundItem : null,
      isCustomizeClosed,
    };
  };

  handleCustomItemEdit = (adjustments: Record<string, any>): void => {
    const { item } = this.state;
    const { inventoryManager } = this.props;

    if (item === null) {
      return;
    }

    if (adjustments.notes === "") {
      adjustments.notes = null;
    }

    inventoryManager.handleCustomEdit({
      item,
      adjustments,
    });
  };

  handleCustomDataUpdate = (
    adjustmentType: Constants.AdjustmentTypeEnum,
    value: any
  ): void => {
    const { item } = this.state;
    const { inventoryManager } = this.props;

    if (item) {
      inventoryManager.handleCustomizationSet({
        item,
        adjustmentType,
        value,
      });
    }
  };

  handleRemoveCustomizations = (): void => {
    const { item } = this.state;
    const { inventoryManager } = this.props;

    if (item) {
      inventoryManager.handleCustomizationsRemove({ item });
    }
  };

  handleDataOriginClick = (dataOrigin: DataOrigin) => {
    const { paneHistoryPush } = this.props;

    let component = getDataOriginComponentInfo(dataOrigin);
    if (component.type !== PaneComponentEnum.ERROR_404) {
      paneHistoryPush(component.type, component.identifiers);
    }
  };

  handleSpellClick = (spell: Spell): void => {
    const { paneHistoryPush } = this.props;

    let component = getSpellComponentInfo(spell);
    if (component.type) {
      paneHistoryPush(component.type, component.identifiers);
    }
  };

  handleInfusionClick = (infusion: Infusion): void => {
    const { paneHistoryPush } = this.props;

    const choiceKey = InfusionUtils.getChoiceKey(infusion);
    if (choiceKey !== null) {
      paneHistoryPush(
        PaneComponentEnum.INFUSION_CHOICE,
        PaneIdentifierUtils.generateInfusionChoice(choiceKey)
      );
    }
  };

  handleActionClick = (action: Action): void => {
    const { paneHistoryPush } = this.props;

    const dataOrigin = ActionUtils.getDataOrigin(action);
    let component = getDataOriginComponentInfo(dataOrigin);
    if (component.type !== PaneComponentEnum.ERROR_404) {
      paneHistoryPush(component.type, component.identifiers);
    }
  };

  handleOpenCustomize = () => {
    this.setState({ isCustomizeClosed: !this.state.isCustomizeClosed });
  };

  render() {
    const { item, isCustomizeClosed } = this.state;
    const {
      weaponSpellDamageGroups,
      ruleData,
      snippetData,
      entityValueLookup,
      infusionChoiceLookup,
      isReadonly,
      proficiencyBonus,
      theme,
      containerLookup,
      inventoryManager,
      partyInfo,
    } = this.props;

    if (item === null) {
      return (
        <PaneInitFailureContent errorMessage="That item is no longer in your inventory! Please try again." />
      );
    }

    const canCustomize = inventoryManager.canCustomizeItem(item) && !isReadonly;

    return (
      <div className="ct-item-pane">
        <Header preview={<Preview imageUrl={ItemUtils.getAvatarUrl(item)} />}>
          <EditableName onClick={this.handleOpenCustomize}>
            <ItemName item={item} />
          </EditableName>
        </Header>
        <ItemListInformationCollapsible item={item} ruleData={ruleData} />
        <ItemDetail
          theme={theme}
          key={ItemUtils.getUniqueKey(item)}
          item={item}
          weaponSpellDamageGroups={weaponSpellDamageGroups}
          ruleData={ruleData}
          snippetData={snippetData}
          onCustomDataUpdate={this.handleCustomDataUpdate}
          onCustomizationsRemove={this.handleRemoveCustomizations}
          onDataOriginClick={this.handleDataOriginClick}
          onSpellClick={this.handleSpellClick}
          onInfusionClick={this.handleInfusionClick}
          onMasteryActionClick={this.handleActionClick}
          entityValueLookup={entityValueLookup}
          infusionChoiceLookup={infusionChoiceLookup}
          isReadonly={isReadonly}
          proficiencyBonus={proficiencyBonus}
          container={HelperUtils.lookupDataOrFallback(
            containerLookup,
            ItemUtils.getContainerDefinitionKey(item)
          )}
          showCustomize={canCustomize}
          onPostRemoveNavigation={PaneComponentEnum.EQUIPMENT_MANAGE}
          partyInfo={partyInfo}
          onCustomItemEdit={this.handleCustomItemEdit}
          isCustomizeClosed={isCustomizeClosed}
          onCustomizeClick={this.handleOpenCustomize}
        />
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    ruleData: rulesEngineSelectors.getRuleData(state),
    items: rulesEngineSelectors.getAllInventoryItems(state),
    weaponSpellDamageGroups:
      rulesEngineSelectors.getWeaponSpellDamageGroups(state),
    entityValueLookup:
      rulesEngineSelectors.getCharacterValueLookupByEntity(state),
    snippetData: rulesEngineSelectors.getSnippetData(state),
    infusionChoiceLookup: rulesEngineSelectors.getInfusionChoiceLookup(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    containerLookup: rulesEngineSelectors.getContainerLookup(state),
    partyInfo: serviceDataSelectors.getPartyInfo(state),
  };
}

const ItemPaneContainer = (props) => {
  const { inventoryManager } = useContext(InventoryManagerContext);
  const {
    pane: { paneHistoryPush },
  } = useSidebar();
  return (
    <ItemPane
      paneHistoryPush={paneHistoryPush}
      inventoryManager={inventoryManager}
      {...props}
    />
  );
};

export default connect(mapStateToProps)(ItemPaneContainer);
