import React from "react";

import { Select } from "../../character-components/es";
import {
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiResponse,
  BaseItemDefinitionContract,
  BaseSpellContract,
  CharacterPreferences,
  CharacterTheme,
  CharClass,
  ChoiceData,
  ClassDefinitionContract,
  ClassFeatureDefinitionContract,
  ClassFeatureUtils,
  ClassSpellInfo,
  ClassSpellListSpellsLookup,
  ClassUtils,
  Constants,
  DataOriginRefData,
  DefinitionPool,
  DefinitionUtils,
  EntitledEntity,
  FeatDefinitionContract,
  FeatLookup,
  HtmlSelectOption,
  InfusionChoice,
  InfusionDefinitionContract,
  Modifier,
  OptionalClassFeatureLookup,
  OverallSpellInfo,
  PrerequisiteData,
  RuleData,
  RuleDataUtils,
  Spell,
  SpellCasterInfo,
  TypeValueLookup,
} from "../../character-rules-engine/es";

import { HelperTextAccordion } from "~/components/HelperTextAccordion";
import { TabList } from "~/components/TabList";

import ClassSpellListManager from "../../../../../Shared/components/legacy/ClassSpellListManager";
import {
  ApiClassFeaturesRequest,
  ApiSpellsRequest,
} from "../../../../../Shared/selectors/composite/apiCreator";
import ClassManagerFeature from "../ClassManagerFeature";
import { OptionalFeatureManager } from "../OptionalFeatureManager";

