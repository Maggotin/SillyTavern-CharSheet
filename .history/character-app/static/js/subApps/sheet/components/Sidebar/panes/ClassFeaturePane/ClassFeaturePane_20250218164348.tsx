import { FC, HTMLAttributes, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ApiAdapterUtils,
  FeatManager,
} from "../../character-rules-engine";

import { FeatureChoice } from "~/components/FeatureChoice";
import { BuilderChoiceTypeEnum } from "~/constants";
import { useSidebar } from "~/contexts/Sidebar";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Preview } from "~/subApps/sheet/components/Sidebar/components/Preview";
import DataLoadingStatusEnum from "~/tools/js/Shared/constants/DataLoadingStatusEnum";
import { CharacterFeaturesManagerContext } from "~/tools/js/Shared/managers/CharacterFeaturesManagerContext";
import { apiCreatorSelectors } from "~/tools/js/Shared/selectors";
import { AppLoggerUtils, PaneIdentifierUtils } from "~/tools/js/Shared/utils";
import LoadingPlaceholder from "~/tools/js/smartComponents/LoadingPlaceholder";
import {
  Action,
  CharClass,
  ClassDefinitionContract,
  ClassFeature,
  Feat,
  InfusionChoice,
  Spell,
} from "~/types";

import { ClassFeatureSnippet } from "../../../../../../tools/js/CharacterSheet/components/FeatureSnippet";
import { appEnvSelectors } from "../../../../../../tools/js/Shared/selectors";
import { Heading } from "../../components/Heading";
import { PaneInitFailureContent } from "../../components/PaneInitFailureContent";
import { PaneComponentEnum, PaneIdentifiersClassFeature } from "../../types";
import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  identifiers: PaneIdentifiersClassFeature | null;
}
export const ClassFeaturePane: FC<Props> = ({ identifiers, ...props }) => {
  const dispatch = useDispatch();
  const {
    infusionChoiceUtils,
    actionUtils,
    characterActions,
    spellUtils,
    classUtils,
    classFeatureUtils,
    classes,
    feats,
    snippetData,
    ruleData,
    abilityLookup,
    proficiencyBonus,
    originRef: dataOriginRefData,
    characterTheme: theme,
    choiceUtils,
    featUtils,
    helperUtils,
  } = useCharacterEngine();

  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );

  const {
    pane: { paneHistoryPush },
  } = useSidebar();

  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);

  const loadAvailableFeats = useSelector(
    apiCreatorSelectors.makeLoadAvailableFeats
  );
  const loadAvailableSubclasses = useSelector(
    apiCreatorSelectors.makeLoadAvailableSubclasses
  );

  const [subclassData, setSubclassData] = useState<
    Array<ClassDefinitionContract>
  >([]);
  const [featsData, setFeatsData] = useState<Array<Feat>>([]);
  const [featLoadingStatus, setFeatLoadingStatus] =
    useState<DataLoadingStatusEnum>(DataLoadingStatusEnum.NOT_INITIALIZED);
  const [subclassLoadingStatus, setSubclassLoadingStatus] =
    useState<DataLoadingStatusEnum>(DataLoadingStatusEnum.NOT_INITIALIZED);

  const charClass = identifiers?.classMappingId
    ? classes.find(
        (charClass) =>
          identifiers.classMappingId === classUtils.getMappingId(charClass)
      )
    : null;

  const classFeature =
    charClass?.classFeatures.find(
      (feature) => identifiers?.id === classFeatureUtils.getId(feature)
    ) ?? null;

  const featureChoices = classFeature
    ? classFeatureUtils.getChoices(classFeature)
    : [];

  const hasFeatChoice = featureChoices.some(
    (choice) =>
      choiceUtils.getType(choice) === BuilderChoiceTypeEnum.FEAT_CHOICE_OPTION
  );

  const hasSubclassChoice = featureChoices.some(
    (choice) =>
      choiceUtils.getType(choice) === BuilderChoiceTypeEnum.SUB_CLASS_OPTION
  );

  useEffect(() => {
    if (
      hasFeatChoice &&
      featLoadingStatus === DataLoadingStatusEnum.NOT_INITIALIZED
    ) {
      setFeatLoadingStatus(DataLoadingStatusEnum.LOADING);

      loadAvailableFeats({
        //   cancelToken: new axios.CancelToken((c) => {
        //     this.loadFeatsCanceler = c;
        //   }),
      })
        .then((response) => {
          let featsData: Array<Feat> = [];

          const data = ApiAdapterUtils.getResponseData(response);
          if (data !== null) {
            featsData = data.map((definition) =>
              featUtils.simulateFeat(definition)
            );
          }

          setFeatsData(featsData);
          setFeatLoadingStatus(DataLoadingStatusEnum.LOADED);
          //   this.loadFeatsCanceler = null;
        })
        .catch(AppLoggerUtils.handleAdhocApiError);
    }

    if (
      charClass &&
      hasSubclassChoice &&
      subclassLoadingStatus === DataLoadingStatusEnum.NOT_INITIALIZED
    ) {
      setSubclassLoadingStatus(DataLoadingStatusEnum.LOADING);

      loadAvailableSubclasses(classUtils.getId(charClass), {
        // cancelToken: new axios.CancelToken((c) => {
        //   this.loadSubclassesCanceler = c;
        // }),
      })
        .then((response) => {
          let subclassData: Array<ClassDefinitionContract> = [];

          const data = ApiAdapterUtils.getResponseData(response);
          if (data !== null) {
            subclassData = data;
          }

          setSubclassData(subclassData);
          setSubclassLoadingStatus(DataLoadingStatusEnum.LOADED);
          //   this.loadSubclassesCanceler = null;
        })
        .catch(AppLoggerUtils.handleAdhocApiError);
    }
  }, [
    hasFeatChoice,
    hasSubclassChoice,
    subclassLoadingStatus,
    featLoadingStatus,
    charClass,
    classUtils,
    featUtils,
    loadAvailableFeats,
    loadAvailableSubclasses,
  ]);

  const handleInfusionChoiceShow = (infusionChoice: InfusionChoice): void => {
    const choiceKey = infusionChoiceUtils.getKey(infusionChoice);
    if (choiceKey !== null) {
      paneHistoryPush(
        PaneComponentEnum.INFUSION_CHOICE,
        PaneIdentifierUtils.generateInfusionChoice(choiceKey)
      );
    }
  };

  const handleChoiceChange = (
    id: string,
    type: number,
    value: any,
    parentChoiceId: string | null
  ): void => {
    if (!charClass || !classFeature) {
      return;
    }
    dispatch(
      characterActions.classFeatureChoiceSetRequest(
        classUtils.getActiveId(charClass),
        classFeatureUtils.getId(classFeature),
        type,
        id,
        helperUtils.parseInputInt(value),
        parentChoiceId
      )
    );
  };

  const handleActionUseSet = (action: Action, uses: number): void => {
    const id = actionUtils.getId(action);
    const entityTypeId = actionUtils.getEntityTypeId(action);
    if (id !== null && entityTypeId !== null) {
      dispatch(
        characterActions.actionUseSet(
          id,
          entityTypeId,
          uses,
          actionUtils.getDataOriginType(action)
        )
      );
    }
  };

  const handleSpellUseSet = (spell: Spell, uses: number): void => {
    const mappingId = spellUtils.getMappingId(spell);
    const mappingEntityTypeId = spellUtils.getMappingEntityTypeId(spell);
    const dataOriginType = spellUtils.getDataOriginType(spell);

    if (mappingId && mappingEntityTypeId && dataOriginType) {
      dispatch(
        characterActions.spellUseSet(
          mappingId,
          mappingEntityTypeId,
          uses,
          dataOriginType
        )
      );
    }
  };

  const handleSpellDetailShow = (spell: Spell): void => {
    const mappingId = spellUtils.getMappingId(spell);
    if (mappingId !== null) {
      paneHistoryPush(
        PaneComponentEnum.CHARACTER_SPELL_DETAIL,
        PaneIdentifierUtils.generateCharacterSpell(mappingId)
      );
    }
  };

  const handleClassFeatureShow = (
    feature: ClassFeature,
    charClass: CharClass
  ): void => {
    paneHistoryPush(
      PaneComponentEnum.CLASS_FEATURE_DETAIL,
      PaneIdentifierUtils.generateClassFeature(
        classFeatureUtils.getId(feature),
        classUtils.getMappingId(charClass)
      )
    );
  };

  const handleActionShow = (action: Action): void => {
    const mappingId = actionUtils.getMappingId(action);
    const mappingEntityTypeId = actionUtils.getMappingEntityTypeId(action);

    if (mappingId !== null && mappingEntityTypeId !== null) {
      paneHistoryPush(
        PaneComponentEnum.ACTION,
        PaneIdentifierUtils.generateAction(mappingId, mappingEntityTypeId)
      );
    }
  };

  const handleFeatShow = (feat: FeatManager): void => {
    paneHistoryPush(
      PaneComponentEnum.FEAT_DETAIL,
      PaneIdentifierUtils.generateFeat(feat.getId())
    );
  };

  const isDataLoaded = (): boolean => {
    if (hasSubclassChoice) {
      if (subclassLoadingStatus !== DataLoadingStatusEnum.LOADED) {
        return false;
      }
    }
    if (hasFeatChoice) {
      if (featLoadingStatus !== DataLoadingStatusEnum.LOADED) {
        return false;
      }
    }

    return true;
  };

  if (!charClass || !classFeature) {
    return <PaneInitFailureContent />;
  }

  return (
    <div
      key={`${classUtils.getMappingId(charClass)}-${classFeatureUtils.getId(
        classFeature
      )}`}
      {...props}
    >
      <Header
        parent={classUtils.getName(charClass)}
        preview={<Preview imageUrl={classUtils.getPortraitUrl(charClass)} />}
      >
        {classFeatureUtils.getName(classFeature)}
      </Header>
      <ClassFeatureSnippet
        charClass={charClass}
        feature={classFeature}
        onActionUseSet={handleActionUseSet}
        onActionClick={handleActionShow}
        onSpellClick={handleSpellDetailShow}
        onSpellUseSet={handleSpellUseSet}
        onFeatureClick={handleClassFeatureShow}
        onInfusionChoiceClick={handleInfusionChoiceShow}
        showHeader={false}
        showDescription={true}
        feats={feats}
        snippetData={snippetData}
        ruleData={ruleData}
        abilityLookup={abilityLookup}
        dataOriginRefData={dataOriginRefData}
        isReadonly={isReadonly}
        proficiencyBonus={proficiencyBonus}
        theme={theme}
        onFeatClick={handleFeatShow}
        featuresManager={characterFeaturesManager}
      />
      {!isReadonly && featureChoices.length > 0 && (
        <>
          <Heading className={styles.heading}>{`Option${
            featureChoices.length > 1 ? "s" : ""
          }`}</Heading>
          {isDataLoaded() ? (
            featureChoices.map((choice) => (
              <FeatureChoice
                charClass={charClass}
                choice={choice}
                feature={classFeature}
                featsData={featsData}
                subclassData={subclassData}
                className={styles.choice}
                key={choiceUtils.getId(choice)}
                onChoiceChange={handleChoiceChange}
                collapseDescription={true}
              />
            ))
          ) : (
            <LoadingPlaceholder />
          )}
        </>
      )}
    </div>
  );
};
