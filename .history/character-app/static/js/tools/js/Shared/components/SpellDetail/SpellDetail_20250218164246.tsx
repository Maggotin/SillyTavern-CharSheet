import React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  Collapsible,
  AoeTypeIcon,
  ComponentConstants,
} from "@dndbeyond/character-components/es";
import {
  ActivationUtils,
  AnySimpleDataType,
  CharacterTheme,
  CharacterUtils,
  CharacterValuesContract,
  Constants,
  DurationUtils,
  EntityValueLookup,
  FormatUtils,
  RuleData,
  RuleDataUtils,
  SourceMappingContract,
  Spell,
  SpellCasterInfo,
  SpellUtils,
  ValueUtils,
} from "../../character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { InfoItem } from "~/components/InfoItem";
import { NumberDisplay } from "~/components/NumberDisplay";
import { Reference } from "~/components/Reference";
import { TagGroup } from "~/components/TagGroup";

import SpellDetailCaster from "../../containers/SpellDetailCaster";
import EditorBox from "../EditorBox";
import ValueEditor from "../ValueEditor";
import { RemoveButton, ThemeButton } from "../common/Button";

interface Props {
  spell: Spell;
  enableCaster: boolean;
  castAsRitual: boolean;
  initialCastLevel: number | null;
  isPreparedMaxed: boolean;
  onRemove?: () => void;
  onPrepareToggle?: () => void;
  onCustomDataUpdate?: (
    key: number,
    value: AnySimpleDataType,
    source: string | null
  ) => void;
  onCustomizationsRemove?: () => void;
  showCustomize: boolean;
  showActions: boolean;
  entityValueLookup?: EntityValueLookup;
  spellCasterInfo: SpellCasterInfo;
  ruleData: RuleData;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
  isCustomizeClosed?: boolean;
  onCustomizeClick?: (isCollapsed: boolean) => void;
}
export default class SpellDetail extends React.PureComponent<Props> {
  static defaultProps = {
    initialCastLevel: null,
    isPreparedMaxed: true,
    enableCaster: true,
    showActions: true,
    showCustomize: true,
    castAsRitual: false,
    spellCasterInfo: {},
    isReadonly: false,
  };

  handleRemoveCustomizations = () => {
    const { onCustomizationsRemove } = this.props;

    if (onCustomizationsRemove) {
      onCustomizationsRemove();
    }
  };

  renderCustomize = (): React.ReactNode => {
    const {
      spell,
      showCustomize,
      onCustomDataUpdate,
      entityValueLookup,
      ruleData,
      isReadonly,
      isCustomizeClosed,
      onCustomizeClick,
    } = this.props;

    const dataOrigin = SpellUtils.getDataOrigin(spell);
    const dataOriginType = SpellUtils.getDataOriginType(spell);

    if (
      !entityValueLookup ||
      !showCustomize ||
      !dataOrigin ||
      (dataOrigin && dataOriginType === Constants.DataOriginTypeEnum.ITEM) ||
      isReadonly
    ) {
      return null;
    }

    const displayAsAttack = SpellUtils.isDisplayAsAttack(spell);
    const initialDisplayAsAttack: boolean =
      displayAsAttack ||
      (SpellUtils.isAttack(spell) &&
        (displayAsAttack || displayAsAttack === null));

    let customizationValues: Array<Constants.AdjustmentTypeEnum> = [
      Constants.AdjustmentTypeEnum.TO_HIT_OVERRIDE,
      Constants.AdjustmentTypeEnum.TO_HIT_BONUS,
      Constants.AdjustmentTypeEnum.FIXED_VALUE_BONUS,
      Constants.AdjustmentTypeEnum.SAVE_DC_OVERRIDE,
      Constants.AdjustmentTypeEnum.SAVE_DC_BONUS,
    ];

    if (!SpellUtils.asPartOfWeaponAttack(spell)) {
      customizationValues.push(Constants.AdjustmentTypeEnum.DISPLAY_AS_ATTACK);
    }

    customizationValues.push(Constants.AdjustmentTypeEnum.NAME_OVERRIDE);
    customizationValues.push(Constants.AdjustmentTypeEnum.NOTES);

    let customizationLabelOverrides: Partial<
      Record<Constants.AdjustmentTypeEnum, string>
    > = {
      [Constants.AdjustmentTypeEnum.NAME_OVERRIDE]: "Name",
      [Constants.AdjustmentTypeEnum.FIXED_VALUE_BONUS]: "Damage Bonus",
      [Constants.AdjustmentTypeEnum.SAVE_DC_OVERRIDE]: "DC Override",
      [Constants.AdjustmentTypeEnum.SAVE_DC_BONUS]: "DC Bonus",
    };

    let customizationDefaults: Partial<
      Record<Constants.AdjustmentTypeEnum, any>
    > = {
      [Constants.AdjustmentTypeEnum.DISPLAY_AS_ATTACK]: initialDisplayAsAttack,
    };

    let [contextId, contextTypeId] = SpellUtils.deriveExpandedContextIds(spell);
    const mappingId = SpellUtils.getMappingId(spell);
    const mappingEntityTypeId = SpellUtils.getMappingEntityTypeId(spell);
    let dataLookup: Record<number, CharacterValuesContract> = {};
    if (mappingId !== null && mappingEntityTypeId !== null) {
      dataLookup = ValueUtils.getEntityData(
        entityValueLookup,
        ValueUtils.hack__toString(mappingId),
        ValueUtils.hack__toString(mappingEntityTypeId),
        ValueUtils.hack__toString(contextId),
        ValueUtils.hack__toString(contextTypeId)
      );
    }

    const isCustomized = SpellUtils.isCustomized(spell);

    return (
      <div className="ct-spell-detail__customize">
        <Collapsible
          layoutType={"minimal"}
          header={`Customize${isCustomized ? "*" : ""}`}
          collapsed={isCustomizeClosed}
          onChangeHandler={onCustomizeClick}
        >
          <EditorBox>
            <ValueEditor
              dataLookup={dataLookup}
              onDataUpdate={onCustomDataUpdate}
              valueEditors={customizationValues}
              ruleData={ruleData}
              labelOverrides={customizationLabelOverrides}
              defaultValues={customizationDefaults}
              layoutType={"compact"}
            />
            <RemoveButton
              enableConfirm={true}
              size="medium"
              style="filled"
              disabled={!isCustomized}
              isInteractive={isCustomized}
              onClick={this.handleRemoveCustomizations}
            >
              {isCustomized ? "Remove" : "No"} Customizations
            </RemoveButton>
          </EditorBox>
        </Collapsible>
      </div>
    );
    //`
  };

