import React from "react";

import {
  ApiAdapterPromise,
  ApiAdapterUtils,
  ApiResponse,
} from "../../rules-engine/es";

interface Props<T extends any = any, TData extends any = any> {
  loadOptions?: () => ApiAdapterPromise<ApiResponse<Array<TData>>>;
  clsNames: Array<string>;
  id?: any; //TODO type?
  options: Array<any>; //TODO type Options
  disabled: boolean;
  value: React.ReactText | null;
  placeholder: string;
  onChange?: (value: string) => void;
  onChangePromise?: (
    newValue: string,
    oldValue: string,
    accept: () => void,
    reject: () => void
  ) => void;
  parseLoadedOptions?: (data: Array<TData>) => Array<T>;
  resetAfterChoice: boolean;
  initialOptionRemoved: boolean;
  preventClickPropagating: boolean;
  isReadonly?: boolean;
  className: string;
}
interface State {
  isLazy: boolean;
  lazyOptions: Array<any>;
  value: React.ReactText;
  resetAfterChoiceValues: Array<string>;
}
export default class Select extends React.Component<Props, State> {
  static defaultProps = {
    clsNames: [],
    className: "",
    disabled: false,
    resetAfterChoice: false,
    initialOptionRemoved: false,
    placeholder: "-- Choose an Option --",
    options: [],
    preventClickPropagating: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isLazy: !!props.loadOptions,
      lazyOptions: [],
      value: props.value === null ? "" : props.value,
      resetAfterChoiceValues: this.getResetAfterValueChoices(props),
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { value } = this.props;

    if (value !== prevProps.value) {
      this.setState({
        value: value === null ? "" : value,
      });
    }
  }

  componentDidMount() {
    const { isLazy } = this.state;
    const { loadOptions, parseLoadedOptions } = this.props;

    if (isLazy && loadOptions && parseLoadedOptions) {
      loadOptions().then((response) => {
        const data = ApiAdapterUtils.getResponseData(response);
        if (data === null) {
          return;
        }

        this.setState({
          lazyOptions: parseLoadedOptions(data),
        });
      });
    }
  }

  getResetAfterValueChoices = (props: Props): Array<string> => {
    const { options, resetAfterChoice } = props;

    if (resetAfterChoice) {
      return options.reduce((acc, option) => {
        if (option.options) {
          acc.push(...option.options.map((opt) => "" + opt.value));
        } else {
          acc.push("" + option.value);
        }
        return acc;
      }, []);
    }

    return options.reduce((acc, option) => {
      if (option.options && option.resetAfterChoice) {
        acc.push(...option.options.map((opt) => "" + opt.value));
      }
      return acc;
    }, []);
  };

  handleChange = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value, resetAfterChoiceValues } = this.state;
    const { onChangePromise, onChange, resetAfterChoice } = this.props;

    const newValue: string = evt.target.value;

    if (onChangePromise) {
      onChangePromise(
        newValue,
        String(value),
        () => {
          this.setState({
            value: newValue,
          });

          if (onChange) {
            onChange(newValue);
          }

          if (resetAfterChoice) {
            evt.target.selectedIndex = 0;
          }
        },
        () => {}
      );
    } else {
      if (resetAfterChoice || resetAfterChoiceValues.includes(newValue)) {
        evt.target.selectedIndex = 0;
      } else {
        this.setState({
          value: newValue,
        });
      }

      if (onChange) {
        onChange(newValue);
      }
    }
  };

  handleClick = (evt: React.MouseEvent): void => {
    const { preventClickPropagating } = this.props;

    if (preventClickPropagating) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
    }
  };

  renderOption = (option: any): React.ReactNode => {
    return (
      <option
        key={option.value}
        value={String(option.value)}
        disabled={option.disabled}
      >
        {option.label}
      </option>
    );
  };

  renderOptGroup = (
    label: string,
    options: Array<any>,
    resetAfterChoice: boolean
  ) => {
    if (!options.length) {
      return null;
    }
    return (
      <optgroup label={label} key={label}>
        {options.map((option) => this.renderOption(option))}
      </optgroup>
    );
  };

  render() {
    const { isLazy, lazyOptions, value } = this.state;
    const {
      options,
      placeholder,
      initialOptionRemoved,
      id,
      disabled,
      clsNames,
      isReadonly,
      className,
    } = this.props;

    let displayOptions: Array<any> = options;
    if (isLazy) {
      displayOptions = lazyOptions;
    }

    const conClassNames: Array<string> = [
      "ddbc-select",
      ...clsNames,
      className,
    ];

    return (
      <select
        id={id}
        className={conClassNames.join(" ")}
        value={value}
        onChange={this.handleChange}
        onClick={this.handleClick}
        disabled={disabled || isReadonly}
      >
        <option
          value=""
          disabled={initialOptionRemoved}
          hidden={initialOptionRemoved}
        >
          {placeholder}
        </option>
        {displayOptions.map((option) => {
          if (option.options) {
            return this.renderOptGroup(
              option.optGroupLabel,
              option.options,
              option.resetAfterChoice
            );
          } else {
            return this.renderOption(option);
          }
        })}
      </select>
    );
  }
}
