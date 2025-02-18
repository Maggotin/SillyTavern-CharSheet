import clsx from "clsx";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  SpellUtils,
  EntityUtils,
  FormatUtils,
  BaseSpell,
  DataOriginRefData,
  characterEnvSelectors,
} from "../../rules-engine/es";

import { useCharacterTheme } from "~/contexts/CharacterTheme";
import { useUnpropagatedClick } from "~/hooks/useUnpropagatedClick";

import { ConcentrationIcon, RitualIcon } from "../../tools/js/smartComponents/";
import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  onClick?: () => void;
  spell: BaseSpell;
  showSpellLevel?: boolean;
  showIcons?: boolean;
  showExpandedType?: boolean;
  showLegacy?: boolean;
  dataOriginRefData?: DataOriginRefData | null;
}

export const SpellName: FC<Props> = ({
  onClick,
  spell,
  showSpellLevel = true,
  showExpandedType = false,
  showIcons = true,
  dataOriginRefData = null,
  showLegacy = false,
  className,
  ...props
}) => {
  const [expandedInfoText, setExpandedInfoText] = useState("");
  const location = useSelector(characterEnvSelectors.getContext);
  const { isDarkMode } = useCharacterTheme();

  const getIconTheme = () => {
    if (location === "BUILDER") return "dark";
    return isDarkMode ? "gray" : "dark";
  };

  const handleClick = useUnpropagatedClick(onClick);

  useEffect(() => {
    if (dataOriginRefData) {
      let expandedDataOriginRef = SpellUtils.getExpandedDataOriginRef(spell);
      if (expandedDataOriginRef === null) {
        setExpandedInfoText("");
      } else {
        setExpandedInfoText(
          EntityUtils.getDataOriginRefName(
            expandedDataOriginRef,
            dataOriginRefData
          )
        );
      }
    }
  }, []);

  return (
    <span
      className={styles.spellName}
      onClick={onClick ? handleClick : undefined}
      {...props}
    >
      {showExpandedType && expandedInfoText !== "" && (
        <Tooltip
          title={expandedInfoText}
          className={styles.expanded}
          isDarkMode={isDarkMode}
        >
          +
        </Tooltip>
      )}
      {SpellUtils.getName(spell)}
      {SpellUtils.isCustomized(spell) && (
        <Tooltip
          title="Spell is Customized"
          className={styles.customized}
          isDarkMode={isDarkMode}
        >
          *
        </Tooltip>
      )}
      {showIcons && SpellUtils.getConcentration(spell) && (
        <ConcentrationIcon className={styles.icon} themeMode={getIconTheme()} />
      )}
      {showIcons && SpellUtils.isRitual(spell) && (
        <RitualIcon
          className={clsx([styles.icon])}
          themeMode={getIconTheme()}
        />
      )}

      {showSpellLevel && (
        <span className={styles.level}>
          ({FormatUtils.renderSpellLevelShortName(SpellUtils.getLevel(spell))})
        </span>
      )}
      {showLegacy && SpellUtils.isLegacy(spell) && (
        <span className={styles.legacy}> • Legacy</span>
      )}
    </span>
  );
};
