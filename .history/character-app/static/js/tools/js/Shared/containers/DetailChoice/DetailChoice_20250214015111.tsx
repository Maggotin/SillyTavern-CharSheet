import { FC, ReactNode } from "react";

import {
  BuilderChoiceContract,
  Choice,
  ChoiceData,
  ChoiceUtils,
  Constants,
  FeatureChoiceOption,
  HtmlSelectOptionGroup,
} from "@dndbeyond/character-rules-engine/es";

import { CollapsibleContent } from "~/components/CollapsibleContent";
import { HtmlContent } from "~/components/HtmlContent";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { useRuleData } from "~/hooks/useRuleData";
import Collapsible from "~/tools/js/smartComponents/Collapsible";
import { Select } from "~/tools/js/smartComponents/legacy";

// TODO this needs to not extend builder contract and options typing needs to be fixed
interface Props extends Omit<BuilderChoiceContract, "options"> {
  choice: Choice;
  description?: string;
  choiceInfo: ChoiceData;
  classId?: number | null;
  maxDescriptionLength?: number;
  showBackgroundProficiencyOptions?: boolean;
  hideWhenOnlyDefaultSelected?: boolean;
  className?: string;
  options: Array<FeatureChoiceOption | HtmlSelectOptionGroup>;
  onChange?: (
    id: string,
    type: number,
    subType: number | null,
    value: any,
    parentChoiceId: string | null
  ) => void;
  collapseDescription?: boolean;
}

export const DetailChoice: FC<Props> = ({
  choice,
  description,
  optionValue,
  parentChoiceId,
  maxDescriptionLength = 750,
  hideWhenOnlyDefaultSelected = true,
  type,
  className = "",
  options,
  collapseDescription,
  classId = null,
  label,
  subType,
  choiceInfo,
  defaultSubtypes = [],
  showBackgroundProficiencyOptions = false,
  onChange,
  id,
}) => {
  const { entityRestrictionData, ruleData } = useCharacterEngine();
  const { languages } = useRuleData();

  const handleChoiceChange = (value: string): void => {
    if (onChange && id !== null) {
      onChange(id, type, subType, value, parentChoiceId);
    }
  };

  if (
    hideWhenOnlyDefaultSelected &&
    ChoiceUtils.isOnlyDefaultSelected(choice)
  ) {
    return null;
  }

  let classNames: Array<string> = ["detail-choice", className];
  if (
    (ChoiceUtils.isInfinite(choice) && !ChoiceUtils.isOptionSelected(choice)) ||
    ChoiceUtils.isTodo(choice)
  ) {
    classNames.push("detail-choice--todo");
  }

  // Use the description prop or, if a chosenOption is found and a description wasn't passed in, use the chosenOption description instead.
  let choiceDescription = description;

  //Look for a chosenOption from options that are not already grouped
  const chosenOption = options.find(
    (option) => option["value"] === optionValue
  );

  if (chosenOption) {
    choiceDescription = description || chosenOption["description"];
  }

  if (parentChoiceId !== null) {
    classNames.push("detail-choice--child");
  }

  let choiceNode: ReactNode;
  if (choiceDescription) {
    switch (type) {
      case Constants.BuilderChoiceTypeEnum.ENTITY_SPELL_OPTION:
        choiceNode = (
          <Collapsible layoutType={"minimal"} header="Spell Details">
            <HtmlContent
              className="detail-choice-description"
              html={choiceDescription}
              withoutTooltips
            />
          </Collapsible>
        );
        break;
      default:
        if (collapseDescription) {
          choiceNode = (
            <Collapsible layoutType={"minimal"} header="Show Details">
              <HtmlContent
                className="detail-choice-description"
                html={choiceDescription}
                withoutTooltips
              />
            </Collapsible>
          );
        } else if (choiceDescription.length > maxDescriptionLength) {
          choiceNode = (
            <CollapsibleContent className="detail-choice-description">
              {choiceDescription}
            </CollapsibleContent>
          );
        } else {
          choiceNode = (
            <HtmlContent
              className="detail-choice-description"
              html={choiceDescription}
              withoutTooltips
            />
          );
        }
    }
  }

  return (
    <div className={classNames.join(" ")}>
      <Select
        className="detail-choice-input"
        options={ChoiceUtils.getSortedRenderOptions(
          options,
          classId,
          subType,
          entityRestrictionData,
          languages ?? [],
          ruleData,
          defaultSubtypes,
          showBackgroundProficiencyOptions,
          choiceInfo,
          optionValue
        )}
        value={optionValue}
        placeholder={label ? `- ${label} -` : "- Choose an Option -"}
        onChange={handleChoiceChange}
      />
      {choiceNode}
    </div>
  );
};
