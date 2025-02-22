import { FC } from "react";
import { useSelector } from "react-redux";

import { useFeatureFlags } from "~/contexts/FeatureFlag";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import SettingsButton from "~/tools/js/CharacterSheet/components/SettingsButton";
import { SettingsContextsEnum } from "~/tools/js/Shared/containers/panes/SettingsPane/typings";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";
import Collapsible, {
  CollapsibleHeaderContent,
  CollapsibleHeading,
} from "~/tools/js/smartComponents/Collapsible";

import { BlessingShoppe } from "./BlessingShoppe";
import { FeatShoppe } from "./FeatShoppe";
import styles from "./styles.module.css";

export const FeatsManagePane: FC<{}> = () => {
  const { gfsBlessingsUiFlag } = useFeatureFlags();

  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  if (isReadonly) {
    return null;
  }

  return (
    <div>
      <Header
        callout={
          <SettingsButton
            context={SettingsContextsEnum.FEATURES}
            isReadonly={isReadonly}
          />
        }
      >
        Manage {gfsBlessingsUiFlag ? "Features" : "Feats"}
      </Header>
      {gfsBlessingsUiFlag ? (
        <Collapsible
          header={
            <CollapsibleHeaderContent
              heading={<CollapsibleHeading>Add Feats</CollapsibleHeading>}
            />
          }
          className={styles.featList}
        >
          <FeatShoppe />
        </Collapsible>
      ) : (
        <FeatShoppe />
      )}
      {gfsBlessingsUiFlag && (
        <Collapsible
          header={
            <CollapsibleHeaderContent
              heading={<CollapsibleHeading>Add Blessings</CollapsibleHeading>}
            />
          }
          className={styles.featList}
        >
          <BlessingShoppe />
        </Collapsible>
      )}
    </div>
  );
};
