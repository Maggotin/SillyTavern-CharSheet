import uniqueId from "lodash/uniqueId";
import React from "react";

import { Select } from "../../character-components/es";

import styles from "./styles.module.css";

interface Props {
  initialValue: string | null;
  onChange?: (value: string) => void;
  onChangePromise?: (
    newValue: string,
    oldValue: string,
    accept: () => void,
    reject: () => void
  ) => void;
  heading: React.ReactNode;
  clsNames: Array<string>;
  initialOptionRemoved: boolean;
  options: Array<any>;
  description?: React.ReactNode;
  block: boolean;
  placeholder?: string;
}
interface State {
  value: string | null;
}
export default class FormSelectField extends React.PureComponent<Props, State> {
  static defaultProps = {
    initialValue: null,
    clsNames: [],
    initialOptionRemoved: false,
    block: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.initialValue,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { initialValue } = this.props;

    if (initialValue !== prevProps.initialValue) {
      this.setState({
        value: initialValue,
      });
    }
  }

  handleChange = (value: string): void => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(value);
    }

    this.setState({
      value,
    });
  };

  //TODO test that removing newValue from state still works in builder choices
  handleChangePromise = (
    newValue: string,
    oldValue: string,
    accept: () => void,
    reject: () => void
  ): void => {
    const { onChangePromise } = this.props;

    if (onChangePromise) {
      onChangePromise(newValue, oldValue, accept, reject);
    }
  };

  render() {
    const { value } = this.state;
    const {
      onChangePromise,
      onChange,
      block,
      heading,
      options,
      clsNames,
      initialOptionRemoved,
      description,
      placeholder,
    } = this.props;

    const uId: string = uniqueId("qry-");

    let conClsNames: Array<string> = ["builder-field", "builder-field-select"];
    if (clsNames.length) {
      conClsNames = [...conClsNames, ...clsNames];
    }
    if (block) {
      conClsNames.push("builder-field-select-block");
    }

    return (
      <div className={conClsNames.join(" ")}>
        <div className="builder-field-select-summary">
          <label
            className="builder-field-heading form-input-field-label"
            htmlFor={uId}
          >
            {heading}
          </label>
          <div className={styles.summaryDescription}>{description}</div>
        </div>
        <div className="builder-field-select-input">
          <Select
            options={options}
            onChange={onChange ? this.handleChange : undefined}
            onChangePromise={
              onChangePromise ? this.handleChangePromise : undefined
            }
            value={value}
            initialOptionRemoved={initialOptionRemoved}
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  }
}
