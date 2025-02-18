import { FC, useContext, useEffect, useState } from "react";

import { FeatManager } from "@dndbeyond/character-rules-engine";

import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { useSource } from "~/hooks/useSource";
import DataLoadingStatusEnum from "~/tools/js/Shared/constants/DataLoadingStatusEnum";
import { CharacterFeaturesManagerContext } from "~/tools/js/Shared/managers/CharacterFeaturesManagerContext";
import { AppLoggerUtils } from "~/tools/js/Shared/utils";
import { isNotNullOrUndefined } from "~/tools/js/Shared/utils/TypeScript";
import Collapsible, {
  CollapsibleHeaderContent,
  CollapsibleHeading,
} from "~/tools/js/smartComponents/Collapsible";
import LoadingPlaceholder from "~/tools/js/smartComponents/LoadingPlaceholder";

import { Feat } from "../Feat/Feat";
import styles from "../styles.module.css";

export const FeatShoppe: FC<{}> = () => {
  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );

  const {
    feats: currentCharacterFeats,
    characterTheme: theme,
    preferences,
  } = useCharacterEngine();

  const { getSourceCategoryGroups } = useSource();

  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatusEnum>(
    DataLoadingStatusEnum.NOT_INITIALIZED
  );
  const [featShoppe, setFeatShoppe] = useState<Array<FeatManager>>([]);

  useEffect(() => {
    if (loadingStatus !== DataLoadingStatusEnum.LOADED) {
      characterFeaturesManager
        .getFeatShoppe()
        .then((featShoppe) => {
          setLoadingStatus(DataLoadingStatusEnum.LOADED);
          setFeatShoppe(featShoppe);
        })
        .catch(AppLoggerUtils.handleAdhocApiError);
    } else {
      setFeatShoppe(characterFeaturesManager.updateFeatShoppe(featShoppe));
    }
  }, [currentCharacterFeats]);

  const getFeatsInSourceCategoryGroups = (feats: FeatManager[]) => {
    const featDefs = feats
      .map((feat) => feat.getDefinition())
      .filter(isNotNullOrUndefined);

    return getSourceCategoryGroups(featDefs).map((group) => {
      return {
        ...group,
        items: characterFeaturesManager.transformLoadedFeats(group.items),
      };
    });
  };

  return loadingStatus !== DataLoadingStatusEnum.LOADED ? (
    <LoadingPlaceholder />
  ) : (
    <>
      <div className={styles.featList}>
        {getFeatsInSourceCategoryGroups(
          characterFeaturesManager.getAvailableFeats(featShoppe)
        ).map((group) => (
          <Collapsible
            key={group.id + "available"}
            layoutType="minimal"
            initiallyCollapsed={false}
            header={<h2>{group.name}</h2>}
          >
            <div>
              {group.items.map((feat) => (
                <Feat theme={theme} key={feat.getId()} feat={feat} />
              ))}
            </div>
          </Collapsible>
        ))}
      </div>
      {characterFeaturesManager.getUnavailableFeats(featShoppe).length > 0 && (
        <Collapsible
          header={
            <CollapsibleHeaderContent
              heading={
                <CollapsibleHeading>
                  Unavailable Feats
                  <span className={styles.unavailableCallout}>
                    Prerequisites Not Met
                  </span>
                </CollapsibleHeading>
              }
            />
          }
          className={styles.featList}
        >
          <>
            {getFeatsInSourceCategoryGroups(
              characterFeaturesManager.getUnavailableFeats(featShoppe)
            ).map((group) => (
              <Collapsible
                key={group.id + "unavailable"}
                layoutType="minimal"
                initiallyCollapsed={false}
                header={<h2>{group.name}</h2>}
              >
                <div>
                  {group.items.map((feat) => (
                    <Feat
                      theme={theme}
                      key={feat.getId()}
                      feat={feat}
                      enableAdd={!preferences?.enforceFeatRules}
                      showFailures={true}
                    />
                  ))}
                </div>
              </Collapsible>
            ))}
          </>
        </Collapsible>
      )}
    </>
  );
};