  renderActions = (): React.ReactNode => {
    const { spell, isPreparedMaxed, onRemove, onPrepareToggle, showActions } =
      this.props;

    const dataOrigin = SpellUtils.getDataOrigin(spell);
    const dataOriginType = SpellUtils.getDataOriginType(spell);

    if (
      !showActions ||
      !dataOrigin ||
      (dataOrigin && dataOriginType !== Constants.DataOriginTypeEnum.CLASS)
    ) {
      return null;
    }

    const isPrepared = SpellUtils.isPrepared(spell);
    const showRemove = SpellUtils.canRemove(spell);
    const showPrepare =
      SpellUtils.canPrepare(spell) && !SpellUtils.isAlwaysPrepared(spell);

    if (!showRemove && !showPrepare) {
      return null;
    }

    return (
      <div className="ct-spell-detail__actions">
        {showPrepare && (
          <div className="ct-spell-detail__action">
            <ThemeButton
              size="small"
              style={isPrepared ? "" : "outline"}
              onClick={onPrepareToggle}
              stopPropagation={true}
              disabled={isPreparedMaxed && !isPrepared}
            >
              {isPrepared ? "Prepared" : "Prepare"}
            </ThemeButton>
          </div>
        )}
        {showRemove && (
          <div className="ct-spell-detail__action">
            <RemoveButton onClick={onRemove} />
          </div>
        )}
      </div>
    );
  };

  renderCaster = (): React.ReactNode => {
    const {
      spell,
      initialCastLevel,
      enableCaster,
      castAsRitual,
      spellCasterInfo,
      proficiencyBonus,
    } = this.props;

    if (!enableCaster || castAsRitual || !SpellUtils.isActive(spell)) {
      return null;
    }

    return (
      <SpellDetailCaster
        spell={spell}
        initialCastLevel={initialCastLevel}
        proficiencyBonus={proficiencyBonus}
        {...spellCasterInfo}
      />
    );
  };

