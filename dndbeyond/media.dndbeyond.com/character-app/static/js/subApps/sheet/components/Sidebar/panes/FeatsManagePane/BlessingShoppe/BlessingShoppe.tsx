import { FC, useContext, useEffect, useState } from "react";

import { FeatureManager } from "@dndbeyond/character-rules-engine";

import { ThemeButton } from "~/tools/js/Shared/components/common/Button";
import DataLoadingStatusEnum from "~/tools/js/Shared/constants/DataLoadingStatusEnum";
import { CharacterFeaturesManagerContext } from "~/tools/js/Shared/managers/CharacterFeaturesManagerContext";
import { AppLoggerUtils, AppNotificationUtils } from "~/tools/js/Shared/utils";
import Collapsible, {
  CollapsibleHeaderContent,
} from "~/tools/js/smartComponents/Collapsible";

export const BlessingShoppe: FC<{}> = () => {
  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );

  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatusEnum>(
    DataLoadingStatusEnum.NOT_INITIALIZED
  );
  const [blessingShoppe, setBlessingShoppe] = useState<Array<FeatureManager>>(
    []
  );
  const [blessings, setBlessings] = useState<Array<FeatureManager>>([]);

  async function fetchBlessings() {
    const blessings = await characterFeaturesManager.getBlessings();
    setBlessings(blessings);
  }

  useEffect(() => {
    if (loadingStatus !== DataLoadingStatusEnum.LOADED) {
      characterFeaturesManager
        .getBlessingShoppe()
        .then((blessingShoppe) => {
          setLoadingStatus(DataLoadingStatusEnum.LOADED);
          setBlessingShoppe(blessingShoppe);
        })
        .catch(AppLoggerUtils.handleAdhocApiError);
    }
    fetchBlessings();
  }, [loadingStatus, characterFeaturesManager]);

  return (
    <div>
      <p>
        A blessing is usually bestowed by a god or a godlike being. A character
        might receive a blessing from a deity for doing something truly
        momentous — an accomplishment that catches the attention of both gods
        and mortals.
      </p>
      <div>
        {blessingShoppe.map((blessing) => {
          return (
            <Collapsible
              key={blessing.getId()}
              layoutType={"minimal"}
              header={
                <CollapsibleHeaderContent
                  heading={blessing.getName()}
                  callout={
                    characterFeaturesManager.hasBlessing(blessing) ? (
                      <ThemeButton
                        onClick={() => {
                          blessing.handleRemove(() => {
                            fetchBlessings();
                            // AppNotificationUtils.dispatchSuccess(
                            //     'Removed Blessing',
                            //     'You removed a blessing',
                            // );
                          });
                        }}
                        size="small"
                      >
                        Remove
                      </ThemeButton>
                    ) : (
                      <ThemeButton
                        onClick={() => {
                          blessing.handleAdd(() => {
                            fetchBlessings();
                            AppNotificationUtils.dispatchSuccess(
                              "Added Blessing",
                              "You added a blessing"
                            );
                          });
                        }}
                        size="small"
                        style="outline"
                      >
                        Add
                      </ThemeButton>
                    )
                  }
                />
              }
            >
              {blessing.getDescription()}
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};
