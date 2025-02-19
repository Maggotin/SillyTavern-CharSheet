import React, { ReactNode, useContext } from "react";

import {
  Checkbox,
  Collapsible,
  ComponentConstants,
  Damage,
  DamageTypeIcon,
  DataOriginName,
  InfusionPreview,
} from "@dndbeyond/character-components/es";
import {
  Action,
  ActionUtils,
  CharacterTheme,
  CharacterUtils,
  Constants,
  Container,
  ContainerUtils,
  DataOrigin,
  DiceUtils,
  EntityValueLookup,
  FormatUtils,
  Infusion,
  InfusionChoiceLookup,
  InventoryManager,
  Item,
  ItemUtils,
  PartyInfo,
  RuleData,
  RuleDataUtils,
  SnippetData,
  SourceMappingContract,
  Spell,
  SpellUtils,
  ValueUtils,
  WeaponSpellDamageGroup,
} from "@dndbeyond/character-rules-engine/es";
import StarIcon from "@dndbeyond/fontawesome-cache/svgs/solid/star.svg";

import { HtmlContent } from "~/components/HtmlContent";
import { InfoItem } from "~/components/InfoItem";
import { NumberDisplay } from "~/components/NumberDisplay";
import { Reference } from "~/components/Reference";
import { TagGroup } from "~/components/TagGroup";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import ItemDetailAbilities from "../../containers/ItemDetailAbilities";
import ItemDetailActions from "../../containers/ItemDetailActions";
import { InventoryManagerContext } from "../../managers/InventoryManagerContext";
import CustomizeDataEditor from "../CustomizeDataEditor";
import EditorBox from "../EditorBox";
import ValueEditor from "../ValueEditor";
import { RemoveButton } from "../common/Button";
import styles from "./styles.module.css";

const infoItemProps = { role: "listitem", inline: true };

interface Props {
  item: Item;
  weaponSpellDamageGroups: Array<WeaponSpellDamageGroup>;
  ruleData: RuleData;
  snippetData: SnippetData;
  className: string;
  showAbilities: boolean;
  showCustomize: boolean;
  showActions: boolean;
  showIntro: boolean;
  showImage: boolean;
  onCustomDataUpdate?: (
    adjustmentType: Constants.AdjustmentTypeEnum,
    value: any
  ) => void;
  onCustomizationsRemove?: () => void;
  onCustomItemEdit?: (data: Record<string, any>) => void;
  onDataOriginClick?: (dataOrigin: DataOrigin) => void;
  onSpellClick?: (spell: Spell) => void;
  onInfusionClick?: (infusion: Infusion) => void;
  onMasteryActionClick?: (action: Action) => void;
  entityValueLookup: EntityValueLookup;
  infusionChoiceLookup: InfusionChoiceLookup;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
  container: Container | null;
  onPostRemoveNavigation?: PaneComponentEnum;
  partyInfo: PartyInfo;
  inventoryManager: InventoryManager;
  isCustomizeClosed?: boolean;
  onCustomizeClick?: (isCollapsed: boolean) => void;
  actions: Array<Action>;
}
export class ItemDetail extends React.PureComponent<Props> {
  static defaultProps = {
    weaponSpellDamageGroups: [],
    className: "",
    showCustomize: true,
    showAbilities: true,
    showActions: true,
    showIntro: true,
    showImage: true,
    snippetData: null,
    entityValueLookup: {},
    infusionChoiceLookup: {},
    isReadonly: false,
    container: null,
  };

  handleSpellClick = (spell: Spell, evt: React.MouseEvent): void => {
    const { onSpellClick } = this.props;

    if (onSpellClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onSpellClick(spell);
    }
  };

  handleInfusionClick = () => {
    const { item, onInfusionClick } = this.props;

    const infusion = ItemUtils.getInfusion(item);
    if (onInfusionClick && infusion) {
      onInfusionClick(infusion);
    }
  };

  handleMasteryActionClick = (evt: React.MouseEvent) => {
    const { item, onMasteryActionClick, actions } = this.props;

    const masteryAction = ItemUtils.getMasteryAction(item, actions);
    if (masteryAction && onMasteryActionClick) {
      onMasteryActionClick(masteryAction);
    }
  };

