import { orderBy } from "lodash";
import React from "react";
import { useContext } from "react";
import { DispatchProp } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";

import {
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiResponse,
  BaseItemDefinitionContract,
  BaseSpellContract,
  characterActions,
  CharacterHitPointInfo,
  CharacterPreferences,
  CharacterUtils,
  CharClass,
  ChoiceData,
  ClassDefinitionContract,
  ClassSpellInfo,
  ClassUtils,
  Constants,
  DataOriginRefData,
  DefinitionContract,
  DefinitionPool,
  DefinitionUtils,
  DiceContract,
  DiceUtils,
  EntitledEntity,
  FeatLookup,
  FeatDefinitionContract,
  FormatUtils,
  HelperUtils,
  InfusionChoiceLookup,
  InfusionChoiceUtils,
  InfusionDefinitionContract,
  InfusionUtils,
  KnownInfusionUtils,
  Modifier,
  OverallSpellInfo,
  PrerequisiteData,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
  serviceDataActions,
  serviceDataSelectors,
  Spell,
  SpellCasterInfo,
  TypeValueLookup,
  InfusionChoice,
  ClassFeatureDefinitionContract,
  ClassFeatureUtils,
  ClassSpellListSpellsLookup,
  OptionalClassFeatureLookup,
  OptionalClassFeatureUtils,
  CharacterTheme,
  InventoryLookup,
  ItemUtils,
} from "@dndbeyond/character-rules-engine/es";
import { InventoryManager } from "@dndbeyond/character-rules-engine/es";

import { RouteKey } from "~/subApps/builder/constants";

import { confirmModalActions, modalActions } from "../../../../Shared/actions";
import { SimpleClassSpellList } from "../../../../Shared/components/SimpleClassSpellList";
import { InventoryManagerContext } from "../../../../Shared/managers/InventoryManagerContext";
import { apiCreatorSelectors } from "../../../../Shared/selectors";
import {
  MakeClassBasedApiClassFeaturesRequest,
  MakeClassBasedApiSpellsRequest,
} from "../../../../Shared/selectors/composite/apiCreator";
import { AppNotificationUtils } from "../../../../Shared/utils";
import Button from "../../../components/Button";
import Page from "../../../components/Page";
import { PageBody } from "../../../components/PageBody";
import { navigationConfig } from "../../../config";
import { ProgressionManager } from "../../ProgressionManager";
import ConnectedBuilderPage from "../ConnectedBuilderPage";
import ClassManager from "./ClassManager";

function getClassSpellList(
  charClass: CharClass,
  classSpellLists: Array<ClassSpellInfo>
): ClassSpellInfo | null {
  const foundClassSpellList = classSpellLists.find(
    (classSpellList) => classSpellList.charClass.id === charClass.id
  );
  return foundClassSpellList ? foundClassSpellList : null;
}

