import clsx from "clsx";
import { HTMLAttributes, ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import {
  characterEnvSelectors,
  Constants,
} from "../../character-rules-engine";
import ChevronRight from "../../fontawesome-cache/svgs/solid/chevron-right.svg";

import { Button } from "~/components/Button";
import { Checkbox } from "~/components/Checkbox";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { builderActions } from "~/tools/js/CharacterBuilder/actions";
import { navigationConfig } from "~/tools/js/CharacterBuilder/config";
import { NavigationUtils } from "~/tools/js/CharacterBuilder/utils";

import { BuilderMethod, RouteKey } from "../../constants";
import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  isEnabled?: boolean;
}

export const BuilderTypeChoicePage: React.FC<Props> = ({
  isEnabled = true,
  className,
  ...props
}) => {
  const params = new URLSearchParams(globalThis.location.search);
  const isMobileApp = params.get("platform");
  const [showHelpText, setShowHelpText] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { characterId } = useCharacterEngine();
  const characterIsLoading = useSelector(
    characterEnvSelectors.getLoadingStatus
  );

  useEffect(() => {
    if (characterIsLoading === Constants.CharacterLoadingStatusEnum.LOADED) {
      navigate(NavigationUtils.getCharacterBuilderUrl(characterId), {
        replace: true,
      });
    }
  }, [characterIsLoading, characterId, navigate]);

  const handleMethodSet = (method: string) => {
    if (method === BuilderMethod.STEP_BY_STEP) {
      dispatch(builderActions.stepBuildRequest(showHelpText));
    } else {
      dispatch(builderActions.builderMethodSet(method));
    }
  };

  const onKeyUp = (
    evt: React.KeyboardEvent<HTMLDivElement>,
    method: string
  ): void => {
    if (evt.key === "Enter") {
      handleMethodSet(method);
    }
  };

  const renderFooter = (text: string = "Start Building") => (
    <div className={clsx([styles.cardFooter, styles.font])}>
      <p>{text}</p>
      <ChevronRight className={styles.icon} />
    </div>
  );

  const renderCardContent = (
    title: string,
    description: string,
    extraNode?: ReactNode
  ) => (
    <div className={styles.cardContent}>
      <h3 className={clsx([styles.cardTitle, styles.font])}>{title}</h3>
      <p className={clsx([styles.cardDescription, styles.font])}>
        {description}
      </p>
      {extraNode}
    </div>
  );

  return (
    <div className={clsx([styles.page, className])} {...props}>
      <h1 className={styles.header}>Character Creation Method</h1>
      <h2 className={clsx([styles.header])}>
        Choose how you would like to create your character
      </h2>
      <section className={styles.grid}>
        {/* STANDARD BUILD */}
        <div
          onClick={() => handleMethodSet(BuilderMethod.STEP_BY_STEP)}
          onKeyUp={(event) => onKeyUp(event, BuilderMethod.STEP_BY_STEP)}
          className={styles.card}
          role="button"
          tabIndex={0}
        >
          <div className={clsx([styles.img, styles.standardBuild])} />
          {renderCardContent(
            "Standard",
            "Create a character using a step-by-step approach",
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (isEnabled) setShowHelpText(!showHelpText);
              }}
              className={styles.helpCheckbox}
            >
              <Checkbox
                id="q-include-help"
                aria-labelledby="include-help-text"
                checked={showHelpText}
                disabled={!isEnabled}
                darkMode
              />
              <label
                id="include-help-text"
                htmlFor="q-include-help"
                className={styles.helpText}
              >
                <strong>Beginner?</strong> Show help text
              </label>
            </div>
          )}
          {renderFooter()}
        </div>
        {/* PREMADES */}
        {!isMobileApp && (
          <Button href="/characters/premade" className={styles.card}>
            <div className={clsx([styles.img, styles.premades])} />
            {renderCardContent(
              "Premade",
              "Browse a selection of ready-to-play, premade characters and claim one to your account."
            )}
            {renderFooter("Start Browsing")}
          </Button>
        )}
        {/* QUICK BUILD */}
        <Link
          className={styles.card}
          to={navigationConfig.getRouteDefPath(RouteKey.QUICK_BUILD)}
          onClick={() => handleMethodSet(BuilderMethod.QUICK)}
        >
          {renderCardContent(
            "Quick Build",
            "Choose a species and class to quickly create a level 1 character."
          )}
          {renderFooter()}
        </Link>
        {/* RANDOM BUILD */}
        <Link
          className={styles.card}
          to={navigationConfig.getRouteDefPath(RouteKey.RANDOMIZE_BUILD)}
          onClick={() => handleMethodSet(BuilderMethod.RANDOMIZE)}
        >
          {renderCardContent(
            "Random",
            "Roll up a randomized character! You can optionally set some parameters such as level, species, and class."
          )}
          {renderFooter()}
        </Link>
      </section>
    </div>
  );
};