  handleHexWeaponChange = (enabled) => {
    const { onCustomDataUpdate } = this.props;

    if (onCustomDataUpdate) {
      onCustomDataUpdate(Constants.AdjustmentTypeEnum.IS_HEXBLADE, enabled);
    }
  };

  handleDedicatedWeaponChange = (enabled) => {
    const { onCustomDataUpdate } = this.props;

    if (onCustomDataUpdate) {
      onCustomDataUpdate(
        Constants.AdjustmentTypeEnum.IS_DEDICATED_WEAPON,
        enabled
      );
    }
  };

  handlePactWeaponChange = (enabled) => {
    const { onCustomDataUpdate, item } = this.props;

    if (onCustomDataUpdate) {
      const isHexWeapon = ItemUtils.isHexWeapon(item);
      if (
        !enabled &&
        isHexWeapon &&
        !this.shouldShowDependentHexWeapons(enabled)
      ) {
        onCustomDataUpdate(Constants.AdjustmentTypeEnum.IS_HEXBLADE, null);
      }
      onCustomDataUpdate(Constants.AdjustmentTypeEnum.IS_PACT_WEAPON, enabled);
    }
  };

  handleRemoveCustomizations = () => {
    const { onCustomizationsRemove } = this.props;

    if (onCustomizationsRemove) {
      onCustomizationsRemove();
    }
  };

  shouldShowDependentHexWeapons = (isPactWeapon) => {
    const { item } = this.props;

    return (
      isPactWeapon ||
      (!isPactWeapon &&
        !ItemUtils.hasWeaponProperty(
          item,
          Constants.WeaponPropertyEnum.TWO_HANDED
        ))
    );
  };

  shouldShowHexWeapon = () => {
    const { item } = this.props;

    const canHexWeapon = ItemUtils.canHexWeapon(item);
    const isPactWeapon = ItemUtils.isPactWeapon(item);
    const canPactWeapon = ItemUtils.canPactWeapon(item);
    const hexWeaponEnabled = ItemUtils.hexWeaponEnabled(item);

    if (!hexWeaponEnabled) {
      return false;
    }

    let showHexWeapon = false;
    if (canPactWeapon) {
      showHexWeapon = this.shouldShowDependentHexWeapons(isPactWeapon);
    } else {
      showHexWeapon = canHexWeapon;
    }
    return showHexWeapon;
  };

  getSourceReference = (item: Item): ReactNode => {
    const { theme, ruleData } = this.props;

    let sourceId: number | null = null;
    let sourcePage: number | null = null;
    let filteredSources = ItemUtils.getSources(item).filter(
      CharacterUtils.isPrimarySource
    );
    if (filteredSources.length) {
      let primarySource: SourceMappingContract = filteredSources[0];
      sourceId = primarySource.sourceId;
      sourcePage = primarySource.pageNumber;
    }

    if (sourceId === null) {
      return null;
    }

    return (
      <InfoItem label="Source:" {...infoItemProps}>
        <Reference
          name={
            RuleDataUtils.getSourceDataInfo(sourceId, ruleData)?.description ||
            ""
          }
          page={sourcePage}
          isDarkMode={theme?.isDarkMode}
        />
      </InfoItem>
    );
  };

  renderIntro = () => {
    const { item, container, partyInfo, inventoryManager } = this.props;

    let type = ItemUtils.getType(item);
    const subType = ItemUtils.getSubType(item);
    const baseArmorName = ItemUtils.getBaseArmorName(item);
    const rarity = ItemUtils.getRarity(item);
    const canAttune = ItemUtils.canAttune(item);
    const equippedEntityId = ItemUtils.getEquippedEntityId(item);

    const attunementDescription = ItemUtils.getAttunementDescription(item);
    const isCustom = ItemUtils.isCustom(item);

    if (ItemUtils.isWeaponContract(item)) {
      if (ItemUtils.isMagic(item)) {
        type = `Weapon (${type})`;
      } else {
        type = "Weapon";
      }
    } else if (ItemUtils.isArmorContract(item)) {
      if (ItemUtils.isMagic(item)) {
        type = `Armor (${baseArmorName})`;
      } else {
        type = "Armor";
      }
    } else if (ItemUtils.isGearContract(item)) {
      type = subType ? subType : type;
    } else if (isCustom) {
      type = "Custom";
    }

    return (
      <>
        <div className="ct-item-detail__intro">
          {ItemUtils.isLegacy(item) && "Legacy • "}
          {type}
          {!isCustom && rarity ? `, ${rarity}` : ""}
          {canAttune &&
            ` (requires attunement${
              attunementDescription ? ` by a ${attunementDescription}` : ""
            })`}
          {ItemUtils.isContainer(item) && ", container"}
        </div>
        {container && (
          <div className="ct-item-detail__intro-subtitle">
            {" "}
            {!ItemUtils.isContainer(item)
              ? ` In ${ContainerUtils.getName(container)}`
              : ` In ${
                  ContainerUtils.isShared(container) ? "Party " : ""
                }Inventory`}
            <div>
              {partyInfo &&
                equippedEntityId &&
                `${
                  inventoryManager.isEquippedToCurrentCharacter(item)
                    ? "Equipped"
                    : `Equipped by ${inventoryManager.getEquippedCharacterName(
                        item
                      )}`
                }`}
            </div>
          </div>
        )}
      </>
    );
  };

