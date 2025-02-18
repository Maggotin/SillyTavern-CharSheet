import clsx from "clsx";
import { FC, HTMLAttributes, ReactNode } from "react";

import {
  Creature,
  CreatureUtils,
  ConditionUtils,
  DamageAdjustmentContract,
  FormatUtils,
  RuleData,
  CreatureAbilityInfo,
} from "../../character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";

import {
  AbilityStatMentalList,
  AbilityStatPhysicalList,
  DDB_MEDIA_URL,
  StatBlockTypeEnum,
} from "../../../../constants";
import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant: "default" | "basic";
  creature: Creature;
  ruleData: RuleData;
}

export const CreatureBlock: FC<Props> = ({
  variant = "default",
  creature,
  ruleData,
  className = "",
}) => {
  const statBlockType = CreatureUtils.getStatBlockType(creature);
  const isVersion2024 = statBlockType === StatBlockTypeEnum.CORE_RULES_2024;

  const getDamageAdjustment = (
    type: "vulnerability" | "resistance" | "immunity"
  ): string | null => {
    let damageAdjustments: Array<DamageAdjustmentContract> = [];

    switch (type) {
      case "vulnerability":
        damageAdjustments = CreatureUtils.getDamageVulnerabilities(creature);
        break;
      case "resistance":
        damageAdjustments = CreatureUtils.getDamageResistances(creature);
        break;
      case "immunity":
        damageAdjustments = CreatureUtils.getDamageImmunities(creature);
        break;
      default:
        break;
    }

    if (!damageAdjustments.length) {
      return null;
    } else {
      return damageAdjustments
        .map((damageAdjustment) => damageAdjustment.name)
        .join(", ");
    }
  };

  const renderSeparator = (): ReactNode => {
    if (isVersion2024) {
      return null;
    }
    //TODO not hard-code the src url here?
    return (
      <img
        className={styles.separator}
        alt=""
        src={`${DDB_MEDIA_URL}/file-attachments/0/579/stat-block-header-bar.svg`}
      />
    );
  };

  const renderStatTable = (
    stats: Array<CreatureAbilityInfo>,
    type: "physical" | "mental"
  ): ReactNode => {
    return (
      <table className={clsx([styles.statTable, styles[type]])}>
        <thead>
          <tr>
            <th />
            <th />
            <th>Mod</th>
            <th>Save</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => {
            return (
              <tr key={stat.id}>
                <th>{stat.statKey}</th>
                <td>{stat.score}</td>
                <td className={styles.modifier}>
                  {FormatUtils.renderSignedNumber(stat.modifier)}
                </td>
                <td className={styles.modifier}>
                  {FormatUtils.renderSignedNumber(stat.saveModifier)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderStats = (): ReactNode => {
    const stats = CreatureUtils.getAbilities(creature);

    if (isVersion2024) {
      const mentalStats: Array<CreatureAbilityInfo> = [];
      const physicalStats: Array<CreatureAbilityInfo> = [];

      stats.forEach((ability) => {
        if (AbilityStatPhysicalList.includes(ability.id)) {
          physicalStats.push(ability);
        }
        if (AbilityStatMentalList.includes(ability.id)) {
          mentalStats.push(ability);
        }
      });
      return (
        <div className={styles.stats}>
          {renderStatTable(physicalStats, "physical")}
          {renderStatTable(mentalStats, "mental")}
        </div>
      );
    }

    return (
      <div className={styles.stats}>
        {stats.map((stat) => {
          const statKey: string = stat.statKey ? stat.statKey : "";
          const modifier: number = stat.modifier ? stat.modifier : 0;
          const score: number | null = stat.score;

          return (
            <div className={styles.stat} key={statKey}>
              <h2 className={styles.statHeading}>{statKey}</h2>
              <p className={styles.statScore}>{score}</p>
              <p className={styles.statModifier}>
                ({FormatUtils.renderSignedNumber(modifier)})
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderActions = (): ReactNode => {
    let groupActionNode: ReactNode;
    const groupActionSnippet = CreatureUtils.getGroupActionSnippet(creature);
    if (groupActionSnippet) {
      groupActionNode = <HtmlContent html={groupActionSnippet} />;
    }

    let actionsNode: ReactNode;
    const actionsDescription = CreatureUtils.getActionsDescription(creature);
    if (actionsDescription) {
      actionsNode = <HtmlContent html={actionsDescription} />;
    }

    const contentNode: ReactNode = (
      <>
        {groupActionNode}
        {actionsNode}
      </>
    );

    return renderDescription("Actions", contentNode);
  };

  const renderLegendaryActions = (): ReactNode => {
    if (!CreatureUtils.canUseLegendaryActions(creature)) {
      return null;
    }

    return renderDescription(
      "Legendary Actions",
      CreatureUtils.getLegendaryActionsDescription(creature)
    );
  };

  const renderSpecialDescription = (): ReactNode => {
    const groupInfo = CreatureUtils.getGroupInfo(creature);
    let groupNode: ReactNode;

    if (groupInfo?.specialQualityText) {
      let groupTitle: ReactNode;
      if (groupInfo.specialQualityTitle) {
        groupTitle = (
          <>
            <strong>
              <em>{groupInfo.specialQualityTitle}</em>
            </strong>
            .{" "}
          </>
        );
      }
      groupNode = (
        <p>
          {groupTitle}
          {groupInfo.specialQualityText}
        </p>
      );
    }

    let monsterNode: ReactNode;
    const monsterDescription =
      CreatureUtils.getSpecialTraitsDescription(creature);
    if (monsterDescription) {
      monsterNode = <HtmlContent html={monsterDescription} />;
    }

    let contentNode: ReactNode = null;
    if (monsterNode || groupNode) {
      contentNode = (
        <>
          {monsterNode}
          {groupNode}
        </>
      );
    }

    return renderDescription("Traits", contentNode);
  };

  const renderDescription = (
    label: string | null,
    description: ReactNode
  ): ReactNode => {
    if (!description) {
      return null;
    }

    let descriptionNode: ReactNode;
    if (typeof description === "string") {
      descriptionNode = (
        <HtmlContent className={styles.description} html={description} />
      );
    } else {
      descriptionNode = <div className={styles.description}>{description}</div>;
    }

    return (
      <>
        {label && <h2 className={styles.descriptionHeading}>{label}</h2>}
        {descriptionNode}
      </>
    );
  };

  const renderAttribute = (label: string, content: string | null) => {
    if (!content) {
      return null;
    }
    return (
      <div className={styles.attribute}>
        <h2 className={styles.attributeLabel}>{label}</h2>
        <p>{content}</p>
      </div>
    );
  };

  const renderImmunities = (): ReactNode => {
    const damageImmunities = getDamageAdjustment("immunity");
    const conditionImmunities = CreatureUtils.getConditionImmunities(creature)
      .map((condition) => ConditionUtils.getName(condition))
      .join(", ");

    if (!isVersion2024) {
      if (!damageImmunities && !conditionImmunities) {
        return null;
      }

      const immunityChunks: Array<string> = [];
      if (damageImmunities) {
        immunityChunks.push(damageImmunities);
      }
      if (conditionImmunities) {
        immunityChunks.push(conditionImmunities);
      }
      return renderAttribute("Immunities", immunityChunks.join("; "));
    }

    return (
      <>
        {renderAttribute("Damage Immunities", damageImmunities)}
        {renderAttribute("Condition Immunities", conditionImmunities)}
      </>
    );
  };

  return (
    <section
      className={clsx([
        className,
        styles.creatureBlock,
        isVersion2024 && styles.v2024,
      ])}
    >
      <h1 className={styles.header}>{CreatureUtils.getName(creature)}</h1>
      <p className={styles.meta}>
        {CreatureUtils.renderMetaText(creature, ruleData, variant === "basic")}
      </p>
      {renderSeparator()}
      {renderAttribute(
        isVersion2024 ? "AC" : "Armor Class",
        CreatureUtils.renderArmorClass(creature)
      )}
      {renderAttribute(
        "Initiative",
        CreatureUtils.renderInitiativeInfo(creature)
      )}
      {renderAttribute(
        isVersion2024 ? "HP" : "Hit Points",
        CreatureUtils.renderHitPointInfo(creature)
      )}
      {renderAttribute(
        "Speed",
        CreatureUtils.renderSpeedInfo(creature, ruleData)
      )}
      {variant === "default" && (
        <>
          {renderSeparator()}
          {renderStats()}
          {renderSeparator()}
        </>
      )}
      {variant === "default" && (
        <>
          {!isVersion2024 &&
            renderAttribute(
              "Saving Throws",
              CreatureUtils.renderSavingThrows(creature)
            )}
          {renderAttribute(
            "Skills",
            CreatureUtils.renderSkills(creature, ruleData)
          )}
          {renderAttribute(
            isVersion2024 ? "Vulnerabilities" : "Damage Vulnerabilities",
            getDamageAdjustment("vulnerability")
          )}
          {renderAttribute(
            isVersion2024 ? "Resistances" : "Damage Resistances",
            getDamageAdjustment("resistance")
          )}
          {renderImmunities()}
          {renderAttribute("Gear", CreatureUtils.getGear(creature))}
          {renderAttribute(
            "Senses",
            CreatureUtils.renderSensesInfo(creature, ruleData)
          )}
          {renderAttribute(
            "Languages",
            CreatureUtils.renderLanguages(creature, ruleData)
          )}
        </>
      )}
      {renderAttribute(
        isVersion2024 ? "CR" : "Challenge",
        CreatureUtils.renderChallengeRatingInfo(creature)
      )}
      {variant === "default" && (
        <>
          {!isVersion2024 &&
            renderAttribute(
              "Proficiency Bonus",
              CreatureUtils.renderProficiencyBonus(creature)
            )}
          {renderSeparator()}
          <div className={styles.descriptions}>
            {renderSpecialDescription()}
            {renderActions()}
            {renderDescription(
              "Bonus Actions",
              CreatureUtils.getBonusActionsDescription(creature)
            )}
            {renderDescription(
              "Reactions",
              CreatureUtils.getReactionsDescription(creature)
            )}
            {renderLegendaryActions()}
          </div>
        </>
      )}
    </section>
  );
};
