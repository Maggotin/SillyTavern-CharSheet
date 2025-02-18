import React, { FC } from "react";
import { useDispatch } from "react-redux";

import {
  Constants,
  characterActions,
} from "../../rules-engine/es";

import { Button } from "~/components/Button";
import { useSidebar } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { PaneInitFailureContent } from "~/subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import {
  PaneComponentEnum,
  PaneIdentifiersPreferenceHitPointConfirm,
} from "~/subApps/sheet/components/Sidebar/types";

interface Props {
  identifiers: PaneIdentifiersPreferenceHitPointConfirm | null;
}

export const PreferencesHitPointConfirmPane: FC<Props> = ({ identifiers }) => {
  const dispatch = useDispatch();
  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  const hitPointType = identifiers?.id ?? null;

  const handleConfirm = (): void => {
    dispatch(characterActions.preferenceChoose("hitPointType", hitPointType));
    paneHistoryStart(PaneComponentEnum.PREFERENCES);
  };

  const handleCancel = (): void => {
    paneHistoryStart(PaneComponentEnum.PREFERENCES);
  };

  const renderContent = (): React.ReactNode => {
    switch (hitPointType) {
      case Constants.PreferenceHitPointTypeEnum.FIXED:
        return (
          <React.Fragment>
            <Header>Fixed Hit Points</Header>
            <div className="change-preference-content">
              <p>
                Are you sure you want to change your hit points to the fixed
                value?
              </p>
              <p>Any rolled hit point totals will be lost.</p>
            </div>
          </React.Fragment>
        );

      case Constants.PreferenceHitPointTypeEnum.MANUAL:
        return (
          <React.Fragment>
            <Header>Manual Hit Points</Header>
            <div className="change-preference-content">
              <p>
                Are you sure you want to change your hit points to manual entry?
              </p>
              <p>
                After doing so, use Manage HP in the Class section to enter your
                rolled values.
              </p>
            </div>
          </React.Fragment>
        );
    }

    return null;
  };

  if (hitPointType === null) {
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
