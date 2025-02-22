import { FC, HTMLAttributes } from "react";

import { HtmlContent } from "~/components/HtmlContent";
import { RuleKeyEnum } from "~/constants";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { useRuleData } from "~/hooks/useRuleData";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const InspirationPane: FC<Props> = ({ ...props }) => {
  const { ruleData } = useCharacterEngine();
  const { ruleDataUtils } = useRuleData();

  let rule = ruleDataUtils.getRule(RuleKeyEnum.INSPIRATION, ruleData);
  let description: string = "";
  if (rule && rule.description) {
    description = rule.description;
  }

  return (
    <div {...props}>
      <Header>Heroic Inspiration</Header>
      <HtmlContent html={description} withoutTooltips />
    </div>
  );
};
