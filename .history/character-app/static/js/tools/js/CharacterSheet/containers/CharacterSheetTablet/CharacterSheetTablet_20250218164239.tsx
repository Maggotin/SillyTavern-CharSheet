import { spring, TransitionMotion } from "@serprex/react-motion";
import React, { useContext } from "react";
import { connect } from "react-redux";

import {
  ThemeStyles,
  DarkAbilitiesSvg,
  DarkActionsSvg,
  DarkEquipmentSvg,
  DarkSpellsSvg,
  DarkDescriptionSvg,
  DarkNotesSvg,
  DarkFeaturesSvg,
  DarkExtrasSvg,
  LightAbilitiesSvg,
  LightActionsSvg,
  LightEquipmentSvg,
  LightSpellsSvg,
  LightDescriptionSvg,
  LightNotesSvg,
  LightFeaturesSvg,
  LightExtrasSvg,
} from "@dndbeyond/character-components/es";
import {
  DecorationUtils,
  DecorationInfo,
  rulesEngineSelectors,
} from "../../character-rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { SidebarInfo } from "~/contexts/Sidebar/Sidebar";
import { usePositioning } from "~/hooks/usePositioning";
import { Sidebar } from "~/subApps/sheet/components/Sidebar";
import { SidebarPositionInfo } from "~/subApps/sheet/components/Sidebar/types";
import { SheetContext } from "~/subApps/sheet/contexts/Sheet";
import { MobileSections } from "~/subApps/sheet/types";

import { appEnvSelectors } from "../../../Shared/selectors";
import { AppEnvDimensionsState } from "../../../Shared/stores/typings";
import {
  ComponentCarousel,
  ComponentCarouselItem,
} from "../../components/ComponentCarousel";
import SectionPlaceholder from "../../components/SectionPlaceholder";
import { SheetAppState } from "../../typings";
import BackdropStyles from "../BackdropStyles";
import CharacterHeaderTablet from "../CharacterHeaderTablet";
import ActionsTablet from "../tablet/ActionsTablet";
import CombatTablet from "../tablet/CombatTablet";
import { DescriptionTablet } from "../tablet/DescriptionTablet";
import EquipmentTablet from "../tablet/EquipmentTablet";
import ExtrasTablet from "../tablet/ExtrasTablet";
import FeaturesTablet from "../tablet/FeaturesTablet";
import MainTablet from "../tablet/MainTablet";
import NotesTablet from "../tablet/NotesTablet";
import SpellsTablet from "../tablet/SpellsTablet";

interface Props {
  sidebarPosition: SidebarPositionInfo;
  sidebarInfo: SidebarInfo;
  envDimensions: AppEnvDimensionsState;
  decorationInfo: DecorationInfo;
  hasSpells: boolean;
  isReadonly: boolean;
  mobileActiveSectionId: MobileSections;
  setMobileActiveSectionId: (id: MobileSections) => void;
}
interface State {
  swipedAmount: number;
}
class CharacterSheetTablet extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      swipedAmount: 0,
    };
  }

  handleComponentChange = (id: MobileSections): void => {
    const { setMobileActiveSectionId } = this.props;
    setMobileActiveSectionId(id);
    window.scrollTo(0, 0);
  };

  handleItemChange = (newKey: MobileSections, oldKey: MobileSections): void => {
    if (newKey !== oldKey) {
      window.scrollTo(0, 0);
    }

    const { setMobileActiveSectionId } = this.props;
    setMobileActiveSectionId(newKey);
  };

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

  renderSections = (activeSectionId: MobileSections): React.ReactNode => {
    const { envDimensions, hasSpells, isReadonly, decorationInfo } = this.props;

    const isDarkMode = DecorationUtils.isDarkMode(decorationInfo);

    return (
      <ComponentCarousel
        activeItemKey={activeSectionId}
        onItemChange={this.handleItemChange}
        envDimensions={envDimensions}
        changingWaitTime={750}
      >
        <ComponentCarouselItem
          itemKey="main"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Abilities, Saves, Senses",
            IconComponent: isDarkMode ? LightAbilitiesSvg : DarkAbilitiesSvg,
          }}
          ContentComponent={MainTablet}
        />
        <ComponentCarouselItem
          itemKey="actions"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Actions",
            IconComponent: isDarkMode ? LightActionsSvg : DarkActionsSvg,
          }}
          ContentComponent={ActionsTablet}
        />
        <ComponentCarouselItem
          itemKey="equipment"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Equipment",
            IconComponent: isDarkMode ? LightEquipmentSvg : DarkEquipmentSvg,
          }}
          ContentComponent={EquipmentTablet}
        />
        <ComponentCarouselItem
          itemKey="spells"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Spells",
            IconComponent: isDarkMode ? LightSpellsSvg : DarkSpellsSvg,
          }}
          ContentComponent={SpellsTablet}
          isEnabled={hasSpells}
        />
        <ComponentCarouselItem
          itemKey="features_traits"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Features & Traits",
            IconComponent: isDarkMode ? LightFeaturesSvg : DarkFeaturesSvg,
          }}
          ContentComponent={FeaturesTablet}
        />
        <ComponentCarouselItem
          itemKey="description"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Description",
            IconComponent: isDarkMode
              ? LightDescriptionSvg
              : DarkDescriptionSvg,
          }}
          ContentComponent={DescriptionTablet}
          isEnabled={!isReadonly}
        />
        <ComponentCarouselItem
          itemKey="notes"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Notes",
            IconComponent: isDarkMode ? LightNotesSvg : DarkNotesSvg,
          }}
          ContentComponent={NotesTablet}
          isEnabled={!isReadonly}
        />
        <ComponentCarouselItem
          itemKey="extras"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Extras",
            IconComponent: isDarkMode ? LightExtrasSvg : DarkExtrasSvg,
          }}
          ContentComponent={ExtrasTablet}
          isEnabled={!isReadonly}
        />
      </ComponentCarousel>
    );
  };

  renderSidebar = (): React.ReactNode => {
    const { swipedAmount } = this.state;
    const { sidebarPosition } = this.props;

    return (
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
            ))}
          </React.Fragment>
        )}
      </TransitionMotion>
    );
  };

  render() {
    const { decorationInfo } = this.props;

    return (
      <SheetContext.Consumer>
        {({ mobileActiveSectionId }) => (
          <div className="ct-character-sheet-tablet">
            <CharacterHeaderTablet />
            <CombatTablet />
            {this.renderSections(mobileActiveSectionId)}
            {this.renderSidebar()}
            <ThemeStyles decorationInfo={decorationInfo} />
            <BackdropStyles
              backdrop={DecorationUtils.getBackdropInfo(decorationInfo)}
            />
          </div>
        )}
      </SheetContext.Consumer>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    decorationInfo: rulesEngineSelectors.getDecorationInfo(state),
    hasSpells: rulesEngineSelectors.hasSpells(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    envDimensions: appEnvSelectors.getDimensions(state),
  };
}

const CharacterSheetTabletContainer = (props) => {
  const { mobileActiveSectionId, setMobileActiveSectionId } =
    useContext(SheetContext);
  const { sidebar } = useSidebar();
  const { getSidebarPositioning } = usePositioning();

  return (
    <CharacterSheetTablet
      mobileActiveSectionId={mobileActiveSectionId}
      setMobileActiveSectionId={setMobileActiveSectionId}
      sidebarInfo={sidebar}
      sidebarPosition={getSidebarPositioning()}
      {...props}
    />
  );
};

export default connect(mapStateToProps)(CharacterSheetTabletContainer);