interface Props {
  charClass: CharClass;
  spellCasterInfo: SpellCasterInfo;
  overallSpellInfo: OverallSpellInfo;
  ruleData: RuleData;
  prerequisiteData: PrerequisiteData;
  choiceInfo: ChoiceData;
  preferences: CharacterPreferences;
  globalModifiers: Array<Modifier>;
  typeValueLookup: TypeValueLookup;
  definitionPool: DefinitionPool;
  knownInfusionLookup: Record<string, InfusionChoice>;
  knownReplicatedItems: Array<string>;
  activeSourceCategories: Array<number>;
  onClassFeatureChoiceChange: (
    classId: number,
    classFeatureId: number,
    choiceType: any,
    choiceId: string,
    optionValue: number | null,
    parentChoiceId: string | null
  ) => void;
  onClassLevelChangePromise: (
    charClass: CharClass,
    classId: number,
    newValue: string,
    oldValue: string,
    accept: () => void,
    reject: () => void
  ) => void;
  onRemoveClass: (charClass: CharClass) => void;
  onSpellPrepare: (spell: Spell, classMappingId: number) => void;
  onSpellUnprepare: (spell: Spell, classMappingId: number) => void;
  onSpellRemove: (spell: Spell, classMappingId: number) => void;
  onSpellAdd: (spell: Spell, classMappingId: number) => void;
  onAlwaysKnownLoad: (
    spells: Array<BaseSpellContract>,
    classId: number
  ) => void;
  onInfusionChoiceItemChangePromise?: (
    infusionChoiceKey: string,
    infusionId: string,
    itemDefinitionKey: string,
    itemName: string,
    accept: () => void,
    reject: () => void
  ) => void;
  onInfusionChoiceItemDestroyPromise?: (
    infusionChoiceKey: string,
    accept: () => void,
    reject: () => void
  ) => void;
  onInfusionChoiceChangePromise?: (
    infusionChoiceKey: string,
    infusionId: string,
    accept: () => void,
    reject: () => void
  ) => void;
  onInfusionChoiceDestroyPromise?: (
    infusionChoiceKey: string,
    accept: () => void,
    reject: () => void
  ) => void;
  onInfusionChoiceCreatePromise?: (
    infusionChoiceKey: string,
    infusionId: string,
    accept: () => void,
    reject: () => void
  ) => void;
  onOptionalFeatureSelection: (
    definitionKey: string,
    affectedClassFeatureDefinitionKey: string | null
  ) => void;
  onChangeReplacementPromise?: (
    definitionKey: string,
    newAffectedDefinitionKey: string | null,
    oldAffectedDefinitionKey: string | null,
    accept: () => void,
    reject: () => void
  ) => void;
  onRemoveSelectionPromise?: (
    definitionKey: string,
    newIsEnabled: boolean,
    accept: () => void,
    reject: () => void
  ) => void;
  classSpellList: ClassSpellInfo | null;
  levelsDiff: number;
  levelsRemaining: number;
  isMulticlass: boolean;
  loadAvailableSubclasses: (
    baseClassId: number,
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<ClassDefinitionContract>>>;
  loadAvailableFeats: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<FeatDefinitionContract>>>;
  loadRemainingSpellList: ApiSpellsRequest | null;
  loadAlwaysKnownSpells?: ApiSpellsRequest | null;
  loadAvailableOptionalClassFeatures: ApiClassFeaturesRequest | null;
  loadAvailableEquipment: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<BaseItemDefinitionContract>>>;
  loadAvailableInfusions: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<
    ApiResponse<EntitledEntity<InfusionDefinitionContract>>
  >;
  onDefinitionsLoaded?: (
    definitions: Array<InfusionDefinitionContract>,
    accessTypes: Record<string, number>
  ) => void;
  onFeatureDefinitionsLoaded?: (
    definitionData: EntitledEntity<ClassFeatureDefinitionContract>
  ) => void;
  featLookup: FeatLookup;
  dataOriginRefData: DataOriginRefData;
  classSpellListSpellsLookup: ClassSpellListSpellsLookup;
  optionalClassFeatureLookup: OptionalClassFeatureLookup;
  theme: CharacterTheme;
}
interface State {
  showClassFeatures: boolean;
  showAtHigherLevelsClassFeatures: boolean;
}
export default class ClassManager extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      showClassFeatures: true,
      showAtHigherLevelsClassFeatures: false,
    };
  }

  handleAtHigherLevelsTriggerClick = (evt: React.MouseEvent): void => {
    this.setState((prevState) => ({
      showAtHigherLevelsClassFeatures:
        !prevState.showAtHigherLevelsClassFeatures,
    }));
  };

  handleFeatureChoiceChange = (
    classFeatureId: number,
    choiceId: string,
    choiceType: any,
    optionValue: number | null,
    parentChoiceId: string | null
  ): void => {
    const { onClassFeatureChoiceChange, charClass } = this.props;

    if (onClassFeatureChoiceChange) {
      onClassFeatureChoiceChange(
        ClassUtils.getActiveId(charClass),
        classFeatureId,
        choiceType,
        choiceId,
        optionValue,
        parentChoiceId
      );
    }
  };

  handleLevelChangePromise = (
    newValue: string,
    oldValue: string,
    accept: () => void,
    reject: () => void
  ): void => {
    const { onClassLevelChangePromise, charClass } = this.props;

    if (onClassLevelChangePromise) {
      onClassLevelChangePromise(
        charClass,
        ClassUtils.getActiveId(charClass),
        newValue,
        oldValue,
        accept,
        reject
      );
    }
  };

  handleClassRemove = (): void => {
    const { onRemoveClass, charClass } = this.props;

    if (onRemoveClass) {
      onRemoveClass(charClass);
    }
  };

  renderInformationCollapsible = (): React.ReactNode => {
    const { ruleData, charClass } = this.props;
    if (charClass === null) {
      return null;
    }

    const definitionKey = DefinitionUtils.hack__generateDefinitionKey(
      ClassUtils.getMappingEntityTypeId(charClass),
      ClassUtils.getId(charClass)
    );
    const builderText = RuleDataUtils.getBuilderHelperTextByDefinitionKeys(
      [definitionKey],
      ruleData,
      Constants.DisplayConfigurationTypeEnum.CLASS_FEATURE
    );

    return <HelperTextAccordion builderHelperText={builderText} />;
  };

  renderClassFeatureGroups = (): React.ReactNode => {
    const { showClassFeatures, showAtHigherLevelsClassFeatures } = this.state;
    const {
      charClass,
      choiceInfo,
      prerequisiteData,
      preferences,
      loadAvailableSubclasses,
      loadAvailableFeats,
      loadAvailableEquipment,
      typeValueLookup,
      globalModifiers,
      ruleData,
      definitionPool,
      loadAvailableInfusions,
      onDefinitionsLoaded,
      onInfusionChoiceItemChangePromise,
      onInfusionChoiceItemDestroyPromise,
      onInfusionChoiceChangePromise,
      onInfusionChoiceDestroyPromise,
      onInfusionChoiceCreatePromise,
      featLookup,
      knownInfusionLookup,
      knownReplicatedItems,
      optionalClassFeatureLookup,
    } = this.props;

    if (!showClassFeatures) {
      return null;
    }

    const level = ClassUtils.getLevel(charClass);
    const isStartingClass = ClassUtils.isStartingClass(charClass);

    const visibleClassFeatures = ClassUtils.getVisibileClassFeatures(charClass);
    const orderedVisibleFeatures = ClassUtils.deriveOrderedClassFeatures(
      visibleClassFeatures
    ).filter((feature) => ClassFeatureUtils.getRequiredLevel(feature) <= level);

    const classFeatures = ClassUtils.getClassFeatures(charClass);
    const orderedClassFeatures =
      ClassUtils.deriveOrderedClassFeatures(classFeatures);
    const atHigherLevelsClassFeatures = orderedClassFeatures.filter(
      (feature) => ClassFeatureUtils.getRequiredLevel(feature) > level
    );

    return (
      <div className="class-manager-features-groups">
        {this.renderInformationCollapsible()}
        {orderedVisibleFeatures.length > 0 && (
          <div className="class-manager-features-group">
            <div className="class-manager-features-group-items">
              {orderedVisibleFeatures.map((feature) => (
                <ClassManagerFeature
                  key={ClassFeatureUtils.getId(feature)}
                  charClass={charClass}
                  feature={feature}
                  isStartingClass={isStartingClass}
                  onChoiceChange={this.handleFeatureChoiceChange}
                  onInfusionChoiceItemChangePromise={
                    onInfusionChoiceItemChangePromise
                  }
                  onInfusionChoiceItemDestroyPromise={
                    onInfusionChoiceItemDestroyPromise
                  }
                  onInfusionChoiceChangePromise={onInfusionChoiceChangePromise}
                  onInfusionChoiceDestroyPromise={
                    onInfusionChoiceDestroyPromise
                  }
                  onInfusionChoiceCreatePromise={onInfusionChoiceCreatePromise}
                  onDefinitionsLoaded={onDefinitionsLoaded}
                  choiceInfo={choiceInfo}
                  prerequisiteData={prerequisiteData}
                  preferences={preferences}
                  loadAvailableEquipment={loadAvailableEquipment}
                  loadAvailableInfusions={loadAvailableInfusions}
                  loadAvailableSubclasses={loadAvailableSubclasses}
                  loadAvailableFeats={loadAvailableFeats}
                  typeValueLookup={typeValueLookup}
                  globalModifiers={globalModifiers}
                  ruleData={ruleData}
                  definitionPool={definitionPool}
                  featLookup={featLookup}
                  knownReplicatedItems={knownReplicatedItems}
                  knownInfusionLookup={knownInfusionLookup}
                  optionalClassFeatureLookup={optionalClassFeatureLookup}
                />
              ))}
            </div>
          </div>
        )}
        {atHigherLevelsClassFeatures.length > 0 && (
          <div
            className={`class-manager-features-group ${
              showAtHigherLevelsClassFeatures
                ? "class-manager-features-group-opened"
                : "class-manager-features-group-collapsed"
            }`}
          >
            <div className="class-manager-features-group-header">
              <div
                className="class-manager-features-group-heading"
                onClick={this.handleAtHigherLevelsTriggerClick}
              >
                Available at Higher Levels ({atHigherLevelsClassFeatures.length}
                )
              </div>
              <div
                className="class-manager-features-group-trigger"
                onClick={this.handleAtHigherLevelsTriggerClick}
              />
            </div>
            {showAtHigherLevelsClassFeatures && (
              <div className="class-manager-features-group-items">
                {atHigherLevelsClassFeatures.map((feature) => (
                  <ClassManagerFeature
                    key={ClassFeatureUtils.getId(feature)}
                    charClass={charClass}
                    choiceInfo={choiceInfo}
                    feature={feature}
                    isStartingClass={isStartingClass}
                    isActive={false}
                    prerequisiteData={prerequisiteData}
                    preferences={preferences}
                    loadAvailableEquipment={loadAvailableEquipment}
                    loadAvailableInfusions={loadAvailableInfusions}
                    loadAvailableSubclasses={loadAvailableSubclasses}
                    loadAvailableFeats={loadAvailableFeats}
                    typeValueLookup={typeValueLookup}
                    globalModifiers={globalModifiers}
                    ruleData={ruleData}
                    definitionPool={definitionPool}
                    knownReplicatedItems={knownReplicatedItems}
                    knownInfusionLookup={knownInfusionLookup}
                    optionalClassFeatureLookup={optionalClassFeatureLookup}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  renderClassFeatures = (): React.ReactNode => {
    const { showClassFeatures } = this.state;

    return (
      <div
        className={`class-manager-features ${
          showClassFeatures
            ? "class-manager-features-opened"
            : "class-manager-features-collapsed"
        }`}
      >
        {/*<div className="class-manager-features-header">*/}
        {/*<div className="class-manager-features-heading" onClick={this.handleFeaturesTriggerClick}>Class Features</div>*/}
        {/*<div className="class-manager-features-trigger" onClick={this.handleFeaturesTriggerClick} />*/}
        {/*</div>*/}
        {this.renderClassFeatureGroups()}
      </div>
    );
  };

  render() {
    const {
      charClass,
      definitionPool,
      levelsDiff,
      levelsRemaining,
      isMulticlass,
      loadRemainingSpellList,
      loadAlwaysKnownSpells,
      loadAvailableOptionalClassFeatures,
      preferences,
      classSpellList,
      spellCasterInfo,
      ruleData,
      overallSpellInfo,
      onSpellAdd,
      onSpellRemove,
      onSpellPrepare,
      onSpellUnprepare,
      onAlwaysKnownLoad,
      dataOriginRefData,
      onOptionalFeatureSelection,
      onRemoveSelectionPromise,
      onChangeReplacementPromise,
      onFeatureDefinitionsLoaded,
      optionalClassFeatureLookup,
      theme,
      activeSourceCategories,
    } = this.props;

    const { subclassDefinition } = charClass;

    const name = ClassUtils.getName(charClass);
    const portraitAvatarUrl = ClassUtils.getPortraitUrl(charClass);
    const isStartingClass = ClassUtils.isStartingClass(charClass);
    const level = ClassUtils.getLevel(charClass);

    let levelOptions: Array<HtmlSelectOption> = [];
    for (let i = 1; i <= level + levelsRemaining; i++) {
      levelOptions.push({
        label: "" + i,
        value: i,
      });
    }

    let selectClsNames: Array<string> = [];
    let levelTodoNode: React.ReactNode;
    if (
      levelsDiff !== 0 &&
      preferences.progressionType === Constants.PreferenceProgressionTypeEnum.XP
    ) {
      selectClsNames.push("character-select-todo");
      levelTodoNode = <span className="todo-indicator-icon">!</span>;
    }

    let subclassNode: React.ReactNode;
    if (subclassDefinition !== null) {
      subclassNode = (
        <div className="class-manager-subclass">{subclassDefinition.name}</div>
      );
    }

    return (
      <div className="class-manager">
        <div className="class-manager-header">
          {isMulticlass && isStartingClass && (
            <div className="class-manager-starting-class">Starting Class</div>
          )}
          <div className="class-manager-preview">
            <img
              className="class-manager-preview-img"
              src={portraitAvatarUrl}
              alt=""
            />
          </div>
          <div className="class-manager-summary">
            {subclassNode}
            <div className="class-manager-heading">{name}</div>
          </div>
          <div className="class-manager-header-aside">
            <div className="class-manager-level">
              <span className="class-manager-level-label">
                {levelTodoNode}Level
              </span>
              <span className="class-manager-level-input">
                <Select
                  clsNames={selectClsNames}
                  value={level}
                  options={levelOptions}
                  initialOptionRemoved={true}
                  onChangePromise={this.handleLevelChangePromise}
                />
              </span>
            </div>
            <div className="class-manager-remove">
              <div
                className="class-manager-remove-icon"
                onClick={this.handleClassRemove}
                role="button"
                aria-label="Remove Class"
              />
            </div>
          </div>
        </div>
        <TabList
          variant="toggle"
          defaultActiveId={isMulticlass ? "none" : "features"}
          tabs={[
            {
              label: "Class Features",
              content: this.renderClassFeatures(),
              id: "features",
            },
            preferences.enableOptionalClassFeatures
              ? {
                  label: "Optional Feature Manager",
                  content: (
                    <OptionalFeatureManager
                      charClass={charClass}
                      definitionPool={definitionPool}
                      optionalClassFeatureLookup={optionalClassFeatureLookup}
                      onDefinitionsLoaded={onFeatureDefinitionsLoaded}
                      loadAvailableOptionalClassFeatures={
                        loadAvailableOptionalClassFeatures
                      }
                      onSelection={onOptionalFeatureSelection}
                      onChangeReplacementPromise={onChangeReplacementPromise}
                      onRemoveSelectionPromise={onRemoveSelectionPromise}
                      ruleData={ruleData}
                    />
                  ),
                  id: "optional-features",
                }
              : null,
            classSpellList
              ? {
                  label: "Spells",
                  content: (
                    <ClassSpellListManager
                      {...(classSpellList as any)}
                      loadRemainingSpellList={loadRemainingSpellList}
                      loadAlwaysKnownSpells={loadAlwaysKnownSpells}
                      onSpellPrepare={onSpellPrepare}
                      onSpellUnprepare={onSpellUnprepare}
                      onSpellRemove={onSpellRemove}
                      onSpellAdd={onSpellAdd}
                      onAlwaysKnownLoad={onAlwaysKnownLoad}
                      showHeader={false}
                      spellCasterInfo={spellCasterInfo}
                      enableSpellcasting={false}
                      enableCustomization={false}
                      ruleData={ruleData}
                      overallSpellInfo={overallSpellInfo}
                      dataOriginRefData={dataOriginRefData}
                      theme={theme}
                      activeSourceCategories={activeSourceCategories}
                    />
                  ),
                  id: "spells",
                }
              : null,
          ]}
        />
      </div>
    );
  }
}
