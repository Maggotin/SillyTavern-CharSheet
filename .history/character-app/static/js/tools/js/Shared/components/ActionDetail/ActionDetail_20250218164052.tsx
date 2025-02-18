import React from "react";

import {
  Collapsible,
  DamageTypeIcon,
  MarketplaceCta,
  AoeTypeIcon,
  ComponentConstants,
} from "@dndbeyond/character-components/es";
import {
  AbilityLookup,
  AccessUtils,
  Action,
  ActionUtils,
  ActivationUtils,
  BaseInventoryContract,
  CharacterTheme,
  Constants,
  DiceUtils,
  EntityUtils,
  EntityValueLookup,
  FormatUtils,
  HelperUtils,
  InfusionUtils,
  InventoryLookup,
  ItemUtils,
  LimitedUseUtils,
  ModelInfoContract,
  RuleData,
  RuleDataUtils,
  ValueUtils,
} from "../../rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { InfoItem } from "~/components/InfoItem";
import { NumberDisplay } from "~/components/NumberDisplay";

import EditorBox from "../EditorBox";
import SlotManager from "../SlotManager";
import SlotManagerLarge from "../SlotManagerLarge";
import ValueEditor from "../ValueEditor";
import { RemoveButton } from "../common/Button";
import styles from "./styles.module.css";

interface Props {
  action: Action;
  ruleData: RuleData;
  onCustomDataUpdate?: (
    propertyKey: Constants.AdjustmentTypeEnum,
    value: any,
    source: any
  ) => void;
  showCustomize?: boolean;
  entityValueLookup: EntityValueLookup;
  abilityLookup: AbilityLookup;
  inventoryLookup: InventoryLookup;
  isReadonly: boolean;
  largePoolMinAmount?: number;
  onLimitedUseSet?: (usedAmount: number) => void;
  onCustomizationsRemove?: () => void;
  proficiencyBonus: number;
  theme?: CharacterTheme;
}

const infoItemProps = { role: "listItem", inline: true };

