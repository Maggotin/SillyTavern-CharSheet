import React from "react";
import { connect, DispatchProp } from "react-redux";

import { Select } from "@dndbeyond/character-components/es";
import {
  rulesEngineSelectors,
  Action,
  ActionUtils,
  characterActions,
  Constants,
  HtmlSelectOption,
  RuleData,
} from "../../rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { SharedAppState } from "../../../stores/typings";
import { PaneIdentifierUtils } from "../../../utils";
import CustomActionsPaneSummary from "./CustomActionsPaneSummary";

interface Props extends DispatchProp {
  actions: Array<Action>;
  ruleData: RuleData;
  paneContext: PaneInfo;
}
class CustomActionsPane extends React.PureComponent<Props> {
  handleCustomActionShow = (action: Action): void => {
    const {
      paneContext: { paneHistoryPush },
    } = this.props;

    const mappingId = ActionUtils.getMappingId(action);
    if (mappingId !== null) {
      paneHistoryPush(
        PaneComponentEnum.CUSTOM_ACTION,
        PaneIdentifierUtils.generateCustomAction(mappingId)
      );
    }
  };

  handleCustomAttackRemove = (action: Action): void => {
    const {
      dispatch,
      paneContext: { paneHistoryStart },
    } = this.props;

    const mappingId = ActionUtils.getMappingId(action);
    if (mappingId !== null) {
      paneHistoryStart(PaneComponentEnum.CUSTOM_ACTIONS);
      dispatch(characterActions.customActionRemove(mappingId));
    }
  };

  handleActionAdd = (actionType: string): void => {
    const { dispatch, actions } = this.props;

    dispatch(
      characterActions.customActionCreate(
        `Custom Action ${actions.length + 1}`,
        actionType as any
      )
    );
  };

  renderActions = (actions: Array<Action>): React.ReactNode => {
    const { ruleData } = this.props;

    if (!actions.length) {
      return null;
    }

    return (
      <div className="ct-custom-actions-pane__actions">
        {actions.map((action, idx) => (
          <CustomActionsPaneSummary
            key={`${action.id} + ${idx}`}
            action={action}
            ruleData={ruleData}
            onDetailShow={this.handleCustomActionShow}
            onRemove={this.handleCustomAttackRemove}
          />
        ))}
      </div>
    );
  };

  renderActionGroup = (
    heading: string,
    actionType: Constants.ActionTypeEnum
  ): React.ReactNode => {
    const { actions } = this.props;

    let filteredActions = actions.filter(
      (action) => ActionUtils.getActionTypeId(action) === actionType
    );
    if (!filteredActions.length) {
      return null;
    }

    return (
      <div className="ct-custom-actions-pane__group">
        <div className="ct-custom-actions-pane__group-heading">
          <Heading>{heading}</Heading>
        </div>
        <div className="ct-custom-actions-pane__group-actions">
          {this.renderActions(filteredActions)}
        </div>
      </div>
    );
  };

  renderAdd = (): React.ReactNode => {
    let customActionOptions: Array<HtmlSelectOption> = [
      { label: "General", value: Constants.ActionTypeEnum.GENERAL },
      { label: "Spell", value: Constants.ActionTypeEnum.SPELL },
      { label: "Weapon", value: Constants.ActionTypeEnum.WEAPON },
    ];
    return (
      <div className="ct-custom-actions-pane__add">
        <Heading>Add new Actions</Heading>
        <Select
          options={customActionOptions}
          resetAfterChoice={true}
          onChange={this.handleActionAdd}
          value={null}
        />
      </div>
    );
  };

  render() {
    const {} = this.props;

    return (
      <div className="ct-custom-actions-pane">
        <Header>Manage Custom Actions</Header>
        {this.renderActionGroup("General", Constants.ActionTypeEnum.GENERAL)}
        {this.renderActionGroup("Spells", Constants.ActionTypeEnum.SPELL)}
        {this.renderActionGroup("Weapons", Constants.ActionTypeEnum.WEAPON)}
        {this.renderAdd()}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    actions: rulesEngineSelectors.getCustomActions(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
  };
}

const CustomActionsPaneContainer = (props) => {
  const { pane } = useSidebar();
  return <CustomActionsPane paneContext={pane} {...props} />;
};

export default connect(mapStateToProps)(CustomActionsPaneContainer);
