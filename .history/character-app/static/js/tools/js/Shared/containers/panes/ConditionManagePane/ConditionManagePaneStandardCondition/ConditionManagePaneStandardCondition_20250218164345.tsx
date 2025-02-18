import React from "react";

import {
  Collapsible,
  CollapsibleHeaderContent,
} from "../../character-components/es";
import {
  CharacterTheme,
  ConditionContract,
  ConditionUtils,
  FormatUtils,
} from "../../character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { Toggle } from "~/components/Toggle";
import ConditionIcon from "~/tools/js/smartComponents/Icons/ConditionIcon";

interface Props {
  condition: ConditionContract;
  isActive: boolean;
  onConditionToggle: (condition: ConditionContract, isEnabled: boolean) => void;
  isReadonly: boolean;
  theme: CharacterTheme;
}
export default class ConditionManagePaneStandardCondition extends React.PureComponent<Props> {
  render() {
    const { isActive, condition, onConditionToggle, isReadonly, theme } =
      this.props;

    let classNames: Array<string> = ["ct-condition-manage-pane__condition"];
    if (isActive) {
      classNames.push("ct-condition-manage-pane__condition--active");
    }

    const name = ConditionUtils.getName(condition);
    const id = ConditionUtils.getId(condition);

    const headingNode: React.ReactNode = (
      <div className="ct-condition-manage-pane__condition-heading">
        <div className={classNames.join(" ")}>
          <div className="ct-condition-manage-pane__condition-preview">
            <ConditionIcon conditionType={id} isDarkMode={theme.isDarkMode} />
          </div>
          <div className="ct-condition-manage-pane__condition-name">{name}</div>
          <div className="ct-condition-manage-pane__condition-toggle">
            <Toggle
              checked={isActive}
              onClick={onConditionToggle.bind(this, condition)}
              color="themed"
              aria-label={`Enable ${name}`}
            />
          </div>
        </div>
      </div>
    );
    //`
    const headerNode: React.ReactNode = (
      <CollapsibleHeaderContent heading={headingNode} />
    );

    const description = ConditionUtils.getDescription(condition);

    return (
      <Collapsible
        layoutType={"minimal"}
        header={headerNode}
        key={ConditionUtils.getUniqueKey(condition)}
      >
        <div className="ct-condition-manage-pane__condition-content">
          <HtmlContent
            className="ct-condition-manage-pane__condition-description"
            html={description ? description : ""}
            withoutTooltips
          />
        </div>
      </Collapsible>
    );
  }
}
