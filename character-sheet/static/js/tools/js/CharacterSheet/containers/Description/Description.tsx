import { visuallyHidden } from "@mui/utils";
import clsx from "clsx";
import React, { useContext } from "react";
import { connect, DispatchProp } from "react-redux";

import {
  AlignmentContract,
  Background,
  CharacterTraits,
  Constants,
  SizeContract,
  rulesEngineSelectors,
  CharacterTheme,
  CharacterFeaturesManager,
  SnippetData,
  RuleData,
  AbilityLookup,
  DataOriginRefData,
  FeatManager,
  Action,
  ActionUtils,
  Spell,
  SpellUtils,
} from "@dndbeyond/character-rules-engine/es";

import { InfoItem } from "~/components/InfoItem";
import { NumberDisplay } from "~/components/NumberDisplay";
import { TabFilter } from "~/components/TabFilter";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";
import { CharacterFeaturesManagerContext } from "~/tools/js/Shared/managers/CharacterFeaturesManagerContext";

import {
  handleActionUseSet,
  handleSpellUseSet,
} from "../../../../../handlers/commonHandlers";
import { appEnvSelectors } from "../../../Shared/selectors";
import { PaneIdentifierUtils } from "../../../Shared/utils";
import BackgroundDetail from "../../components/BackgroundDetail";
import ContentGroup from "../../components/ContentGroup";
import TraitContent from "../../components/TraitContent";
import { SheetAppState } from "../../typings";
import styles from "./styles.module.css";

const DEFAULT_VALUE = "--";

interface Props extends DispatchProp {
  isVertical: boolean;
  background: Background | null;
  alignment: AlignmentContract | null;
  height: string | null;
  weight: number | null;
  size: SizeContract | null;
  faith: string | null;
  skin: string | null;
  eyes: string | null;
  hair: string | null;
  age: number | null;
  gender: string | null;
  traits: CharacterTraits;
  isReadonly: boolean;
  theme: CharacterTheme;
  characterFeaturesManager: CharacterFeaturesManager;
  snippetData: SnippetData;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  dataOriginRefData: DataOriginRefData;
  proficiencyBonus: number;
  paneContext: PaneInfo;
}
class Description extends React.PureComponent<Props> {
  static defaultProps = {
    isVertical: false,
  };

  handlePhysicalCharacteristicsClick = (): void => {
    const {
      paneContext: { paneHistoryStart },
      isReadonly,
    } = this.props;

    if (!isReadonly) {
      paneHistoryStart(PaneComponentEnum.DESCRIPTION);
    }
  };

  handleBackgroundClick = (): void => {
    const {
      paneContext: { paneHistoryStart },
    } = this.props;

    paneHistoryStart(PaneComponentEnum.BACKGROUND);
  };

  handleFeatClick = (feat: FeatManager): void => {
    const {
      paneContext: { paneHistoryStart },
    } = this.props;

    paneHistoryStart(
      PaneComponentEnum.FEAT_DETAIL,
      PaneIdentifierUtils.generateFeat(feat.getId())
    );
  };

  handleTraitShow = (key: Constants.TraitTypeEnum): void => {
    const {
      paneContext: { paneHistoryStart },
      isReadonly,
    } = this.props;

    if (!isReadonly) {
      paneHistoryStart(
        PaneComponentEnum.TRAIT,
        PaneIdentifierUtils.generateTrait(key)
      );
    }
  };

  handleActionClick = (action: Action): void => {
    const {
      paneContext: { paneHistoryStart },
    } = this.props;

    const mappingId = ActionUtils.getMappingId(action);
    const mappingEntityTypeId = ActionUtils.getMappingEntityTypeId(action);

    if (mappingId !== null && mappingEntityTypeId !== null) {
      paneHistoryStart(
        PaneComponentEnum.ACTION,
        PaneIdentifierUtils.generateAction(mappingId, mappingEntityTypeId)
      );
    }
  };

  handleSpellDetailClick = (spell: Spell): void => {
    const {
      paneContext: { paneHistoryStart },
    } = this.props;

    const mappingId = SpellUtils.getMappingId(spell);
    if (mappingId !== null) {
      paneHistoryStart(
        PaneComponentEnum.CHARACTER_SPELL_DETAIL,
        PaneIdentifierUtils.generateCharacterSpell(mappingId)
      );
    }
  };