interface Props extends DispatchProp {
  ruleData: RuleData;
  overallSpellInfo: OverallSpellInfo;
  prerequisiteData: PrerequisiteData;
  totalClassLevel: number;
  hitPointInfo: CharacterHitPointInfo;
  choiceInfo: ChoiceData;
  classSpellLists: Array<ClassSpellInfo>;
  spellCasterInfo: SpellCasterInfo;
  preferences: CharacterPreferences;
  globalModifiers: Array<Modifier>;
  typeValueLookup: TypeValueLookup;
  definitionPool: DefinitionPool;
  currentLevel: number;
  classes: Array<CharClass>;
  loadAvailableOptionalClassFeatures: MakeClassBasedApiClassFeaturesRequest;
  loadAvailableSubclasses: (
    baseClassId: number,
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<ClassDefinitionContract>>>;
  loadAvailableFeats: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<FeatDefinitionContract>>>;
  loadAvailableEquipment: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<BaseItemDefinitionContract>>>;
  loadAvailableInfusions: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<
    ApiResponse<EntitledEntity<InfusionDefinitionContract>>
  >;
  makeLoadClassAlwaysKnownSpells: MakeClassBasedApiSpellsRequest;
  makeLoadClassRemainingSpells: MakeClassBasedApiSpellsRequest;
  infusionChoiceLookup: InfusionChoiceLookup;
  featLookup: FeatLookup;
  knownInfusionLookup: Record<string, InfusionChoice>;
  knownReplicatedItems: Array<string>;
  dataOriginRefData: DataOriginRefData;
  classSpellListSpellsLookup: ClassSpellListSpellsLookup;
  optionalClassFeatureLookup: OptionalClassFeatureLookup;
  theme: CharacterTheme;
  inventoryLookup: InventoryLookup;
  inventoryManager: InventoryManager;
  navigate: NavigateFunction;
  characterId: number;
  activeSourceCategories: Array<number>;
}

class ClassesManage extends React.PureComponent<Props> {
  handleInfusionChoiceItemChangePromise = (
    choiceKey: string,
    infusionId: string,
    itemDefinitionKey: string | null,
    itemName: string | null,
    accept: () => void,
    reject: () => void
  ): void => {
    // Bag of Holding change to something else
    const {
      dispatch,
      infusionChoiceLookup,
      inventoryLookup,
      inventoryManager,
    } = this.props;

    let itemId: string | null = null;
    let itemTypeId: string | null = null;
    if (itemDefinitionKey !== null) {
      itemId = DefinitionUtils.getDefinitionKeyId(itemDefinitionKey);
      itemTypeId = DefinitionUtils.getDefinitionKeyType(itemDefinitionKey);
    }

    const infusionChoice = HelperUtils.lookupDataOrFallback(
      infusionChoiceLookup,
      choiceKey
    );
    if (infusionChoice === null) {
      reject();
      return;
    }
    const infusion = InfusionChoiceUtils.getInfusion(infusionChoice);

    if (infusion) {
      const knownInfusion =
        InfusionChoiceUtils.getKnownInfusion(infusionChoice);
      let knownInfusionItemName: string | null = null;
      if (knownInfusion !== null) {
        knownInfusionItemName = KnownInfusionUtils.getItemName(knownInfusion);
      }
      const infusionId = InfusionUtils.getId(infusion);
      if (infusionId === null) {
        reject();
        return;
      }

      // Get the item
      const inventoryMappingId = InfusionUtils.getInventoryMappingId(infusion);
      const item = HelperUtils.lookupDataOrFallback(
        inventoryLookup,
        inventoryMappingId
      );

      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-infusion-item-change"],
          acceptBtnClsNames: ["character-button-remove"],
          heading: "Change Infusion Item Warning",
          content: (
            <div className="">
              <p>
                You are about to remove the existing replicated item{" "}
                <strong>{knownInfusionItemName}</strong>.
              </p>
              <p>
                Are you sure you want to change your choice to{" "}
                <strong>{itemName}</strong>?
              </p>
            </div>
          ),
          onConfirm: () => {
            if (item) {
              const isContainer = ItemUtils.isContainer(item);

              if (isContainer) {
                inventoryManager.handleRemove({ item });
                dispatch(
                  serviceDataActions.knownInfusionMappingSet(
                    choiceKey,
                    infusionId,
                    itemId,
                    itemTypeId,
                    itemName
                  )
                );
                accept();
                return;
              }
            }
            dispatch(
              serviceDataActions.infusionMappingDestroy(
                infusionId,
                InfusionUtils.getInventoryMappingId(infusion)
              )
            );
            dispatch(
              serviceDataActions.knownInfusionMappingSet(
                choiceKey,
                infusionId,
                itemId,
                itemTypeId,
                itemName
              )
            );
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    } else {
      dispatch(
        serviceDataActions.knownInfusionMappingSet(
          choiceKey,
          infusionId,
          itemId,
          itemTypeId,
          itemName
        )
      );
      accept();
    }
  };

  handleInfusionChoiceItemDestroyPromise = (
    choiceKey: string,
    accept: () => void,
    reject: () => void
  ): void => {
    const {
      dispatch,
      infusionChoiceLookup,
      inventoryLookup,
      inventoryManager,
    } = this.props;

    const infusionChoice = HelperUtils.lookupDataOrFallback(
      infusionChoiceLookup,
      choiceKey
    );
    if (infusionChoice === null) {
      reject();
      return;
    }
    const knownInfusion = InfusionChoiceUtils.getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
      reject();
      return;
    }
    const simulatedInfusion =
      KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
    if (simulatedInfusion === null) {
      reject();
      return;
    }
    const simulatedInfusionId = InfusionUtils.getId(simulatedInfusion);
    if (simulatedInfusionId === null) {
      reject();
      return;
    }

    const infusion = InfusionChoiceUtils.getInfusion(infusionChoice);

    if (infusion) {
      const infusionId = InfusionUtils.getId(infusion);
      if (infusionId === null) {
        reject();
        return;
      }

      // Get the item
      const inventoryMappingId = InfusionUtils.getInventoryMappingId(infusion);
      const item = HelperUtils.lookupDataOrFallback(
        inventoryLookup,
        inventoryMappingId
      );

      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-infusion-item-destroy"],
          acceptBtnClsNames: ["character-button-remove"],
          heading: "Remove Infusion Item Warning",
          content: (
            <div className="">
              <p>
                Are you sure you want to remove the existing replicated item{" "}
                <strong>{KnownInfusionUtils.getItemName(knownInfusion)}</strong>
                ?
              </p>
            </div>
          ),
          onConfirm: () => {
            if (item) {
              const isContainer = ItemUtils.isContainer(item);

              if (isContainer) {
                inventoryManager.handleRemove({ item });
                dispatch(
                  serviceDataActions.knownInfusionMappingSet(
                    choiceKey,
                    simulatedInfusionId,
                    null,
                    null,
                    null
                  )
                );
                accept();
                return;
              }
            }
            dispatch(
              serviceDataActions.infusionMappingDestroy(
                infusionId,
                InfusionUtils.getInventoryMappingId(infusion)
              )
            );
            dispatch(
              serviceDataActions.knownInfusionMappingSet(
                choiceKey,
                simulatedInfusionId,
                null,
                null,
                null
              )
            );
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    } else {
      dispatch(
        serviceDataActions.knownInfusionMappingSet(
          choiceKey,
          simulatedInfusionId,
          null,
          null,
          null
        )
      );
      accept();
    }
  };

  handleInfusionChoiceChangePromise = (
    choiceKey: string,
    infusionId: string,
    accept: () => void,
    reject: () => void
  ): void => {
    // Changing from replicate magic item to something else

    const {
      dispatch,
      infusionChoiceLookup,
      definitionPool,
      inventoryLookup,
      inventoryManager,
    } = this.props;

    const infusionChoice = HelperUtils.lookupDataOrFallback(
      infusionChoiceLookup,
      choiceKey
    );
    if (infusionChoice === null) {
      reject();
      return;
    }
    const infusion = InfusionChoiceUtils.getInfusion(infusionChoice);

    // if an infusion exists
    if (infusion) {
      const knownInfusion =
        InfusionChoiceUtils.getKnownInfusion(infusionChoice);
      let knownInfusionName: string | null = null;
      if (knownInfusion !== null) {
        const simulatedInfusion =
          KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
        if (simulatedInfusion !== null) {
          knownInfusionName = InfusionUtils.getName(simulatedInfusion);
        }
      }

      const definitionKey = DefinitionUtils.generateDefinitionKey(
        Constants.DefinitionTypeEnum.INFUSION,
        infusionId
      );
      const newInfusion = InfusionUtils.simulateInfusion(
        definitionKey,
        definitionPool
      );
      let newInfusionName: string | null = null;
      if (newInfusion !== null) {
        newInfusionName = InfusionUtils.getName(newInfusion);
      }

      const destroyInfusionId = InfusionUtils.getId(infusion);
      if (destroyInfusionId === null) {
        reject();
        return;
      }

      // Get the item
      const inventoryMappingId = InfusionUtils.getInventoryMappingId(infusion);
      const item = HelperUtils.lookupDataOrFallback(
        inventoryLookup,
        inventoryMappingId
      );

      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-infusion-change"],
          acceptBtnClsNames: ["character-button-remove"],
          heading: "Change Infusion Warning",
          content: (
            <div className="">
              <p>
                You are about to remove all infusion data related to the{" "}
                <strong>{knownInfusionName}</strong> Infusion.
              </p>
              <p>
                Are you sure you want to change your infusion to{" "}
                <strong>{newInfusionName}</strong>?
              </p>
            </div>
          ),
          onConfirm: () => {
            if (item) {
              const isContainer = ItemUtils.isContainer(item);

              if (isContainer) {
                inventoryManager.handleRemove({ item });
                dispatch(
                  serviceDataActions.knownInfusionMappingSet(
                    choiceKey,
                    infusionId,
                    null,
                    null,
                    null
                  )
                );
                accept();
                return;
              }
            }
            dispatch(
              serviceDataActions.infusionMappingDestroy(
                destroyInfusionId,
                InfusionUtils.getInventoryMappingId(infusion)
              )
            );
            dispatch(
              serviceDataActions.knownInfusionMappingSet(
                choiceKey,
                infusionId,
                null,
                null,
                null
              )
            );
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    } else {
      dispatch(
        serviceDataActions.knownInfusionMappingSet(
          choiceKey,
          infusionId,
          null,
          null,
          null
        )
      );
      accept();
    }
  };

  handleInfusionChoiceDestroyPromise = (
    choiceKey: string,
    accept: () => void,
    reject: () => void
  ): void => {
    const {
      dispatch,
      infusionChoiceLookup,
      inventoryLookup,
      inventoryManager,
    } = this.props;

    const infusionChoice = HelperUtils.lookupDataOrFallback(
      infusionChoiceLookup,
      choiceKey
    );
    if (infusionChoice === null) {
      reject();
      return;
    }
    const infusion = InfusionChoiceUtils.getInfusion(infusionChoice);

    // if an infusion exists
    if (infusion) {
      const knownInfusion =
        InfusionChoiceUtils.getKnownInfusion(infusionChoice);
      let knownInfusionName: string | null = null;
      if (knownInfusion !== null) {
        const simulatedInfusion =
          KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
        if (simulatedInfusion !== null) {
          knownInfusionName = InfusionUtils.getName(simulatedInfusion);
        }
      }

      // Get the item
      const inventoryMappingId = InfusionUtils.getInventoryMappingId(infusion);
      const item = HelperUtils.lookupDataOrFallback(
        inventoryLookup,
        inventoryMappingId
      );

      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-infusion-destroy"],
          acceptBtnClsNames: ["character-button-remove"],
          heading: "Remove Infusion Warning",
          content: (
            <div className="">
              <p>
                Are you sure you want to remove all infusion data related to the{" "}
                <strong>{knownInfusionName}</strong> Infusion?
              </p>
            </div>
          ),
          onConfirm: () => {
            if (item) {
              const isContainer = ItemUtils.isContainer(item);

              if (isContainer) {
                inventoryManager.handleRemove({ item });
                dispatch(
                  serviceDataActions.knownInfusionMappingDestroy(choiceKey)
                );
                accept();
                return;
              }
            }
            dispatch(serviceDataActions.knownInfusionMappingDestroy(choiceKey));
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    } else {
      dispatch(serviceDataActions.knownInfusionMappingDestroy(choiceKey));
      accept();
    }
  };

  handleInfusionChoiceCreatePromise = (
    choiceKey: string,
    infusionId: string,
    accept: () => void,
    reject: () => void
  ): void => {
    const { dispatch } = this.props;

    dispatch(
      serviceDataActions.knownInfusionMappingCreate(choiceKey, infusionId)
    );
    accept();
  };

  handleOptionalFeatureSelection = (
    definitionKey: string,
    affectedClassFeatureDefinitionKey: string | null
  ): void => {
    const { dispatch } = this.props;

    const classFeatureId =
      DefinitionUtils.hack__getDefinitionKeyId(definitionKey);
    if (!classFeatureId) {
      return;
    }

    const affectedClassFeatureId = affectedClassFeatureDefinitionKey
      ? DefinitionUtils.hack__getDefinitionKeyId(
          affectedClassFeatureDefinitionKey
        )
      : null;

    dispatch(
      characterActions.optionalClassFeatureCreate(
        classFeatureId,
        affectedClassFeatureId
      )
    );
  };

  handleRemoveOptionalFeatureSelectionPromise = (
    definitionKey: string,
    newIsEnabled: boolean,
    accept: () => void,
    reject: () => void
  ): void => {
    const {
      dispatch,
      optionalClassFeatureLookup,
      classSpellListSpellsLookup,
      dataOriginRefData,
    } = this.props;

    const optionalFeature = HelperUtils.lookupDataOrFallback(
      optionalClassFeatureLookup,
      definitionKey
    );
    if (!optionalFeature) {
      return;
    }

    const optionalClassFeature =
      OptionalClassFeatureUtils.getClassFeature(optionalFeature);
    if (!optionalClassFeature) {
      return;
    }

    const classFeatureId =
      OptionalClassFeatureUtils.getClassFeatureId(optionalFeature);
    const spellListIds =
      OptionalClassFeatureUtils.getRemoveMappingSpellListIds(optionalFeature);
    const hasSpellsToRemove = spellListIds.some((id) =>
      classSpellListSpellsLookup.hasOwnProperty(id)
    );

    if (!hasSpellsToRemove) {
      dispatch(characterActions.optionalClassFeatureDestroy(classFeatureId));
      accept();
    } else {
      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-remove"],
          acceptBtnClsNames: ["character-button-remove"],
          heading: "Optional Feature Warning",
          content: (
            <div className="">
              <p>
                You are about to remove{" "}
                <strong>
                  {ClassFeatureUtils.getName(optionalClassFeature)}
                </strong>{" "}
                from your character.
              </p>
              <p>
                After doing so, the following spells provided by this feature
                will be removed from your character:
              </p>
              <SimpleClassSpellList
                spellListIds={spellListIds}
                classSpellListSpellsLookup={classSpellListSpellsLookup}
              />
            </div>
          ),
          onConfirm: () => {
            dispatch(
              characterActions.optionalClassFeatureDestroy(classFeatureId)
            );
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    }
  };

  handleOnChangeOptionalClassFeatureReplacementPromise = (
    definitionKey: string,
    newAffectedDefinitionKey: string | null,
    oldAffectedDefinitionKey: string | null,
    accept: () => void,
    reject: () => void
  ): void => {
    const {
      dispatch,
      optionalClassFeatureLookup,
      classSpellListSpellsLookup,
      dataOriginRefData,
    } = this.props;

    if (newAffectedDefinitionKey === oldAffectedDefinitionKey) {
      return;
    }

    const optionalFeature = HelperUtils.lookupDataOrFallback(
      optionalClassFeatureLookup,
      definitionKey
    );
    if (!optionalFeature) {
      return;
    }

    const optionalClassFeature =
      OptionalClassFeatureUtils.getClassFeature(optionalFeature);
    if (!optionalClassFeature) {
      return;
    }

    const classFeatureId =
      OptionalClassFeatureUtils.getClassFeatureId(optionalFeature);
    const newAffectedClassFeatureId: number | null = newAffectedDefinitionKey
      ? DefinitionUtils.hack__getDefinitionKeyId(newAffectedDefinitionKey)
      : null;
    const spellListIds =
      OptionalClassFeatureUtils.getUpdateMappingSpellListIdsToRemove(
        optionalFeature,
        {
          affectedClassFeatureId: newAffectedClassFeatureId,
        }
      );
    const hasSpellsToRemove = spellListIds.some((id) =>
      classSpellListSpellsLookup.hasOwnProperty(id)
    );

    if (!hasSpellsToRemove) {
      dispatch(
        characterActions.optionalClassFeatureSetRequest(
          classFeatureId,
          newAffectedClassFeatureId
        )
      );
      accept();
    } else {
      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-remove"],
          acceptBtnClsNames: ["character-button-remove"],
          heading: "Optional Feature Warning",
          content: (
            <div className="">
              <p>
                You are about to change the Class Feature to be replaced by{" "}
                <strong>
                  {ClassFeatureUtils.getName(optionalClassFeature)}
                </strong>
                .
              </p>
              <p>
                After doing so, the following spells provided by this feature
                will be removed from your character:
              </p>
              <SimpleClassSpellList
                spellListIds={spellListIds}
                classSpellListSpellsLookup={classSpellListSpellsLookup}
              />
            </div>
          ),
          onConfirm: () => {
            dispatch(
              characterActions.optionalClassFeatureSetRequest(
                classFeatureId,
                newAffectedClassFeatureId
              )
            );
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    }
  };

  handleSpellAdd = (
    charClass: CharClass,
    spell: Spell,
    classMappingId: number
  ): void => {
    const { dispatch } = this.props;
    dispatch(
      characterActions.spellCreate(
        spell,
        classMappingId,
        AppNotificationUtils.handleSpellCreateAccepted.bind(
          this,
          spell,
          charClass
        )
      )
    );
  };

  handlePrepare = (spell: Spell, characterClassId: number): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.spellPreparedSet(spell, characterClassId, true));
  };

  handleUnprepare = (spell: Spell, characterClassId: number): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.spellPreparedSet(spell, characterClassId, false));
  };

  handleRemove = (spell: Spell, characterClassId: number): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.spellRemove(spell, characterClassId));
  };

