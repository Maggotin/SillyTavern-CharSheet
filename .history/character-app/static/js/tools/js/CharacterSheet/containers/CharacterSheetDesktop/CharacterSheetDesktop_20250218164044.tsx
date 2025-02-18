import { spring, TransitionMotion } from "@serprex/react-motion";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import { ThemeStyles } from "@dndbeyond/character-components/es";
import {
  rulesEngineSelectors,
  DecorationInfo,
  DecorationUtils,
} from "../../rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { SidebarInfo } from "~/contexts/Sidebar/Sidebar";
import { usePositioning } from "~/hooks/usePositioning";
import { Sidebar } from "~/subApps/sheet/components/Sidebar";
import { SidebarPositionInfo } from "~/subApps/sheet/components/Sidebar/types";

import { appEnvSelectors } from "../../../Shared/selectors";
import { AppEnvDimensionsState } from "../../../Shared/stores/typings";
import Subsections from "../../components/Subsections";
import { DESKTOP_LARGE_COMPONENT_START_WIDTH } from "../../config";
import { SheetAppState } from "../../typings";
import BackdropStyles from "../BackdropStyles";
import { CharacterHeaderDesktop } from "../CharacterHeaderDesktop";
import Combat from "../Combat";
import PrimaryBox from "../PrimaryBox";
import ProficiencyGroupsDesktop from "../ProficiencyGroupsDesktop";
import QuickInfo from "../QuickInfo";
import SavingThrowsDesktop from "../SavingThrowsDesktop";
import SensesDesktop from "../SensesDesktop";
import SkillsDesktop from "../SkillsDesktop";

interface Props extends DispatchProp {
  sidebarInfo: SidebarInfo;
  sidebarPosition: SidebarPositionInfo;
  decorationInfo: DecorationInfo;
  envDimensions: AppEnvDimensionsState;
}
interface State {
  swipedAmount: number;
}

class CharacterSheetDesktop extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      swipedAmount: 0,
    };
  }

  getPositionX = (swipedAmount: number): number => {
    const { sidebarInfo } = this.props;

    let position: number =
      (sidebarInfo.isVisible ? 0 : sidebarInfo.width) + swipedAmount;

    if (swipedAmount > 0) {
      return Math.min(sidebarInfo.width, position);
    } else {
      return Math.max(0, position);
    }
  };

  renderContent = (): React.ReactNode => {
    return (
      <React.Fragment>
        <CharacterHeaderDesktop />
        <QuickInfo />
        <Subsections>
          <SavingThrowsDesktop />
          <SensesDesktop />
          <ProficiencyGroupsDesktop />
          <SkillsDesktop />
          <Combat />
          <PrimaryBox />
        </Subsections>
      </React.Fragment>
    );
  };

  renderSmall = (): React.ReactNode => {
    const { swipedAmount } = this.state;
    const { sidebarPosition } = this.props;

    return (
      <div className="ct-character-sheet-desktop">
        {this.renderContent()}
        <TransitionMotion
          styles={[
            {
              key: "1",
              style: {
                transform: spring(this.getPositionX(swipedAmount), {
                  stiffness: 400,
                  damping: 30,
                }),
              },
            },
          ]}
        >
          {(interpolatedStyles) => (
            <React.Fragment>
              {interpolatedStyles.map((config) => (
                <>
                  <Sidebar
                    key={config.key}
                    style={{
                      ...sidebarPosition,
                      transform: `translateX(${config.style.transform}px)`,
                    }}
                    setSwipedAmount={(swipedAmount) =>
                      this.setState({ swipedAmount })
                    }
                  />
                </>
              ))}
            </React.Fragment>
          )}
        </TransitionMotion>
      </div>
    );
  };

  renderLarge = (): React.ReactNode => {
    const { sidebarPosition } = this.props;

    return (
      <div className="ct-character-sheet-desktop">
        {this.renderContent()}
        <Sidebar style={sidebarPosition} />
      </div>
    );
  };

  renderSheet = (): React.ReactNode => {
    const { envDimensions } = this.props;

    if (envDimensions.window.width < DESKTOP_LARGE_COMPONENT_START_WIDTH) {
      return this.renderSmall();
    }

    return this.renderLarge();
  };

  render() {
    const { decorationInfo } = this.props;

    return (
      <React.Fragment>
        {this.renderSheet()}
        <BackdropStyles
          backdrop={DecorationUtils.getBackdropInfo(decorationInfo)}
        />
        <ThemeStyles decorationInfo={decorationInfo} />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    decorationInfo: rulesEngineSelectors.getDecorationInfo(state),
    envDimensions: appEnvSelectors.getDimensions(state),
  };
}

const CharacterSheetContainer = (props) => {
  const { sidebar } = useSidebar();
  const { getSidebarPositioning } = usePositioning();

  return (
    <CharacterSheetDesktop
      sidebarInfo={sidebar}
      sidebarPosition={getSidebarPositioning()}
      {...props}
    />
  );
};

export default connect(mapStateToProps)(CharacterSheetContainer);
