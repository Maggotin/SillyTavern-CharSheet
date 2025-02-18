import React from "react";
import { connect } from "react-redux";
import SwipeableViews from "react-swipeable-views";

import { FeatureFlagContext } from "@dndbeyond/character-components/es";
import {
  characterSelectors,
  CharacterStatusSlug,
  featureFlagInfoSelectors,
  FormatUtils,
} from "../../rules-engine/es";

import { Link } from "~/components/Link";
import { PremadeCharacterEditStatus } from "~/components/PremadeCharacterEditStatus";

import { appEnvSelectors } from "../../../Shared/selectors";
import { MobileMessengerUtils } from "../../../Shared/utils";
import { navigationConfig } from "../../config";
import { builderEnvSelectors, builderSelectors } from "../../selectors";
import { BuilderAppState } from "../../typings";
import HelpTextManager from "../HelpTextManager";

interface Props {
  characterId: number | null;
  builderMethod: string | null;
  sections: Array<any>;
  firstAvailableSectionRoutes: any;
  isCharacterSheetReady: boolean;
  characterSheetUrl: string;
  activeSectionIdx: number;
  isMobile: boolean;
  characterStatus: CharacterStatusSlug | null;
  isReadonly: boolean;
}
class NavigationSections extends React.PureComponent<Props> {
  handleSheetShowClick = () => {
    const { characterId } = this.props;

    if (characterId !== null) {
      MobileMessengerUtils.sendMessage(
        MobileMessengerUtils.createShowCharacterSheetMessage(characterId)
      );
    }
  };

  renderNonMobileUi = (): React.ReactNode => {
    const {
      characterId,
      sections,
      firstAvailableSectionRoutes,
      isCharacterSheetReady,
      characterSheetUrl,
    } = this.props;

    let classNames: Array<string> = ["builder-sections-sheet"];
    if (isCharacterSheetReady) {
      classNames.push("builder-sections-sheet-ready");
    } else {
      classNames.push("builder-sections-sheet-disabled");
    }

    return (
      <div className="builder-sections builder-sections-large">
        <HelpTextManager />
        <div className={classNames.join(" ")}>
          {isCharacterSheetReady ? (
            <Link
              className="builder-sections-sheet-icon"
              href={characterSheetUrl}
              onClick={this.handleSheetShowClick}
              useRouter
            />
          ) : (
            <div className="builder-sections-sheet-icon" />
          )}
        </div>
        <div className="builder-sections-large-routes">
          {sections.map((section) => {
            const firstRoute = firstAvailableSectionRoutes[section.key];
            let clsNames: Array<string> = [
              "builder-sections-link",
              `builder-sections-${FormatUtils.slugify(section.key)}`,
            ];
            if (section.active) {
              clsNames.push("builder-sections-link-active");
            }
            return (
              <div className="builder-sections-view" key={section.key}>
                <Link
                  href={firstRoute.path.replace(":characterId", characterId)}
                  className={clsNames.join(" ")}
                  useRouter
                >
                  <FeatureFlagContext.Consumer>
                    {(featureFlags) => section.getLabel(featureFlags)}
                  </FeatureFlagContext.Consumer>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  renderMobileUi = (): React.ReactNode => {
    const {
      characterId,
      sections,
      firstAvailableSectionRoutes,
      activeSectionIdx,
      isCharacterSheetReady,
      characterSheetUrl,
    } = this.props;

    const scrollbarStyles: React.CSSProperties = {
      padding: "0 37.5%",
    };

    let classNames = ["builder-sections-sheet"];
    if (isCharacterSheetReady) {
      classNames.push("builder-sections-sheet-ready");
    } else {
      classNames.push("builder-sections-sheet-disabled");
    }

    return (
      <div className="builder-sections builder-sections-small">
        <HelpTextManager />
        <div className={classNames.join(" ")}>
          {isCharacterSheetReady ? (
            <Link
              className="builder-sections-sheet-icon"
              href={characterSheetUrl}
              onClick={this.handleSheetShowClick}
              useRouter
            />
          ) : (
            <div className="builder-sections-sheet-icon" />
          )}
        </div>
        <SwipeableViews
          index={activeSectionIdx}
          style={scrollbarStyles}
          className="builder-sections-views"
          ignoreNativeScroll={true}
        >
          {sections.map((section) => {
            const firstRoute = firstAvailableSectionRoutes[section.key];
            let clsNames: Array<string> = [
              "builder-sections-link",
              `builder-sections-${FormatUtils.slugify(section.key)}`,
            ];
            if (section.active) {
              clsNames.push("builder-sections-link-active");
            }
            return (
              <div className="builder-sections-view" key={section.key}>
                <Link
                  href={firstRoute.path.replace(":characterId", characterId)}
                  className={clsNames.join(" ")}
                  useRouter
                >
                  <FeatureFlagContext.Consumer>
                    {(featureFlags) => section.getLabel(featureFlags)}
                  </FeatureFlagContext.Consumer>
                </Link>
              </div>
            );
          })}
        </SwipeableViews>
      </div>
    );
  };

  render() {
    const { builderMethod, isMobile, characterStatus, isReadonly } = this.props;

    if (builderMethod === null) {
      return null;
    }

    return isMobile ? (
      <>
        {this.renderMobileUi()}
        <PremadeCharacterEditStatus
          characterStatus={characterStatus}
          isReadonly={isReadonly}
          isBuilderView
        />
      </>
    ) : (
      <>
        {this.renderNonMobileUi()}
        <PremadeCharacterEditStatus
          characterStatus={characterStatus}
          isReadonly={isReadonly}
          isBuilderView
        />
      </>
    );
  }
}

function mapStateToProps(state: BuilderAppState, ownProps) {
  const currentPath = ownProps.pathname;
  const sections = navigationConfig.getNavigationSections(
    builderSelectors.getBuilderMethod(state),
    navigationConfig.getCurrentRouteDef(currentPath),
    featureFlagInfoSelectors.getFeatureFlagInfo(state)
  );

  let activeSectionIdx: number = 0;
  sections.forEach((section, idx) => {
    if (section.active) {
      activeSectionIdx = idx;
    }
  });

  return {
    sections,
    firstAvailableSectionRoutes:
      builderSelectors.getFirstAvailableSectionRoutes(state),
    isCharacterSheetReady: builderSelectors.checkIsCharacterSheetReady(state),
    characterSheetUrl: builderEnvSelectors.getCharacterSheetUrl(state),
    builderMethod: builderSelectors.getBuilderMethod(state),
    activeSectionIdx,
    isMobile: appEnvSelectors.getIsMobile(state),
    characterStatus: characterSelectors.getStatusSlug(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
  };
}

export default connect(mapStateToProps)(NavigationSections);
