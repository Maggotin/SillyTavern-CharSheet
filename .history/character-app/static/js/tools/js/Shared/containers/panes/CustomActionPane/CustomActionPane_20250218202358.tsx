import React from "react";
import { connect, DispatchProp } from "react-redux";

import { Collapsible } from "@dndbeyond/character-components/es";
import {
  AbilityLookup,
  Action,
  ActionUtils,
  ActivationUtils,
  characterActions,
  CharacterTheme,
  Constants,
  CustomActionContract,
  DiceUtils,
  EntityValueLookup,
  InventoryLookup,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
} from "@dndbeyond/character-rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import {
  PaneComponentEnum,
  PaneIdentifiersCustomAction,
} from "~/subApps/sheet/components/Sidebar/types";

import { PaneInitFailureContent } from "../../../../../../subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import { ActionDetail } from "../../../components/ActionDetail";
import CustomizeDataEditor from "../../../components/CustomizeDataEditor";
import EditorBox from "../../../components/EditorBox";
import { RemoveButton } from "../../../components/common/Button";
import { appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";

type EditCustomContractProperties = Omit<
  CustomActionContract,
  "id" | "entityTypeId"
>;

interface Props extends DispatchProp {
  actions: Array<Action>;
  entityValueLookup: EntityValueLookup;
  abilityLookup: AbilityLookup;
  inventoryLookup: InventoryLookup;
  ruleData: RuleData;
  identifiers: PaneIdentifiersCustomAction | null;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
  paneContext: PaneInfo;
}
interface State {
  action: Action | null;
}
class CustomActionPane extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = this.generateStateData(props);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { actions, identifiers } = this.props;

    if (
      actions !== prevProps.actions ||
      identifiers !== prevProps.identifiers
    ) {
      this.setState(this.generateStateData(this.props));
    }
  }

  generateStateData = (props: Props): State => {
    const { actions, identifiers } = props;

    let foundAction: Action | null | undefined = null;
    if (identifiers !== null) {
      foundAction = actions.find((action) => identifiers.id === action.id);
    }

    return {
      action: foundAction ? foundAction : null,
    };
  };

  handleCustomDataUpdate = (data: EditCustomContractProperties): void => {
    const { action } = this.state;
    const { dispatch } = this.props;

    if (action === null) {
      return;
    }

    const mappingId = ActionUtils.getMappingId(action);
    if (mappingId !== null) {
      dispatch(characterActions.customActionSet(mappingId, data));
    }
  };

  handleCustomActionsShow = (): void => {
    const {
      paneContext: { paneHistoryPush },
    } = this.props;

    paneHistoryPush(PaneComponentEnum.CUSTOM_ACTIONS);
  };

  handleRemove = (): void => {
    const { action } = this.state;
    const {
      dispatch,
      paneContext: { paneHistoryStart },
    } = this.props;

    paneHistoryStart(PaneComponentEnum.CUSTOM_ACTIONS);
    if (action) {
      const mappingId = ActionUtils.getMappingId(action);

      if (mappingId !== null) {
        dispatch(characterActions.customActionRemove(mappingId));
      }
    }
  };

  getData = (): Record<string, any> => {
    const { action } = this.state;

    if (action === null) {
      return {};
    }

    let activation = ActionUtils.getDefinitionActivation(action);
    let range = ActionUtils.getDefinitionRange(action);
    let dice = ActionUtils.getDefinitionDice(action);
    let value = ActionUtils.getDefinitionFixedValue(action);

    let diceCount: number | null = null;
    let diceType: number | null = null;
    let fixedValue: number | null = null;
    if (dice !== null) {
      diceCount = DiceUtils.getCount(dice);
      diceType = DiceUtils.getValue(dice);
      fixedValue = DiceUtils.getFixedValue(dice);
    } else if (value !== null) {
      fixedValue = value;
    }

    let data: EditCustomContractProperties = {
      actionType: ActionUtils.getDefinitionActionTypeId(action),
      activationTime: ActivationUtils.getTime(activation),
      activationType: ActivationUtils.getType(activation),
      aoeSize: range?.aoeSize ?? null,
      aoeType: range?.aoeType ?? null,
      attackSubtype: ActionUtils.getDefinitionAttackSubtypeId(action),
      damageBonus: null, // not used
      damageTypeId: ActionUtils.getDefinitionDamageTypeId(action),
      description: ActionUtils.getDefinitionDescription(action),
      diceCount,
      diceType,
      fixedValue,
      displayAsAttack: ActionUtils.displayAsAttack(action),
      fixedSaveDc: ActionUtils.getDefinitionFixedSaveDc(action),
      isMartialArts: ActionUtils.getDefinitionIsMartialArts(action),
      isOffhand: ActionUtils.isOffhand(action),
      isProficient: ActionUtils.isProficient(action),
      isSilvered: ActionUtils.isSilvered(action),
      longRange: range?.longRange ?? null,
      name: ActionUtils.getDefinitionName(action),
      onMissDescription: ActionUtils.getDefinitionOnMissDescription(action),
      range: range?.range ?? null,
      rangeId: ActionUtils.getDefinitionAttackRangeId(action),
      saveFailDescription: ActionUtils.getDefinitionSaveFailDescription(action),
      saveStatId: ActionUtils.getDefinitionSaveStatId(action),
      saveSuccessDescription:
        ActionUtils.getDefinitionSaveSuccessDescription(action),
      snippet: ActionUtils.getDefinitionSnippet(action),
      spellRangeType: ActionUtils.getDefinitionSpellRangeType(action),
      statId: ActionUtils.getDefinitionAbilityModifierStatId(action),
      toHitBonus: null, // not used
    };

    return data;
  };

  renderCustomize = (): React.ReactNode => {
    const { isReadonly, ruleData } = this.props;
    const { action } = this.state;

    if (isReadonly) {
      return null;
    }

    if (action === null) {
      return null;
    }

    const damageTypeOptions = RuleDataUtils.getDamageTypeOptions(ruleData);
    const rangeTypeOptions = RuleDataUtils.getAttackRangeTypeOptions(ruleData);
    const statOptions = RuleDataUtils.getStatOptions(ruleData);
    const dieTypeOptions = RuleDataUtils.getDieTypeOptions(ruleData);
    const attackSubtypeOptions =
      RuleDataUtils.getAttackSubtypeOptions(ruleData);
    const activationTypeOptions =
      RuleDataUtils.getActivationTypeOptions(ruleData);
    const aoeTypeOptions = RuleDataUtils.getAoeTypeOptions(ruleData);
    const spellRangeTypeOptions =
      RuleDataUtils.getSpellRangeTypeOptions(ruleData);

    const actionType = ActionUtils.getActionTypeId(action);

    return (
      <Collapsible
        layoutType={"minimal"}
        header="Edit"
        className="ct-custom-action-pane__customize"
      >
        <EditorBox>
          <CustomizeDataEditor
            data={this.getData()}
            fallbackValues={{
              displayAsAttack: ActionUtils.isDefaultDisplayAsAttack(action),
            }}
            labelOverrides={{
              fixedValue: "Fixed Value",
            }}
            enableName={true}
            enableIsProficient={true}
            enableRangeType={true}
            enableDiceCount={true}
            enableDiceType={true}
            enableFixedValue={true}
            enableDamageType={true}
            enableIsOffhand={actionType === Constants.ActionTypeEnum.WEAPON}
            enableAttackSubtype={actionType === Constants.ActionTypeEnum.WEAPON}
            enableIsSilver={actionType === Constants.ActionTypeEnum.WEAPON}
            enableIsMartialArts={true}
            enableDescription={true}
            enableStat={true}
            enableSaveDc={true}
            enableActivationTime={true}
            enableActivationType={true}
            enableSaveType={true}
            enableDisplayAsAttack={true}
            enableAoeType={true}
            enableAoeSize={true}
            enableSpellRangeType={actionType === Constants.ActionTypeEnum.SPELL}
            enableRange={true}
            enableLongRange={actionType === Constants.ActionTypeEnum.WEAPON}
            enableSnippet={true}
            maxNameLength={1024}
            rangeOptions={rangeTypeOptions}
            damageTypeOptions={damageTypeOptions}
            diceTypeOptions={dieTypeOptions}
            statOptions={statOptions}
            attackSubtypeOptions={attackSubtypeOptions}
            activationTypeOptions={activationTypeOptions}
            aoeTypeOptions={aoeTypeOptions}
            spellRangeTypeOptions={spellRangeTypeOptions}
            onDataUpdate={this.handleCustomDataUpdate}
          />
        </EditorBox>
      </Collapsible>
    );
  };

  render() {
    const { action } = this.state;
    const {
      ruleData,
      entityValueLookup,
      abilityLookup,
      inventoryLookup,
      isReadonly,
      theme,
      proficiencyBonus,
    } = this.props;

    if (action === null) {
      return <PaneInitFailureContent />;
    }

    return (
      <div
        className="ct-custom-action-pane"
        key={ActionUtils.getUniqueKey(action)}
      >
        <Header parent="Custom Actions" onClick={this.handleCustomActionsShow}>
          {ActionUtils.getName(action)}
        </Header>
        {this.renderCustomize()}
        <ActionDetail
          theme={theme}
          action={action}
          ruleData={ruleData}
          entityValueLookup={entityValueLookup}
          inventoryLookup={inventoryLookup}
          showCustomize={false}
          abilityLookup={abilityLookup}
          isReadonly={isReadonly}
          proficiencyBonus={proficiencyBonus}
        />
        {!isReadonly && (
          <div className="ct-custom-action-pane__actions">
            <div
              className="ct-custom-action-pane__actionstcs-custom-action-pane__action--remove"
              onClick={this.handleRemove}
            >
              <RemoveButton onClick={this.handleRemove}>
                Remove Action
              </RemoveButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    actions: rulesEngineSelectors.getCustomActions(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    entityValueLookup:
      rulesEngineSelectors.getCharacterValueLookupByEntity(state),
    inventoryLookup: rulesEngineSelectors.getInventoryLookup(state),
    abilityLookup: rulesEngineSelectors.getAbilityLookup(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

const CustomActionPaneContainer = (props) => {
  const { pane } = useSidebar();
  return <CustomActionPane paneContext={pane} {...props} />;
};

export default connect(mapStateToProps)(CustomActionPaneContainer);
