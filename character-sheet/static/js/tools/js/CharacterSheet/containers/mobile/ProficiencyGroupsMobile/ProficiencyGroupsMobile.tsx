import { visuallyHidden } from "@mui/utils";
import { FC } from "react";
import { useSelector } from "react-redux";

import { useSidebar } from "~/contexts/Sidebar";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { appEnvSelectors } from "../../../../Shared/selectors";
import MobileDivider from "../../../components/MobileDivider";
import ProficiencyGroups from "../../../components/ProficiencyGroups";
import SubsectionMobile from "../../../components/SubsectionMobile";

interface Props {}
export const ProficiencyGroupsMobile: FC<Props> = () => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  const { proficiencyGroups, characterTheme } = useCharacterEngine();
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);

  const handleManageShow = (): void => {
    if (!isReadonly) {
      paneHistoryStart(PaneComponentEnum.PROFICIENCIES);
    }
  };

  return (
    <SubsectionMobile name="Proficiency Groups">
      <MobileDivider
        label={"Proficiencies & Training"}
        onClick={handleManageShow}
        isReadonly={isReadonly}
        theme={characterTheme}
      />
      <section className="ct-proficiency-groups-mobile">
        <h2 style={visuallyHidden}>Proficiencies and Training</h2>
        <ProficiencyGroups
          proficiencyGroups={proficiencyGroups}
          onClick={handleManageShow}
        />
      </section>
      <MobileDivider isEnd={true} theme={characterTheme} />
    </SubsectionMobile>
  );
};
