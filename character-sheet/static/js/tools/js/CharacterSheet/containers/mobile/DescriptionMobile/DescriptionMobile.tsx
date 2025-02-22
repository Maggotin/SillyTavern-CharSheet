import { visuallyHidden } from "@mui/utils";
import { FC } from "react";

import { useCharacterEngine } from "~/hooks/useCharacterEngine";

import MobileDivider from "../../../components/MobileDivider";
import SubsectionMobile from "../../../components/SubsectionMobile";
import Description from "../../Description";

export const DescriptionMobile: FC = () => {
  const { characterTheme } = useCharacterEngine();
  return (
    <SubsectionMobile className="ct-description-mobile">
      <MobileDivider label={"Background"} theme={characterTheme} />
      <section>
        <h2 style={visuallyHidden}>Background</h2>
        <Description theme={characterTheme} isVertical={true} />
      </section>
      <MobileDivider isEnd={true} theme={characterTheme} />
    </SubsectionMobile>
  );
};
