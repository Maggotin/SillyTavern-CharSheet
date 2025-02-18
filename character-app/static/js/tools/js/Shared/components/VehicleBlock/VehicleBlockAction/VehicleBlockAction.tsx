import React from "react";

import { HtmlContent } from "~/components/HtmlContent";

import { VehicleBlockActionProp } from "../../../utils/Component";
import InlineSeparatedNodes from "../../common/InlineSeparatedNodes";

interface Props {
  action: VehicleBlockActionProp;
}
export default class VehicleBlockAction extends React.PureComponent<Props> {
  render() {
    const { action } = this.props;

    const { key, name, description, ammo } = action;

    const actionText: Array<React.ReactNode> = [];

    if (name) {
      actionText.push(
        <span className="ct-vehicle-block__action-name">{name}.</span>
      );
    }

    if (ammo !== null && ammo.length > 0) {
      let ammunitionText: Array<string> = [];
      ammo.forEach((ammoContract) => {
        let text: string = `${ammoContract.quantity}`;
        if (ammoContract.custom !== null) {
          text = `${text} ${ammoContract.custom}`;
        }

        ammunitionText.push(text);
      });
      actionText.push(
        <React.Fragment>
          <span className="ct-vehicle-block__action-ammo-label">
            Ammunition:{" "}
          </span>
          <span className="ct-vehicle-block__action-ammo-description">
            {ammunitionText.join(", ")}.
          </span>
        </React.Fragment>
      );
    }

    if (description) {
      //All vehicle && component actions descriptions are currently formatted html,
      //should use action props derivers to generate the content displayed in this description in the future
      actionText.push(
        <React.Fragment>
          <HtmlContent
            className="ct-vehicle-block__action-description"
            html={description}
            withoutTooltips
          />
        </React.Fragment>
      );
    }

    return (
      <div className="ct-vehicle-block__action" key={key}>
        <InlineSeparatedNodes nodes={actionText} sep={" "} />
      </div>
    );
  }
}
