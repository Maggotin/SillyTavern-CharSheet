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
}

const SpeciesHelp: React.FC<Props> = ({ isMobile }) => {
  return (
    <Page>
      <PageBody>
        <PageHeader>Choose your Species</PageHeader>

        <CollapsibleContent
          forceShow={!isMobile}
          heading={
            <p>
              Choose a species in the next step. Your choice of species affects
              many different aspects of your character. It establishes
              fundamental qualities that exist throughout your character's
              adventuring career. When making this decision, keep in mind the
              kind of character you want to play.
            </p>
          }
        >
          <p>
            For example, a halfling could be a good choice for a sneaky rogue, a
            dwarf makes a tough warrior, and an elf can be a master of arcane
            magic.
          </p>

          <p>
            Your character species not only affects your ability scores and
            traits but also provides the cues for building your character's
            story. Each species' description includes information to help you
            roleplay a character of that species, including personality,
            physical appearance, features of society, and alignment tendencies.
          </p>

          <p>
            These details are suggestions to help you think about your
            character; adventurers can deviate widely from the norm for their
            species. It's worthwhile to consider why your character is
            different, as a helpful way to think about your character's
            background and personality.
          </p>
        </CollapsibleContent>

        <PageHeader>Traits</PageHeader>

        <CollapsibleContent
          forceShow={!isMobile}
          heading={
            <p>
              The description of each species includes traits that are common to
              members of that species. The following entries appear among the
              traits of most species.
            </p>
          }
        >
          <p>
            <strong>AGE</strong>
            <br />
            The age entry notes the age when a member of the species is
            considered an adult, as well as the species' expected lifespan. This
            information can help you decide how old your character is at the
            start of the game. You can choose any age for your character, which
            could provide an explanation for some of your ability scores.
          </p>

          <p>
            For example, if you play a young or very old character, your age
            could explain a particularly low Strength or Constitution score,
            while advanced age could account for a high Intelligence or Wisdom.
          </p>

          <p>
            <strong>SIZE</strong>
            <br />
            Characters of most species are Medium, a size category including
            creatures that are roughly 4 to 8 feet tall. Members of a few
            species are Small (between 2 and 4 feet tall), which means that
            certain rules of the game affect them differently.
          </p>

          <p>
            <strong>SPEED</strong>
            <br />
            Your speed determines how far you can move when traveling and
            fighting.
          </p>

          <p>
            <strong>LANGUAGES</strong>
            <br />
            By virtue of your species, your character can speak, read, and write
            certain languages.
          </p>
        </CollapsibleContent>
      </PageBody>
    </Page>
  );
};

export default ConnectedBuilderPage(
  SpeciesHelp,
  RouteKey.RACE_HELP,
  (state: BuilderAppState) => {
    return {
      isMobile: appEnvSelectors.getIsMobile(state),
    };
  }
);
