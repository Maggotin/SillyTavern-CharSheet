import React from "react";

import {
  Constants,
  EntityAdjustmentConstraintContract,
  RuleData,
  RuleDataUtils,
} from "../../character-rules-engine/es";

import {
  SIGNED_32BIT_INT_MAX_VALUE,
  SIGNED_32BIT_INT_MIN_VALUE,
} from "~/subApps/sheet/constants";

import ValueEditorCheckboxProperty from "./ValueEditorCheckboxProperty";
import ValueEditorNumberProperty from "./ValueEditorNumberProperty";
import ValueEditorSelectProperty from "./ValueEditorSelectProperty";
import ValueEditorTextProperty from "./ValueEditorTextProperty";

interface ConstraintProps {
  minimumValue?: number;
  maximumValue?: number;
}

interface Props {
  dataLookup: Partial<Record<Constants.AdjustmentTypeEnum, any>>;
  valueEditors: Array<number>; // TODO deal with enums not working with switch statement
  labelOverrides: Partial<Record<Constants.AdjustmentTypeEnum, string>>;
  optionRestrictions: Partial<Record<Constants.AdjustmentTypeEnum, Array<any>>>;
  defaultValues: Partial<Record<Constants.AdjustmentTypeEnum, any>>;
  layoutType: "standard" | "compact";
  onDataUpdate?: (
    propertyKey: Constants.AdjustmentTypeEnum,
    value: any,
    source: any
  ) => void;
  ruleData: RuleData;
  className: string;
}
interface State {
  dataLookup: Partial<Record<Constants.AdjustmentTypeEnum, any>>;
}
export default class ValueEditor extends React.PureComponent<Props, State> {
  static defaultProps = {
    className: "",
    labelOverrides: {},
    optionRestrictions: {},
    defaultValues: {},
    layoutType: "standard",
  };

  constructor(props: Props) {
    super(props);

    this.state = this.generateStateData(props);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { dataLookup } = this.props;

    if (dataLookup !== prevProps.dataLookup) {
      this.setState(this.generateStateData(this.props));
    }
  }

  generateStateData = (props: Props): State => {
    const { dataLookup } = props;

    return {
      dataLookup,
    };
  };

  getNumberConstraintProps = (
    constraintLookup: Record<number, EntityAdjustmentConstraintContract>
  ): ConstraintProps => {
    let constraintProps: ConstraintProps = {};
    if (constraintLookup[Constants.AdjustmentConstraintTypeEnum.MINIMUM]) {
      constraintProps.minimumValue = this.getConstraintValue(
        Constants.AdjustmentConstraintTypeEnum.MINIMUM,
        constraintLookup
      );
    } else {
      constraintProps.minimumValue = SIGNED_32BIT_INT_MIN_VALUE;
    }
    if (constraintLookup[Constants.AdjustmentConstraintTypeEnum.MAXIMUM]) {
      constraintProps.maximumValue = this.getConstraintValue(
        Constants.AdjustmentConstraintTypeEnum.MAXIMUM,
        constraintLookup
      );
    } else {
      constraintProps.maximumValue = SIGNED_32BIT_INT_MAX_VALUE;
    }
    return constraintProps;
  };

  getConstraintValue = (
    constraintTypeId: Constants.AdjustmentConstraintTypeEnum,
    constraintLookup: Record<number, EntityAdjustmentConstraintContract>,
    fallback: any = null
  ): any => {
    let constraint = constraintLookup[constraintTypeId];
    if (constraint) {
      return constraint.value;
    }
    return fallback;
  };

  getPropertyValue = (key: Constants.AdjustmentTypeEnum): any => {
    const { dataLookup, defaultValues } = this.props;

    let property = dataLookup[key];
    if (property) {
      return property.value;
    }

    let defaultValue = defaultValues[key];
    if (defaultValue) {
      return defaultValue;
    }

    return null;
  };

  getPropertySource = (key: Constants.AdjustmentTypeEnum): string | null => {
    const { dataLookup } = this.state;
    let property = dataLookup[key];
    if (property) {
      return property.notes;
    }
    return null;
  };

  restrictOptions = <T extends any>(
    key: Constants.AdjustmentTypeEnum,
    options: Array<T>
  ): Array<T> => {
    const { optionRestrictions } = this.props;

    let typeOptionRestrictions = optionRestrictions[key];

    if (!typeOptionRestrictions || typeOptionRestrictions.length === 0) {
      return options;
    }

    return options.filter((option) => {
      if (!typeOptionRestrictions) {
        return true;
      }
      // @ts-ignore
      return typeOptionRestrictions.includes(option.value);
    });
  };

  handleDataUpdate = (
    key: Constants.AdjustmentTypeEnum,
    value: any,
    source: any
  ): void => {
    const { onDataUpdate } = this.props;

    this.setState((prevState: State): State => {
      let processedSource: string | null = source === "" ? null : source;
      if (
        onDataUpdate &&
        (this.getPropertyValue(key) !== value ||
          this.getPropertySource(key) !== processedSource)
      ) {
        onDataUpdate(key, value, processedSource);
      }

      return {
        ...prevState,
        dataLookup: {
          ...prevState.dataLookup,
          [key]: {
            value,
            notes: processedSource,
          },
        },
      };
    });
  };

