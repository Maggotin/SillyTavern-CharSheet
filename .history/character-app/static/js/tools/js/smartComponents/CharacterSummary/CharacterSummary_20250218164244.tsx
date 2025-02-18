import * as React from "react";

import {
  CharClass,
  ClassUtils,
  Race,
  RaceUtils,
} from "../../character-rules-engine/es";

interface Props {
  classes: Array<CharClass> | null;
  gender: string | null;
  species: Race | null;
  className: string;
}
export default class CharacterSummary extends React.PureComponent<Props, {}> {
  static defaultProps = {
    className: "",
  };

  renderClassList(): React.ReactNode {
    const { classes } = this.props;

    if (classes === null) {
      return null;
    }

    const list: Array<string> = classes.map(
      (charClass) =>
        `${ClassUtils.getName(charClass)} ${ClassUtils.getLevel(charClass)}`
    );
    return (
      <span className="ddbc-character-summary__classes">
        {list.join(" / ")}
      </span>
    );
  }

  render() {
    const { species, gender, className } = this.props;

    const classNames: Array<string> = ["ddbc-character-summary", className];

    let speciesNode: React.ReactNode;
    if (species !== null) {
      speciesNode = RaceUtils.getFullName(species);
    }

    return (
      <div className={classNames.join(" ")}>
        {gender && (
          <span className="ddbc-character-summary__gender">{gender}</span>
        )}
        {speciesNode && (
          <span className="ddbc-character-summary__race">{speciesNode}</span>
        )}
        {this.renderClassList()}
      </div>
    );
  }
}
