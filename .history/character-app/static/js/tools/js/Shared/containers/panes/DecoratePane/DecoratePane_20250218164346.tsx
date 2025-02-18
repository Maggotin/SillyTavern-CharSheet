import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AbilitySummary,
  CharacterAvatar,
  CharacterAvatarPortrait,
  Collapsible,
  CollapsibleHeaderContent,
  LightLongRestSvg,
} from "../../character-components/es";
import {
  characterActions,
  DecorationUtils,
  rulesEngineSelectors,
} from "../../character-rules-engine/es";
import { Dice } from "../../dice";

import { useAbilities } from "~/hooks/useAbilities";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";

import { appEnvActions } from "../../../actions/appEnv";
import CtaPreferenceManager from "../../../components/CtaPreferenceManager";
import { AttributesManagerContext } from "../../../managers/AttributesManagerContext";
import { characterRollContextSelectors } from "../../../selectors";
import * as appEnvSelectors from "../../../selectors/appEnv";
import { BackdropManager } from "./BackdropManager";
import { CurrentDecorationItem } from "./CurrentDecorationItem";
import { FrameManager } from "./FrameManager";
import { PortraitManager } from "./PortraitManager";
import { ThemeManager } from "./ThemeManager";

enum SHOP_KEY {
  NONE = "NONE",
  FRAMES = "FRAMES",
  BACKDROPS = "BACKDROPS",
  PORTRAITS = "PORTRAITS",
  THEMES = "THEMES",
  PREFERENCES = "PREFERENCES",
  DICE = "DICE",
}

