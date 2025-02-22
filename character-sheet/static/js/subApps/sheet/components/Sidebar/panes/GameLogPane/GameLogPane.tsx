import clsx from "clsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Dice } from "@dndbeyond/dice";
import { GameLog } from "@dndbeyond/game-log-components";

import { appEnvActions } from "~/tools/js/Shared/actions/appEnv";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";

import styles from "./styles.module.css";

export const GameLogPane = () => {
  const dispatch = useDispatch();
  const gameLog = useSelector(appEnvSelectors.getGameLog);
  const characterId = useSelector(appEnvSelectors.getCharacterId);

  useEffect(
    () => {
      const updateOpenState = (isOpen: boolean) => {
        const lastMessageTime = new Date().getTime();

        dispatch(
          appEnvActions.dataSet({
            gameLog: {
              ...gameLog,
              isOpen: isOpen,
              lastMessageTime: lastMessageTime,
            },
          })
        );

        try {
          localStorage.setItem(
            `gameLog-lastMessageTime-${characterId}`,
            lastMessageTime.toString()
          );
        } catch (e) {}

        // turn the dice notifications off if the panel is open
        Dice.setDiceNotificationEnabled(!isOpen);
      };

      updateOpenState(true);

      return () => {
        updateOpenState(false);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className={clsx(styles.gameLogPane)} data-testid="gamelog-pane">
      {characterId && <GameLog />}
    </div>
  );
};

export default GameLogPane;
