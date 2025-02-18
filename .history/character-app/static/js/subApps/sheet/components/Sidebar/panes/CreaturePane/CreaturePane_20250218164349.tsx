import clsx from "clsx";
import {
  FC,
  Fragment,
  HTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Collapsible,
  CollapsibleHeaderCallout,
  CollapsibleHeaderContent,
  CreatureName,
  InfusionPreview,
} from "../../character-components/es";
import {
  characterActions,
  Constants,
  Creature,
  CreatureUtils,
  InfusionUtils,
  serviceDataActions,
  SourceUtils,
  ValueUtils,
} from "../../character-rules-engine/es";

import { Button } from "~/components/Button";
import { EditableName } from "~/components/EditableName";
import { HtmlContent } from "~/components/HtmlContent";
import { Reference } from "~/components/Reference";
import { TagGroup } from "~/components/TagGroup";
import { useSidebar } from "~/contexts/Sidebar";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { CreatureBlock } from "~/subApps/sheet/components/CreatureBlock";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";
import { Preview } from "~/subApps/sheet/components/Sidebar/components/Preview";
import {
  PaneComponentEnum,
  PaneIdentifiersCreature,
} from "~/subApps/sheet/components/Sidebar/types";

import CustomizeDataEditor from "../../../../../../tools/js/Shared/components/CustomizeDataEditor";
import EditorBox from "../../../../../../tools/js/Shared/components/EditorBox";
import ValueEditor from "../../../../../../tools/js/Shared/components/ValueEditor";
import { RemoveButton } from "../../../../../../tools/js/Shared/components/common/Button";
import { appEnvSelectors } from "../../../../../../tools/js/Shared/selectors";
import { PaneIdentifierUtils } from "../../../../../../tools/js/Shared/utils";
import { DeathSummary } from "../../../HitPointsBox/DeathSummary";
import { HitPointsSummary } from "../../../HitPointsBox/HitPointsSummary";
import { PaneInitFailureContent } from "../../components/PaneInitFailureContent";
import { QuickActions } from "../../components/QuickActions";
import { HitPointsAdjuster } from "../HitPointsManagePane/HitPointsAdjuster";
import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  identifiers: PaneIdentifiersCreature | null;
}