export default function DecoratePane() {
  const { attributesManager } = useContext(AttributesManagerContext);
  const abilities = useAbilities();
  const highestAbility = attributesManager.getHighestAbilityScore(abilities);
  const dispatch = useDispatch();
  const decorationInfo = useSelector(rulesEngineSelectors.getDecorationInfo);
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const diceEnabled = useSelector(appEnvSelectors.getDiceEnabled);
  const preferences = useSelector(rulesEngineSelectors.getCharacterPreferences);
  const characterRollContext = useSelector(
    characterRollContextSelectors.getCharacterRollContext
  );
  const [currentShop, setCurrentShop] = useState<SHOP_KEY>(SHOP_KEY.NONE);

  const handleDarkModeToggle = (): void => {
    const { enableDarkMode } = preferences;

    dispatch(
      characterActions.preferenceChoose("enableDarkMode", !enableDarkMode)
    );
  };

  //TODO this is repeated a few times now.. reusable thing? hook?
  const handleDiceToggle = (): void => {
    const newDiceEnabledSetting: boolean = !diceEnabled;

    try {
      localStorage.setItem("dice-enabled", newDiceEnabledSetting.toString());
      Dice.setEnabled(newDiceEnabledSetting);
    } catch (e) {}

    dispatch(
      appEnvActions.dataSet({
        diceEnabled: newDiceEnabledSetting,
      })
    );
  };

  const handleClick = (type: SHOP_KEY): void => {
    setCurrentShop(type);
  };

  const handleCollapseChange = (isCollapsed: boolean, type: SHOP_KEY): void => {
    setCurrentShop(!isCollapsed ? type : SHOP_KEY.NONE);
  };

  const renderPreferences = (): React.ReactNode => {
    const { enableDarkMode } = preferences;

    const headerNode: React.ReactNode = (
      <CollapsibleHeaderContent heading={"Preferences"} />
    );

    return (
      <Collapsible
        header={headerNode}
        layoutType="minimal"
        className="ct-decorate-pane__preferences"
        initiallyCollapsed={false}
      >
        <div className="ct-decorate-pane__preferences-content">
          <CtaPreferenceManager
            preferenceEnabled={enableDarkMode}
            onPreferenceClick={handleDarkModeToggle}
            icon={<LightLongRestSvg />}
            backgroundImageUrl="https://www.dndbeyond.com/avatars/13574/100/637396156849705602.jpeg"
            borderColor="#715280"
            switchColor="#715280"
            preferenceTitle="Underdark Mode"
          />
        </div>
      </Collapsible>
    );
  };

  const renderDecorateShop = (): React.ReactNode => {
    return (
      <div className="ct-decorate-pane__shop">
        <Heading>Browse Decorations</Heading>

        {/*BACKDROPS*/}
        <Collapsible
          header="Backdrops"
          collapsed={currentShop !== SHOP_KEY.BACKDROPS}
          onChangeHandler={(isCollapsed) =>
            handleCollapseChange(isCollapsed, SHOP_KEY.BACKDROPS)
          }
        >
          <BackdropManager />
        </Collapsible>

        {/*FRAMES*/}
        <Collapsible
          header="Frames"
          collapsed={currentShop !== SHOP_KEY.FRAMES}
          onChangeHandler={(isCollapsed) =>
            handleCollapseChange(isCollapsed, SHOP_KEY.FRAMES)
          }
        >
          <FrameManager />
        </Collapsible>

        {/*THEMES*/}
        <Collapsible
          header="Themes"
          collapsed={currentShop !== SHOP_KEY.THEMES}
          onChangeHandler={(isCollapsed) =>
            handleCollapseChange(isCollapsed, SHOP_KEY.THEMES)
          }
        >
          <ThemeManager />
        </Collapsible>

        {/*PORTRAITS*/}
        <Collapsible
          header="Portraits"
          collapsed={currentShop !== SHOP_KEY.PORTRAITS}
          onChangeHandler={(isCollapsed) =>
            handleCollapseChange(isCollapsed, SHOP_KEY.PORTRAITS)
          }
        >
          <PortraitManager />
        </Collapsible>

        {/*DICE*/}
        {/*<Collapsible*/}
        {/*    header="Dice"*/}
        {/*    collapsed={currentShop !== SHOP_KEY.DICE}*/}
        {/*    onChangeHandler={(isCollapsed) => handleCollapseChange(isCollapsed, SHOP_KEY.DICE)}*/}
        {/*>*/}
        {/*    <div>*/}
        {/*        DICE CHOICE FOR THIS CHARACTER??? HOW NICE!!*/}

        {/*        or could we show a picture at least?*/}
        {/*    </div>*/}
        {/*</Collapsible>*/}
      </div>
    );
  };

  const avatarInfo = DecorationUtils.getAvatarInfo(decorationInfo);
  const backdropInfo = DecorationUtils.getBackdropInfo(decorationInfo);
  const characterTheme = DecorationUtils.getCharacterTheme(decorationInfo);

  let avatarClasses: Array<string> = ["ct-decorate-pane__portrait"];
  if (!avatarInfo.avatarUrl) {
    avatarClasses.push("ct-decorate-pane__portrait--none");
  }

  let backdropClasses: Array<string> = ["ct-decorate-pane__backdrop"];
  let backdropStyles: React.CSSProperties = {};
  if (backdropInfo.thumbnailBackdropAvatarUrl) {
    backdropStyles = {
      backgroundImage: `url(${backdropInfo.thumbnailBackdropAvatarUrl})`,
    };
  } else {
    backdropClasses.push("ct-decorate-pane__backdrop--none");
  }

  return (
    <div className="ct-decorate-pane">
      <div className="ct-decorate-pane__current-selections">
        <Header>Current Decorations</Header>
        <div className="ct-decorate-pane__grid">
          <CurrentDecorationItem
            label="Portrait"
            onClick={handleClick}
            decorationKey={SHOP_KEY.PORTRAITS}
            isActive={currentShop === SHOP_KEY.PORTRAITS}
            isReadonly={isReadonly}
          >
            <CharacterAvatarPortrait
              className={avatarClasses.join(" ")}
              avatarUrl={avatarInfo.avatarUrl}
            />
          </CurrentDecorationItem>

          <CurrentDecorationItem
            label="Frame"
            onClick={handleClick}
            decorationKey={SHOP_KEY.FRAMES}
            isActive={currentShop === SHOP_KEY.FRAMES}
            isReadonly={isReadonly}
          >
            <CharacterAvatar avatarInfo={avatarInfo} />
          </CurrentDecorationItem>

          <CurrentDecorationItem
            label="Theme"
            onClick={handleClick}
            decorationKey={SHOP_KEY.THEMES}
            isActive={currentShop === SHOP_KEY.THEMES}
            isReadonly={isReadonly}
          >
            <div className="ct-decorate-pane__theme">
              {highestAbility && (
                <AbilitySummary
                  theme={characterTheme}
                  ability={highestAbility}
                  preferences={preferences}
                  diceEnabled={false}
                  rollContext={characterRollContext}
                />
              )}
              <div className="ct-decorate-pane__theme-color">
                {characterTheme.name}
              </div>
            </div>
          </CurrentDecorationItem>

          <CurrentDecorationItem
            label="Backdrop"
            onClick={handleClick}
            decorationKey={SHOP_KEY.BACKDROPS}
            isActive={currentShop === SHOP_KEY.BACKDROPS}
            isReadonly={isReadonly}
          >
            <div className={backdropClasses.join(" ")} style={backdropStyles} />
          </CurrentDecorationItem>
        </div>
      </div>
      {renderPreferences()}
      {renderDecorateShop()}
    </div>
  );
}
