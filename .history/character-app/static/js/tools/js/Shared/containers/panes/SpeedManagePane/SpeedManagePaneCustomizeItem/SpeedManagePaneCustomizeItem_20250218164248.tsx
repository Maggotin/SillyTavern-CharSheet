import React from "react";

import { HelperUtils } from "../../character-rules-engine/es";

interface Props {
  id: number;
  label: string | null;
  initialValue: number | null;
  initialSource: string | null;
  onUpdate: (id: number, value: number | null, source: string | null) => void;
  enableSource: boolean;
  minimumValue: number | null;
  className: string;
}
interface State {
  value: number | null;
  source: string | null;
  isDirty: boolean;
}
export default class SpeedManagePaneCustomizeItem extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    className: "",
    enableSource: true,
    minimumValue: null,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.initialValue,
      source: props.initialSource,
      isDirty: false,
    };
  }

  handleUpdate = (): void => {
    const { onUpdate, id } = this.props;
    const { value, source, isDirty } = this.state;

    if (isDirty && onUpdate) {
      onUpdate(id, value, source);
      this.setState({
        isDirty: false,
      });
    }
  };

  handleValueBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { minimumValue } = this.props;

    let value = evt.target.value;
    this.setState((prevState) => {
      let parsedValue = HelperUtils.parseInputInt(value);
      let clampedInt: number | null = parsedValue;
      if (minimumValue !== null && parsedValue !== null) {
        clampedInt = HelperUtils.clampInt(parsedValue, minimumValue);
      }

      return {
        value: clampedInt,
      };
    }, this.handleUpdate);
  };

  handleValueChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      value: HelperUtils.parseInputInt(evt.target.value),
      isDirty: true,
    });
  };

  handleSourceChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      source: evt.target.value,
      isDirty: true,
    });
  };

  render() {
    const { value, source } = this.state;
    const { label, enableSource, minimumValue, className } = this.props;

    return (
      <div className={`ct-speed-manage-pane__customize-item ${className}`}>
        <div className="ct-speed-manage-pane__customize-item-label">
          {label}
        </div>
        <div className="ct-speed-manage-pane__customize-item-input">
          <input
            type="number"
            min={minimumValue === null ? undefined : minimumValue}
            onChange={this.handleValueChange}
            onBlur={this.handleValueBlur}
            value={value === null ? "" : value}
          />
        </div>
        {enableSource && (
          <div className="ct-speed-manage-pane__customize-item-source">
            <input
              type="text"
              onChange={this.handleSourceChange}
              onBlur={this.handleUpdate}
              value={source === null ? "" : source}
            />
          </div>
        )}
      </div>
    );
    //`
  }
}
