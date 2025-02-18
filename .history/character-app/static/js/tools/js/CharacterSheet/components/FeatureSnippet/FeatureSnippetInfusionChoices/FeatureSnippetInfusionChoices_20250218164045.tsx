import React from "react";

import {
  InfusionChoice,
  InfusionChoiceUtils,
  InfusionUtils,
  KnownInfusionUtils,
} from "../../rules-engine/es";

type OnInfusionChoiceClick = (infusionChoice: InfusionChoice) => void;
interface Props {
  infusionChoices: Array<InfusionChoice>;

  onInfusionChoiceClick?: OnInfusionChoiceClick;
}

export default class FeatureSnippetInfusionChoices extends React.PureComponent<Props> {
  handleInfusionChoiceClick = (
    infusionChoice: InfusionChoice,
    evt: React.MouseEvent
  ) => {
    const { onInfusionChoiceClick } = this.props;

    if (onInfusionChoiceClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onInfusionChoiceClick(infusionChoice);
    }
  };

  render() {
    const { infusionChoices } = this.props;

    let availableInfusionChoices = infusionChoices.filter(
      InfusionChoiceUtils.validateIsAvailable
    );

    if (!availableInfusionChoices.length) {
      return null;
    }

    let classNames: Array<string> = ["ct-feature-snippet__infusion-choices"];

    return (
      <div className={classNames.join(" ")}>
        {availableInfusionChoices.map((infusionChoice, idx) => {
          const knownInfusion =
            InfusionChoiceUtils.getKnownInfusion(infusionChoice);

          let nameNode: React.ReactNode = "No Infusion Choice Made";
          let onClick: OnInfusionChoiceClick | undefined;
          if (knownInfusion) {
            const simulatedInfusion =
              KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
            if (simulatedInfusion !== null) {
              nameNode = (
                <React.Fragment>
                  {InfusionUtils.getName(simulatedInfusion)}
                </React.Fragment>
              );
              onClick = this.handleInfusionChoiceClick.bind(
                this,
                infusionChoice
              );
            }
          }

          const choiceKey = InfusionChoiceUtils.getKey(infusionChoice);

          //TODO this onclick handler needs to be converted to a new sub component to
          // get away from the need for binding as it messes with typing it
          return (
            <div
              className="ct-feature-snippet__infusion-choice"
              key={choiceKey === null ? "" : choiceKey}
            >
              <div
                className="ct-feature-snippet__infusion-choice-summary"
                onClick={onClick as any}
              >
                {nameNode}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
