import React from "react";

interface Props {
  defaultValue: string | null;
  placeholder: string;
  onUpdate?: (value: string) => void;
}
interface State {
  value: string | null;
}
export default class ValueEditorPropertySource extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    placeholder: "Enter Source Notes...",
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultValue,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { defaultValue } = this.props;
    const { value } = this.state;

    if (defaultValue !== prevProps.defaultValue && defaultValue !== value) {
      this.setState({
        value: defaultValue,
      });
    }
  }

  handleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      value: evt.target.value,
    });
  };

  handleBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { onUpdate } = this.props;

    let value = evt.target.value;
    if (onUpdate) {
      onUpdate(value);
    }
    this.setState({
      value,
    });
  };

  render() {
    const { value } = this.state;
    const { placeholder } = this.props;

    return (
      <div className="ct-value-editor__property-source">
        <input
          className="ct-value-editor__property-input"
          type="text"
          placeholder={placeholder}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={value === null ? "" : value}
        />
      </div>
    );
  }
}
