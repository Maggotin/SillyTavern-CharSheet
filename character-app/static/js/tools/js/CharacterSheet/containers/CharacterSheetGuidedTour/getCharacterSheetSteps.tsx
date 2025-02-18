import { StepType } from "@reactour/tour";

import { GuidedTourStep } from "~/tools/js/Shared/containers/GuidedTour";

/**
 *  CHARACTER SHEET TOUR STEPS
 **/
export const getCharacterSheetSteps = (
  hasSpells: boolean,
  isTablet: boolean,
  isDesktop: boolean
): StepType[] => {
  const getSelector = (
    mobileSelector: string,
    tabletSelector?: string,
    desktopSelector?: string
  ) =>
    isDesktop && desktopSelector
      ? desktopSelector
      : isTablet && tabletSelector
      ? tabletSelector
      : mobileSelector;

  const stepList = [
    {
      selector: getSelector("html"),
      content: (
        <GuidedTourStep
          title="Welcome!"
          content={
            <>
              Welcome to your character sheet! Here, you can find information
              about your character, roll dice, and find more information about
              other characters in your game. If you ever have any questions
              about rules or what something is for, you can click on almost
              anything to learn more!
            </>
          }
          showClose
        />
      ),
    },
    {
      selector: getSelector(".dice-toolbar"),
      content: (
        <GuidedTourStep
          title="Digital Dice"
          content={
            <>
              Click here if you need to make a custom dice roll. Your dice
              collection can be found{" "}
              <a
                href="https://www.dndbeyond.com/my-dice"
                target="_blank"
                rel="noopener"
              >
                here
              </a>
              .
            </>
          }
        />
      ),
    },
    {
      selector: getSelector(
        ".ct-character-header-mobile__group-tidbits",
        ".ct-character-header-tablet__group-tidbits",
        ".ct-character-header-desktop__group-tidbits"
      ),
      content: (
        <GuidedTourStep
          title="Character Overview"
          content={
            <>
              Basic information about your character such as Name, Species,
              Class, and Level can be found here. Click this area to change your
              character's name, sheet styles, and modify other settings for your
              character.
            </>
          }
        />
      ),
    },
    {
      selector: ".ct-character-header-desktop__group--builder",
      content: (
        <GuidedTourStep
          title="Character Builder"
          content={
            <>
              Click here to visit the Character Builder. Each time you level up,
              check here to see how to develop your character.
            </>
          }
        />
      ),
    },
    {
      selector: getSelector(
        ".ct-main-mobile__abilities",
        ".ct-main-tablet__abilities",
        ".ct-quick-info__abilities"
      ),
      content: (
        <GuidedTourStep
          title="Ability Scores"
          content={
            <>
              Much of what your character does in the game depends on his or her
              six abilities: Strength, Dexterity, Constitution, Intelligence,
              Wisdom, and Charisma. Learn more about an ability by clicking on
              it.
            </>
          }
        />
      ),
    },
    {
      selector: getSelector(
        ".ct-combat-mobile__extra--proficiency",
        ".ct-combat-tablet__extra--proficiency",
        ".ct-quick-info__box--proficiency"
      ),
      content: (
        <GuidedTourStep
          title="Proficiency Bonus"
          content={
            <>
              Proficiency is added to rolls made to accomplish tasks with which
              your character is proficient. The bonus is automatically added to
              rolls when it is needed. Click here to learn more about how
              Proficiency Bonuses are used.
            </>
          }
        />
      ),
    },
    {
      selector: getSelector(
        ".ct-combat-mobile__extra--speed",
        ".ct-combat-tablet__extra--speed",
        ".ct-quick-info__box--speed"
      ),
      content: (
        <GuidedTourStep
          title="Speed"
          content={
            <>
              In each round of combat, your character can move up to the total
              distance indicated by your speed. Click here to learn more or
              customize your speed.
            </>
          }
        />
      ),
    },
    {
      selector: getSelector(
        ".ct-status-summary-mobile__health",
        ".ct-status-summary-mobile__health",
        ".ct-health-summary"
      ),
      content: (
        <GuidedTourStep
          title="Hit Points"
          content={
            <>
              In this area, you can manage your character's hit points. When
              your character reaches zero hit points, they are on the brink of
              death and begin making death saving throws.
            </>
          }
        />
      ),
    },
    {
      selector: getSelector(
        ".ct-combat-mobile__extra--initiative",
        ".ct-combat-tablet__extra--initiative",
        ".ct-combat__summary-group--initiative"
      ),
      content: (
        <GuidedTourStep
          title="Initiative"
          content={
            <>
              Initiative rolls determine the order in which you go in combat.
              The higher the number, the sooner you get to fight. Click here to
              roll initiative!
            </>
          }
        />
      ),
    },
    {
      selector: getSelector(
        ".ct-combat-mobile__extra--ac",
        ".ct-combat-tablet__extra--ac",
        ".ct-combat__summary-group--ac"
      ),
      content: (
        <GuidedTourStep
          title="Armor Class"
          content={
            <>
              Your Armor Class (AC) represents how well your character avoids
              being wounded in battle.
            </>
          }
        />
      ),
    },
    {
      selector: getSelector(
        ".ct-main-mobile__saving-throws",
        ".ct-saving-throws-box",
        ".ct-saving-throws-box"
      ),
      content: (
        <GuidedTourStep
          title="Saving Throws"
          content={
            <>
              Your DM may ask you to roll a saving throw (or make a save) to
              resist an incoming effect. Click on a save to automatically roll.
            </>
          }
        />
      ),
    },
    ...(isDesktop || isTablet
      ? [
          {
            selector: ".ct-proficiency-groups-box",
            content: (
              <GuidedTourStep
                title="Proficiencies"
                content={
                  <>
                    Proficiencies tell you what tools, equipment, and languages
                    your character is skilled at using.
                  </>
                }
              />
            ),
          },
          {
            selector: ".ct-skills-box",
            content: (
              <GuidedTourStep
                title="Skills"
                content={
                  <>
                    If you wish to perform an action, your DM will determine
                    which of these skills you will use. Click on a skill to roll
                    or learn more.
                  </>
                }
              />
            ),
          },
        ]
      : [
          {
            selector: ".ct-quick-nav__menu-item--skills",
            content: (
              <GuidedTourStep
                title="Skills"
                content={
                  <>
                    If you wish to perform an action, your DM will determine
                    which of these skills you will use. Click on a skill to roll
                    or learn more.
                  </>
                }
              />
            ),
          },
        ]),
    ...(!isDesktop
      ? [
          {
            selector: ".ct-quick-nav__menu-item--actions",
            content: (
              <GuidedTourStep
                title="Actions"
                content={
                  <>
                    When you take your action on your turn, you can take one of
                    the actions presented here. You can track actions or make
                    rolls to perform them by clicking in this panel.
                  </>
                }
              />
            ),
          },
          {
            selector: ".ct-quick-nav__menu-item--equipment",
            content: (
              <GuidedTourStep
                title="Inventory"
                content={
                  <>
                    View and manage your character's items and coin from this
                    panel.
                  </>
                }
              />
            ),
          },
          {
            selector: ".ct-quick-nav__menu-item--spells",
            content: (
              <GuidedTourStep
                title="Spells"
                content={
                  <>
                    If your character has the ability to cast spells, look here
                    for a list of spells and to track your spellcasting.
                  </>
                }
              />
            ),
          },
          {
            selector: ".ct-quick-nav__menu-item--features",
            content: (
              <GuidedTourStep
                title="Features & Traits"
                content={
                  <>
                    This section describes the source of your character's
                    abilities. How this manifests in your character's
                    personality is up to you.
                  </>
                }
              />
            ),
          },
          ...(!isTablet
            ? [
                {
                  selector: ".ct-quick-nav__menu-item--proficiencies",
                  content: (
                    <GuidedTourStep
                      title="Proficiencies"
                      content={
                        <>
                          Proficiencies tell you what tools, equipment, and
                          languages your character is skilled at using.
                        </>
                      }
                    />
                  ),
                },
              ]
            : []),
          {
            selector: ".ct-quick-nav__menu-item--description",
            content: (
              <GuidedTourStep
                title="Description"
                content={
                  <>
                    Use the description panel to tell your character's story.
                    Your character's background features are also found here.
                  </>
                }
                showClose
              />
            ),
          },
        ]
      : [
          {
            selector: ".ct-primary-box__tab--actions",
            content: (
              <GuidedTourStep
                title="Actions"
                content={
                  <>
                    When you take your action on your turn, you can take one of
                    the actions presented here. You can track actions or make
                    rolls to perform them by clicking in this panel.
                  </>
                }
              />
            ),
          },
          ...(hasSpells
            ? [
                {
                  selector: ".ct-primary-box__tab--spells",
                  content: (
                    <GuidedTourStep
                      title="Spells"
                      content={
                        <>
                          If your character has the ability to cast spells, look
                          here for a list of spells and to track your
                          spellcasting.
                        </>
                      }
                    />
                  ),
                },
              ]
            : []),
          {
            selector: ".ct-primary-box__tab--equipment",
            content: (
              <GuidedTourStep
                title="Inventory"
                content={
                  <>
                    View and manage your character's items and coin from this
                    panel.
                  </>
                }
              />
            ),
          },
          {
            selector: ".ct-primary-box__tab--features",
            content: (
              <GuidedTourStep
                title="Features & Traits"
                content={
                  <>
                    This section describes the source of your character's
                    abilities. How this manifests in your character's
                    personality is up to you.
                  </>
                }
              />
            ),
          },
          {
            selector: ".ct-primary-box__tab--description",
            content: (
              <GuidedTourStep
                title="Description"
                content={
                  <>
                    Use the description panel to tell your character's story.
                    Your character's background features are also found here.
                  </>
                }
                showClose
              />
            ),
          },
        ]),
  ];
  return stepList.filter((s) => s);
};