  render() {
    const { spell, ruleData, theme } = this.props;
    let { castAsRitual } = this.props;

    castAsRitual = castAsRitual || SpellUtils.isCastAsRitual(spell);

    const attackSaveValue = SpellUtils.getAttackSaveValue(spell);
    const notes = SpellUtils.getNotes(spell);
    const range = SpellUtils.getRange(spell);
    const additionalDescription = SpellUtils.getAdditionalDescription(spell);
    const level = SpellUtils.getLevel(spell);
    const components = SpellUtils.getComponents(spell);
    const componentsDescription = SpellUtils.getComponentsDescription(spell);
    const duration = SpellUtils.getDuration(spell);
    const school = SpellUtils.getSchool(spell);
    const description = SpellUtils.getDescription(spell);
    const version = SpellUtils.getVersion(spell);
    const requiresSavingThrow = SpellUtils.getRequiresSavingThrow(spell);
    const tags = SpellUtils.getTags(spell);
    const activation = SpellUtils.getActivation(spell);
    const castingTimeDescription = SpellUtils.getCastingTimeDescription(spell);
    let sourceId: number | null = null;
    let sourcePage: number | null = null;
    let filteredSources = SpellUtils.getSources(spell).filter(
      CharacterUtils.isPrimarySource
    );
    if (filteredSources.length) {
      let primarySource: SourceMappingContract = filteredSources[0];
      sourceId = primarySource.sourceId;
      sourcePage = primarySource.pageNumber;
    }

    let rangeAreas: Array<React.ReactNode> = [];
    if (range) {
      if (
        range.origin &&
        range.origin !== Constants.SpellRangeTypeNameEnum.RANGED
      ) {
        rangeAreas.push(range.origin);
      }
      if (range.rangeValue) {
        rangeAreas.push(
          <NumberDisplay type="distanceInFt" number={range.rangeValue} />
        );
      }
      if (range.aoeValue) {
        rangeAreas.push(
          <React.Fragment>
            <NumberDisplay type="distanceInFt" number={range.aoeValue} />
            <span className="ct-spell-detail__range-shape">
              <AoeTypeIcon
                className="ct-spell-detail__range-icon"
                type={
                  FormatUtils.slugify(
                    range.aoeType
                  ) as ComponentConstants.AoeTypePropType
                }
                themeMode={theme.isDarkMode ? "gray" : "dark"}
              />
            </span>
          </React.Fragment>
        );
      }
    }

    let componentsNode: React.ReactNode;
    if (components) {
      componentsNode = (
        <span className="ct-spell-detail__components">
          {components.map((componentId, idx) => {
            let componentInfo = RuleDataUtils.getSpellComponentInfo(
              componentId,
              ruleData
            );
            if (componentInfo === null) {
              return null;
            }
            return (
              <React.Fragment key={componentId}>
                <Tooltip
                  isDarkMode={theme.isDarkMode}
                  title={componentInfo.name ? componentInfo.name : ""}
                >
                  {componentInfo.shortName}
                </Tooltip>
                {idx + 1 < components.length ? ", " : ""}
              </React.Fragment>
            );
          })}
        </span>
      );
    }

    let castingTimeDisplay: React.ReactNode;
    if (activation) {
      castingTimeDisplay = ActivationUtils.renderCastingTime(
        activation,
        castAsRitual ? 10 : 0,
        ruleData
      );
    }

    const infoItemProps = { role: "listitem", inline: true };
    const getSourceInfo = (sourceId) =>
      sourceId ? RuleDataUtils.getSourceDataInfo(sourceId, ruleData) : null;

    return (
      <div className="ct-spell-detail">
        <div className="ct-spell-detail__level-school">
          {SpellUtils.isLegacy(spell) && (
            <span className="ct-spell-detail__level-school-item">
              Legacy •{" "}
            </span>
          )}
          <span className="ct-spell-detail__level-school-item">
            {SpellUtils.isCantrip(spell)
              ? school
              : FormatUtils.renderSpellLevelName(level)}
          </span>
          <span className="ct-spell-detail__level-school-item">
            {SpellUtils.isCantrip(spell)
              ? FormatUtils.renderSpellLevelName(level)
              : school}
          </span>
        </div>
        {this.renderCaster()}
        {this.renderCustomize()}
        <div className="ct-spell-detail__properties" role="list">
          <InfoItem label="Casting Time:" {...infoItemProps}>
            {castingTimeDisplay}
            {castingTimeDescription ? `, ${castingTimeDescription}` : ""}
          </InfoItem>
          <InfoItem label="Range/Area:" {...infoItemProps}>
            {rangeAreas.map((node, idx) => (
              <React.Fragment key={idx}>
                {node}
                {idx + 1 < rangeAreas.length ? "/" : ""}
              </React.Fragment>
            ))}
          </InfoItem>
          <InfoItem label="Components:" {...infoItemProps}>
            {componentsNode}
            {componentsDescription && (
              <span className="ct-spell-detail__components-description">
                ({componentsDescription})
              </span>
            )}
          </InfoItem>
          {duration !== null && (
            <InfoItem label="Duration:" {...infoItemProps}>
              {DurationUtils.renderDuration(
                duration,
                SpellUtils.getConcentration(spell)
              )}
            </InfoItem>
          )}
          {requiresSavingThrow && (
            <InfoItem label="Attack/Save:" {...infoItemProps}>
              {SpellUtils.getSaveDcAbilityShortName(spell, ruleData)}{" "}
              {attackSaveValue}
            </InfoItem>
          )}
          {version !== null && (
            <InfoItem label="Version:" {...infoItemProps}>
              {version}
            </InfoItem>
          )}
          {notes && (
            <InfoItem label="Notes:" {...infoItemProps}>
              {notes}
            </InfoItem>
          )}
          {sourceId !== null && (
            <InfoItem label="Source:" {...infoItemProps}>
              <Reference
                name={getSourceInfo(sourceId)?.description || ""}
                page={sourcePage}
                isDarkMode={theme?.isDarkMode}
              />
            </InfoItem>
          )}
        </div>
        {description !== null && (
          <HtmlContent
            className="ct-spell-detail__description"
            html={description}
            withoutTooltips
          />
        )}
        {additionalDescription && (
          <HtmlContent
            className="ct-spell-detail__additional-description"
            html={additionalDescription}
            withoutTooltips
          />
        )}
        {this.renderActions()}
        {tags.length > 0 && (
          <TagGroup
            className="ct-spell-detail__tags"
            label="Tags"
            tags={tags}
          />
        )}
      </div>
    );
  }
}