  handleAlwaysKnownLoad = (
    spells: Array<BaseSpellContract>,
    classId: number
  ): void => {
    const { dispatch } = this.props;
    dispatch(serviceDataActions.classAlwaysKnownSpellsSet(spells, classId));
  };

  handleClassFeatureChoiceChange = (
    classId: number,
    classFeatureId: number,
    choiceType: any,
    choiceId: string,
    optionValue: number | null,
    parentChoiceId: string | null
  ): void => {
    const { dispatch } = this.props;
    dispatch(
      characterActions.classFeatureChoiceSetRequest(
        classId,
        classFeatureId,
        choiceType,
        choiceId,
        optionValue,
        parentChoiceId
      )
    );
  };

  handleDefinitionsLoaded = (
    definitions: Array<DefinitionContract>,
    accessTypes: Record<string, number>
  ): void => {
    const { dispatch } = this.props;
    dispatch(serviceDataActions.definitionPoolAdd(definitions, accessTypes));
  };

  handleFeatureDefinitionsLoaded = (
    entitledData: EntitledEntity<ClassFeatureDefinitionContract>
  ): void => {
    const { dispatch } = this.props;

    dispatch(
      serviceDataActions.definitionPoolAdd(
        entitledData.definitionData,
        entitledData.accessTypes
      )
    );
  };