  renderAbilities = () => {
    const { item } = this.props;

    return <ItemDetailAbilities item={item} />;
  };

  renderClassCustomize = () => {
    const { item } = this.props;

    const isHexWeapon = ItemUtils.isHexWeapon(item);
    const canHexWeapon = ItemUtils.canHexWeapon(item);
    const isPactWeapon = ItemUtils.isPactWeapon(item);
    const canPactWeapon = ItemUtils.canPactWeapon(item);
    const canBeDedicatedWeapon = ItemUtils.canBeDedicatedWeapon(item);
    const isDedicatedWeapon = ItemUtils.isDedicatedWeapon(item);

    if (!canHexWeapon && !canPactWeapon && !canBeDedicatedWeapon) {
      return null;
    }

    return (
      <div className="ct-item-detail__class-customize">
        {canPactWeapon && (
          <div className="ct-item-detail__class-customize-item">
            <Checkbox
              initiallyEnabled={isPactWeapon}
              onChange={this.handlePactWeaponChange}
              label="Pact Weapon"
            />
          </div>
        )}
        {this.shouldShowHexWeapon() && (
          <div className="ct-item-detail__class-customize-item">
            <Checkbox
              initiallyEnabled={isHexWeapon}
              onChange={this.handleHexWeaponChange}
              label="Hex Weapon"
            />
          </div>
        )}
        {canBeDedicatedWeapon && (
          <div className="ct-item-detail__class-customize-item">
            <Checkbox
              initiallyEnabled={isDedicatedWeapon}
              onChange={this.handleDedicatedWeaponChange}
              label="Dedicated Weapon"
            />
          </div>
        )}
      </div>
    );
  };

  renderCustomItemEdit = (): React.ReactNode => {
    const { item, onCustomItemEdit } = this.props;

    let originalContract = ItemUtils.getOriginalContract(item);
    if (!originalContract || !onCustomItemEdit) {
      return null;
    }

    const { id, quantity, ...itemData } = originalContract;

    return (
      <EditorBox>
        <CustomizeDataEditor
          data={itemData}
          enableName={true}
          enableNotes={true}
          enableDescription={true}
          enableCost={true}
          enableWeight={true}
          maxNameLength={128}
          onDataUpdate={onCustomItemEdit}
        />
      </EditorBox>
    );
  };

