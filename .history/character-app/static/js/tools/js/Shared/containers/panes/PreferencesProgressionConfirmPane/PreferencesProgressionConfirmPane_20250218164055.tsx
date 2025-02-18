import { FC } from "react";
import { useDispatch } from "react-redux";

import {
  Constants,
  characterActions,
} from "../../rules-engine/es";

import { Button } from "~/components/Button";
import { useSidebar } from "~/contexts/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { PaneInitFailureContent } from "~/subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import {
  PaneComponentEnum,
  PaneIdentifiersPreferenceProgressionConfirm,
} from "~/subApps/sheet/components/Sidebar/types";

interface Props {
  identifiers: PaneIdentifiersPreferenceProgressionConfirm | null;
}

export const PreferencesProgressionConfirmPane: FC<Props> = ({
  identifiers,
}) => {
  const dispatch = useDispatch();
  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  const progressionType = identifiers?.id ?? null;

  const handleConfirm = (): void => {
    dispatch(
      characterActions.preferenceChoose("progressionType", progressionType)
    );
    paneHistoryStart(PaneComponentEnum.PREFERENCES);
  };

  const handleCancel = (): void => {
    paneHistoryStart(PaneComponentEnum.PREFERENCES);
  };

  const renderContent = (): React.ReactNode => {
    switch (progressionType) {
      case Constants.PreferenceProgressionTypeEnum.XP:
        return (
          <>
            <Header>XP Advancement</Header>
            <div className="change-preference-content">
              <p>
                Are you sure you want to change your advancement method to XP
                progression?
              </p>
              <p>
                You will begin with the base XP value for your current level.
              </p>
            </div>
          </>
        );

      case Constants.PreferenceProgressionTypeEnum.MILESTONE:
        return (
          <>
            <Header>Milestone Advancement</Header>
            <div className="change-preference-content">
              <p>
                Are you sure you want to change your advancement method to
                Milestone progression?
              </p>
              <p>Your current XP values will be lost.</p>
            </div>
          </>
        );
    }

    return null;
  };

  if (progressionType === null) {
    return <PaneInitFailureContent />;
  }

  return (
    <div className="ct-preferences-pane">
      {renderContent()}
      <div className="ct-preferences-pane__actions">
        <div className="ct-preferences-pane__action">
          <Button sizes="solid" size="x-small" themed onClick={handleConfirm}>
            Accept
          </Button>
        </div>
        <div className="ct-preferences-pane__action">
          <Button
            variant="outline"
            size="x-small"
            themed
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
