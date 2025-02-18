import clsx from "clsx";
import {
  ChangeEvent,
  FC,
  HTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CharacterAvatarPortrait,
  CharacterName,
  CharacterProgressionSummary,
  CharacterSummary,
  LightPencilSvg,
  ThemedPaintBrushSvg,
} from "../../character-components/es";

import { Button } from "~/components/Button/Button";
import {
  CharacterNameLimitMsg,
  DeathCauseEnum,
  InputLimits,
} from "~/constants";
import { useCharacterTheme } from "~/contexts/CharacterTheme";
import { useSidebar } from "~/contexts/Sidebar";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { useMaxLengthErrorHandling } from "~/hooks/useErrorHandling/useMaxLengthErrorHandling";
import useUserId from "~/hooks/useUserId";
import { appEnvActions } from "~/tools/js/Shared/actions";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";
import { CharacterStatusSlug } from "~/types";

import { Popover } from "../../../../../../../components/Popover";
import { PopoverContent } from "../../../../../../../components/PopoverContent";
import { PaneComponentEnum } from "../../../types";
import styles from "./styles.module.css";

export interface OverviewProps extends HTMLAttributes<HTMLDivElement> {}

export const Overview: FC<OverviewProps> = ({ className, ...props }) => {
  const {
    ruleData,
    characterName,
    characterGender: gender,
    race: species,
    experienceInfo: xpInfo,
    deathCause,
    preferences,
    decorationInfo,
    playerName,
    playerId,
    characterActions,
    decorationUtils,
    classUtils,
    classes,
    characterStatusSlug: characterStatus,
  } = useCharacterEngine();
  const dispatch = useDispatch();

  const { isDarkMode } = useCharacterTheme();

  const userId = useUserId();
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const canOverrideReadOnly = useSelector(
    appEnvSelectors.getCanOverrideReadOnly
  );

  const {
    pane: { paneHistoryPush },
  } = useSidebar();

  const { MaxLengthErrorMessage, hideError, handleMaxLengthErrorMsg } =
    useMaxLengthErrorHandling(
      (characterName?.length ?? 0) >= InputLimits.characterNameMaxLength,
      InputLimits.characterNameMaxLength,
      CharacterNameLimitMsg
    );

  const isUserCharacter = playerId === Number(userId);
  const isPremade = characterStatus === CharacterStatusSlug.PREMADE;

  const [isNameEditorVisible, setIsNameEditorVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNameEditorVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isNameEditorVisible]);

  const handleNameClick = (): void => {
    setIsNameEditorVisible(true);
  };

  const handleNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = evt.target.value;

    if (inputValue !== characterName && inputValue !== "") {
      dispatch(characterActions.nameSet(inputValue));
    }

    setIsNameEditorVisible(false);
    hideError();
  };

  const handleToggleEdit = (status: boolean): void => {
    dispatch(appEnvActions.dataSet({ isReadonly: status }));
  };

  const handleNameUpdate = (evt: ChangeEvent<HTMLInputElement>): void => {
    handleMaxLengthErrorMsg(evt.target.value);
  };

  const handleDecorateMenuClick = (): void => {
    paneHistoryPush(PaneComponentEnum.DECORATE);
  };

  const isEditingCharacterName = useMemo(
    () => isNameEditorVisible && !isReadonly,
    [isNameEditorVisible, isReadonly]
  );

  return (
    <div
      className={clsx([styles.intro, isDarkMode && styles.dark, className])}
      {...props}
    >
      <div className={styles.summary}>
        <CharacterAvatarPortrait
          className={styles.avatar}
          avatarUrl={decorationUtils.getAvatarInfo(decorationInfo).avatarUrl}
        />
        {
          <div
            className={clsx([
              styles.characterName,
              isEditingCharacterName && styles.editName,
            ])}
            onClick={isReadonly ? undefined : handleNameClick}
          >
            {isEditingCharacterName ? (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  defaultValue={characterName ?? ""}
                  maxLength={InputLimits.characterNameMaxLength}
                  onBlur={handleNameChange}
                  onChange={handleNameUpdate}
                  onFocus={handleNameUpdate}
                />
                <MaxLengthErrorMessage />
              </>
            ) : (
              <>
                <CharacterName
                  name={characterName ?? ""}
                  isDead={deathCause !== DeathCauseEnum.NONE}
                  isFaceMenu={true}
                />
                {!isReadonly && <LightPencilSvg />}
              </>
            )}
          </div>
        }
        {/* DISPLAY PLAYER NAME IF ITS NOT A PREMADE OR YOUR CHARACTER */}
        {!isUserCharacter && !isPremade && (
          <div>
            <span className={styles.playerNameLabel}>Player: </span>
            {playerName}
          </div>
        )}
        {/* SHOW SPECIES, GENDER AND XP/LEVEL INFO */}
        <div className={styles.description}>
          <CharacterSummary
            className={styles.summaryText}
            classes={null}
            species={species}
            gender={gender}
          />
          <CharacterProgressionSummary
            ruleData={ruleData}
            progressionType={preferences.progressionType}
            xpInfo={xpInfo}
          />
        </div>
      </div>
      {/* DISPLAY CLASS LIST */}
      <div className={styles.classList}>
        {classes.map((charClass) => (
          <div className={styles.classItem} key={classUtils.getId(charClass)}>
            <div
              className={styles.classImage}
              style={{
                backgroundImage: `url(${classUtils.getPortraitUrl(charClass)})`,
              }}
            >
              <div className={styles.classLevel}>
                {classUtils.getLevel(charClass)}
              </div>
            </div>
            <div className={styles.classSummary}>
              <div>{classUtils.getName(charClass)}</div>
              <div className={styles.classMeta}>
                {classUtils.getSubclassName(charClass) ?? "No Subclass"}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.buttonGroup}>
        {/* This is only for PREMADE characters */}
        {canOverrideReadOnly && (
          <div className={styles.featureCallout}>
            {isReadonly ? (
              <Popover
                trigger={
                  <Button
                    size="x-small"
                    variant="solid"
                    className={clsx([styles.toggleButton])}
                    forceThemeMode="dark"
                  >
                    <LightPencilSvg />
                    <span>Enable Edit Premade</span>
                  </Button>
                }
                position="bottom"
                className={styles.popoverToggle}
              >
                <PopoverContent
                  title="PROCEED WITH CAUTION!!!"
                  content="⚠️ If you enable editing you will be modifying a published character ⚠️"
                  confirmText="Enable"
                  onConfirm={() => handleToggleEdit(false)}
                  withCancel
                />
              </Popover>
            ) : (
              <Button
                size="x-small"
                variant="solid"
                className={clsx([styles.toggleButton])}
                forceThemeMode="dark"
                onClick={() => handleToggleEdit(true)}
              >
                <LightPencilSvg />
                <span>DISABLE Edit Premade</span>
              </Button>
            )}
          </div>
        )}

        {/* DISPLAY DECORATE BUTTON AS A "FEATURE CALLOUT" */}
        {!isReadonly && (
          <div className={styles.featureCallout}>
            <Button
              size="x-small"
              variant="outline"
              className={styles.decorateButton}
              forceThemeMode="dark"
              themed
              onClick={handleDecorateMenuClick}
            >
              <ThemedPaintBrushSvg
                theme={decorationUtils.getCharacterTheme(decorationInfo)}
              />
              <span>Change Sheet Appearance</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
