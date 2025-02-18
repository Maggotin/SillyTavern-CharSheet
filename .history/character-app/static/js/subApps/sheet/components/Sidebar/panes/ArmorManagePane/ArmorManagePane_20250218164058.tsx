import { FC, HTMLAttributes } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Collapsible } from "@dndbeyond/character-components/es";
import {
  characterActions,
  ValueUtils,
} from "../../rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { AdjustmentTypeEnum, RuleKeyEnum } from "~/constants";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { useRuleData } from "~/hooks/useRuleData";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import EditorBox from "~/tools/js/Shared/components/EditorBox";
import ValueEditor from "~/tools/js/Shared/components/ValueEditor";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";

import { ArmorClassDetail } from "./ArmorClassDetail";
import styles from "./styles.module.css";

/*
This is the sidebar information for Armor Class. It displays the sources of any Armor Class bonuses and you can provide customizations and overrides here.
*/

interface ArmorManagePaneProps extends HTMLAttributes<HTMLDivElement> {}
export const ArmorManagePane: FC<ArmorManagePaneProps> = ({ ...props }) => {
  const dispatch = useDispatch();
  const { acAdjustments, acTotal, valueLookup, ruleData } =
    useCharacterEngine();
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const { ruleDataUtils } = useRuleData();

  const acRule =
    ruleDataUtils.getRule(RuleKeyEnum.ARMOR_CLASS, ruleData)?.description ??
    null;

  const customizationValues = [
    AdjustmentTypeEnum.OVERRIDE_AC,
    AdjustmentTypeEnum.OVERRIDE_BASE_ARMOR,
    AdjustmentTypeEnum.MAGIC_BONUS_AC,
    AdjustmentTypeEnum.MISC_BONUS_AC,
  ];

  let hasOverrideAcAdjustment: boolean =
    acAdjustments.overrideAc !== null &&
    acAdjustments.overrideAc.value !== null;
  let overrideAcAdjustmentSource: string | null =
    hasOverrideAcAdjustment && acAdjustments.overrideAc
      ? acAdjustments.overrideAc.notes
      : "";

  const handleCustomDataUpdate = (
    key: number,
    value: string,
    source: string
  ): void => {
    dispatch(characterActions.valueSet(key, value, source));
  };
  return (
    <div {...props}>
      <Header>
        Armor Class: {acTotal}
        {hasOverrideAcAdjustment ? "*" : ""}
        {hasOverrideAcAdjustment && (
          <span className={styles.headingOverride}>
            (
            {overrideAcAdjustmentSource
              ? overrideAcAdjustmentSource
              : "Override"}
            )
          </span>
        )}
      </Header>
      <ArmorClassDetail />
      {/* AC CUSTOMIZATION */}
      {!isReadonly && (
        <Collapsible
          layoutType={"minimal"}
          header="Customize"
          className={styles.customize}
        >
          <EditorBox className={styles.editorBox}>
            <ValueEditor
              dataLookup={ValueUtils.getDataLookup(
                valueLookup,
                customizationValues
              )}
              onDataUpdate={handleCustomDataUpdate}
              valueEditors={customizationValues}
              ruleData={ruleData}
            />
          </EditorBox>
        </Collapsible>
      )}
      {/* AC Description */}
      {acRule && (
        <HtmlContent
          className={styles.description}
          html={acRule}
          withoutTooltips
        />
      )}
    </div>
  );
};