  renderCustomize = (): React.ReactNode => {
    const {
      item,
      ruleData,
      onCustomDataUpdate,
      entityValueLookup,
      isReadonly,
    } = this.props;

    if (isReadonly) {
      return;
    }

    const isWeaponLike = ItemUtils.validateIsWeaponLike(item);

    let customizationValues: Array<Constants.AdjustmentTypeEnum> = [];
    if (isWeaponLike) {
      customizationValues = [
        ...customizationValues,
        Constants.AdjustmentTypeEnum.TO_HIT_OVERRIDE,
        Constants.AdjustmentTypeEnum.TO_HIT_BONUS,
        Constants.AdjustmentTypeEnum.FIXED_VALUE_BONUS,
      ];
    }
    customizationValues.push(Constants.AdjustmentTypeEnum.COST_OVERRIDE);
    customizationValues.push(Constants.AdjustmentTypeEnum.WEIGHT_OVERRIDE);
    if (ItemUtils.isContainer(item)) {
      customizationValues.push(
        Constants.AdjustmentTypeEnum.CAPACITY_WEIGHT_OVERRIDE
      );
    }
    if (ItemUtils.canOffhand(item)) {
      customizationValues.push(Constants.AdjustmentTypeEnum.IS_OFFHAND);
    }
    if (ItemUtils.isWeaponContract(item)) {
      customizationValues = [
        ...customizationValues,
        Constants.AdjustmentTypeEnum.IS_SILVER,
        Constants.AdjustmentTypeEnum.IS_ADAMANTINE,
      ];
    }
    if (isWeaponLike) {
      customizationValues.push(Constants.AdjustmentTypeEnum.DISPLAY_AS_ATTACK);
    }
    customizationValues.push(Constants.AdjustmentTypeEnum.NAME_OVERRIDE);
    customizationValues.push(Constants.AdjustmentTypeEnum.NOTES);

    let customizationLabelOverrides: Partial<
      Record<Constants.AdjustmentTypeEnum, string>
    > = {
      [Constants.AdjustmentTypeEnum.NAME_OVERRIDE]: "Name",
      [Constants.AdjustmentTypeEnum.IS_SILVER]: "Silvered",
      [Constants.AdjustmentTypeEnum.FIXED_VALUE_BONUS]: "Damage Bonus",
      [Constants.AdjustmentTypeEnum.IS_ADAMANTINE]: "Adamantine",
    };

    let customizationDefaults: Partial<
      Record<Constants.AdjustmentTypeEnum, any>
    > = {
      [Constants.AdjustmentTypeEnum.DISPLAY_AS_ATTACK]:
        ItemUtils.isDisplayAsAttack(item),
    };

    const isCustomized = ItemUtils.isCustomized(item);

    return (
      <EditorBox>
        <ValueEditor
          dataLookup={ValueUtils.getEntityData(
            entityValueLookup,
            ValueUtils.hack__toString(ItemUtils.getMappingId(item)),
            ValueUtils.hack__toString(ItemUtils.getMappingEntityTypeId(item))
          )}
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
    );
    //`
  };

  renderCustomProperties = (): React.ReactNode => {
    const { item } = this.props;

    const weight = ItemUtils.getWeight(item);
    const cost = ItemUtils.getCost(item);
    const notes = ItemUtils.getNotes(item);

    return (
      <div className="ct-item-detail__customize" role="list">
        <InfoItem label="Weight:" {...infoItemProps}>
          {weight ? <NumberDisplay type="weightInLb" number={weight} /> : "--"}
        </InfoItem>
        <InfoItem label="Cost:" {...infoItemProps}>
          {cost ? `${FormatUtils.renderLocaleNumber(cost)} gp` : "--"}
        </InfoItem>
        {notes && (
          <InfoItem label="Notes:" {...infoItemProps}>
            {notes}
          </InfoItem>
        )}
      </div>
    );
    //`
  };

