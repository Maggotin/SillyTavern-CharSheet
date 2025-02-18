import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import { useContext, ReactNode, MouseEvent, PureComponent } from "react";
import React from "react";
import { connect } from "react-redux";

import {
  DarkBuilderSvg,
  FeatureFlagContext,
} from "@dndbeyond/character-components/es";
import {
  CharacterCurrencyContract,
  CharacterNotes,
  CharacterTheme,
  Constants,
  ContainerManager,
  Creature,
  CreatureUtils,
  InfusionChoice,
  InfusionChoiceUtils,
  Item,
  ItemUtils,
  SnippetData,
  RuleData,
  rulesEngineSelectors,
  characterSelectors,
  BaseCharClass,
  ContainerUtils,
  InventoryManager,
  FormatUtils,
  CampaignUtils,
  serviceDataSelectors,
  PartyInfo,
  CoinManager,
} from "../../rules-engine/es";

import { ItemName } from "~/components/ItemName";
import { Link } from "~/components/Link";
import { NumberDisplay } from "~/components/NumberDisplay";
import { TabFilter } from "~/components/TabFilter";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import CurrencyButton from "../../../CharacterSheet/components/CurrencyButton";
import { ItemSlotManager } from "../../../Shared/components/ItemSlotManager";
import { ThemeButton } from "../../../Shared/components/common/Button";
import { CoinManagerContext } from "../../../Shared/managers/CoinManagerContext";
import { InventoryManagerContext } from "../../../Shared/managers/InventoryManagerContext";
import { appEnvSelectors } from "../../../Shared/selectors";
import { PaneIdentifierUtils } from "../../../Shared/utils";
import ContentGroup from "../../components/ContentGroup";
import EquipmentOverview from "../../components/EquipmentOverview";
import Infusions from "../../components/Infusions";
import InventoryFilter from "../../components/InventoryFilter";
import InventoryTableHeader from "../../components/InventoryTableHeader";
import OtherPossessions from "../../components/OtherPossessions";
import { sheetAppSelectors } from "../../selectors";
import { SheetAppState } from "../../typings";
import Attunement from "../Attunement";
import Inventory from "../Inventory";

interface Props {
  showNotes: boolean;

  builderUrl: string;
  inventory: Array<Item>;
  partyInventory: Array<Item>;
  creatures: Array<Creature>;
  currencies: CharacterCurrencyContract | null;
  notes: CharacterNotes;
  infusionChoices: Array<InfusionChoice>;
  weight: number;
  weightSpeedType: Constants.WeightSpeedTypeEnum;
  ruleData: RuleData;
  snippetData: SnippetData;
  isReadonly: boolean;
  isMobile: boolean;
  theme: CharacterTheme;
  proficiencyBonus: number;
  classes: Array<BaseCharClass>;
  inventoryManager: InventoryManager;
  campaignInfo: PartyInfo | null;
  coinManager: CoinManager;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
interface StateFilterData {
  filteredInventory: Array<Item>;
  filteredPartyInventory: Array<Item>;
  showAdvancedFilters: boolean;
  isFiltering: boolean;
}
interface State {
  infusableChoices: Array<InfusionChoice>;
  filterData: StateFilterData;
  filteredEquippedInventory: Array<Item>;
  shouldShowPartyInventory: number;
  shouldShowDeleteOnlyInfo: boolean;
}

class Equipment extends PureComponent<Props, State> {
  static defaultProps = {
    showNotes: true,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      infusableChoices: props.infusionChoices.filter((infusionChoice) =>
        InfusionChoiceUtils.canInfuse(infusionChoice)
      ),
      filterData: {
        filteredInventory: [],
        filteredPartyInventory: [],
        showAdvancedFilters: false,
        isFiltering: false,
      },
      filteredEquippedInventory: [],
      shouldShowPartyInventory: 0, // mui used 0,1,2 for tabs so 0 is off 1 is on...
      shouldShowDeleteOnlyInfo: false,
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.infusionChoices !== this.props.infusionChoices) {
      this.setState({
        infusableChoices: this.props.infusionChoices.filter((infusionChoice) =>
          InfusionChoiceUtils.canInfuse(infusionChoice)
        ),
      });
    }
  }

