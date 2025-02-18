import clsx from "clsx";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CharacterPortraitContract } from "../../character-rules-engine";
import ShuffleIcon from "../../fontawesome-cache/svgs/solid/shuffle.svg";
import { LabelChip } from "../../ttui/components/LabelChip";

import { Button } from "~/components/Button";
import { ConfirmModal } from "~/components/ConfirmModal";
import {
  CharacterNameLimitMsg,
  InputLimits,
  DefaultCharacterName,
} from "~/constants";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { builderActions } from "~/tools/js/CharacterBuilder/actions";
import { builderSelectors } from "~/tools/js/CharacterBuilder/selectors";
import { FormInputField } from "~/tools/js/Shared/components/common/FormInputField";
import { PortraitManager } from "~/tools/js/Shared/containers/panes/DecoratePane";
import Tooltip from "~/tools/js/commonComponents/Tooltip";
import { CharacterAvatarPortrait } from "~/tools/js/smartComponents/CharacterAvatar";

import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  hidePortrait?: boolean;
  handleNameUpdate?: (newValue: string) => void;
  fullWidth?: boolean;
  useDefaultCharacterName?: boolean;
}

export const PortraitName: FC<Props> = ({
  fullWidth,
  hidePortrait,
  handleNameUpdate,
  useDefaultCharacterName,
  ...props
}) => {
  const dispatch = useDispatch();
  const { characterActions, decorationUtils, decorationInfo, characterName } =
    useCharacterEngine();
  const [localValue, setLocalValue] = useState(characterName);

  const suggestedNames = useSelector(builderSelectors.getSuggestedNames);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPortrait, setSelectedPortrait] =
    useState<CharacterPortraitContract | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentSuggestedNames, setCurrentSuggestedNames] = useState<
    Array<string>
  >([]);

  useEffect(() => {
    setCurrentSuggestedNames(suggestedNames);
  }, [suggestedNames]);

  const handleNameFieldSet = (value: string | null): void => {
    let updatedName = value ?? "";

    // If the flag useDefaultCharacterName is true and value is falsy, set the name to the DefaultCharacterName
    if (useDefaultCharacterName) updatedName = value || DefaultCharacterName;

    setLocalValue(updatedName);
    if (handleNameUpdate) {
      handleNameUpdate(updatedName);
    } else {
      dispatch(characterActions.nameSet(updatedName));
    }
  };

  const handleShowSuggestions = (): void => {
    if (currentSuggestedNames.length === 0) {
      dispatch(builderActions.suggestedNamesRequest());
    }

    setShowSuggestions(!showSuggestions);
  };

  const handleSuggestMoreClick = (): void => {
    dispatch(builderActions.suggestedNamesRequest());
  };

  const onConfirmPortrait = (): void => {
    if (selectedPortrait?.avatarId && selectedPortrait?.avatarUrl) {
      dispatch(
        characterActions.portraitSet(
          selectedPortrait.avatarId,
          selectedPortrait.avatarUrl
        )
      );
    }
    closeModal();
  };

  const handleSelectPortrait = (portrait: CharacterPortraitContract): void => {
    setSelectedPortrait(portrait);
  };

  const handlePortraitClick = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedPortrait(null);
  };

  const avatarUrl = decorationUtils.getAvatarInfo(decorationInfo).avatarUrl;

  return (
    <div {...props}>
      <div
        className={clsx([styles.nameContainer, fullWidth && styles.fullwidth])}
      >
        {!hidePortrait && (
          <>
            <div onClick={handlePortraitClick}>
              <CharacterAvatarPortrait
                className={clsx([styles.avatar, !avatarUrl && styles.empty])}
                avatarUrl={avatarUrl}
                data-testid="character-portrait"
              />
            </div>
            <ConfirmModal
              open={isModalOpen}
              onClose={closeModal}
              onConfirm={onConfirmPortrait}
              heading="Manage Portrait"
              className={styles.portraitManagerModal}
              confirmButtonText="Apply"
            >
              <PortraitManager handleSelectPortrait={handleSelectPortrait} />
            </ConfirmModal>
          </>
        )}
        <div className={styles.inputContainer}>
          <FormInputField
            label="Character Name"
            onBlur={handleNameFieldSet}
            initialValue={localValue}
            inputAttributes={
              {
                spellCheck: false,
                autoComplete: "off",
              } as HTMLAttributes<HTMLInputElement>
            }
            maxLength={InputLimits.characterNameMaxLength}
            maxLengthErrorMsg={CharacterNameLimitMsg}
          />
          <Button
            className={styles.suggestionButton}
            onClick={handleShowSuggestions}
            size="xx-small"
            variant="text"
            forceThemeMode="light"
          >
            {showSuggestions ? "Hide" : "Show"} Suggestions
          </Button>
        </div>
      </div>
      {showSuggestions && (
        <div>
          <div className={styles.suggestionsContainer}>
            <div className={styles.suggestionsLabel}>Suggestions:</div>
            <div>
              <Tooltip title="Shuffle Suggestions">
                <Button
                  variant="text"
                  size="xx-small"
                  onClick={handleSuggestMoreClick}
                  className={styles.shuffleButton}
                >
                  <ShuffleIcon className={styles.shuffleIcon} />
                </Button>
              </Tooltip>
            </div>
            <div className={styles.suggestions}>
              {currentSuggestedNames.map((name: string, index: number) => (
                <LabelChip
                  key={index}
                  onClick={() => handleNameFieldSet(name)}
                  className={styles.suggestion}
                  data-testid="suggestion-chip"
                >
                  {name}
                </LabelChip>
              ))}
            </div>
          </div>
          <div className={styles.credit}>
            Names by
            <Button
              className={styles.creditLink}
              href="http://www.fantasynamegenerators.com/"
              target="_blank"
              rel="noreferrer"
              variant="text"
            >
              <span className={styles.creditText}>Fantasy Name Generators</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
