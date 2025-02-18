import { spring, TransitionMotion } from "@serprex/react-motion";
import React, { useContext } from "react";
import { connect } from "react-redux";

import {
  ThemeStyles,
  DarkAbilitiesSvg,
  DarkActionsSvg,
  DarkSkillsSvg,
  DarkEquipmentSvg,
  DarkSpellsSvg,
  DarkProficienciesSvg,
  DarkDescriptionSvg,
  DarkNotesSvg,
  DarkFeaturesSvg,
  DarkExtrasSvg,
  LightAbilitiesSvg,
  LightActionsSvg,
  LightSkillsSvg,
  LightEquipmentSvg,
  LightSpellsSvg,
  LightProficienciesSvg,
  LightDescriptionSvg,
  LightNotesSvg,
  LightFeaturesSvg,
  LightExtrasSvg,
} from "@dndbeyond/character-components/es";
import {
  rulesEngineSelectors,
  DecorationInfo,
  DecorationUtils,
} from "@dndbeyond/character-rules-engine/es";

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
import CharacterHeaderMobile from "../CharacterHeaderMobile";
import ActionsMobile from "../mobile/ActionsMobile";
import CombatMobile from "../mobile/CombatMobile";
import { DescriptionMobile } from "../mobile/DescriptionMobile";
import EquipmentMobile from "../mobile/EquipmentMobile";
import ExtrasMobile from "../mobile/ExtrasMobile";
import FeaturesMobile from "../mobile/FeaturesMobile";
import MainMobile from "../mobile/MainMobile";
import NotesMobile from "../mobile/NotesMobile";
import { ProficiencyGroupsMobile } from "../mobile/ProficiencyGroupsMobile";
import SkillsMobile from "../mobile/SkillsMobile";
import SpellsMobile from "../mobile/SpellsMobile";

interface Props {
  sidebarInfo: SidebarInfo;
  sidebarPosition: SidebarPositionInfo;
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
class CharacterSheetMobile extends React.PureComponent<Props, State> {
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
      >
        <ComponentCarouselItem
          itemKey="main"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Abilities, Saves, Senses",
            IconComponent: isDarkMode ? LightAbilitiesSvg : DarkAbilitiesSvg,
          }}
          ContentComponent={MainMobile}
        />
        <ComponentCarouselItem
          itemKey="skills"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Skills",
            IconComponent: isDarkMode ? LightSkillsSvg : DarkSkillsSvg,
          }}
          ContentComponent={SkillsMobile}
        />
        <ComponentCarouselItem
          itemKey="actions"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Actions",
            IconComponent: isDarkMode ? LightActionsSvg : DarkActionsSvg,
          }}
          ContentComponent={ActionsMobile}
        />
        <ComponentCarouselItem
          itemKey="equipment"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Inventory",
            IconComponent: isDarkMode ? LightEquipmentSvg : DarkEquipmentSvg,
          }}
          ContentComponent={EquipmentMobile}
        />
        <ComponentCarouselItem
          itemKey="spells"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Spells",
            IconComponent: isDarkMode ? LightSpellsSvg : DarkSpellsSvg,
          }}
          ContentComponent={SpellsMobile}
          isEnabled={hasSpells}
        />
        <ComponentCarouselItem
          itemKey="features_traits"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Features & Traits",
            IconComponent: isDarkMode ? LightFeaturesSvg : DarkFeaturesSvg,
          }}
          ContentComponent={FeaturesMobile}
        />
        <ComponentCarouselItem
          itemKey="proficiencies"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Proficiencies & Training",
            IconComponent: isDarkMode
              ? LightProficienciesSvg
              : DarkProficienciesSvg,
          }}
          ContentComponent={ProficiencyGroupsMobile}
        />
        <ComponentCarouselItem
          itemKey="description"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Background",
            IconComponent: isDarkMode
              ? LightDescriptionSvg
              : DarkDescriptionSvg,
          }}
          ContentComponent={DescriptionMobile}
          isEnabled={!isReadonly}
        />
        <ComponentCarouselItem
          itemKey="notes"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Notes",
            IconComponent: isDarkMode ? LightNotesSvg : DarkNotesSvg,
          }}
          ContentComponent={NotesMobile}
          isEnabled={!isReadonly}
        />
        <ComponentCarouselItem
          itemKey="extras"
          PlaceholderComponent={SectionPlaceholder}
          placeholderProps={{
            name: "Extras",
            IconComponent: isDarkMode ? LightExtrasSvg : DarkExtrasSvg,
          }}
          ContentComponent={ExtrasMobile}
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
          <div
            className={`ct-character-sheet-mobile ${
              DecorationUtils.isDarkMode(decorationInfo)
                ? "ct-character-sheet-mobile--dark-mode"
                : ""
            }`}
          >
            <div className="ct-character-sheet-mobile__header">
              <CharacterHeaderMobile />
              <CombatMobile />
            </div>
            {this.renderSections(mobileActiveSectionId)}
            {this.renderSidebar()}
            <ThemeStyles decorationInfo={decorationInfo} />
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

const CharacterSheetMobileContainer = (props) => {
  const { mobileActiveSectionId, setMobileActiveSectionId } =
    useContext(SheetContext);
  const { sidebar } = useSidebar();
  const { getSidebarPositioning } = usePositioning();

  return (
    <CharacterSheetMobile
      mobileActiveSectionId={mobileActiveSectionId}
      setMobileActiveSectionId={setMobileActiveSectionId}
      sidebarInfo={sidebar}
      sidebarPosition={getSidebarPositioning()}
      {...props}
    />
  );
};

export default connect(mapStateToProps)(CharacterSheetMobileContainer);
