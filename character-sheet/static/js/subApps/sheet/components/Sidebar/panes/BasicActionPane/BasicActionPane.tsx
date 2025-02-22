import { FC, HTMLAttributes } from "react";

import { HtmlContent } from "~/components/HtmlContent";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { useRuleData } from "~/hooks/useRuleData";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";

import { PaneInitFailureContent } from "../../components/PaneInitFailureContent";
import { PaneIdentifiersBasicAction } from "../../types";

/*
This is the Sidebar display for Basic Actions. You can see this Pane by clicking on the Basic Actions (actions, bonus actions, reactions, etc.) displayed in the Actions section of the Character Sheet. Examples of Basic Actions include Attack, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Use an Object, etc.
*/

interface BasicActionPaneProps extends HTMLAttributes<HTMLDivElement> {
  identifiers: PaneIdentifiersBasicAction | null;
}

export const BasicActionPane: FC<BasicActionPaneProps> = ({
  identifiers,
  ...props
}) => {
  const { ruleData } = useCharacterEngine();
  const { ruleDataUtils } = useRuleData();

  const action =
    identifiers && ruleDataUtils.getBasicAction(identifiers.id, ruleData);

  if (action === null) {
    return <PaneInitFailureContent />;
  }

  return (
    <div {...props}>
      <Header>{action.name}</Header>
      {action.description !== null && (
        <HtmlContent html={action.description} withoutTooltips />
      )}
    </div>
  );
};