  renderGearProperties = (): React.ReactNode => {
    const { item, theme } = this.props;

    const bundleSize = ItemUtils.getBundleSize(item);
    const isStackable = ItemUtils.isStackable(item);
    const version = ItemUtils.getVersion(item);
    const weight = ItemUtils.getWeight(item);
    const capacityWeight = ItemUtils.getCapacityWeight(item);
    const notes = ItemUtils.getNotes(item);
    const cost = ItemUtils.getCost(item);

    return (
      <div className="ct-item-detail__customize" role="list">
        <InfoItem label="Weight:" {...infoItemProps}>
          {weight ? <NumberDisplay type="weightInLb" number={weight} /> : "--"}
        </InfoItem>
        {ItemUtils.isContainer(item) && (
          <InfoItem label="Capacity:" {...infoItemProps}>
            {capacityWeight ? (
              <NumberDisplay type="weightInLb" number={capacityWeight} />
            ) : (
              "--"
            )}
          </InfoItem>
        )}
        <InfoItem label="Cost:" {...infoItemProps}>
          {cost ? `${FormatUtils.renderLocaleNumber(cost)} gp` : "--"}
        </InfoItem>
        {isStackable && bundleSize > 1 && (
          <InfoItem label="Bundle Size:" {...infoItemProps}>
            {bundleSize}
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
        {this.getSourceReference(item)}
      </div>
    );
    //`
  };

  renderWeaponProperties = (): React.ReactNode => {
    const { item, theme } = this.props;

    const bundleSize = ItemUtils.getBundleSize(item);
    const isStackable = ItemUtils.isStackable(item);
    const version = ItemUtils.getVersion(item);
    const weight = ItemUtils.getWeight(item);
    const reach = ItemUtils.getReach(item);
    const range = ItemUtils.getRange(item);
    const longRange = ItemUtils.getLongRange(item);
    const versatileDamage = ItemUtils.getVersatileDamage(item);
    const additionalDamages = ItemUtils.getAdditionalDamages(item);
    const attackType = ItemUtils.getAttackType(item);
    const attackTypeName: string =
      attackType === null
        ? ""
        : RuleDataUtils.getAttackTypeRangeName(attackType);
    const damageType = ItemUtils.getDamageType(item);
    const damage = ItemUtils.getDamage(item);
    const properties = ItemUtils.getProperties(item);
    const proficiency = ItemUtils.hasProficiency(item);
    const notes = ItemUtils.getNotes(item);
    const cost = ItemUtils.getCost(item);

    let versatileDamageNode: React.ReactNode;
    if (versatileDamage) {
      versatileDamageNode = (
        <span className="ct-item-detail__versatile-damage">
          ({DiceUtils.renderDie(versatileDamage)})
        </span>
      );
    }

    let damageDisplay: React.ReactNode = "--";
    if (damage !== null) {
      damageDisplay = <Damage theme={theme} damage={damage} />;
    }

    const showRange: boolean =
      attackType === Constants.AttackTypeRangeEnum.RANGED ||
      ItemUtils.hasWeaponProperty(item, Constants.WeaponPropertyEnum.THROWN) ||
      ItemUtils.hasWeaponProperty(item, Constants.WeaponPropertyEnum.RANGE);

    return (
      <div className="ct-item-detail__customize" role="list">
        {proficiency && (
          <InfoItem label="Proficient: " {...infoItemProps}>
            Yes
          </InfoItem>
        )}
        <InfoItem label="Attack Type:" {...infoItemProps}>
          {attackType === null ? "--" : attackTypeName}
        </InfoItem>
        {reach && (
          <InfoItem label="Reach:" {...infoItemProps}>
            <NumberDisplay type="distanceInFt" number={reach} />
          </InfoItem>
        )}
        {showRange && (
          <InfoItem label="Range:" {...infoItemProps}>
            <NumberDisplay type="distanceInFt" number={range} />
            /
            <NumberDisplay type="distanceInFt" number={longRange} />
          </InfoItem>
        )}
        <InfoItem label="Damage:" {...infoItemProps}>
          <div>
            {damageDisplay}
            {versatileDamageNode}
          </div>
          {additionalDamages.map((additionalDamage, idx) => (
            <div className="ct-item-detail__additional-damage" key={idx}>
              {typeof additionalDamage.damage === "number"
                ? additionalDamage.damage
                : DiceUtils.renderDie(additionalDamage.damage)}
              {additionalDamage.damageType !== null && (
                <DamageTypeIcon
                  theme={theme}
                  type={
                    FormatUtils.slugify(
                      additionalDamage.damageType
                    ) as ComponentConstants.DamageTypePropType
                  }
                />
              )}
              {additionalDamage.info && (
                <span className="ct-item-detail__additional-damage-info">
                  {additionalDamage.info}
                </span>
              )}
            </div>
          ))}
        </InfoItem>
        <InfoItem label="Damage Type:" {...infoItemProps}>
          {damageType === null ? (
            "--"
          ) : (
            <React.Fragment>
              <DamageTypeIcon
                theme={theme}
                type={
                  FormatUtils.slugify(
                    damageType
                  ) as ComponentConstants.DamageTypePropType
                }
              />{" "}
              {damageType}
            </React.Fragment>
          )}
        </InfoItem>
        <InfoItem label="Weight:" {...infoItemProps}>
          {weight ? <NumberDisplay type="weightInLb" number={weight} /> : "--"}
        </InfoItem>
        <InfoItem label="Cost:" {...infoItemProps}>
          {cost ? `${FormatUtils.renderLocaleNumber(cost)} gp` : "--"}
        </InfoItem>
        {isStackable && bundleSize > 1 && (
          <InfoItem label="Bundle Size:" {...infoItemProps}>
            {bundleSize}
          </InfoItem>
        )}
        {properties && properties.length > 0 && (
          <InfoItem label="Properties:" {...infoItemProps}>
            {properties
              .map((prop) => prop.name + (prop.notes ? ` (${prop.notes})` : ""))
              .join(", ")}
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
        {this.getSourceReference(item)}
      </div>
    );
    //`
  };

  renderArmorProperties = (): React.ReactNode => {
    const { item, theme } = this.props;

    const bundleSize = ItemUtils.getBundleSize(item);
    const isStackable = ItemUtils.isStackable(item);
    const version = ItemUtils.getVersion(item);
    const armorClass = ItemUtils.getArmorClass(item);
    const weight = ItemUtils.getWeight(item);
    const cost = ItemUtils.getCost(item);
    const notes = ItemUtils.getNotes(item);

    let armorClassDisplay: React.ReactNode = armorClass;
    if (ItemUtils.isShield(item)) {
      armorClassDisplay = (
        <NumberDisplay
          type="signed"
          number={armorClass === null ? 0 : armorClass}
        />
      );
    }

    return (
      <div className="ct-item-detail__customize" role="list">
        <InfoItem label="Armor Class:" {...infoItemProps}>
          {armorClassDisplay}
        </InfoItem>
        <InfoItem label="Weight:" {...infoItemProps}>
          {weight ? <NumberDisplay type="weightInLb" number={weight} /> : "--"}
        </InfoItem>
        <InfoItem label="Cost:" {...infoItemProps}>
          {cost ? `${FormatUtils.renderLocaleNumber(cost)} gp` : "--"}
        </InfoItem>
        {isStackable && bundleSize > 1 && (
          <InfoItem label="Bundle Size:" {...infoItemProps}>
            {bundleSize}
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
        {this.getSourceReference(item)}
      </div>
    );
    //`
  };

  renderWeaponSpellDamage = (): React.ReactNode => {
    const { item, weaponSpellDamageGroups, onDataOriginClick, theme } =
      this.props;

    if (!ItemUtils.validateIsWeaponLike(item)) {
      return null;
    }

    let filteredSpellDamage = ItemUtils.getApplicableWeaponSpellDamageGroups(
      item,
      weaponSpellDamageGroups
    );
    if (!filteredSpellDamage.length) {
      return null;
    }

    return (
      <div className="ct-item-detail__spell-damage">
        {filteredSpellDamage.map((spellDamageGroup, groupIdx) => (
          <div
            className="ct-item-detail__spell-damage-group"
            key={`${SpellUtils.getUniqueKey(
              spellDamageGroup.spell
            )}-${groupIdx}`}
          >
            <div className="ct-item-detail__spell-damage-group-header">
              <span
                className="ct-item-detail__spell-damage-group-name"
                onClick={this.handleSpellClick.bind(
                  this,
                  spellDamageGroup.spell
                )}
              >
                {SpellUtils.getName(spellDamageGroup.spell)}
              </span>
              <span className="ct-item-detail__spell-damage-group-data-origin">
                (
                <DataOriginName
                  dataOrigin={SpellUtils.getDataOrigin(spellDamageGroup.spell)}
                  onClick={onDataOriginClick}
                  theme={theme}
                />
                )
              </span>
            </div>
            <div className="ct-item-detail__spell-damage-group-items">
              {spellDamageGroup.damageDice.map((damage, itemIdx) => (
                <div
                  className="ct-item-detail__spell-damage-group-item"
                  key={`${damage.type}-${itemIdx}`}
                >
                  <Damage
                    theme={theme}
                    damage={damage.dice}
                    type={damage.type}
                  />
                  {damage.restriction && (
                    <span className="ct-item-detail__spell-damage-group-restriction">
                      ({damage.restriction})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
    //`
  };

  renderProperties = (): React.ReactNode => {
    const { item } = this.props;

    if (ItemUtils.isWeaponContract(item)) {
      return this.renderWeaponProperties();
    } else if (ItemUtils.isArmorContract(item)) {
      return this.renderArmorProperties();
    } else if (ItemUtils.isGearContract(item)) {
      return this.renderGearProperties();
    } else if (ItemUtils.isCustom(item)) {
      return this.renderCustomProperties();
    }

    return null;
  };

  renderTags = (): React.ReactNode => {
    const { item } = this.props;

    const tags = ItemUtils.getTags(item);
    if (!tags.length) {
      return null;
    }

    return <TagGroup label="Tags" tags={tags} />;
  };

  renderImage = (): React.ReactNode => {
    const { item } = this.props;

    const largeImageUrl = ItemUtils.getLargeImageUrl(item);
    if (!largeImageUrl) {
      return null;
    }

    return (
      <div className="ct-item-detail__full-image">
        <img
          className="ct-item-detail__full-image-img"
          src={largeImageUrl}
          alt=""
        />
      </div>
    );
  };

  renderDescription = (): React.ReactNode => {
    const { item } = this.props;

    const description = ItemUtils.getDescription(item);

    if (!description) {
      return null;
    }

    if (ItemUtils.isCustom(item)) {
      return (
        <div className="ct-item-detail__descriptionstcs-item-detail__description--plain">
          {description}
        </div>
      );
    } else {
      return (
        <HtmlContent
          className="ct-item-detail__descriptionstcs-item-detail__description--rich"
          html={description}
          withoutTooltips
        />
      );
    }
  };

  renderInfusionPreview = (): React.ReactNode => {
    const {
      item,
      snippetData,
      ruleData,
      infusionChoiceLookup,
      proficiencyBonus,
    } = this.props;

    const infusion = ItemUtils.getInfusion(item);
    if (infusion && snippetData && infusionChoiceLookup) {
      return (
        <div className="ct-item-detail__infusion">
          <InfusionPreview
            infusion={infusion}
            snippetData={snippetData}
            ruleData={ruleData}
            infusionChoiceLookup={infusionChoiceLookup}
            onClick={this.handleInfusionClick}
            proficiencyBonus={proficiencyBonus}
          />
        </div>
      );
    }

    return null;
  };

  render() {
    const {
      item,
      className,
      showActions,
      showAbilities,
      showCustomize,
      showIntro,
      showImage,
      onPostRemoveNavigation,
      isCustomizeClosed,
      onCustomizeClick,
      actions,
      theme,
    } = this.props;

    const isCustomized =
      ItemUtils.isCustomized(item) && !ItemUtils.isCustom(item);

    const masteryAction = ItemUtils.getMasteryAction(item, actions);

    return (
      <div className={`${className}stcs-item-detail`}>
        {showIntro && this.renderIntro()}
        {showAbilities && this.renderAbilities()}
        {showCustomize && (
          <div className="ct-item-detail__customize">
            <Collapsible
              layoutType={"minimal"}
              header={`Customize${isCustomized ? "*" : ""}`}
              collapsed={isCustomizeClosed}
              onChangeHandler={onCustomizeClick}
            >
              {ItemUtils.isCustom(item)
                ? this.renderCustomItemEdit()
                : this.renderCustomize()}
            </Collapsible>
          </div>
        )}
        {showCustomize && this.renderClassCustomize()}
        {this.renderProperties()}
        {this.renderWeaponSpellDamage()}
        {this.renderDescription()}
        {this.renderTags()}
        {masteryAction && (
          <div
            className={styles.action}
            onClick={this.handleMasteryActionClick}
          >
            <div className={styles.label}>
              <StarIcon style={{ fill: theme.themeColor }} /> Mastery:{" "}
              {ActionUtils.getName(masteryAction)}
            </div>
            <HtmlContent
              html={ActionUtils.getDescription(masteryAction) ?? ""}
              withoutTooltips
            />
          </div>
        )}
        {this.renderInfusionPreview()}
        {showImage && this.renderImage()}
        {showActions && (
          <ItemDetailActions
            onPostRemoveNavigation={onPostRemoveNavigation}
            item={item}
          />
        )}
      </div>
    );
  }
}

const ItemDetailContainer = (props) => {
  const { inventoryManager } = useContext(InventoryManagerContext);
  const { actions } = useCharacterEngine();
  return (
    <ItemDetail
      inventoryManager={inventoryManager}
      actions={actions}
      {...props}
    />
  );
};

export default ItemDetailContainer;
