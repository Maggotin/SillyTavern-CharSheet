import { FC, HTMLAttributes } from "react";

import { useCharacterTheme } from "~/contexts/CharacterTheme";
import { useFeatureFlags } from "~/contexts/FeatureFlag";

import { getActiveEntryComponent } from "../../helpers/getActiveEntryComponent";
import { PaneComponentInfo } from "../../types";
import styles from "./styles.module.css";

interface PaneContentProps extends HTMLAttributes<HTMLElement> {
  activePane: PaneComponentInfo | null;
}

export const PaneContent: FC<PaneContentProps> = ({ activePane, ...props }) => {
  const { isDarkMode } = useCharacterTheme();
  const { campaignSettingsFlag } = useFeatureFlags();

  // Empty pane
  if (!activePane)
    return (
      <div className={styles.default} {...props}>
        Select elements on the character sheet to display more information about
      </div>
    );

  const Component = getActiveEntryComponent(
    campaignSettingsFlag,
    activePane.type
  );

  // Component not found
  if (!Component) return <div {...props}>Component was not found.</div>;

  // Return correct component
  return (
    <div className={styles.maxHeight} {...props}>
      <Component
        theme={isDarkMode ? "DARK" : "LIGHT"}
        identifiers={activePane.identifiers}
      />
    </div>
  );
};
