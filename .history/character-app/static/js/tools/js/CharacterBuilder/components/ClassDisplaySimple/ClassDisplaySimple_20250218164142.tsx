import React from "react";

import { ClassDefinitionContract } from "@dndbeyond/character-rules-engine/es";

import Button from "../Button";

interface Props {
  charClass: ClassDefinitionContract;
  onRequestChange: () => void;
}
export default class ClassDisplaySimple extends React.PureComponent<Props> {
  handleChangeClick = () => {
    const { onRequestChange } = this.props;

    if (onRequestChange) {
      onRequestChange();
    }
  };

  render() {
    const { charClass } = this.props;

    let portraitAvatarUrl = charClass.portraitAvatarUrl;

    return (
      <div className="builder-field builder-field-valid class-simple">
        <div className="builder-field-heading">Selected Class</div>
        <div className="class-simple-chosen">
          <div className="class-simple-chosen-preview">
            <img
              className="class-simple-chosen-preview-img"
              src={portraitAvatarUrl ? portraitAvatarUrl : ""}
              alt=""
            />
          </div>
          <div className="class-simple-chosen-heading">{charClass.name}</div>
          <div className="class-simple-chosen-action">
            <Button onClick={this.handleChangeClick} size="small">
              Change
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
