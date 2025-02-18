import clsx from "clsx";
import { FC, ReactNode } from "react";

import { FeatManager } from "../../rules-engine/es";

import { Reference } from "~/components/Reference";
import { DataOriginTypeEnum } from "~/constants";
import { useCharacterTheme } from "~/contexts/CharacterTheme";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import Collapsible, {
  CollapsibleHeaderContent,
} from "~/tools/js/smartComponents/Collapsible";
import { TodoIcon } from "~/tools/js/smartComponents/Icons";
import PrerequisiteFailureSummary from "~/tools/js/smartComponents/PrerequisiteFailureSummary";
import { CharacterTheme } from "~/types";

import {
  RemoveButton,
  ThemeButton,
} from "../../../../../../../tools/js/Shared/components/common/Button";
import { FeatDetail } from "../FeatDetail";
import styles from "./styles.module.css";

interface Props {
  feat: FeatManager;
  enableRemove?: boolean;
  enableAdd?: boolean;
  showFailures?: boolean;
  theme: CharacterTheme;
}

export const Feat: FC<Props> = ({
  feat,
  enableAdd = true,
  enableRemove = true,
  showFailures = false,
  theme,
}) => {
  const { entityUtils } = useCharacterEngine();
  const { isDarkMode } = useCharacterTheme();

  let missingChoiceCount: number = feat.getUnfinishedChoices().length;
  let calloutNode: ReactNode = null;
  let dataOrigin = feat.getDataOrigin();
  let dataOriginType = feat.getDataOriginType();

  switch (dataOriginType) {
    case DataOriginTypeEnum.ADHOC:
      if (enableRemove) {
        calloutNode = (
          <RemoveButton
            onClick={feat.handleRemove}
            style="filled"
            className={styles.button}
          />
        );
      }
      break;

    case DataOriginTypeEnum.SIMULATED:
      if (enableAdd) {
        calloutNode = (
          <ThemeButton
            onClick={feat.handleAdd}
            size="small"
            style="outline"
            className={styles.button}
          >
            Add
          </ThemeButton>
        );
      }
      break;

    default:
      const dataOriginExtra = entityUtils.getDataOriginName(
        dataOrigin,
        "Unknown",
        true
      );

      calloutNode = (
        <span className={styles.origin}>
          <span className={styles.originLabel}>From</span>
          <span className={styles.originName}>{dataOriginExtra}</span>
        </span>
      );
  }

  return (
    <Collapsible
      layoutType={"minimal"}
      className={styles.feat}
      header={
        <CollapsibleHeaderContent
          heading={
            <div>
              <div>
                <span>{feat.getName()}</span>
                {missingChoiceCount > 0 && (
                  <TodoIcon
                    theme={theme}
                    title={`Choice${
                      missingChoiceCount !== 1 ? "s" : ""
                    } Needed`}
                  />
                )}
              </div>
              <span className={styles.source}>
                <Reference name={feat.getPrimarySourceName()} />
              </span>
              {showFailures && (
                <PrerequisiteFailureSummary
                  failures={feat.getPrerequisiteFailures()}
                  className={styles.failures}
                />
              )}
            </div>
          }
          callout={calloutNode}
        />
      }
    >
      <FeatDetail
        featManager={feat}
        className={clsx([styles.detail, isDarkMode && styles.dark])}
      />
    </Collapsible>
  );
};