export const CreaturePane: FC<Props> = ({ identifiers, ...props }) => {
  const { pane } = useSidebar();

  const {
    ruleData,
    creatures,
    entityValueLookup,
    snippetData,
    infusionChoiceLookup,
    proficiencyBonus,
    characterTheme: theme,
    hpInfo,
    deathCause,
  } = useCharacterEngine();
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);
  const dispatch = useDispatch();

  const getCreature = useCallback((): Creature | null => {
    return (
      creatures.find(
        (creature) => identifiers?.id === CreatureUtils.getMappingId(creature)
      ) ?? null
    );
  }, [creatures, identifiers]);

  const [creature, setCreature] = useState<Creature | null>(getCreature());
  const [isCustomizeClosed, setIsCustomizeClosed] = useState(true);

  useEffect(() => {
    const foundCreature = getCreature();

    setCreature(foundCreature);
  }, [getCreature]);

  const getData = (): Record<string, any> => {
    if (!creature) {
      return {};
    }

    return {
      name: CreatureUtils.getName(creature),
      description: creature.description,
      groupId: CreatureUtils.getGroupId(creature),
    };
  };

  const handleToggleCustomize = () => {
    setIsCustomizeClosed(!isCustomizeClosed);
  };

  const dispatchTempHp = (value: number): void => {
    if (!creature) {
      return;
    }

    const useOwnerHp = CreatureUtils.getUseOwnerHp(creature);
    const id = CreatureUtils.getMappingId(creature);
    const hitPointInfo = useOwnerHp
      ? hpInfo
      : CreatureUtils.getHitPointInfo(creature);

    dispatch(
      useOwnerHp
        ? characterActions.hitPointsSet(hitPointInfo.removedHp, value)
        : characterActions.creatureHitPointsSet(
            id,
            hitPointInfo.removedHp,
            value
          )
    );
  };

  const handleQuickTempAction = (value: number): void => {
    dispatchTempHp(value);
  };

  const handleSaveProperties = (properties: Record<string, any>): void => {
    if (!creature) {
      return;
    }

    const data = getData();
    const prevData: Record<string, any> = data || {};

    const newProperties: Record<string, any> = {
      ...prevData,
      ...properties,
    };

    dispatch(
      characterActions.creatureDataSet(
        CreatureUtils.getMappingId(creature),
        newProperties as any
      )
    );
  };

  const handleDataUpdate = (data: Record<string, any>): void => {
    if (!data.name) {
      data.name = null;
    }

    handleSaveProperties(data);
  };

  const handleCustomDataUpdate = (
    key: number,
    value: string,
    source: string | null
  ): void => {
    if (!creature) {
      return;
    }

    dispatch(
      characterActions.valueSet(
        key,
        value,
        source,
        ValueUtils.hack__toString(CreatureUtils.getMappingId(creature)),
        ValueUtils.hack__toString(
          CreatureUtils.getMappingEntityTypeId(creature)
        )
      )
    );
  };

  const handleRemoveCustomizations = (): void => {
    if (creature) {
      dispatch(
        characterActions.creatureCustomizationsDelete(
          CreatureUtils.getMappingId(creature),
          CreatureUtils.getMappingEntityTypeId(creature)
        )
      );
    }
  };

  const handleRemove = (): void => {
    if (!creature) {
      return;
    }

    pane.paneHistoryStart(PaneComponentEnum.EXTRA_MANAGE);
    dispatch(
      characterActions.creatureRemove(CreatureUtils.getMappingId(creature))
    );
  };

  const handleRemoveInfusion = (): void => {
    if (!creature) {
      return;
    }

    const infusion = CreatureUtils.getInfusion(creature);
    if (infusion) {
      const infusionId = InfusionUtils.getId(infusion);
      if (infusionId === null) {
        return;
      }

      const choiceKey = InfusionUtils.getChoiceKey(infusion);
      if (choiceKey !== null) {
        pane.paneHistoryStart(
          PaneComponentEnum.INFUSION_CHOICE,
          PaneIdentifierUtils.generateInfusionChoice(choiceKey)
        );
      }
      dispatch(
        serviceDataActions.infusionMappingDestroy(
          infusionId,
          InfusionUtils.getInventoryMappingId(infusion)
        )
      );
    }
  };

  const handleInfusionClick = (): void => {
    if (!creature) {
      return;
    }

    const infusion = CreatureUtils.getInfusion(creature);
    if (infusion) {
      const choiceKey = InfusionUtils.getChoiceKey(infusion);
      if (choiceKey !== null) {
        pane.paneHistoryPush(
          PaneComponentEnum.INFUSION_CHOICE,
          PaneIdentifierUtils.generateInfusionChoice(choiceKey)
        );
      }
    }
  };

  const handleDeathSummaryClick = (evt: React.MouseEvent): void => {
    if (!isReadonly) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      pane.paneHistoryPush(PaneComponentEnum.HEALTH_MANAGE);
    }
  };

  const renderHealthAdjuster = (): React.ReactNode => {
    if (!creature) {
      return null;
    }

    const creatureHpInfo = CreatureUtils.getHitPointInfo(creature);

    // Key to check if the creature has useOwnerHp set to true
    const creatureGroupName = CreatureUtils.getGroupInfo(creature)?.name;
    const useOwnerHp = CreatureUtils.getUseOwnerHp(creature);
    const initialTempHp = CreatureUtils.getInitialTempHp(creature);

    const hp = useOwnerHp ? hpInfo : creatureHpInfo;

    const tempHp = hp.tempHp ?? 0;

    const extraNode: React.ReactNode = (
      <>
        <span className={clsx([tempHp > 0 && styles.hasTempHp])}>
          {hp.remainingHp + tempHp}
        </span>
        <span className={styles.valueSep}>/</span>
        <span className={clsx([tempHp > 0 && styles.hasTempHp])}>
          {hp.totalHp + tempHp}
        </span>
      </>
    );

    const headerCalloutNode: React.ReactNode = (
      <CollapsibleHeaderCallout extra={extraNode} value={null} />
    );

    const headerNode: React.ReactNode = (
      <CollapsibleHeaderContent
        heading="Hit Points"
        callout={headerCalloutNode}
      />
    );

    return (
      <div className={clsx([styles.adjuster, styles.hasSeparator])}>
        <Collapsible header={headerNode}>
          {useOwnerHp &&
          (deathCause === Constants.DeathCauseEnum.CONDITION ||
            hpInfo.remainingHp <= 0) ? (
            <DeathSummary
              className={styles.deathSummary}
              onClick={handleDeathSummaryClick}
            />
          ) : (
            <div className={styles.hitPointsContainer}>
              {creatureGroupName === Constants.DB_STRING_WILDSHAPE_2024 &&
                useOwnerHp && (
                  <p className={clsx([styles.wildshapeInfo, styles.block])}>
                    Wild Shape modifies your character's HP. Your sheet will
                    reflect these changes.
                  </p>
                )}
              <HitPointsSummary
                hpInfo={hp}
                creature={useOwnerHp ? undefined : creature}
                showPermanentInputs
              />
              {!isReadonly && (
                <HitPointsAdjuster
                  hpInfo={hp}
                  creature={useOwnerHp ? undefined : creature}
                />
              )}
              {creatureGroupName === Constants.DB_STRING_WILDSHAPE_2024 &&
                initialTempHp !== 0 && (
                  <p className={styles.wildshapeInfo}>
                    When you assume a Wild Shape form, you gain{" "}
                    <b>{initialTempHp}</b> Temporary HP.
                  </p>
                )}
              {!isReadonly && renderQuickActions()}
            </div>
          )}
        </Collapsible>
      </div>
    );
  };

  const renderQuickActions = (): React.ReactNode => {
    if (!creature) {
      return null;
    }

    // If initialTempHp exists and is not 0, render a button to add the initial temp hp to the creature.
    const initialTempHp = CreatureUtils.getInitialTempHp(creature);
    if (!initialTempHp) {
      return null;
    }

    const actions = [] as {
      label: string;
      onClick: () => void;
      disabled: boolean;
    }[];

    actions.push({
      label: `Set Temp HP to ${initialTempHp}`,
      onClick: () => handleQuickTempAction(initialTempHp),
      disabled: false,
    });

    return <QuickActions actions={actions}></QuickActions>;
  };

  const renderDescription = (
    label: React.ReactNode,
    description: string | null
  ): React.ReactNode => {
    if (!description) {
      return null;
    }

    return (
      <div className={styles.description}>
        {label && <Heading>{label}</Heading>}
        <HtmlContent html={description} withoutTooltips />
      </div>
    );
  };

  const renderTags = (): React.ReactNode => {
    if (!creature) {
      return null;
    }

    const tags = CreatureUtils.getTags(creature);
    const envTags = CreatureUtils.getEnvironmentTags(creature);

    return (
      <>
        {tags.length > 0 && <TagGroup label="Tags" tags={tags} />}
        {envTags.length > 0 && <TagGroup label="Habitats" tags={envTags} />}
      </>
    );
  };

  const renderCustomize = (): React.ReactNode => {
    if (isReadonly || !creature) {
      return null;
    }

    const useOwnerHp = CreatureUtils.getUseOwnerHp(creature);

    const optionRestrictions: Record<number, Array<number> | null> = {};
    const groupInfo = CreatureUtils.getGroupInfo(creature);
    if (groupInfo?.monsterTypes?.length) {
      optionRestrictions[Constants.AdjustmentTypeEnum.CREATURE_TYPE_OVERRIDE] =
        groupInfo.monsterTypes;
    }

    const isCustomized = CreatureUtils.isCustomized(creature);

    const valueEditors = [
      Constants.AdjustmentTypeEnum.CREATURE_SIZE,
      Constants.AdjustmentTypeEnum.CREATURE_TYPE_OVERRIDE,
      Constants.AdjustmentTypeEnum.CREATURE_ALIGNMENT,
      Constants.AdjustmentTypeEnum.CREATURE_AC,
      Constants.AdjustmentTypeEnum.CREATURE_HIT_POINTS,
      Constants.AdjustmentTypeEnum.CREATURE_NOTES,
    ];
    // Filter out hitpoints if the creature has useOwnerHp set to true
    if (useOwnerHp) {
      valueEditors.splice(
        valueEditors.indexOf(Constants.AdjustmentTypeEnum.CREATURE_HIT_POINTS),
        1
      );
    }
    const labelOverrides = {
      [Constants.AdjustmentTypeEnum.CREATURE_AC]: "Armor Class",
      [Constants.AdjustmentTypeEnum.CREATURE_ALIGNMENT]: "Alignment",
      [Constants.AdjustmentTypeEnum.CREATURE_HIT_POINTS]: "Max HP",
      [Constants.AdjustmentTypeEnum.CREATURE_SIZE]: "Size",
      [Constants.AdjustmentTypeEnum.CREATURE_TYPE_OVERRIDE]: "Type",
      [Constants.AdjustmentTypeEnum.CREATURE_NOTES]: "Notes",
    };

    return (
      <div className={styles.hasSeparator}>
        <Collapsible
          layoutType={"minimal"}
          header={`Customize${isCustomized ? "*" : ""}`}
          collapsed={isCustomizeClosed}
          onChangeHandler={handleToggleCustomize}
        >
          <EditorBox className={styles.editor}>
            <CustomizeDataEditor
              data={getData()}
              enableName={true}
              onDataUpdate={handleDataUpdate}
            />
            <ValueEditor
              dataLookup={ValueUtils.getEntityData(
                entityValueLookup,
                ValueUtils.hack__toString(CreatureUtils.getMappingId(creature)),
                ValueUtils.hack__toString(
                  CreatureUtils.getMappingEntityTypeId(creature)
                )
              )}
              onDataUpdate={handleCustomDataUpdate}
              valueEditors={valueEditors}
              labelOverrides={labelOverrides}
              layoutType={"standard"}
              optionRestrictions={optionRestrictions}
              ruleData={ruleData}
            />
            <RemoveButton
              enableConfirm={true}
              size="medium"
              style="filled"
              disabled={!isCustomized}
              isInteractive={isCustomized}
              onClick={handleRemoveCustomizations}
            >
              {isCustomized ? "Remove" : "No"} Customizations
            </RemoveButton>
          </EditorBox>
        </Collapsible>
      </div>
    );
  };

  const renderInfusionPreview = (): React.ReactNode => {
    if (!creature) {
      return null;
    }

    const infusion = CreatureUtils.getInfusion(creature);
    if (infusion) {
      return (
        <div className={styles.hasSeparator}>
          <InfusionPreview
            infusion={infusion}
            snippetData={snippetData}
            ruleData={ruleData}
            infusionChoiceLookup={infusionChoiceLookup}
            onClick={handleInfusionClick}
            proficiencyBonus={proficiencyBonus}
          />
        </div>
      );
    }

    return null;
  };

  const key: string = creature ? CreatureUtils.getUniqueKey(creature) : "";
  const groupInfo = creature ? CreatureUtils.getGroupInfo(creature) : null;
  const largeAvatarUrl = creature
    ? CreatureUtils.getLargeAvatarUrl(creature)
    : null;

  const infusion = creature ? CreatureUtils.getInfusion(creature) : null;

  return (
    <div key={key} {...props}>
      {!creature ? (
        <>
          <Header>Missing Creature</Header>
          <PaneInitFailureContent />
        </>
      ) : (
        <>
          <Header
            parent={groupInfo?.name || null}
            preview={
              <Preview imageUrl={CreatureUtils.getAvatarUrl(creature)} />
            }
          >
            <EditableName onClick={handleToggleCustomize}>
              <CreatureName theme={theme} creature={creature} />
            </EditableName>
          </Header>
          {CreatureUtils.isHomebrew(creature) ? (
            <Reference isDarkMode={theme.isDarkMode} name="Homebrew" />
          ) : (
            SourceUtils.getSourceFullNames(
              CreatureUtils.getSources(creature),
              ruleData
            ).map((source, idx) => {
              return (
                <Fragment key={source}>
                  {idx > 0 ? " /" : ""}{" "}
                  <Reference isDarkMode={theme.isDarkMode} name={source} />
                </Fragment>
              );
            })
          )}
          {renderCustomize()}
          {renderHealthAdjuster()}
          <div className={styles.block}>
            <CreatureBlock
              variant="default"
              creature={creature}
              ruleData={ruleData}
            />
          </div>
          {largeAvatarUrl && (
            <img
              className={styles.img}
              src={largeAvatarUrl}
              alt={CreatureUtils.getDefinitionName(creature)}
            />
          )}
          {renderTags()}
          {renderDescription(
            null,
            CreatureUtils.getCharacteristicsDescription(creature)
          )}
          {renderDescription(
            "Lair",
            CreatureUtils.getLairDescription(creature)
          )}
          {renderInfusionPreview()}
          {!isReadonly && (
            <div className={clsx([styles.hasSeparator, styles.removeButton])}>
              <Button
                variant="outline"
                size="xx-small"
                themed
                onClick={() => {
                  if (infusion) {
                    handleRemoveInfusion();
                  } else {
                    handleRemove();
                  }
                }}
              >
                {infusion ? "Remove Infusion" : "Delete"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
