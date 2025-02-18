import { ComponentType, FC, HTMLAttributes, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  LightLinkOutSvg,
  ThemedBackdropSvg,
  ThemedBuilderSvg,
  ThemedExportSvg,
  ThemedFrameSvg,
  ThemedLongRestSvg,
  ThemedManageLevelSvg,
  ThemedManageXpSvg,
  ThemedPortraitSvg,
  ThemedPreferencesSvg,
  ThemedShareSvg,
  ThemedShortRestSvg,
  ThemedThemeIconSvg,
  ThemedChatBubbleSvg,
  FeatureFlagContext,
} from "../../character-components/es";
import D6 from "../../fontawesome-cache/svgs/regular/dice-d6.svg";

import { Button } from "~/components/Button";
import config from "~/config";
import {
  PreferencePrivacyTypeEnum,
  PreferenceProgressionTypeEnum,
} from "~/constants";
import { useSidebar } from "~/contexts/Sidebar";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { sheetAppSelectors } from "~/tools/js/CharacterSheet/selectors";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";
import { CharacterStatusSlug } from "~/types";

import {
  PaneMenu,
  PaneMenuGroup,
  PaneMenuItem,
} from "../../components/PaneMenu";
import { PaneComponentEnum } from "../../types";
import { Overview } from "./Overview";
import styles from "./styles.module.css";

const BASE_PATHNAME = config.basePathname;

interface CharacterManagePaneProps extends HTMLAttributes<HTMLDivElement> {}

export const CharacterManagePane: FC<CharacterManagePaneProps> = ({
  ...props
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const builderUrl = useSelector(sheetAppSelectors.getBuilderUrl);

  const {
    preferences,
    decorationInfo,
    helperUtils,
    decorationUtils,
    characterStatusSlug: characterStatus,
    characterTheme,
  } = useCharacterEngine();

  const {
    pane: { paneHistoryPush },
  } = useSidebar();

  const handleXpMenuClick = (): void => {
    paneHistoryPush(PaneComponentEnum.XP);
  };

  const handleGameLogMenuClick = (): void => {
    paneHistoryPush(PaneComponentEnum.GAME_LOG);
  };

  const handleShortRestMenuClick = (): void => {
    paneHistoryPush(PaneComponentEnum.SHORT_REST);
  };

  const handleLongRestMenuClick = (): void => {
    paneHistoryPush(PaneComponentEnum.LONG_REST);
  };

  const handlePreferencesMenuClick = (): void => {
    paneHistoryPush(PaneComponentEnum.PREFERENCES);
  };

  const handleShareMenuClick = (): void => {
    paneHistoryPush(PaneComponentEnum.SHARE_URL);
  };

  const handlePdfClick = (): void => {
    paneHistoryPush(PaneComponentEnum.EXPORT_PDF);
  };

  const handleBuilderClick = (): void => {
    navigate(builderUrl);
  };

  //USE A LOOKUP TO GET EACH MENU ICON
  const getMenuIconNode = (menuKey: string): ReactNode => {
    const menuIconLookup: Record<string, ComponentType> = {
      builder: ThemedBuilderSvg,
      shortrest: ThemedShortRestSvg,
      longrest: ThemedLongRestSvg,
      share: ThemedShareSvg,
      managelevel: ThemedManageLevelSvg,
      managexp: ThemedManageXpSvg,
      gamelog: ThemedChatBubbleSvg,
      frame: ThemedFrameSvg,
      backdrop: ThemedBackdropSvg,
      theme: ThemedThemeIconSvg,
      portrait: ThemedPortraitSvg,
      preferences: ThemedPreferencesSvg,
      downloadpdf: ThemedExportSvg,
    };

    const IconNode: ComponentType<any> | null =
      menuIconLookup[menuKey] &&
      helperUtils.lookupDataOrFallback(menuIconLookup, menuKey);

    if (IconNode === null) {
      return null;
    }

    if (menuKey === "gamelog") {
      return (
        <D6
          className="ddbc-svg ddbc-svg--themed"
          style={{ fill: characterTheme.themeColor }}
        />
      );
    }

    return (
      <IconNode theme={decorationUtils.getCharacterTheme(decorationInfo)} />
    );
  };

  return (
    <div
      className={styles.characterManagePane}
      data-testid="character-manage-pane"
      {...props}
    >
      <Overview />
      {/* Display Readonly CTA or MENU */}
      {isReadonly ? (
        <div className={styles.readonlyBackground}>
          <div className={styles.readonlyContent}>
            <div>
              You are viewing a{" "}
              {characterStatus === CharacterStatusSlug.PREMADE
                ? "premade"
                : "read-only"}{" "}
              Character Sheet.
            </div>
            <Button
              className={styles.createCTA}
              size="medium"
              variant="solid"
              target="_blank"
              themed
              href={`${BASE_PATHNAME}/builder`}
              forceThemeMode="dark"
            >
              <span>Create a Character</span>
              <LightLinkOutSvg />
            </Button>
          </div>
        </div>
      ) : (
        <PaneMenu>
          <PaneMenuGroup label="My Character">
            <PaneMenuItem
              menukey="builder"
              prefixIcon={getMenuIconNode("builder")}
              suffixIcon={<LightLinkOutSvg />}
              onClick={handleBuilderClick}
            >
              Manage Character & Levels
            </PaneMenuItem>
            {preferences.progressionType ===
              PreferenceProgressionTypeEnum.XP && (
              <PaneMenuItem
                menukey="managexp"
                prefixIcon={getMenuIconNode("managexp")}
                onClick={handleXpMenuClick}
              >
                Manage Experience
              </PaneMenuItem>
            )}
            <PaneMenuItem
              menukey="preferences"
              prefixIcon={getMenuIconNode("preferences")}
              onClick={handlePreferencesMenuClick}
            >
              <FeatureFlagContext.Consumer>
                {({ campaignSettingsFlag }) =>
                  campaignSettingsFlag
                    ? "Character Options"
                    : "Character Settings"
                }
              </FeatureFlagContext.Consumer>
            </PaneMenuItem>
          </PaneMenuGroup>
          <PaneMenuGroup label="Play">
            <PaneMenuItem
              menukey="gamelog"
              prefixIcon={getMenuIconNode("gamelog")}
              onClick={handleGameLogMenuClick}
            >
              Game Log
            </PaneMenuItem>
            <PaneMenuItem
              menukey="shortrest"
              prefixIcon={getMenuIconNode("shortrest")}
              onClick={handleShortRestMenuClick}
            >
              Short Rest
            </PaneMenuItem>
            <PaneMenuItem
              menukey="longrest"
              prefixIcon={getMenuIconNode("longrest")}
              onClick={handleLongRestMenuClick}
            >
              Long Rest
            </PaneMenuItem>
          </PaneMenuGroup>
          <PaneMenuGroup label="Share">
            {preferences.privacyType === PreferencePrivacyTypeEnum.PUBLIC && (
              <PaneMenuItem
                menukey="share"
                prefixIcon={getMenuIconNode("share")}
                onClick={handleShareMenuClick}
              >
                Shareable Link
              </PaneMenuItem>
            )}
            <PaneMenuItem
              menukey="downloadpdf"
              prefixIcon={getMenuIconNode("downloadpdf")}
              onClick={handlePdfClick}
            >
              Export to PDF
            </PaneMenuItem>
          </PaneMenuGroup>
        </PaneMenu>
      )}
    </div>
  );
};
