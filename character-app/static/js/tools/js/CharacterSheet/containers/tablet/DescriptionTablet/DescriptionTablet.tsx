import { visuallyHidden } from "@mui/utils";
import { FC } from "react";

import { useCharacterEngine } from "~/hooks/useCharacterEngine";

import SubsectionTablet from "../../../components/SubsectionTablet";
import TabletBox from "../../../components/TabletBox";
import Description from "../../Description";

export const DescriptionTablet: FC = () => {
  const { characterTheme } = useCharacterEngine();

  return (
    <SubsectionTablet>
      <TabletBox
        header={"Background"}
        className="ct-description-tablet"
        theme={characterTheme}
      >
        <section>
          <h2 style={visuallyHidden}>Background</h2>
          <Description theme={characterTheme} />
        </section>
      </TabletBox>
    </SubsectionTablet>
  );
};
