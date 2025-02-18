import React from "react";

import {
  Collapsible,
  CollapsibleHeaderContent,
  ConditionIcon,
} from "../../character-components/es";
import {
  CharacterTheme,
  ConditionContract,
  ConditionLevelUtils,
  ConditionUtils,
} from "../../character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { ProgressBar } from "~/subApps/sheet/components/Sidebar/components/ProgressBar";

import ConditionLevelsTable from "../../../../components/ConditionLevelsTable";

interface Props {
  condition: ConditionContract;
  conditionLevel: number | null;
  isActive: boolean;
  onConditionLevelChange: (
    condition: ConditionContract,
    level: number | null
  ) => void;
  isReadonly: boolean;
  theme: CharacterTheme;
}
export default class ConditionManagePaneSpecialCondition extends React.PureComponent<Props> {
  handleLevelChange = (newLevel: number | null): void => {
    const { onConditionLevelChange, condition } = this.props;

    onConditionLevelChange(condition, newLevel);
  };

  render() {
    const { isActive, condition, conditionLevel, isReadonly, theme } =
      this.props;

    let classNames: Array<string> = ["ct-condition-manage-pane__condition"];
    if (isActive) {
      classNames.push("ct-condition-manage-pane__condition--active");
    }

    const level: React.ReactNode =
      conditionLevel !== null ? conditionLevel : "--";
    const name = ConditionUtils.getName(condition);

    const headingNode: React.ReactNode = (
      <div className="ct-condition-manage-pane__condition-heading">
        <div className={classNames.join(" ")}>
          <div className="ct-condition-manage-pane__condition-preview">
            <ConditionIcon
              conditionType={ConditionUtils.getId(condition)}
              isDarkMode={theme.isDarkMode}
            />
          </div>
          <div className="ct-condition-manage-pane__condition-name">{name}</div>
          <div className="ct-condition-manage-pane__condition-level">
            Level {level}
          </div>
        </div>
      </div>
    );
    //`

    const headerNode: React.ReactNode = (
      <CollapsibleHeaderContent heading={headingNode} />
    );

    const levels = ConditionUtils.getDefinitionLevels(condition);
    let levelNumbers = levels.map((level) =>
      ConditionLevelUtils.getLevel(level)
    );
    const levelEffectLookup = ConditionUtils.getLevelEffectLookup(condition);

    const headerFooterNode: React.ReactNode = (
      <ProgressBar
        options={levelNumbers}
        value={conditionLevel}
        onClick={this.handleLevelChange}
        isInteractive={!isReadonly}
      />
    );

    const description = ConditionUtils.getDescription(condition);

    return (
      <div key={ConditionUtils.getUniqueKey(condition)}>
        <Collapsible
          layoutType={"minimal"}
          header={headerNode}
          headerFooter={headerFooterNode}
        >
          <div className="ct-condition-manage-pane__condition-content">
            <HtmlContent
              className="ct-condition-manage-pane__condition-description"
              html={description ? description : ""}
              withoutTooltips
            />
            <ConditionLevelsTable
              conditionName={name}
              levels={levelNumbers}
              activeLevel={conditionLevel}
              isInteractive={!isReadonly}
              onLevelChange={this.handleLevelChange}
              levelEffectLookup={levelEffectLookup}
            />
          </div>
        </Collapsible>
      </div>
    );
  }
}
