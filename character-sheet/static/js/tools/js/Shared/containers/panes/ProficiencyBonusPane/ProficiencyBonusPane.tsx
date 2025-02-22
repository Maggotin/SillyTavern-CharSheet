import React from "react";
import { connect } from "react-redux";

import {
  rulesEngineSelectors,
  Constants,
  RuleData,
  RuleDataUtils,
} from "@dndbeyond/character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";

import { SharedAppState } from "../../../stores/typings";

interface Props {
  ruleData: RuleData;
}
class ProficiencyBonusPane extends React.PureComponent<Props> {
  render() {
    const { ruleData } = this.props;

    let rule = RuleDataUtils.getRule(
      Constants.RuleKeyEnum.PROFICIENCY_BONUS,
      ruleData
    );
    let description: string = "";
    if (rule && rule.description) {
      description = rule.description;
    }

    return (
      <div className="ct-proficiency-bonus-pane">
        <Header>Proficiency Bonus</Header>
        <HtmlContent
          className="ct-proficiency-bonus-pane__description"
          html={description}
          withoutTooltips
        />
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    ruleData: rulesEngineSelectors.getRuleData(state),
  };
}

export default connect(mapStateToProps)(ProficiencyBonusPane);
