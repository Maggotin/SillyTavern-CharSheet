import { FC, HTMLAttributes } from "react";

import { FeatManager } from "../../character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { DetailChoiceFeat } from "~/tools/js/Shared/containers/DetailChoice";

import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  featManager: FeatManager;
}

export const FeatDetail: FC<Props> = ({ featManager, className, ...props }) => {
  const prerequisiteDescription = featManager.getPrerequisiteDescription();
  const featDescription = featManager.getDescription();

  return (
    <div className={className} {...props}>
      {prerequisiteDescription && (
        <div className={styles.prereq}>
          Prerequisite: {prerequisiteDescription}
        </div>
      )}
      {featDescription && (
        <HtmlContent html={featDescription} withoutTooltips />
      )}
      {featManager.getChoices().length > 0 && (
        <div className={styles.choices}>
          <DetailChoiceFeat featId={featManager.getId()} />
        </div>
      )}
    </div>
  );
};
