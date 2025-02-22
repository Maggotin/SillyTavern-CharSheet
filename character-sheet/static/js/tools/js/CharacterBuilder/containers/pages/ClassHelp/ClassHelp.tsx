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
class ClassHelp extends React.PureComponent<Props> {
  render() {
    const { isMobile } = this.props;

    return (
      <Page>
        <PageBody>
          <PageHeader>Choose your Class</PageHeader>

          <CollapsibleContent
            forceShow={!isMobile}
            heading={
              <p>
                In the first step, choose a class for your character. Every
                adventurer is a member of a class. Class broadly describes a
                character's vocation, what special talents they possess, and the
                tactics they are most likely to employ when exploring a dungeon,
                fighting monsters, or engaging in a tense negotiation.
              </p>
            }
          >
            <p>
              Your character receives a number of benefits from your chosen
              class. These features are capabilities (such as Spellcasting) that
              set your character apart from members of other classes. You also
              gain a number of proficiencies: weapons, skills, saving throws,
              and sometimes tools. Your proficiencies define many of the things
              your character can do particularly well, from using certain
              weapons to telling a convincing lie.
            </p>
          </CollapsibleContent>

          <PageHeader>Multiclassing</PageHeader>

          <p>
            Adventurers sometimes advance in more than one class. A Rogue might
            switch direction in life and swear the oath of a Paladin, A
            Barbarian might discover latent magical ability and dabble in the
            Sorcerer class while continuing to advance as a Barbarian.
          </p>

          <p>
            The optional rules for combining classes in this way is called
            Multiclassing.
          </p>
        </PageBody>
      </Page>
    );
  }
}

export default ConnectedBuilderPage(
  ClassHelp,
  RouteKey.CLASS_HELP,
  (state: BuilderAppState) => {
    return {
      isMobile: appEnvSelectors.getIsMobile(state),
    };
  }
);