  handleClassLevelChangePromise = (
    charClass: CharClass,
    classId: number,
    newLevel: string,
    oldLevel: string,
    accept: () => void,
    reject: () => void
  ): void => {
    const { dispatch, preferences, currentLevel, classes, ruleData } =
      this.props;

    const name = ClassUtils.getName(charClass);

    const newLevelValue = HelperUtils.parseInputInt(newLevel, 0);
    const oldLevelValue = HelperUtils.parseInputInt(oldLevel, 0);

    const newTotalClassLevel: number = classes.reduce(
      (acc: number, oldClass) =>
        (acc += oldClass.id === charClass.id ? newLevelValue : oldClass.level),
      0
    );
    const isLevelUp: boolean = newLevelValue > oldLevelValue;
    const isLevelDown: boolean = newLevelValue < oldLevelValue;

    // Modals to handle milestone
    if (
      isLevelUp &&
      preferences.progressionType ===
        Constants.PreferenceProgressionTypeEnum.MILESTONE
    ) {
      dispatch(characterActions.classLevelSetRequest(classId, newLevelValue));
      accept();
    }

    if (
      isLevelDown &&
      preferences.progressionType ===
        Constants.PreferenceProgressionTypeEnum.MILESTONE
    ) {
      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-level-down"],
          acceptBtnClsNames: ["character-button-remove"],
          heading: "Level Down",
          content: (
            <div className="change-level-content">
              {this.renderConfirmClassDisplay(
                charClass,
                currentLevel,
                newTotalClassLevel
              )}
              <p>Are you sure you want to level down in the {name} class?</p>
              <p>
                Your hit points will be reduced by the fixed amount and class
                feature choices you have made for the higher levels will be
                lost.
              </p>
            </div>
          ),
          onConfirm: () => {
            dispatch(
              characterActions.classLevelSetRequest(classId, newLevelValue)
            );
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    }

    // Modals to handle progression
    if (
      isLevelUp &&
      preferences.progressionType === Constants.PreferenceProgressionTypeEnum.XP
    ) {
      if (newTotalClassLevel <= currentLevel) {
        dispatch(characterActions.classLevelSetRequest(classId, newLevelValue));
        accept();
      } else {
        dispatch(
          confirmModalActions.create({
            conClsNames: ["confirm-modal-level-up"],
            heading: "Level Up",
            content: (
              <div className="change-level-content">
                {this.renderConfirmClassDisplay(
                  charClass,
                  currentLevel,
                  newTotalClassLevel
                )}
                <p>Are you sure you want to level up in the {name} class?</p>
                <p>
                  Your XP total will be increased to{" "}
                  {FormatUtils.renderLocaleNumber(
                    CharacterUtils.deriveCurrentLevelXp(
                      newTotalClassLevel,
                      ruleData
                    )
                  )}{" "}
                  to match your new level.
                </p>
              </div>
            ),
            onConfirm: () => {
              dispatch(
                characterActions.classLevelSetRequest(
                  classId,
                  newLevelValue,
                  CharacterUtils.deriveCurrentLevelXp(
                    newTotalClassLevel,
                    ruleData
                  )
                )
              );
              accept();
            },
            onCancel: () => {
              reject();
            },
          })
        );
      }
    }

    if (
      isLevelDown &&
      preferences.progressionType === Constants.PreferenceProgressionTypeEnum.XP
    ) {
      dispatch(
        confirmModalActions.create({
          conClsNames: ["confirm-modal-level-down"],
          acceptBtnClsNames: ["character-button-remove"],
          heading: "Level Down",
          content: (
            <div className="change-level-content">
              {this.renderConfirmClassDisplay(
                charClass,
                currentLevel,
                newTotalClassLevel
              )}
              <p>Are you sure you want to level down in the {name} class?</p>
              <p>
                Your hit points will be reduced by the fixed amount and class
                feature choices you have made for the higher levels will be
                lost.
              </p>
              <p>
                Your XP total will be decreased to{" "}
                {FormatUtils.renderLocaleNumber(
                  CharacterUtils.deriveCurrentLevelXp(
                    newTotalClassLevel,
                    ruleData
                  )
                )}{" "}
                to match your new level.
              </p>
            </div>
          ),
          onConfirm: () => {
            dispatch(
              characterActions.classLevelSetRequest(
                classId,
                newLevelValue,
                CharacterUtils.deriveCurrentLevelXp(
                  newTotalClassLevel,
                  ruleData
                )
              )
            );
            accept();
          },
          onCancel: () => {
            reject();
          },
        })
      );
    }
  };

  handleAddAnotherClass = (): void => {
    const { navigate, characterId } = this.props;
    navigate(
      navigationConfig
        .getRouteDefPath(RouteKey.CLASS_CHOOSE)
        .replace(":characterId", characterId)
    );
  };

  handleOpenHpManager = (): void => {
    const { dispatch } = this.props;
    dispatch(modalActions.open("hp"));
  };

  handleRemoveClass = (charClass: CharClass): void => {
    const { dispatch, preferences, classes, ruleData } = this.props;

    const newTotalClassLevel: number = classes.reduce(
      (acc: number, oldClass) =>
        (acc += oldClass.id === charClass.id ? 0 : oldClass.level),
      0
    );

    dispatch(
      confirmModalActions.create({
        conClsNames: ["confirm-modal-remove"],
        acceptBtnClsNames: ["character-button-remove"],
        heading: "Remove Class",
        content: (
          <div className="remove-class-content">
            {this.renderConfirmClassDisplay(charClass)}
            <p>
              Are you sure you want to remove all your levels in the{" "}
              {ClassUtils.getName(charClass)} class?
            </p>
            <p>
              Your hit points will be reduced by the fixed amount and class
              feature choices you have made for the higher levels will be lost.
            </p>
            {preferences.progressionType ===
              Constants.PreferenceProgressionTypeEnum.XP && (
              <p>Your XP total will be decreased to match your new level.</p>
            )}
          </div>
        ),
        onConfirm: () => {
          let newCharacterXp: number | null =
            preferences.progressionType ===
            Constants.PreferenceProgressionTypeEnum.XP
              ? CharacterUtils.deriveCurrentLevelXp(
                  newTotalClassLevel,
                  ruleData
                )
              : null;
          dispatch(
            characterActions.classRemoveRequest(charClass.id, newCharacterXp)
          );
        },
      })
    );
  };

  renderConfirmClassDisplay = (
    charClass: CharClass,
    currentLevel: number | null = null,
    newLevel: number | null = null
  ): React.ReactNode => {
    const name = ClassUtils.getName(charClass);
    const portraitAvatarUrl = ClassUtils.getPortraitUrl(charClass);
    return (
      <div className="confirm-class-simple">
        <div className="confirm-class-simple-preview">
          <img
            className="confirm-class-simple-preview-img"
            src={portraitAvatarUrl}
            alt=""
          />
        </div>
        <div className="confirm-class-simple-name">{name}</div>
        {currentLevel !== null && newLevel !== null && (
          <div className="confirm-class-simple-levels">
            <div className="confirm-class-simple-level confirm-class-simple-level-current">
              Current Level: {currentLevel}
            </div>
            <div className="confirm-class-simple-level confirm-class-simple-level-next">
              New Level: {newLevel}
            </div>
          </div>
        )}
      </div>
    );
  };

  render() {
    const {
      currentLevel,
      classes,
      totalClassLevel,
      hitPointInfo,
      choiceInfo,
      classSpellLists,
      spellCasterInfo,
      preferences,
      ruleData,
      loadAvailableFeats,
      loadAvailableSubclasses,
      loadAvailableEquipment,
      loadAvailableInfusions,
      loadAvailableOptionalClassFeatures,
      makeLoadClassAlwaysKnownSpells,
      makeLoadClassRemainingSpells,
      globalModifiers,
      typeValueLookup,
      definitionPool,
      overallSpellInfo,
      prerequisiteData,
      featLookup,
      knownReplicatedItems,
      knownInfusionLookup,
      dataOriginRefData,
      classSpellListSpellsLookup,
      optionalClassFeatureLookup,
      theme,
      activeSourceCategories,
    } = this.props;

    const levelsDiff: number = currentLevel - totalClassLevel;
    const levelsRemaining: number = Math.max(
      0,
      RuleDataUtils.getMaxCharacterLevel(ruleData) - totalClassLevel
    );
    const hitDice = hitPointInfo.classesHitDice.map(
      (classHitDice) => classHitDice.dice
    );
    const combinedHitDice: Array<DiceContract> = [];
    hitDice.forEach((hitDie) => {
      const existingDieIdx = combinedHitDice.findIndex(
        (hitDice) => hitDice.diceValue === hitDie.diceValue
      );
      if (existingDieIdx > -1) {
        let existingDie = combinedHitDice[existingDieIdx];
        combinedHitDice[existingDieIdx] = {
          ...combinedHitDice[existingDieIdx],
          diceCount:
            (existingDie.diceCount !== null ? existingDie.diceCount : 0) +
            (hitDie.diceCount !== null ? hitDie.diceCount : 0),
        };
      } else {
        combinedHitDice.push(hitDie);
      }
    });

    const hitDiceStrings = orderBy(combinedHitDice, ["diceValue"]).map(
      (hitDie) => DiceUtils.renderDie(hitDie)
    );

    return (
      <Page clsNames={["classes-manage"]}>
        <PageBody>
          <div className="classes-manage-primary">
            <div className="classes-manage-primary-section classes-manage-primary-section-progression">
              <ProgressionManager />
            </div>
            <div className="classes-manage-primary-section classes-manage-primary-section-hp">
              <div className="classes-manage-hitpoints">
                <div className="classes-manage-hitpoints-summary">
                  <div className="classes-manage-hitpoints-max">
                    <span className="classes-manage-hitpoints-label">
                      Max Hit Points:
                    </span>
                    <span className="classes-manage-hitpoints-data">
                      {hitPointInfo.totalHp}
                    </span>
                  </div>
                  <div className="classes-manage-hitpoints-hitdice">
                    <span className="classes-manage-hitpoints-label">
                      Hit Dice:
                    </span>
                    <span className="classes-manage-hitpoints-data">
                      {hitDiceStrings.join(" + ")}
                    </span>
                  </div>
                </div>
                <div className="classes-manage-hitpoints-actions">
                  <Button onClick={this.handleOpenHpManager}>Manage HP</Button>
                </div>
              </div>
            </div>
          </div>
          {classes.map((charClass) => (
            <ClassManager
              theme={theme}
              charClass={charClass}
              loadAvailableFeats={loadAvailableFeats}
              loadAvailableSubclasses={loadAvailableSubclasses}
              loadRemainingSpellList={makeLoadClassRemainingSpells(charClass)}
              loadAlwaysKnownSpells={makeLoadClassAlwaysKnownSpells(charClass)}
              loadAvailableOptionalClassFeatures={loadAvailableOptionalClassFeatures(
                charClass
              )}
              loadAvailableEquipment={loadAvailableEquipment}
              loadAvailableInfusions={loadAvailableInfusions}
              levelsRemaining={levelsRemaining}
              levelsDiff={levelsDiff}
              onClassFeatureChoiceChange={this.handleClassFeatureChoiceChange}
              onClassLevelChangePromise={this.handleClassLevelChangePromise}
              onRemoveClass={this.handleRemoveClass}
              onSpellPrepare={this.handlePrepare}
              onSpellUnprepare={this.handleUnprepare}
              onSpellRemove={this.handleRemove}
              onSpellAdd={this.handleSpellAdd.bind(this, charClass)}
              onAlwaysKnownLoad={this.handleAlwaysKnownLoad}
              onInfusionChoiceItemChangePromise={
                this.handleInfusionChoiceItemChangePromise
              }
              onInfusionChoiceItemDestroyPromise={
                this.handleInfusionChoiceItemDestroyPromise
              }
              onInfusionChoiceChangePromise={
                this.handleInfusionChoiceChangePromise
              }
              onInfusionChoiceDestroyPromise={
                this.handleInfusionChoiceDestroyPromise
              }
              onInfusionChoiceCreatePromise={
                this.handleInfusionChoiceCreatePromise
              }
              onOptionalFeatureSelection={this.handleOptionalFeatureSelection}
              onRemoveSelectionPromise={
                this.handleRemoveOptionalFeatureSelectionPromise
              }
              onChangeReplacementPromise={
                this.handleOnChangeOptionalClassFeatureReplacementPromise
              }
              onDefinitionsLoaded={this.handleDefinitionsLoaded}
              onFeatureDefinitionsLoaded={this.handleFeatureDefinitionsLoaded}
              key={charClass.id}
              isMulticlass={classes.length > 1}
              choiceInfo={choiceInfo}
              preferences={preferences}
              classSpellList={getClassSpellList(charClass, classSpellLists)}
              spellCasterInfo={spellCasterInfo}
              ruleData={ruleData}
              overallSpellInfo={overallSpellInfo}
              prerequisiteData={prerequisiteData}
              typeValueLookup={typeValueLookup}
              globalModifiers={globalModifiers}
              definitionPool={definitionPool}
              featLookup={featLookup}
              knownInfusionLookup={knownInfusionLookup}
              knownReplicatedItems={knownReplicatedItems}
              dataOriginRefData={dataOriginRefData}
              optionalClassFeatureLookup={optionalClassFeatureLookup}
              classSpellListSpellsLookup={classSpellListSpellsLookup}
              activeSourceCategories={activeSourceCategories}
            />
          ))}
          {levelsRemaining !== 0 && (
            <div className="classes-manage-actions">
              <div
                className="classes-manage-actions-action"
                onClick={this.handleAddAnotherClass}
              >
                + Add Another Class
              </div>
            </div>
          )}
        </PageBody>
      </Page>
    );
  }
}

function ClassesManageContainer(props) {
  const { inventoryManager } = useContext(InventoryManagerContext);
  const navigate = useNavigate();

  return (
    <ClassesManage
      inventoryManager={inventoryManager}
      navigate={navigate}
      {...props}
    />
  );
}

export default ConnectedBuilderPage(
  ClassesManageContainer,
  RouteKey.CLASS_MANAGE,
  (state) => {
    return {
      hitPointInfo: rulesEngineSelectors.getHitPointInfo(state),
      classes: rulesEngineSelectors.getClasses(state),
      classSpellLists: rulesEngineSelectors.getClassSpellLists(state),
      loadAvailableFeats: apiCreatorSelectors.makeLoadAvailableFeats(state),
      loadAvailableSubclasses:
        apiCreatorSelectors.makeLoadAvailableSubclasses(state),
      loadAvailableEquipment: apiCreatorSelectors.makeLoadAvailableItems(state),
      loadAvailableInfusions:
        apiCreatorSelectors.makeLoadAvailableInfusions(state),
      loadAvailableOptionalClassFeatures:
        apiCreatorSelectors.makeLoadAvailableOptionalClassFeatures(state),
      makeLoadClassRemainingSpells:
        apiCreatorSelectors.makeLoadClassRemainingSpells(state),
      makeLoadClassAlwaysKnownSpells:
        apiCreatorSelectors.makeLoadClassAlwaysKnownSpells(state),
      totalClassLevel: rulesEngineSelectors.getTotalClassLevel(state),
      currentLevel: rulesEngineSelectors.getCurrentLevel(state),
      choiceInfo: rulesEngineSelectors.getChoiceInfo(state),
      preferences: rulesEngineSelectors.getCharacterPreferences(state),
      spellCasterInfo: rulesEngineSelectors.getSpellCasterInfo(state),
      overallSpellInfo: rulesEngineSelectors.getOverallSpellInfo(state),
      ruleData: rulesEngineSelectors.getRuleData(state),
      prerequisiteData: rulesEngineSelectors.getPrerequisiteData(state),
      globalModifiers: rulesEngineSelectors.getValidGlobalModifiers(state),
      typeValueLookup:
        rulesEngineSelectors.getCharacterValueLookupByType(state),
      definitionPool: serviceDataSelectors.getDefinitionPool(state),
      infusionChoiceLookup: rulesEngineSelectors.getInfusionChoiceLookup(state),
      featLookup: rulesEngineSelectors.getFeatLookup(state),
      knownInfusionLookup: rulesEngineSelectors.getKnownInfusionLookup(state),
      knownReplicatedItems: rulesEngineSelectors.getKnownReplicatedItems(state),
      classSpellListSpellsLookup:
        rulesEngineSelectors.getClassSpellListSpellsLookup(state),
      dataOriginRefData: rulesEngineSelectors.getDataOriginRefData(state),
      optionalClassFeatureLookup:
        rulesEngineSelectors.getOptionalClassFeatureLookup(state),
      theme: rulesEngineSelectors.getCharacterTheme(state),
      inventoryLookup: rulesEngineSelectors.getInventoryLookup(state),
      characterId: rulesEngineSelectors.getId(state),
      activeSourceCategories:
        rulesEngineSelectors.getActiveSourceCategories(state),
    };
  }
);