  handleClick = (e: React.MouseEvent, onClick: Function): void => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onClick();
  };

  renderDescriptionItem = (
    value: number | string | null,
    fallback: string = DEFAULT_VALUE
  ): React.ReactNode => {
    return value === null ? fallback : value;
  };

  render() {
    const {
      dispatch,
      background,
      characterFeaturesManager,
      snippetData,
      ruleData,
      abilityLookup,
      dataOriginRefData,
      isReadonly,
      proficiencyBonus,
      theme,
      isVertical,
      size,
      height,
      weight,
      alignment,
      gender,
      eyes,
      hair,
      skin,
      age,
      faith,
      traits,
    } = this.props;

    const infoItemProps = {
      role: "listitem",
      inline: isVertical,
    };

    return (
      <section className="ct-description">
        <h2 style={visuallyHidden}>Description</h2>
        <TabFilter
          filters={[
            {
              label: "Background",
              content: (
                <ContentGroup header="Background">
                  <BackgroundDetail
                    background={background}
                    onClick={this.handleBackgroundClick}
                    featuresManager={characterFeaturesManager}
                    onActionUseSet={(action, uses) =>
                      handleActionUseSet(action, uses, dispatch)
                    }
                    onSpellUseSet={(spell, uses) =>
                      handleSpellUseSet(spell, uses, dispatch)
                    }
                    snippetData={snippetData}
                    ruleData={ruleData}
                    abilityLookup={abilityLookup}
                    dataOriginRefData={dataOriginRefData}
                    isReadonly={isReadonly}
                    proficiencyBonus={proficiencyBonus}
                    theme={theme}
                  />
                </ContentGroup>
              ),
            },
            {
              label: "Characteristics",
              content: (
                <>
                  <ContentGroup header="Characteristics">
                    <div
                      className={clsx([
                        "ct-description__physical",
                        styles.physical,
                      ])}
                      role="list"
                      onClick={(e) =>
                        this.handleClick(
                          e,
                          this.handlePhysicalCharacteristicsClick
                        )
                      }
                    >
                      <InfoItem label="Alignment" {...infoItemProps}>
                        {alignment === null ? DEFAULT_VALUE : alignment.name}
                      </InfoItem>
                      <InfoItem label="Gender" {...infoItemProps}>
                        {this.renderDescriptionItem(gender)}
                      </InfoItem>
                      <InfoItem label="Eyes" {...infoItemProps}>
                        {this.renderDescriptionItem(eyes)}
                      </InfoItem>
                      <InfoItem label="Size" {...infoItemProps}>
                        {this.renderDescriptionItem(size ? size.name : null)}
                      </InfoItem>
                      <InfoItem label="Height" {...infoItemProps}>
                        {this.renderDescriptionItem(height)}
                      </InfoItem>
                      <InfoItem label="Faith" {...infoItemProps}>
                        {this.renderDescriptionItem(faith)}
                      </InfoItem>
                      <InfoItem label="Hair" {...infoItemProps}>
                        {this.renderDescriptionItem(hair)}
                      </InfoItem>
                      <InfoItem label="Skin" {...infoItemProps}>
                        {this.renderDescriptionItem(skin)}
                      </InfoItem>
                      <InfoItem label="Age" {...infoItemProps}>
                        {this.renderDescriptionItem(age)}
                      </InfoItem>
                      <InfoItem label="Weight" {...infoItemProps}>
                        {weight === null ? (
                          DEFAULT_VALUE
                        ) : (
                          <NumberDisplay type="weightInLb" number={weight} />
                        )}
                      </InfoItem>
                    </div>
                  </ContentGroup>
                  <div
                    className="ct-description__traits"
                    style={
                      theme.isDarkMode
                        ? { borderColor: `${theme.themeColor}66` }
                        : undefined
                    }
                  >
                    <TraitContent
                      traits={traits}
                      traitKey={Constants.TraitTypeEnum.PERSONALITY_TRAITS}
                      label="Personality Traits"
                      fallback="+ Add Personality Traits"
                      onClick={this.handleTraitShow}
                    />
                    <TraitContent
                      traits={traits}
                      traitKey={Constants.TraitTypeEnum.IDEALS}
                      label="Ideals"
                      fallback="+ Add Ideals"
                      onClick={this.handleTraitShow}
                    />
                    <TraitContent
                      traits={traits}
                      traitKey={Constants.TraitTypeEnum.BONDS}
                      label="Bonds"
                      fallback="+ Add Bonds"
                      onClick={this.handleTraitShow}
                    />
                    <TraitContent
                      traits={traits}
                      traitKey={Constants.TraitTypeEnum.FLAWS}
                      label="Flaws"
                      fallback="+ Add Flaws"
                      onClick={this.handleTraitShow}
                    />
                  </div>
                </>
              ),
            },
            ...(traits !== null
              ? [
                  {
                    label: "Appearance",
                    content: (
                      <ContentGroup header="Appearance">
                        <TraitContent
                          traits={traits}
                          traitKey={Constants.TraitTypeEnum.APPEARANCE}
                          fallback="+ Add Appearance information"
                          onClick={this.handleTraitShow}
                        />
                      </ContentGroup>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </section>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    background: rulesEngineSelectors.getBackgroundInfo(state),
    alignment: rulesEngineSelectors.getAlignment(state),
    height: rulesEngineSelectors.getHeight(state),
    weight: rulesEngineSelectors.getWeight(state),
    size: rulesEngineSelectors.getSize(state),
    faith: rulesEngineSelectors.getFaith(state),
    skin: rulesEngineSelectors.getSkin(state),
    eyes: rulesEngineSelectors.getEyes(state),
    hair: rulesEngineSelectors.getHair(state),
    age: rulesEngineSelectors.getAge(state),
    gender: rulesEngineSelectors.getGender(state),
    traits: rulesEngineSelectors.getCharacterTraits(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    snippetData: rulesEngineSelectors.getSnippetData(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    abilityLookup: rulesEngineSelectors.getAbilityLookup(state),
    dataOriginRefData: rulesEngineSelectors.getDataOriginRefData(state),
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
  };
}

const DescriptionWrapper = (props) => {
  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );
  const { pane } = useSidebar();

  return (
    <Description
      paneContext={pane}
      characterFeaturesManager={characterFeaturesManager}
      {...props}
    />
  );
};

export default connect(mapStateToProps)(DescriptionWrapper);
