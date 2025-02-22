import React from "react";

import { RouteKey } from "~/subApps/builder/constants";

import Page from "../../../components/Page";
import { PageBody } from "../../../components/PageBody";
import PageHeader from "../../../components/PageHeader";
import ConnectedBuilderPage from "../ConnectedBuilderPage";

interface Props {}
class DescriptionHelp extends React.PureComponent<Props> {
  render() {
    return (
      <Page>
        <PageBody>
          <PageHeader>Background</PageHeader>
          <p>
            Your character’s background describes where they came from, their
            original occupation, and their place in the D&amp;D world.
          </p>

          <p>
            Backgrounds from the Core D&amp;D source category give your
            character ability score increases, an Origin feat, and proficiencies
            in specific skills and tools.
          </p>

          <p>
            Backgrounds from other sources give your character a background
            feature (a general benefit) and proficiency in two skills, and it
            might also give you additional languages or proficiency with certain
            kinds of tools.
          </p>

          <PageHeader>Describe Your Character</PageHeader>
          <p>
            In this step, you will flesh your character out as a person. Your
            character needs a name.
          </p>

          <p>
            You’ll need to decide your character’s appearance and personality.
            Choose your character’s alignment (the moral compass that guides his
            or her decisions) and ideals. Identify the things your character
            holds most dear, called bonds, and the flaws that could one day
            undermine them.
          </p>
        </PageBody>
      </Page>
    );
  }
}

export default ConnectedBuilderPage(DescriptionHelp, RouteKey.DESCRIPTION_HELP);
