import { visuallyHidden } from "@mui/utils";
import clsx from "clsx";
import { FC, HTMLAttributes, useContext } from "react";
import { useSelector } from "react-redux";

import {
  AdvantageIcon,
  BoxBackground,
  InitiativeBoxSvg,
} from "@dndbeyond/character-components/es";
import { DiceTools, RollKind, RollType } from "@dndbeyond/dice";
import { GameLogContext } from "@dndbeyond/game-log-components";

import { RollableNumberDisplay } from "~/components/RollableNumberDisplay/RollableNumberDisplay";
import { useCharacterTheme } from "~/contexts/CharacterTheme";
import { useSidebar } from "~/contexts/Sidebar";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import {
  appEnvSelectors,
  characterRollContextSelectors,
} from "~/tools/js/Shared/selectors";
import { isNotNullOrUndefined } from "~/tools/js/Shared/utils/TypeScript/utils";

import { PaneComponentEnum } from "../Sidebar/types";
import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  isMobile?: boolean;
  isTablet?: boolean;
}
export const InitiativeBox: FC<Props> = ({ isMobile, isTablet, ...props }) => {
  const [{ messageTargetOptions, defaultMessageTargetOption, userId }] =
    useContext(GameLogContext);
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  const handleClick = (evt: React.MouseEvent): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    paneHistoryStart(PaneComponentEnum.INITIATIVE);
  };

  const {
    hasInitiativeAdvantage,
    processedInitiative: initiative,
    characterTheme: theme,
  } = useCharacterEngine();
  const { isDarkMode } = useCharacterTheme();

  const diceEnabled = useSelector(appEnvSelectors.getDiceEnabled);
  const rollContext = useSelector(
    characterRollContextSelectors.getCharacterRollContext
  );

  return (
    <section
      className={clsx([isMobile ? styles.boxMobile : styles.box])}
      onClick={handleClick}
      {...props}
    >
      {!isMobile && (
        <div
          className={clsx([
            styles.label,
            isDarkMode && !isTablet && styles.dark,
          ])}
          data-testid="combat-initiative-label"
        >
          Initiative
        </div>
      )}
      <div className={isMobile ? styles.valueMobile : styles.value}>
        {!isMobile && (
          <>
            <BoxBackground StyleComponent={InitiativeBoxSvg} theme={theme} />
            <h2 style={visuallyHidden}>Initiative</h2>
          </>
        )}
        <RollableNumberDisplay
          number={initiative}
          type="signed"
          size={"large"}
          diceNotation={DiceTools.CustomD20(initiative)}
          rollType={RollType.Roll}
          rollAction={"Initiative"}
          rollKind={hasInitiativeAdvantage ? RollKind.Advantage : RollKind.None}
          diceEnabled={diceEnabled}
          advMenu={true}
          themeColor={theme.themeColor}
          rollContext={rollContext}
          rollTargetOptions={
            messageTargetOptions?.entities
              ? Object.values(messageTargetOptions?.entities).filter(
                  isNotNullOrUndefined
                )
              : undefined
          }
          rollTargetDefault={defaultMessageTargetOption}
          userId={Number(userId)}
          className={clsx([
            isMobile && !theme.isDarkMode && styles.numberColorOverride,
          ])}
        />
      </div>
      {hasInitiativeAdvantage && (
        <div
          className={clsx([styles.advantage, isMobile && styles.mobile])}
          aria-label="Has advantage on initiative"
        >
          <AdvantageIcon
            theme={theme}
            className={styles.advantageIcon}
            title={"Advantage on Initiative"}
          />
        </div>
      )}
      {isMobile && <div className={styles.labelMobile}>Initiative</div>}
    </section>
  );
};
