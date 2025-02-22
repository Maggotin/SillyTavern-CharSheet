import React from "react";

import { RemoveButton } from "../../../../components/common/Button";

interface Props {
  label: string;
  type: number;
  id: number;
  initialValue: string | null;
  sourcePlaceholder: string;
  onRemove?: (type: number, id: number) => void;
  onSourceUpdate?: (type: number, id: number, value: string | null) => void;
}
interface State {
  value: string | null;
  isDirty: boolean;
}
export default class DefenseManagePaneCustomItem extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    sourcePlaceholder: "Enter Source Note...",
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.initialValue,
      isDirty: false,
    };
  }

  handleRemove = (): void => {
    const { type, id, onRemove } = this.props;

    if (onRemove) {
      onRemove(type, id);
    }
  };

  handleSourceBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { value, isDirty } = this.state;
    const { type, id, onSourceUpdate } = this.props;

    if (isDirty && onSourceUpdate) {
      onSourceUpdate(type, id, value);
      this.setState({
        isDirty: false,
      });
    }
  };

  handleSourceChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      value: evt.target.value,
      isDirty: true,
    });
  };

  render() {
    const { value } = this.state;
    const { label, sourcePlaceholder } = this.props;

    return (
      <div className="ct-defense-manage-pane__custom-item">
        <div className="ct-defense-manage-pane__custom-item-action">
          <RemoveButton onClick={this.handleRemove} />
        </div>
        <div className="ct-defense-manage-pane__custom-item-label">{label}</div>
        <div className="ct-defense-manage-pane__custom-item-source">
          <input
            type="text"
            onChange={this.handleSourceChange}
            onBlur={this.handleSourceBlur}
            value={value === null ? "" : value}
            placeholder={sourcePlaceholder}
          />
        </div>
      </div>
    );
  }
}