export const ActionDetail = ({
  showCustomize = true,
  largePoolMinAmount = 11,
  onCustomizationsRemove,
  ruleData,
  abilityLookup,
  action,
  onLimitedUseSet,
  proficiencyBonus,
  isReadonly,
  entityValueLookup,
  onCustomDataUpdate,
  theme,
  inventoryLookup,
}: Props) => {
  const handleRemoveCustomizations = () => {
    if (onCustomizationsRemove) {
      onCustomizationsRemove();
    }
  };

  const renderSmallAmountSlotPool = (): React.ReactNode => {
    let limitedUse = ActionUtils.getLimitedUse(action);
    if (!limitedUse) {
      return null;
    }

    const numberUsed = LimitedUseUtils.getNumberUsed(limitedUse);
    const maxUses = LimitedUseUtils.deriveMaxUses(
      limitedUse,
      abilityLookup,
      ruleData,
      proficiencyBonus
    );

    return (
      <SlotManager
        used={numberUsed}
        available={maxUses}
        size={"small"}
        onSet={onLimitedUseSet}
      />
    );
  };

  const renderLargeAmountSlotPool = (): React.ReactNode => {
    let limitedUse = ActionUtils.getLimitedUse(action);
    if (!limitedUse) {
      return null;
    }

    const numberUsed = LimitedUseUtils.getNumberUsed(limitedUse);
    const maxUses = LimitedUseUtils.deriveMaxUses(
      limitedUse,
      abilityLookup,
      ruleData,
      proficiencyBonus
    );

    return (
      <SlotManagerLarge
        available={maxUses}
        used={numberUsed}
        onSet={onLimitedUseSet}
        isReadonly={isReadonly}
      />
    );
  };

  const renderLimitedUses = (): React.ReactNode => {
    let limitedUse = ActionUtils.getLimitedUse(action);
    if (!limitedUse) {
      return null;
    }

    let maxUses = LimitedUseUtils.deriveMaxUses(
      limitedUse,
      abilityLookup,
      ruleData,
      proficiencyBonus
    );
    if (!maxUses) {
      return null;
    }
    let numberUsed = LimitedUseUtils.getNumberUsed(limitedUse);
    let totalSlots: number = Math.max(maxUses, numberUsed);

    return (
      <div className={styles.limitedUses}>
        <div className={styles.limitedUsesLabel}>Limited Use</div>
        {totalSlots >= largePoolMinAmount
          ? renderLargeAmountSlotPool()
          : renderSmallAmountSlotPool()}
      </div>
    );
  };

  const renderCustomize = (): React.ReactNode => {
    const mappingId = ActionUtils.getMappingId(action);
    const mappingEntityTypeId = ActionUtils.getMappingEntityTypeId(action);

    if (
      !showCustomize ||
      isReadonly ||
      mappingId === null ||
      mappingEntityTypeId === null
    ) {
      return null;
    }

    let valueEditorComponents: Array<Constants.AdjustmentTypeEnum> = [
      Constants.AdjustmentTypeEnum.TO_HIT_OVERRIDE,
      Constants.AdjustmentTypeEnum.TO_HIT_BONUS,
      Constants.AdjustmentTypeEnum.FIXED_VALUE_BONUS,
      Constants.AdjustmentTypeEnum.DISPLAY_AS_ATTACK,
      Constants.AdjustmentTypeEnum.NAME_OVERRIDE,
      Constants.AdjustmentTypeEnum.NOTES,
    ];

    const isCustomized = ActionUtils.isCustomized(action);

    return (
      <Collapsible
        layoutType={"minimal"}
        header={`Customize${isCustomized ? "*" : ""}`}
        className={styles.customize}
      >
        <EditorBox>
          <ValueEditor
            dataLookup={ValueUtils.getEntityData(
              entityValueLookup,
              mappingId,
              mappingEntityTypeId
            )}
            onDataUpdate={onCustomDataUpdate}
            valueEditors={valueEditorComponents}
            ruleData={ruleData}
            labelOverrides={{
              [Constants.AdjustmentTypeEnum.NAME_OVERRIDE]: "Name",
              [Constants.AdjustmentTypeEnum.FIXED_VALUE_BONUS]: "Damage Bonus",
            }}
            defaultValues={{
              [Constants.AdjustmentTypeEnum.DISPLAY_AS_ATTACK]:
                ActionUtils.isDefaultDisplayAsAttack(action),
            }}
            layoutType={"compact"}
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
    );
  };

  const getRangedInfoData = (): Array<React.ReactNode> => {
    let rangeInfo = ActionUtils.getRange(action);
    let attackRangeId = ActionUtils.getAttackRangeId(action);

    let rangeAreas: Array<React.ReactNode> = [];
    if (
      rangeInfo !== null &&
      attackRangeId === Constants.AttackTypeRangeEnum.RANGED
    ) {
      if (
        rangeInfo.origin &&
        rangeInfo.origin !== Constants.SpellRangeTypeEnum.RANGED
      ) {
        let spellRangeType = RuleDataUtils.getSpellRangeType(
          rangeInfo.origin,
          ruleData
        );
        if (spellRangeType !== null) {
          rangeAreas.push(spellRangeType.name);
        }
      }

      if (rangeInfo.range) {
        rangeAreas.push(
          <React.Fragment>
            <NumberDisplay type="distanceInFt" number={rangeInfo.range} />
            {rangeInfo.longRange && <span>({rangeInfo.longRange})</span>}
          </React.Fragment>
        );
      }

      if (rangeInfo.aoeSize) {
        let aoeType: ModelInfoContract | null = null;
        if (rangeInfo.aoeType !== null) {
          aoeType = RuleDataUtils.getAoeType(rangeInfo.aoeType, ruleData);
        }
        rangeAreas.push(
          <React.Fragment>
            <NumberDisplay type="distanceInFt" number={rangeInfo.aoeSize} />
            {aoeType !== null && (
              <span className={styles.rangeShape}>
                <AoeTypeIcon
                  className={styles.rangeIcon}
                  type={
                    FormatUtils.slugify(
                      aoeType.name
                    ) as ComponentConstants.AoeTypePropType
                  }
                  themeMode={theme?.isDarkMode ? "gray" : "dark"}
                />
              </span>
            )}
          </React.Fragment>
        );
      }
    }

    return rangeAreas;
    //`
  };

  const renderDamageProperties = (): React.ReactNode => {
    let damage = ActionUtils.getDamage(action);

    let damageDisplay: React.ReactNode = null;
    if (damage.value !== null) {
      if (typeof damage.value === "number") {
        damageDisplay = damage.value;
      } else {
        damageDisplay = DiceUtils.renderDice(damage.value);
      }
    }

    return (
      <React.Fragment>
        {damageDisplay !== null && (
          <InfoItem label="Damage:" {...infoItemProps}>
            {damageDisplay}
          </InfoItem>
        )}
        {damage.type !== null && damage.type.name !== null && (
          <InfoItem label="Damage Type:" {...infoItemProps}>
            <DamageTypeIcon
              theme={theme}
              type={
                FormatUtils.slugify(
                  damage.type.name
                ) as ComponentConstants.DamageTypePropType
              }
            />
            {damage.type.name}
          </InfoItem>
        )}
      </React.Fragment>
    );
  };

  const renderWeaponProperties = (): React.ReactNode => {
    let isProficient = ActionUtils.isProficient(action);
    let toHit = ActionUtils.getToHit(action);
    let attackRangeId = ActionUtils.getAttackRangeId(action);
    let statId = ActionUtils.getStatId(action);
    let requiresAttackRoll = ActionUtils.requiresAttackRoll(action);
    let requiresSavingThrow = ActionUtils.requiresSavingThrow(action);
    let activation = ActionUtils.getActivation(action);
    let notes = ActionUtils.getNotes(action);
    let attackSubtypeId = ActionUtils.getAttackSubtypeId(action);
    let saveStateId = ActionUtils.getSaveStatId(action);

    let rangeAreas: Array<React.ReactNode> = [];
    if (attackRangeId === Constants.AttackTypeRangeEnum.RANGED) {
      rangeAreas = getRangedInfoData();
    } else {
      rangeAreas.push(
        <React.Fragment>
          <NumberDisplay
            type="distanceInFt"
            number={ActionUtils.getReach(action)}
          />{" "}
          Reach
        </React.Fragment>
      );
    }

    return (
      <div className={styles.properties} role="list">
        {activation !== null && activation.activationType && (
          <InfoItem label="Action Type:" {...infoItemProps}>
            {ActivationUtils.renderActivation(activation, ruleData)}
          </InfoItem>
        )}
        {attackSubtypeId && (
          <InfoItem label="Attack Type:" {...infoItemProps}>
            {ActionUtils.getAttackSubtypeName(action)}
          </InfoItem>
        )}
        {requiresAttackRoll && (
          <InfoItem label="To Hit:" {...infoItemProps}>
            <NumberDisplay type="signed" number={toHit} />
          </InfoItem>
        )}
        {requiresSavingThrow && (
          <InfoItem label="Attack/Save:" {...infoItemProps}>
            {saveStateId !== null
              ? RuleDataUtils.getStatNameById(saveStateId, ruleData)
              : ""}{" "}
            {ActionUtils.getAttackSaveValue(action)}
          </InfoItem>
        )}
        {renderDamageProperties()}
        {requiresAttackRoll && (
          <InfoItem label="Stat:" {...infoItemProps}>
            {statId === null
              ? "--"
              : RuleDataUtils.getStatNameById(statId, ruleData)}
          </InfoItem>
        )}
        {rangeAreas.length > 0 && (
          <InfoItem label="Range/Area:" {...infoItemProps}>
            {rangeAreas.map((node, idx) => (
              <React.Fragment key={idx}>
                {node}
                {idx + 1 < rangeAreas.length ? "/" : ""}
              </React.Fragment>
            ))}
          </InfoItem>
        )}
        {isProficient && (
          <InfoItem label="Proficient:" {...infoItemProps}>
            Yes
          </InfoItem>
        )}
        {notes && (
          <InfoItem label="Notes:" {...infoItemProps}>
            {notes}
          </InfoItem>
        )}
      </div>
    );
  };

  const renderSpellProperties = (): React.ReactNode => {
    let isProficient = ActionUtils.isProficient(action);
    let toHit = ActionUtils.getToHit(action);
    let statId = ActionUtils.getStatId(action);
    let requiresAttackRoll = ActionUtils.requiresAttackRoll(action);
    let requiresSavingThrow = ActionUtils.requiresSavingThrow(action);
    let activation = ActionUtils.getActivation(action);
    let notes = ActionUtils.getNotes(action);
    let attackSubtypeId = ActionUtils.getAttackSubtypeId(action);
    let saveStateId = ActionUtils.getSaveStatId(action);

    let rangeAreas = getRangedInfoData();
    return (
      <div className={styles.properties} role="list">
        {activation !== null && activation.activationType && (
          <InfoItem label="Casting Time:" {...infoItemProps}>
            {ActivationUtils.renderActivation(activation, ruleData)}
          </InfoItem>
        )}
        {attackSubtypeId && (
          <InfoItem label="Attack Type:">
            {ActionUtils.getAttackSubtypeName(action)}
          </InfoItem>
        )}
        {requiresAttackRoll && (
          <InfoItem label="To Hit:">
            <NumberDisplay type="signed" number={toHit} />
          </InfoItem>
        )}
        {requiresSavingThrow && (
          <InfoItem label="Attack/Save:">
            {saveStateId !== null
              ? RuleDataUtils.getStatNameById(saveStateId, ruleData)
              : ""}{" "}
            {ActionUtils.getAttackSaveValue(action)}
          </InfoItem>
        )}
        {renderDamageProperties()}
        {requiresAttackRoll && (
          <InfoItem label="Stat:">
            {statId === null
              ? "--"
              : RuleDataUtils.getStatNameById(statId, ruleData)}
          </InfoItem>
        )}
        {rangeAreas.length > 0 && (
          <InfoItem label="Range/Area:">
            {rangeAreas.map((node, idx) => (
              <React.Fragment key={idx}>
                {node}
                {idx + 1 < rangeAreas.length ? "/" : ""}
              </React.Fragment>
            ))}
          </InfoItem>
        )}
        {isProficient && <InfoItem label="Proficient:">Yes</InfoItem>}
        {notes && <InfoItem label="Notes:">{notes}</InfoItem>}
      </div>
    );
  };

  const renderGeneralProperties = (): React.ReactNode => {
    let isProficient = ActionUtils.isProficient(action);
    let toHit = ActionUtils.getToHit(action);
    let statId = ActionUtils.getStatId(action);
    let requiresAttackRoll = ActionUtils.requiresAttackRoll(action);
    let requiresSavingThrow = ActionUtils.requiresSavingThrow(action);
    let activation = ActionUtils.getActivation(action);
    let notes = ActionUtils.getNotes(action);
    let attackRangeId = ActionUtils.getAttackRangeId(action);
    let saveStateId = ActionUtils.getSaveStatId(action);

    let rangeAreas: Array<React.ReactNode> = [];
    if (attackRangeId === Constants.AttackTypeRangeEnum.RANGED) {
      rangeAreas = getRangedInfoData();
    } else {
      rangeAreas.push(
        <React.Fragment>
          <NumberDisplay
            type="distanceInFt"
            number={ActionUtils.getReach(action)}
          />{" "}
          Reach
        </React.Fragment>
      );
    }

    return (
      <div className={styles.properties} role="list">
        {activation !== null && activation.activationType && (
          <InfoItem label={"Action Type:"} {...infoItemProps}>
            {ActivationUtils.renderActivation(activation, ruleData)}
          </InfoItem>
        )}
        {requiresAttackRoll && (
          <InfoItem label="To Hit:" {...infoItemProps}>
            <NumberDisplay type="signed" number={toHit} />
          </InfoItem>
        )}
        {requiresSavingThrow && (
          <InfoItem label="Attack/Save:" {...infoItemProps}>
            {saveStateId !== null
              ? RuleDataUtils.getStatNameById(saveStateId, ruleData)
              : ""}{" "}
            {ActionUtils.getAttackSaveValue(action)}
          </InfoItem>
        )}
        {renderDamageProperties()}
        {requiresAttackRoll && (
          <InfoItem label="Stat:" {...infoItemProps}>
            {statId === null
              ? "--"
              : RuleDataUtils.getStatNameById(statId, ruleData)}
          </InfoItem>
        )}
        {rangeAreas.length > 0 && (
          <InfoItem label="Range/Area:" {...infoItemProps}>
            {rangeAreas.map((node, idx) => (
              <React.Fragment key={idx}>
                {node}
                {idx + 1 < rangeAreas.length ? "/" : ""}
              </React.Fragment>
            ))}
          </InfoItem>
        )}
        {isProficient && (
          <InfoItem label="Proficient:" {...infoItemProps}>
            Yes
          </InfoItem>
        )}
        {notes && (
          <InfoItem label="Notes:" {...infoItemProps}>
            {notes}
          </InfoItem>
        )}
      </div>
    );
  };

  const renderProperties = (): React.ReactNode => {
    const actionTypeId = ActionUtils.getActionTypeId(action);
    switch (actionTypeId) {
      case Constants.ActionTypeEnum.SPELL:
        return renderSpellProperties();
      case Constants.ActionTypeEnum.WEAPON:
        return renderWeaponProperties();
      case Constants.ActionTypeEnum.GENERAL:
        return renderGeneralProperties();
      default:
      // not implemented
    }

    return null;
  };

  const renderDescription = (): React.ReactNode => {
    let description = ActionUtils.getDescription(action);
    let dataOrigin = ActionUtils.getDataOrigin(action);
    let dataOriginType = ActionUtils.getDataOriginType(action);

    if (!description) {
      description = EntityUtils.getPrimaryDescription(dataOrigin);
    }

    if (dataOriginType === Constants.DataOriginTypeEnum.ITEM) {
      const itemContract = dataOrigin.primary as BaseInventoryContract;
      const itemMappingId = ItemUtils.getMappingId(itemContract);
      const item = HelperUtils.lookupDataOrFallback(
        inventoryLookup,
        itemMappingId
      );

      if (item === null) {
        return null;
      }

      let infusion = ItemUtils.getInfusion(item);

      if (
        infusion &&
        !AccessUtils.isAccessible(InfusionUtils.getAccessType(infusion))
      ) {
        const sources = InfusionUtils.getSources(infusion);

        let sourceNames: Array<string> = [];
        if (sources.length > 0) {
          sources.forEach((sourceMapping) => {
            let source = RuleDataUtils.getSourceDataInfo(
              sourceMapping.sourceId,
              ruleData
            );

            if (source !== null && source.description !== null) {
              sourceNames.push(source.description);
            }
          });
        }

        const sourceName: string | null =
          sourceNames.length > 0
            ? FormatUtils.renderNonOxfordCommaList(sourceNames)
            : null;

        return (
          <div className={styles.marketplaceCta}>
            <MarketplaceCta
              showImage={false}
              sourceName={sourceName}
              description={
                "To unlock this infusion, check out the Marketplace to view purchase options."
              }
            />
          </div>
        );
      }
    }

    if (!description) {
      return null;
    }

    return (
      <HtmlContent
        className={styles.description}
        html={description}
        withoutTooltips
      />
    );
  };

  return (
    <div className={styles.details}>
      {renderLimitedUses()}
      {renderCustomize()}
      {renderProperties()}
      {renderDescription()}
    </div>
  );
};
