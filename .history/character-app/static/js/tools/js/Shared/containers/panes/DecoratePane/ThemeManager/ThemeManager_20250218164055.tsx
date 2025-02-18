import axios, { Canceler } from "axios";
import { uniq } from "lodash";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AbilitySummary,
  LoadingPlaceholder,
} from "@dndbeyond/character-components/es";
import {
  ApiAdapterUtils,
  ApiRequests,
  characterActions,
  CharacterThemeColorContract,
  DecorationUtils,
  rulesEngineSelectors,
} from "../../rules-engine/es";

import { useAbilities } from "~/hooks/useAbilities";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";
import { AttributesManagerContext } from "~/tools/js/Shared/managers/AttributesManagerContext";

import DataLoadingStatusEnum from "../../../../constants/DataLoadingStatusEnum";
import { characterRollContextSelectors } from "../../../../selectors";
import { AppLoggerUtils } from "../../../../utils";
import DecorationPreviewItem from "../DecorationPreviewItem";

interface ThemeGroupInfo {
  label: string;
  themes: Array<CharacterThemeColorContract>;
}

export default function ThemeManager() {
  let loadThemesCanceler: null | Canceler = null;
  const [themeData, setThemeData] = useState<
    Array<CharacterThemeColorContract>
  >([]);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatusEnum>(
    DataLoadingStatusEnum.NOT_INITIALIZED
  );

  const { attributesManager } = useContext(AttributesManagerContext);
  const abilities = useAbilities();
  const highestAbility = attributesManager.getHighestAbilityScore(abilities);

  const dispatch = useDispatch();
  const decorationInfo = useSelector(rulesEngineSelectors.getDecorationInfo);
  const startingClass = useSelector(rulesEngineSelectors.getStartingClass);
  const preferences = useSelector(rulesEngineSelectors.getCharacterPreferences);
  const characterRollContext = useSelector(
    characterRollContextSelectors.getCharacterRollContext
  );

  useEffect(() => {
    setLoadingStatus(DataLoadingStatusEnum.LOADING);

    ApiRequests.getCharacterGameDataThemeColors({
      cancelToken: new axios.CancelToken((c) => {
        loadThemesCanceler = c;
      }),
    })
      .then((response) => {
        let apiData: Array<CharacterThemeColorContract> = [];

        const data = ApiAdapterUtils.getResponseData(response);
        if (data !== null) {
          apiData = data;
        }

        setThemeData(apiData);
        setLoadingStatus(DataLoadingStatusEnum.LOADED);
        loadThemesCanceler = null;
      })
      .catch(AppLoggerUtils.handleAdhocApiError);
    return () => {
      if (loadThemesCanceler !== null) {
        loadThemesCanceler();
      }
    };
  }, []);

  const handleThemeClick = (theme: CharacterThemeColorContract): void => {
    dispatch(characterActions.themeSet(theme));
  };

  const handleDefaultThemeClick = (): void => {
    dispatch(characterActions.themeSet(null));
  };

  const renderThemes = (
    heading: string,
    themes: Array<CharacterThemeColorContract>
  ): React.ReactNode => {
    const characterTheme = DecorationUtils.getCharacterTheme(decorationInfo);

    return (
      <div className="ct-decoration-manager__group" key={heading}>
        <Heading>{heading}</Heading>
        <div className="ct-decoration-manager__list">
          {themes.map((theme) => {
            const isSelected =
              !characterTheme.isDefault &&
              theme.themeColorId === characterTheme.themeColorId;
            let classNames: Array<string> = [
              "ct-decoration-manager__item--theme",
            ];
            if (isSelected) {
              classNames.push("ct-decoration-manager__item--current-theme");
            }
            return (
              <DecorationPreviewItem
                key={theme.themeColorId}
                avatarId={theme?.themeColorId ?? null}
                isCurrent={isSelected}
                onSelected={() => handleThemeClick(theme)}
                className={classNames.join(" ")}
                avatarName={theme.name}
              >
                <AbilitySummary
                  theme={DecorationUtils.generateCharacterTheme(
                    theme,
                    preferences
                  )}
                  ability={highestAbility}
                  preferences={preferences}
                  diceEnabled={false}
                  rollContext={characterRollContext}
                />
              </DecorationPreviewItem>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContent = (): React.ReactNode => {
    let tags: Array<string> = uniq(
      themeData.reduce((acc: Array<string>, data) => {
        let newTags = data.tags ? data.tags : [];
        return [...acc, ...newTags];
      }, [])
    );
    let groups: Array<ThemeGroupInfo> = [];
    tags.forEach((tag) => {
      groups.push({
        label: tag,
        themes: themeData.filter(
          (data) => data.tags && data.tags.includes(tag)
        ),
      });
    });

    let classNames: Array<string> = ["ct-decoration-manager__item--theme"];
    if (DecorationUtils.isDefaultTheme(decorationInfo)) {
      classNames.push("ct-decoration-manager__item--current-theme");
    }

    return (
      <>
        <div className="ct-decoration-manager__group">
          <Heading>Default</Heading>
          <div className="ct-decoration-manager__list">
            <DecorationPreviewItem
              avatarId={null}
              isCurrent={DecorationUtils.isDefaultTheme(decorationInfo)}
              onSelected={handleDefaultThemeClick}
              className={classNames.join(" ")}
              avatarName={"DDB Red"}
            >
              <AbilitySummary
                theme={DecorationUtils.generateCharacterTheme(
                  null,
                  preferences
                )}
                ability={highestAbility}
                preferences={preferences}
                diceEnabled={false}
                rollContext={characterRollContext}
              />
            </DecorationPreviewItem>
          </div>
        </div>
        {groups.map((group) => renderThemes(group.label, group.themes))}
      </>
    );
  };

  let contentNode: React.ReactNode;
  if (loadingStatus === DataLoadingStatusEnum.LOADED) {
    contentNode = renderContent();
  } else {
    contentNode = <LoadingPlaceholder />;
  }

  return <div className="ct-decoration-manager">{contentNode}</div>;
}
