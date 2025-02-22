import React from "react";

import { RouteKey } from "~/subApps/builder/constants";

import Page from "../../../components/Page";
import { PageBody } from "../../../components/PageBody";
import PageHeader from "../../../components/PageHeader";
import PageSubHeader from "../../../components/PageSubHeader";
import ConnectedBuilderPage from "../ConnectedBuilderPage";

class EquipmentHelp extends React.PureComponent {
  render() {
    return (
      <Page>
        <PageBody>
          <PageHeader>Choose Equipment</PageHeader>
          <p>
            In this step, you will select weapons, armor, and other adventuring
            gear for your character.
          </p>

          <PageSubHeader>Starting Equipment</PageSubHeader>
          <p>
            Your starting equipment options will be displayed on the next
            screen. Your class and background determine your character’s
            starting equipment. Review the options and add the appropriate items
            using Manage Equipment.
          </p>

          <PageSubHeader>Starting Gold</PageSubHeader>
          <p>
            Instead of taking the gear given to you by your class and
            background, you can purchase starting equipment. You have a number
            of gold pieces (GP) to spend based on your class, as shown on the
            next screen if you choose this option.
          </p>
        </PageBody>
      </Page>
    );
  }
}

export default ConnectedBuilderPage(EquipmentHelp, RouteKey.EQUIPMENT_HELP);