  handleCurrencyClick = (
    evt: React.MouseEvent | React.KeyboardEvent,
    containerDefinitionKey: string
  ): void => {
    const { paneHistoryStart } = this.props;

    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();

    paneHistoryStart(
      PaneComponentEnum.CURRENCY,
      PaneIdentifierUtils.generateCurrencyContext(containerDefinitionKey)
    );
  };

  handleWeightClick = (): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(PaneComponentEnum.ENCUMBRANCE);
  };

  handleCampaignClick = (): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(PaneComponentEnum.CAMPAIGN);
  };

  handlePossessionsManage = (): void => {
    const { paneHistoryStart, isReadonly } = this.props;

    if (!isReadonly) {
      paneHistoryStart(
        PaneComponentEnum.NOTE_MANAGE,
        PaneIdentifierUtils.generateNote(
          Constants.NoteKeyEnum.PERSONAL_POSSESSIONS
        )
      );
    }
  };

  handleManageClick = (): void => {
    const { paneHistoryStart } = this.props;

    paneHistoryStart(PaneComponentEnum.EQUIPMENT_MANAGE);
  };

  handleFilterUpdate = (filterData: StateFilterData): void => {
    this.setState({
      filterData,
      filteredEquippedInventory: [
        ...filterData.filteredInventory.filter(ItemUtils.isEquipped),
        ...filterData.filteredPartyInventory.filter(ItemUtils.isEquipped),
      ],
    });
  };

  handleInfusionChoiceShow = (infusionChoice: InfusionChoice): void => {
    const { paneHistoryStart } = this.props;

    const choiceKey = InfusionChoiceUtils.getKey(infusionChoice);
    if (choiceKey !== null) {
      paneHistoryStart(
        PaneComponentEnum.INFUSION_CHOICE,
        PaneIdentifierUtils.generateInfusionChoice(choiceKey)
      );
    }
  };

  handleItemShow = (item: Item): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(
      PaneComponentEnum.ITEM_DETAIL,
      PaneIdentifierUtils.generateItem(ItemUtils.getMappingId(item))
    );
  };

  handleContainerShow = (container: ContainerManager): void => {
    const { paneHistoryStart } = this.props;

    paneHistoryStart(
      PaneComponentEnum.CONTAINER,
      PaneIdentifierUtils.generateContainer(container.getDefinitionKey())
    );
  };

  handleCreatureShow = (creature: Creature): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(
      PaneComponentEnum.CREATURE,
      PaneIdentifierUtils.generateCreature(CreatureUtils.getMappingId(creature))
    );
  };

  shouldRenderInfusions = (): boolean => {
    const { infusionChoices } = this.props;

    return infusionChoices.length > 0;
  };

  renderContainer = (
    container: ContainerManager,
    inventory: Array<Item>
  ): ReactNode => {
    const { shouldShowPartyInventory } = this.state;
    const { isReadonly, showNotes, theme, coinManager } = this.props;
    const containerMappingId = container.getMappingId();

    const containerName = container.getName();
    const weightInfo = container.getWeightInfo();

    const containerInventory = container.getInventoryItems({
      filteredInventory: inventory,
    }).items;
    const containerItem = container.getContainerItem();

    const quantityNode = (
      <span className="ct-equipment__container-quantity">{`(${containerInventory.length})`}</span>
    );
    const nameNode: ReactNode = containerItem ? (
      <>
        <ItemName item={containerItem.item} /> {quantityNode}
      </>
    ) : (
      <>
        {containerName} {quantityNode}
      </>
    );

    const headerNode: ReactNode = (
      <div
        className="ct-equipment__container ct-inventory-item"
        onClick={(evt) => {
          evt.nativeEvent.stopImmediatePropagation();
          this.handleContainerShow(container);
        }}
        role="button"
        data-testid={`${containerItem?.getName() || containerName}-section`
          .toLowerCase()
          .replace(/\s/g, "-")}
      >
        <div className="ct-equipment__container-action ct-inventory-item__action">
          {containerItem && (
            <ItemSlotManager
              isUsed={!!containerItem.isEquipped()}
              isReadonly={isReadonly}
              canUse={
                !(
                  containerItem.isEquipped() &&
                  !containerItem.isEquippedToCurrentCharacter()
                )
              }
              onSet={(uses) => {
                if (uses === 0) {
                  containerItem.handleUnequip();
                }

                if (uses === 1) {
                  containerItem.handleEquip();
                }
              }}
              theme={theme}
              useTooltip={false}
            />
          )}
        </div>
        <div className="ct-equipment__container-name ct-inventory-item__name">
          {nameNode}
        </div>
        <div className="ct-equipment__container-weight ct-inventory-item__weight">
          <NumberDisplay type="weightInLb" number={weightInfo.applied} />
          {weightInfo.capacity > 0 && (
            <span className="ct-equipment__container-weight-capacity">
              ({Math.ceil(weightInfo.total)}/
              {FormatUtils.renderWeight(weightInfo.capacity)})
            </span>
          )}
        </div>
        {coinManager.canUseCointainers() ? (
          <div className="ct-equipment__container-coin">
            <CurrencyButton
              coin={ContainerUtils.getCoin(container.container)}
              isDarkMode={theme.isDarkMode}
              shouldShowPartyInventory={shouldShowPartyInventory === 1}
              handleCurrencyClick={(evt) =>
                this.handleCurrencyClick(
                  evt,
                  ContainerUtils.getDefinitionKey(container.container)
                )
              }
            />
          </div>
        ) : (
          containerItem &&
          container.isEquipped() &&
          !containerItem.isEquippedToCurrentCharacter() && (
            <div className="ct-equipment__container-equipped">
              Equipped by {containerItem.getEquippedCharacterName()}
            </div>
          )
        )}
      </div>
    );

    return (
      <ContentGroup key={containerMappingId} header={headerNode}>
        <Inventory
          container={container}
          inventory={containerInventory}
          showNotes={showNotes}
          showTableHeader={false}
          isReadonly={isReadonly}
          theme={theme}
        />
      </ContentGroup>
    );
  };

  renderCharacterContainers = (): ReactNode => {
    const { filterData } = this.state;
    const { inventoryManager } = this.props;

    return inventoryManager
      .getCharacterContainers()
      .map((container) =>
        this.renderContainer(container, filterData.filteredInventory)
      );
  };

  renderPartyContainers = (): ReactNode => {
    const { filterData } = this.state;
    const { inventoryManager } = this.props;

    return inventoryManager
      .getPartyContainers()
      .map((container) =>
        this.renderContainer(container, filterData.filteredPartyInventory)
      );
  };

  renderAttunement = (): ReactNode => {
    const { isMobile, theme } = this.props;

    return (
      <ContentGroup header="Attunement">
        <Attunement isMobile={isMobile} />
      </ContentGroup>
    );
  };

  renderInfusions = (): ReactNode => {
    const { infusableChoices } = this.state;
    const {
      builderUrl,
      infusionChoices,
      isReadonly,
      snippetData,
      inventory,
      partyInventory,
      creatures,
      ruleData,
      proficiencyBonus,
      theme,
    } = this.props;

    const headerNode: ReactNode = (
      <>
        Infusions{" "}
        {infusableChoices.length !== infusionChoices.length && (
          <>
            ({infusableChoices.length}/{infusionChoices.length} Known Infusions)
          </>
        )}
      </>
    );

    let extraNode: ReactNode = null;
    if (!isReadonly) {
      extraNode = (
        <Link
          href={builderUrl}
          className="ct-equipment__builder-link"
          useRouter
        >
          <DarkBuilderSvg />
          <span className="ct-equipment__builder-link-text">
            Manage Infusions
          </span>
        </Link>
      );
    }

    return (
      <ContentGroup header={headerNode} extra={extraNode}>
        <Infusions
          theme={theme}
          infusionChoices={infusableChoices}
          inventory={[...inventory, ...partyInventory]}
          creatures={creatures}
          snippetData={snippetData}
          onCreatureShow={this.handleCreatureShow}
          onItemShow={this.handleItemShow}
          onInfusionChoiceShow={this.handleInfusionChoiceShow}
          ruleData={ruleData}
          isReadonly={isReadonly}
          proficiencyBonus={proficiencyBonus}
        />
      </ContentGroup>
    );
  };

  renderOtherPossessions = (): ReactNode => {
    const { notes, isReadonly } = this.props;

    if (isReadonly) {
      return null;
    }

    return (
      <ContentGroup header="Other Possessions">
        <OtherPossessions
          notes={notes}
          onClick={this.handlePossessionsManage}
        />
      </ContentGroup>
    );
  };

  renderContent = (): ReactNode => {
    const {
      isReadonly,
      inventoryManager,
      inventory,
      partyInventory,
      showNotes,
    } = this.props;
    const { shouldShowPartyInventory } = this.state;

    const headerNode: ReactNode = (
      <div
        className="ct-equipment__container"
        onClick={(evt) => {
          evt.nativeEvent.stopImmediatePropagation();
          this.handleManageClick();
        }}
      >
        Party Inventory
      </div>
    );

    return (
      <div className="ct-equipment__content">
        <TabFilter
          sharedChildren={<InventoryTableHeader showNotes={showNotes} />}
          filters={[
            {
              label: "All",
              content: (
                <>
                  {shouldShowPartyInventory === 0 ? (
                    <>
                      {this.renderCharacterContainers()}
                      {this.renderAttunement()}
                      {this.shouldRenderInfusions() && this.renderInfusions()}
                      {this.renderOtherPossessions()}
                    </>
                  ) : null}
                  <FeatureFlagContext.Consumer>
                    {({ imsFlag }) => {
                      return imsFlag &&
                        shouldShowPartyInventory === 1 &&
                        inventoryManager.getPartyContainers().length > 0 ? (
                        <ContentGroup header={headerNode}>
                          {this.renderPartyContainers()}
                        </ContentGroup>
                      ) : null;
                    }}
                  </FeatureFlagContext.Consumer>
                </>
              ),
            },
            ...(shouldShowPartyInventory === 0
              ? inventoryManager
                  .getCharacterContainers()
                  .map((characterContainer) => ({
                    label: characterContainer.getName(),
                    content: this.renderContainer(
                      characterContainer,
                      inventory
                    ),
                  }))
              : []),
            ...(shouldShowPartyInventory === 1
              ? inventoryManager.getPartyContainers().map((partyContainer) => ({
                  label: partyContainer.getName(),
                  content: this.renderContainer(partyContainer, partyInventory),
                }))
              : []),
            ...(shouldShowPartyInventory === 0
              ? [
                  {
                    label: "Attunement",
                    content: this.renderAttunement(),
                  },
                  ...(this.shouldRenderInfusions()
                    ? [
                        {
                          label: "Infusions",
                          content: this.renderInfusions(),
                        },
                      ]
                    : []),
                  ...(!isReadonly
                    ? [
                        {
                          label: "Other Possessions",
                          content: this.renderOtherPossessions(),
                        },
                      ]
                    : []),
                ]
              : []),
          ]}
          showAllTab={false}
        />
      </div>
    );
  };

  renderManageButton = (): ReactNode => {
    const { isReadonly } = this.props;

    if (isReadonly) {
      return null;
    }

    return (
      <ThemeButton
        style="outline"
        size="medium"
        onClick={this.handleManageClick}
        data-testid="open-manage-equipment"
      >
        Manage Inventory
      </ThemeButton>
    );
  };

  toggleShouldShowPartyInventory = (event, newValue): void => {
    this.setState({
      shouldShowPartyInventory: newValue,
    });
  };
  handleCloseDeleteOnlyInfo = (event: MouseEvent): void => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.setState({
      shouldShowDeleteOnlyInfo: false,
    });
  };
  handleOpenDeleteOnlyInfo = (event: MouseEvent): void => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.setState({
      shouldShowDeleteOnlyInfo: true,
    });
  };

  renderDeleteOnlyAlertAction = (): ReactNode => {
    const { shouldShowDeleteOnlyInfo } = this.state;
    const { campaignInfo } = this.props;
    return (
      <div>
        <ThemeButton
          style="outline"
          size="medium"
          onClick={this.handleOpenDeleteOnlyInfo}
        >
          More Info
        </ThemeButton>
        <Dialog
          open={shouldShowDeleteOnlyInfo}
          onClose={this.handleCloseDeleteOnlyInfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Only</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Party Inventory sharing isn’t currently enabled for this campaign.
              Your old items are still here, but you won’t be able to add new
              items until it’s turned on again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {campaignInfo ? (
              <Button
                variant="outlined"
                color="primary"
                component="a"
                href={CampaignUtils.getLink(campaignInfo) || "/my-campaigns"}
                size="small"
              >
                go to campaign
              </Button>
            ) : null}
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleCloseDeleteOnlyInfo}
              autoFocus
              size="small"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  renderOverviewFiltersAndContent = (): ReactNode => {
    const { filterData, shouldShowPartyInventory } = this.state;
    const {
      currencies,
      weight,
      weightSpeedType,
      inventory,
      ruleData,
      theme,
      partyInventory,
      campaignInfo,
      inventoryManager,
      coinManager,
    } = this.props;

    const cointainerFlagEnabled: boolean = coinManager.canUseCointainers();
    let coin: CharacterCurrencyContract | null = currencies;
    if (shouldShowPartyInventory === 1 && campaignInfo) {
      // We need all the party coin if flag is on, or just Party Equipment coin if not
      if (cointainerFlagEnabled) {
        coin = coinManager.getAllPartyCoin();
      } else {
        coin = CampaignUtils.getCoin(campaignInfo);
      }
    } else if (cointainerFlagEnabled) {
      // We need to change it to all container currencies
      coin = coinManager.getAllCharacterCoin();
    }

    return (
      <>
        <div className="ct-equipment__overview">
          <EquipmentOverview
            shouldShowPartyInventory={shouldShowPartyInventory === 1}
            currencies={coin}
            weight={weight}
            weightSpeedType={weightSpeedType}
            onCurrencyClick={(evt) =>
              this.handleCurrencyClick(
                evt,
                shouldShowPartyInventory === 1
                  ? inventoryManager.getPartyEquipmentContainerDefinitionKey() ??
                      inventoryManager.getCharacterContainerDefinitionKey()
                  : inventoryManager.getCharacterContainerDefinitionKey()
              )
            }
            onWeightClick={this.handleWeightClick}
            onCampaignClick={this.handleCampaignClick}
            enableManage={false}
            isDarkMode={theme.isDarkMode}
            campaignName={
              campaignInfo !== null ? CampaignUtils.getName(campaignInfo) : null
            }
          />
        </div>
        <div className="ct-equipment__filter">
          <InventoryFilter
            partyInventory={partyInventory}
            inventory={inventory}
            ruleData={ruleData}
            onDataUpdate={this.handleFilterUpdate}
            callout={this.renderManageButton()}
            theme={theme}
          />
        </div>
        {!filterData.showAdvancedFilters && this.renderContent()}
      </>
    );
  };

  renderOptinToInventorySharing = (): ReactNode => {
    const { campaignInfo } = this.props;

    return (
      <>
        <Stack justifyContent="center">
          <Stack marginBottom="10px" marginTop="40px">
            <Typography color="primary" align="center" variant="body2">
              Want a hand with that loot?
            </Typography>
          </Stack>
          <Stack marginBottom="30px" alignItems={"center"}>
            <Typography
              align="center"
              variant="body1"
              sx={{ maxWidth: "320px" }}
            >
              Party Inventory makes it easy for your group to keep track of all
              their shared loot and coin. Add it to your campaign today with a
              subscription to D&D Beyond!
            </Typography>
          </Stack>
          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            justifyContent="center"
          >
            {campaignInfo ? (
              <Button
                variant="contained"
                color="primary"
                component="a"
                href={CampaignUtils.getLink(campaignInfo) || "/my-campaigns"}
                size="large"
                sx={{
                  marginLeft: { xs: 0 },
                  marginRight: { xs: 0 },
                }}
              >
                go to campaign
              </Button>
            ) : null}

            <Button variant="contained" color="primary" size="large">
              view subscription plans
            </Button>
          </Stack>
          <Stack
            style={{ display: "flex", justifyContent: "center", marginTop: 51 }}
          >
            <div className="ct-item-detail__full-image">
              <img
                className="ct-item-detail__full-image-img"
                src="https://www.dndbeyond.com/avatars/thumbnails/7/120/315/315/636284708068284913.jpeg"
                alt=""
              />
            </div>
          </Stack>
        </Stack>
      </>
    );
  };

  render() {
    const { shouldShowPartyInventory } = this.state;
    const { campaignInfo, inventoryManager } = this.props;

    return (
      <section className="ct-equipment">
        <h2 style={visuallyHidden}>Inventory</h2>
        <FeatureFlagContext.Consumer>
          {({ imsFlag }) => {
            return imsFlag && campaignInfo !== null ? (
              <>
                <Tabs
                  value={shouldShowPartyInventory}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={this.toggleShouldShowPartyInventory}
                  aria-label="disabled tabs example"
                  variant="fullWidth"
                >
                  <Tab label="My Inventory" data-testid="my-inventory" />
                  <Tab label="Party Inventory" data-testid="party-inventory" />
                </Tabs>
                {/* TODO: make this go away when last itme is removed... */}
                {shouldShowPartyInventory &&
                inventoryManager.isSharingTurnedDeleteOnly() ? (
                  <div role="button" onMouseUp={this.handleOpenDeleteOnlyInfo}>
                    <Alert
                      severity="info"
                      action={this.renderDeleteOnlyAlertAction()}
                    >
                      Party Inventory is currently turned off for this campaign.
                    </Alert>
                  </div>
                ) : null}
                {shouldShowPartyInventory &&
                inventoryManager.isSharingTurnedOff()
                  ? this.renderOptinToInventorySharing()
                  : this.renderOverviewFiltersAndContent()}
              </>
            ) : (
              this.renderOverviewFiltersAndContent()
            );
          }}
        </FeatureFlagContext.Consumer>
      </section>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    builderUrl: sheetAppSelectors.getBuilderUrl(state),
    inventory: rulesEngineSelectors.getInventory(state),
    partyInventory: rulesEngineSelectors.getPartyInventory(state),
    creatures: rulesEngineSelectors.getCreatures(state),
    weight: rulesEngineSelectors.getTotalCarriedWeight(state),
    weightSpeedType: rulesEngineSelectors.getCurrentCarriedWeightType(state),
    notes: rulesEngineSelectors.getCharacterNotes(state),
    infusionChoices: rulesEngineSelectors.getAvailableInfusionChoices(state),
    currencies: rulesEngineSelectors.getCurrencies(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    snippetData: rulesEngineSelectors.getSnippetData(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    isMobile: appEnvSelectors.getIsMobile(state),
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
    classes: characterSelectors.getClasses(state),
    campaignInfo: serviceDataSelectors.getPartyInfo(state),
  };
}

const EquipmentContainer = (props) => {
  const { inventoryManager } = useContext(InventoryManagerContext);
  const { coinManager } = useContext(CoinManagerContext);
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return (
    <Equipment
      inventoryManager={inventoryManager}
      coinManager={coinManager}
      paneHistoryStart={paneHistoryStart}
      {...props}
    />
  );
};

export default connect(mapStateToProps)(EquipmentContainer);
