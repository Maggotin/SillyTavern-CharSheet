import React from "react";

import { RouteKey } from "~/subApps/builder/constants";

import { CollapsibleContent } from "../../../../../../components/CollapsibleContent";
import { appEnvSelectors } from "../../../../Shared/selectors";
import Page from "../../../components/Page";
import { PageBody } from "../../../components/PageBody";
import PageHeader from "../../../components/PageHeader";
import { BuilderAppState } from "../../../typings";
import ConnectedBuilderPage from "../ConnectedBuilderPage";

interface Props {
  isMobile: boolean;
  lowerCase: { singular: string; plural: string; desc: string };
}
class HomeHelp extends React.PureComponent<Props> {
  render() {
    const { isMobile } = this.props;

    return (
      <Page>
        <PageBody>
          <CollapsibleContent
            forceShow={!isMobile}
            heading={
              <>
                <PageHeader>Creating a Character</PageHeader>
                <p>
                  Your first step in playing an adventure in the Dungeons &
                  Dragons game is to imagine and create a character of your own.
                  Your character is a combination of game statistics,
                  roleplaying hooks, and your imagination.
                </p>
              </>
            }
          >
            <p>
              You choose a class (such as Fighter or Wizard), a background (such
              as Artisan or Soldier), and a species (such as Human or Halfling).
              You also invent the personality, appearance, and backstory of your
              character. Once completed, your character serves as your
              representative in the game, your avatar in the Dungeons &amp;
              Dragons multiverse.
            </p>

            <p>
              Before you dive into the character builder, think about the kind
              of adventurer you want to play. You might be a courageous Fighter,
              a skulking Rogue, a fervent Cleric, or a flamboyant Wizard. Or you
              might be more interested in an unconventional character, such as a
              brawny Rogue who likes hand-to-hand combat, or a sharpshooter who
              picks off enemies from afar. Do you like fantasy fiction featuring
              Dwarves or Elves? Try building a character of one of those
              species. Do you want your character to be the toughest adventurer
              at the table? Consider a class like Barbarian or Paladin. Once you
              have a character in mind, follow the steps in this builder in
              order, making decisions that reflect the character you want. Your
              conception of your character might evolve with each choice you
              make. What's important is that you come to the table with a
              character you're excited to play.
            </p>
          </CollapsibleContent>
          <CollapsibleContent
            forceShow={!isMobile}
            heading={
              <>
                <PageHeader>Character Level</PageHeader>
                <p>
                  Typically, your character begins play at 1st level. In the
                  next step, adjust your level if you’re playing in a
                  higher-powered campaign.
                </p>
              </>
            }
          >
            <p>
              As your character goes on adventures and overcomes challenges,
              they gain experience, represented by Experience Points (XP). Once
              you reach a specified XP total, you gain a new level. Adjusting
              your character level will change your XP total and vice versa.
            </p>
          </CollapsibleContent>
          <PageHeader>Preferences</PageHeader>
          <p>
            The next step also includes various preferences for your character.
            You can proceed with the default options or make changes if desired.
          </p>
        </PageBody>
      </Page>
    );
  }
}

export default ConnectedBuilderPage(
  HomeHelp,
  RouteKey.HOME_HELP,
  (state: BuilderAppState) => {
    return {
      isMobile: appEnvSelectors.getIsMobile(state),
    };
  }
);
