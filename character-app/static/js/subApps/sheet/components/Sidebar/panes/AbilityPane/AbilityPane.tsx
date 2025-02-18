import { FC, HTMLAttributes, ReactNode } from "react";
import { useSelector } from "react-redux";

import { AbilityScoreManager } from "~/components/AbilityScoreManager";
import { HtmlContent } from "~/components/HtmlContent";
import { NumberDisplay } from "~/components/NumberDisplay";
import { useCharacterTheme } from "~/contexts/CharacterTheme";
import { useAbilities } from "~/hooks/useAbilities";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { PaneInitFailureContent } from "~/subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import { Preview } from "~/subApps/sheet/components/Sidebar/components/Preview";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";
import { AbilityIcon } from "~/tools/js/smartComponents/Icons";

import { PaneIdentifiersAbility } from "../../types";
import styles from "./styles.module.css";

/*
AbilityPane is the specific Sidebar for each Ability on a character 
(Strength, Dexterity, Constitution, Wisdom, Intelligence, Charisma)
*/

interface Props extends HTMLAttributes<HTMLDivElement> {
  identifiers: PaneIdentifiersAbility | null;
}
export const AbilityPane: FC<Props> = ({ identifiers, ...props }) => {
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const { isDarkMode } = useCharacterTheme();
  const abilities = useAbilities();
  const ability =
    (identifiers &&
      abilities.find((a) => a.getId() === identifiers?.ability.getId())) ||
    identifiers?.ability;

  if (!ability) {
    return <PaneInitFailureContent />;
  }

  const statId = ability.getId();

  let sidebarPreviewNode: ReactNode = (
    <Preview>
      <AbilityIcon
        className={styles.icon}
        statId={statId}
        themeMode={isDarkMode ? "light" : "dark"}
      />
    </Preview>
  );

  const modifier = ability.getModifier();
  const abilityCompendiumText = ability.getCompendiumText();
  return (
    <div key={statId} {...props}>
      <Header preview={sidebarPreviewNode}>
        {ability.getLabel()} {ability.getTotalScore()}
        {modifier !== null && (
          <span className={styles.modifier}>
            (
            <NumberDisplay
              type="signed"
              number={modifier}
              className={styles.signedNumber}
            />
            )
          </span>
        )}
      </Header>
      <AbilityScoreManager
        ability={ability}
        showHeader={false}
        isReadonly={isReadonly}
      />
      {abilityCompendiumText && (
        <HtmlContent
          className={styles.description}
          html={abilityCompendiumText}
          withoutTooltips
        />
      )}
    </div>
  );
};
