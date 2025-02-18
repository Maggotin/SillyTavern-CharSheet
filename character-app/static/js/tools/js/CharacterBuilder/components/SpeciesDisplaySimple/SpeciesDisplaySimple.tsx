import React from "react";

import {
  RaceDefinitionContract,
  RuleData,
  RuleDataUtils,
} from "@dndbeyond/character-rules-engine/es";

import Button from "../Button";

interface Props {
  species: RaceDefinitionContract | null;
  onRequestAction: () => void;
  actionText: string;
  headingText: string;
  ruleData: RuleData;
}
export default class SpeciesDisplaySimple extends React.PureComponent<Props> {
  static defaultProps = {
    actionText: "Change",
    headingText: "Selected ",
  };

  render() {
    const { species, actionText, headingText, ruleData, onRequestAction } =
      this.props;

    if (species === null) {
      return null;
    }

    const { portraitAvatarUrl, baseName, subRaceShortName } = species;
    const previewUrl: string | null = portraitAvatarUrl
      ? portraitAvatarUrl
      : RuleDataUtils.getDefaultRaceImageUrl(ruleData);

    return (
      <div className="builder-field builder-field-valid race-simple">
        <div className="builder-field-heading">{headingText}</div>
        <div className="race-simple-content">
          <div className="race-simple-preview">
            <img
              className="race-simple-preview-img"
              src={previewUrl ? previewUrl : ""}
              alt=""
            />
          </div>
          <div className="race-simple-info">
            {subRaceShortName ? (
              <div className="race-simple-subclass">{subRaceShortName}</div>
            ) : null}
            <div className="race-simple-parent">{baseName}</div>
          </div>
          <div className="race-simple-action">
            <Button onClick={onRequestAction} size="small">
              {actionText}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
