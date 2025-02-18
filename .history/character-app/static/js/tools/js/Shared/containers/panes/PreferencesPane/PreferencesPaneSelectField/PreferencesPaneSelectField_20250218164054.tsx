import { uniqueId } from "lodash";
import React from "react";

import { Select } from "@dndbeyond/character-components/es";
import {
  HelperUtils,
  HtmlSelectOption,
} from "../../rules-engine/es";

import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";

interface Props {
  initialValue: number | null;
  onChange?: (value: number | null) => void;
  onChangePromise?: (
    newValue: string,
    oldValue: string,
    accept: () => void,
    reject: () => void
  ) => void;
  heading: React.ReactNode;
  className: string;
  initialOptionRemoved: boolean;
  options: Array<HtmlSelectOption>;
  description: string;
  block: boolean;
  placeholder?: string;
}
interface State {
  value: number | null;
}
export default class PreferencesPaneSelectField extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    initialValue: null,
    className: "",
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

    let parseValue = HelperUtils.parseInputInt(value);

    if (onChange) {
      onChange(parseValue);
    }

    this.setState({
      value: parseValue,
    });
  };

  handleChangePromise = (
    newValue: string,
    oldValue: string,
    accept: () => void,
    reject: () => void
  ): void => {
    const { onChangePromise } = this.props;

    if (onChangePromise) {
      onChangePromise(
        newValue,
        oldValue,
        () => {
          let parseValue = HelperUtils.parseInputInt(newValue);
          this.setState({
            value: parseValue,
          });
          accept();
        },
        reject
      );
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
      className,
      initialOptionRemoved,
      description,
      placeholder,
    } = this.props;

    const uId = uniqueId("qry-");

    let classNames: Array<string> = [
      "ct-preferences-pane__field",
      "ct-preferences-pane__field--select",
      className,
    ];
    if (block) {
      classNames.push("ct-preferences-pane__field--block");
    }

    return (
      <div className={classNames.join(" ")}>
        <div className="ct-preferences-pane__field-summary">
          <Heading className="ct-preferences-pane__field-heading">
            <label className="ct-preferences-pane__field-label" htmlFor={uId}>
              {heading}
            </label>
          </Heading>
          <div className="ct-preferences-pane__field-description">
            {description}
          </div>
        </div>
        <div className="ct-preferences-pane__field-input">
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