  render() {
    const { valueEditors, className, ruleData, labelOverrides, layoutType } =
      this.props;

    let enableSource: boolean = layoutType === "standard";
    let layoutClass: string = layoutType === "compact" ? "compact" : "standard";

    let classNames: Array<string> = [
      "ct-value-editor",
      `ct-value-editor--${layoutClass}`,
      className,
    ];

    return (
      <div className={classNames.join(" ")}>
        {valueEditors.map((valueTypeId) => {
          let valueDataTypeId = RuleDataUtils.getAdjustmentDataType(
            valueTypeId,
            ruleData
          );
          let constraintLookup = RuleDataUtils.getAdjustmentConstraintLookup(
            valueTypeId,
            ruleData
          );
          let valueName: string = "";
          if (labelOverrides.hasOwnProperty(valueTypeId)) {
            valueName = labelOverrides[valueTypeId];
          } else {
            let adjustmentName = RuleDataUtils.getAdjustmentName(
              valueTypeId,
              ruleData
            );
            if (adjustmentName) {
              valueName = adjustmentName;
            }
          }
          switch (valueDataTypeId) {
            case Constants.AdjustmentDataTypeEnum.STRING:
              return (
                <ValueEditorTextProperty
                  key={valueTypeId}
                  propertyKey={valueTypeId}
                  defaultValue={this.getPropertyValue(valueTypeId)}
                  label={valueName}
                  onUpdate={this.handleDataUpdate}
                  enableSource={enableSource}
                  initialFocus={
                    valueTypeId === Constants.AdjustmentTypeEnum.NAME_OVERRIDE
                  }
                />
              );

            case Constants.AdjustmentDataTypeEnum.BOOLEAN:
              return (
                <ValueEditorCheckboxProperty
                  key={valueTypeId}
                  propertyKey={valueTypeId}
                  initiallyEnabled={this.getPropertyValue(valueTypeId)}
                  defaultSource={this.getPropertySource(valueTypeId)}
                  label={valueName}
                  onUpdate={this.handleDataUpdate}
                  enableSource={enableSource}
                />
              );

            case Constants.AdjustmentDataTypeEnum.INTEGER:
              let baseProps = {
                key: valueTypeId,
                propertyKey: valueTypeId,
                defaultValue: this.getPropertyValue(valueTypeId),
                defaultSource: this.getPropertySource(valueTypeId),
                label: valueName,
                onUpdate: this.handleDataUpdate,
                enableSource: enableSource,
              };

              switch (valueTypeId) {
                case Constants.AdjustmentTypeEnum.SKILL_STAT_OVERRIDE:
                  return (
                    <ValueEditorSelectProperty
                      {...baseProps}
                      options={RuleDataUtils.getStatOptions(ruleData)}
                    />
                  );

                case Constants.AdjustmentTypeEnum.DICE_TYPE_OVERRIDE:
                  return (
                    <ValueEditorSelectProperty
                      {...baseProps}
                      options={RuleDataUtils.getDieTypeOptions(ruleData)}
                    />
                  );

                case Constants.AdjustmentTypeEnum.SKILL_PROFICIENCY_LEVEL:
                case Constants.AdjustmentTypeEnum
                  .SAVING_THROW_PROFICIENCY_LEVEL:
                  return (
                    <ValueEditorSelectProperty
                      {...baseProps}
                      options={RuleDataUtils.getProficiencyLevelOptions(
                        ruleData
                      )}
                    />
                  );

                case Constants.AdjustmentTypeEnum.CREATURE_ALIGNMENT:
                  return (
                    <ValueEditorSelectProperty
                      {...baseProps}
                      options={RuleDataUtils.getAlignmentOptions(ruleData)}
                    />
                  );

                case Constants.AdjustmentTypeEnum.CREATURE_SIZE:
                  return (
                    <ValueEditorSelectProperty
                      {...baseProps}
                      options={RuleDataUtils.getCreatureSizeOptions(ruleData)}
                    />
                  );

                case Constants.AdjustmentTypeEnum.CREATURE_TYPE_OVERRIDE:
                  return (
                    <ValueEditorSelectProperty
                      {...baseProps}
                      options={this.restrictOptions(
                        valueTypeId,
                        RuleDataUtils.getMonsterTypeOptions(ruleData)
                      )}
                    />
                  );

                default:
                  let constraintProps =
                    this.getNumberConstraintProps(constraintLookup);
                  return (
                    <ValueEditorNumberProperty
                      {...baseProps}
                      {...constraintProps}
                    />
                  );
              }

            case Constants.AdjustmentDataTypeEnum.DECIMAL:
              let constraintProps =
                this.getNumberConstraintProps(constraintLookup);
              return (
                <ValueEditorNumberProperty
                  key={valueTypeId}
                  step={0.01}
                  propertyKey={valueTypeId}
                  defaultValue={this.getPropertyValue(valueTypeId)}
                  defaultSource={this.getPropertySource(valueTypeId)}
                  label={valueName}
                  onUpdate={this.handleDataUpdate}
                  enableSource={enableSource}
                  {...constraintProps}
                />
              );

            default:
            // not implemented
          }

          return null;
        })}
      </div>
    );
  }
}
