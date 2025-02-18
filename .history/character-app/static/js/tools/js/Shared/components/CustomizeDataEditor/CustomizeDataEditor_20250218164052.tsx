/**
 * NOTE: This file is meant to be removed over time.  This is an older editor that is still used,
 * but will be phased out eventually.
 */
import React from "react";

import { Checkbox, Select } from "@dndbeyond/character-components/es";
import {
  HelperUtils,
  HtmlSelectOption,
} from "../../rules-engine/es";

import CustomizeDataEditorProperty from "./CustomizeDataEditorProperty";
import CustomizeDataEditorPropertyLabel from "./CustomizeDataEditorPropertyLabel";
import CustomizeDataEditorPropertyValue from "./CustomizeDataEditorPropertyValue";

const CUSTOMIZE_KEY = {
  ABILITY_MODIFIER_STAT: "abilityModifierStatId",
  ATTACK_SUBTYPE: "attackSubtype",
  ACTIVATION_TYPE: "activationType",
  ACTIVATION_TIME: "activationTime",
  AOE_SIZE: "aoeSize",
  AOE_TYPE: "aoeType",
  COST: "cost",
  DAMAGE_BONUS: "damageBonus",
  DAMAGE_TYPE: "damageTypeId",
  DESCRIPTION: "description",
  DICE_COUNT: "diceCount",
  DICE_TYPE: "diceType",
  DISPLAY_AS_ATTACK: "displayAsAttack",
  FIXED_VALUE: "fixedValue",
  IS_ADAMANTINE: "isAdamantine",
  IS_OFFHAND: "isOffhand",
  IS_PROFICIENT: "isProficient",
  IS_SILVER: "isSilvered",
  IS_MARTIAL_ARTS: "isMartialArts",
  LONG_RANGE: "longRange",
  MAGIC_BONUS: "magicBonus",
  MISC_BONUS: "miscBonus",
  NAME: "name",
  NOTES: "notes",
  OVERRIDE: "override",
  PROFICIENCY_LEVEL: "proficiencyLevel",
  RANGE: "range",
  RANGE_TYPE: "rangeId",
  SAVE_DC_BONUS: "saveDcBonus",
  SAVE_DC: "fixedSaveDc",
  SAVE_TYPE: "saveStatId",
  SNIPPET: "snippet",
  SPELL_RANGE_TYPE: "spellRangeType",
  STAT: "statId",
  TO_HIT_BONUS: "toHitBonus",
  TO_HIT: "toHit",
  WEIGHT: "weight",
};

interface SelectEditorProps {
  label: string;
  propertyKey: string;
  defaultValue: number | null;
  options: Array<any>;
  onUpdate: (propertyKey: string, value: number | null) => void;
  isEnabled: boolean;
}
interface SelectEditorState {
  value: number | null;
}
class SelectEditor extends React.PureComponent<
  SelectEditorProps,
  SelectEditorState
> {
  static defaultProps = {
    options: [],
  };

  constructor(props: SelectEditorProps) {
    super(props);

    this.state = {
      value: props.defaultValue,
    };
  }

  handleChange = (value: string): void => {
    const { propertyKey, onUpdate } = this.props;

    if (onUpdate) {
      let parsedValue = HelperUtils.parseInputInt(value);
      onUpdate(propertyKey, parsedValue);
      this.setState({
        value: parsedValue,
      });
    }
  };

  render() {
    const { value } = this.state;
    const { propertyKey, label, options, isEnabled } = this.props;

    if (!isEnabled) {
      return null;
    }

    return (
      <CustomizeDataEditorProperty propertyKey={propertyKey}>
        <CustomizeDataEditorPropertyValue>
          <Select
            placeholder="--"
            options={options}
            value={value}
            onChange={this.handleChange}
          />
        </CustomizeDataEditorPropertyValue>
        <CustomizeDataEditorPropertyLabel>
          {label}
        </CustomizeDataEditorPropertyLabel>
      </CustomizeDataEditorProperty>
    );
  }
}

interface CheckboxEditorProps {
  label: string;
  propertyKey: string;
  initiallyEnabled: boolean;
  onUpdate: (propertyKey: string, value: boolean) => void;
  isEnabled: boolean;
}
class CheckboxEditor extends React.PureComponent<CheckboxEditorProps> {
  handleChange = (isEnabled: boolean): void => {
    const { propertyKey, onUpdate } = this.props;

    if (onUpdate) {
      onUpdate(propertyKey, isEnabled);
    }
  };

  render() {
    const { propertyKey, label, initiallyEnabled, isEnabled } = this.props;

    if (!isEnabled) {
      return null;
    }

    return (
      <CustomizeDataEditorProperty propertyKey={propertyKey}>
        <CustomizeDataEditorPropertyValue>
          <Checkbox
            label={label}
            initiallyEnabled={initiallyEnabled}
            enabled={initiallyEnabled}
            onChange={this.handleChange}
          />
        </CustomizeDataEditorPropertyValue>
      </CustomizeDataEditorProperty>
    );
  }
}

interface NumberEditorProps {
  label: string;
  propertyKey: string;
  defaultValue: number | null;
  minimumValue: number | null;
  maximumValue: number | null;
  onUpdate: (propertyKey: string, value: number | null) => void;
  isEnabled: boolean;
}
interface NumberEditorState {
  value: number | null;
}
class NumberEditor extends React.PureComponent<
  NumberEditorProps,
  NumberEditorState
> {
  static defaultProps = {
    minimumValue: null,
    maximumValue: null,
  };

  constructor(props: NumberEditorProps) {
    super(props);

    this.state = {
      value: props.defaultValue,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<NumberEditorProps>,
    prevState: Readonly<NumberEditorState>
  ): void {
    const { defaultValue } = this.props;

    if (defaultValue !== prevProps.defaultValue) {
      this.setState({
        value: defaultValue,
      });
    }
  }

  handleBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { propertyKey, onUpdate, minimumValue, maximumValue } = this.props;

    let parsedValue = HelperUtils.parseInputInt(evt.target.value);
    let newValue: number | null =
      parsedValue === null
        ? null
        : HelperUtils.clampInt(parsedValue, minimumValue, maximumValue);
    if (onUpdate) {
      onUpdate(propertyKey, newValue);
    }
    this.setState({
      value: newValue,
    });
  };

  handleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      value: HelperUtils.parseInputInt(evt.target.value),
    });
  };

  render() {
    const { value } = this.state;
    const { propertyKey, label, minimumValue, maximumValue, isEnabled } =
      this.props;

    if (!isEnabled) {
      return null;
    }

    return (
      <CustomizeDataEditorProperty propertyKey={propertyKey}>
        <CustomizeDataEditorPropertyValue>
          <input
            type="number"
            min={minimumValue ?? ""}
            max={maximumValue ?? ""}
            value={value ?? ""}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
          />
        </CustomizeDataEditorPropertyValue>
        <CustomizeDataEditorPropertyLabel>
          {label}
        </CustomizeDataEditorPropertyLabel>
      </CustomizeDataEditorProperty>
    );
  }
}

interface TextAreaEditorProps {
  label: string;
  propertyKey: string;
  defaultValue: string | null;
  onUpdate: (propertyKey: string, value: string | null) => void;
  isEnabled: boolean;
}
interface TextAreaEditorState {
  value: string;
}
class TextAreaEditor extends React.PureComponent<
  TextAreaEditorProps,
  TextAreaEditorState
> {
  constructor(props: TextEditorProps) {
    super(props);

    this.state = {
      value: props.defaultValue ?? "",
    };
  }

  componentDidUpdate(
    prevProps: Readonly<TextAreaEditorProps>,
    prevState: Readonly<TextAreaEditorState>
  ): void {
    const { defaultValue } = this.props;

    if (defaultValue !== prevProps.defaultValue) {
      this.setState({
        value: defaultValue ?? "",
      });
    }
  }

  handleBlur = (evt: React.FocusEvent<HTMLTextAreaElement>): void => {
    const { propertyKey, onUpdate } = this.props;

    if (onUpdate) {
      onUpdate(propertyKey, evt.target.value);
    }
  };

  handleChange = (evt: React.FocusEvent<HTMLTextAreaElement>): void => {
    const { value } = this.state;

    if (value !== evt.target.value) {
      this.setState({
        value: evt.target.value,
      });
    }
  };

  render() {
    const { propertyKey, label, isEnabled } = this.props;
    const { value } = this.state;

    if (!isEnabled) {
      return null;
    }

    return (
      <CustomizeDataEditorProperty propertyKey={propertyKey} isBlock={true}>
        <CustomizeDataEditorPropertyValue>
          <textarea
            value={value}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
          />
        </CustomizeDataEditorPropertyValue>
        <CustomizeDataEditorPropertyLabel>
          {label}
        </CustomizeDataEditorPropertyLabel>
      </CustomizeDataEditorProperty>
    );
  }
}

interface TextEditorProps {
  label: string;
  propertyKey: string;
  defaultValue: string | null;
  onUpdate: (propertyKey: string, value: string | null) => void;
  isEnabled: boolean;
  maxLength: number | null;
  initialFocus?: boolean;
}
interface TextAreaState {
  value: string | null;
}
class TextEditor extends React.PureComponent<TextEditorProps, TextAreaState> {
  static defaultProps = {
    maxLength: null,
  };

  constructor(props: TextEditorProps) {
    super(props);

    this.state = {
      value: props.defaultValue,
    };
  }
  inputRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    if (this.inputRef.current && this.props.initialFocus) {
      this.inputRef.current.focus();
    }
  }

  componentDidUpdate(
    prevProps: Readonly<TextEditorProps>,
    prevState: Readonly<TextAreaState>
  ): void {
    const { defaultValue } = this.props;

    if (defaultValue !== prevProps.defaultValue) {
      this.setState({
        value: defaultValue,
      });
    }
  }

  handleBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { propertyKey, onUpdate } = this.props;

    if (onUpdate) {
      onUpdate(propertyKey, evt.target.value);
    }
  };

  handleChange = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { value } = this.state;

    if (value !== evt.target.value) {
      this.setState({
        value: evt.target.value,
      });
    }
  };

  render() {
    const { propertyKey, label, isEnabled, maxLength } = this.props;

    const { value } = this.state;

    if (!isEnabled) {
      return null;
    }

    return (
      <CustomizeDataEditorProperty propertyKey={propertyKey} isBlock={true}>
        <CustomizeDataEditorPropertyValue>
          <input
            type="text"
            maxLength={maxLength ?? undefined}
            value={value ?? ""}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            ref={this.inputRef}
          />
        </CustomizeDataEditorPropertyValue>
        <CustomizeDataEditorPropertyLabel>
          {label}
        </CustomizeDataEditorPropertyLabel>
      </CustomizeDataEditorProperty>
    );
  }
}

type DataLookup = Record<string, any>;
interface Props {
  data: DataLookup;
  onDataUpdate: (data: DataLookup) => void;

  enableActivationType: boolean;
  enableActivationTime: boolean;
  enableAoeType: boolean;
  enableAoeSize: boolean;
  enableAttackSubtype: boolean;
  enableCost: boolean;
  enableDamageBonus: boolean;
  enableDamageType: boolean;
  enableDescription: boolean;
  enableDiceCount: boolean;
  enableDiceType: boolean;
  enableFixedValue: boolean;
  enableIsAdamantine: boolean;
  enableIsMartialArts: boolean;
  enableIsOffhand: boolean;
  enableIsProficient: boolean;
  enableIsSilver: boolean;
  enableLongRange: boolean;
  enableMagicBonus: boolean;
  enableMiscBonus: boolean;
  enableName: boolean;
  enableNotes: boolean;
  enableOverride: boolean;
  enableProficiencyLevel: boolean;
  enableRange: boolean;
  enableRangeType: boolean;
  enableSaveDcBonus: boolean;
  enableSaveDc: boolean;
  enableSaveType: boolean;
  enableSnippet: boolean;
  enableSpellRangeType: boolean;
  enableStat: boolean;
  enableToHitBonus: boolean;
  enableToHit: boolean;
  enableWeight: boolean;
  enableDisplayAsAttack: boolean;

  maxNameLength: number;

  fallbackValues: Record<string, any>;
  labelOverrides: Record<string, string>;

  damageTypeOptions?: Array<HtmlSelectOption>;
  diceTypeOptions?: Array<HtmlSelectOption>;
  rangeOptions?: Array<HtmlSelectOption>;
  statOptions?: Array<HtmlSelectOption>;
  attackSubtypeOptions?: Array<HtmlSelectOption>;
  activationTypeOptions?: Array<HtmlSelectOption>;
  spellRangeTypeOptions?: Array<HtmlSelectOption>;
  aoeTypeOptions?: Array<HtmlSelectOption>;
  proficiencyLevelOptions?: Array<HtmlSelectOption>;

  className: Array<string>;
}
interface State {
  data: DataLookup;
}
export default class CustomizeDataEditor extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    enableActivationTime: false,
    enableActivationType: false,
    enableAoeType: false,
    enableAoeSize: false,
    enableAttackSubtype: false,

    enableDamageBonus: false,
    enableName: false,
    enableNotes: false,
    enableSnippet: false,
    enableToHitBonus: false,
    enableToHit: false,
    enableDisplayAsAttack: false,

    enableCost: false,
    enableIsAdamantine: false,
    enableDescription: false,
    enableIsMartialArts: false,
    enableIsOffhand: false,
    enableIsProficient: false,
    enableIsSilver: false,
    enableSaveDcBonus: false,
    enableSaveDc: false,
    enableSaveType: false,
    enableSpellRangeType: false,

    enableWeight: false,

    enableProficiencyLevel: false,
    enableMagicBonus: false,
    enableMiscBonus: false,
    enableOverride: false,

    enableRange: false,
    enableLongRange: false,
    enableRangeType: false,
    enableStat: false,
    enableDiceCount: false,
    enableDiceType: false,
    enableFixedValue: false,
    enableDamageType: false,

    maxNameLength: 256,

    fallbackValues: {},
    labelOverrides: {},

    className: "",
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      data: props.data,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { data } = this.props;

    if (data !== prevProps.data) {
      this.setState({
        data,
      });
    }
  }

  handleDataUpdate = (key: string, value: any): void => {
    const { onDataUpdate } = this.props;

    this.setState((prevState: State) => {
      let newData: DataLookup = {
        ...prevState.data,
        [key]: value,
      };

      if (onDataUpdate) {
        onDataUpdate(newData);
      }

      return {
        data: newData,
      };
    });
  };

  getPropertyDefaultValue = (key: string, fallback: any = null): any => {
    if (this.state.data.hasOwnProperty(key) && this.state.data[key] !== null) {
      return this.state.data[key];
    }
    if (this.props.fallbackValues.hasOwnProperty(key)) {
      return this.props.fallbackValues[key];
    }
    return fallback;
  };

  getPropertyLabelOverride = (key: string, fallback: any): any => {
    if (this.props.labelOverrides.hasOwnProperty(key)) {
      return this.props.labelOverrides[key];
    }
    return fallback;
  };

  render() {
    const {
      enableActivationTime,
      enableActivationType,
      enableAoeSize,
      enableAoeType,
      enableAttackSubtype,
      enableCost,
      enableDisplayAsAttack,
      enableDamageBonus,
      enableDamageType,
      enableDescription,
      enableDiceCount,
      enableDiceType,
      enableFixedValue,
      enableIsAdamantine,
      enableIsMartialArts,
      enableIsOffhand,
      enableIsProficient,
      enableIsSilver,
      enableLongRange,
      enableMagicBonus,
      enableMiscBonus,
      enableName,
      enableNotes,
      enableOverride,
      enableProficiencyLevel,
      enableRange,
      enableRangeType,
      enableStat,
      enableSaveDcBonus,
      enableSaveDc,
      enableSaveType,
      enableSnippet,
      enableSpellRangeType,
      enableToHitBonus,
      enableToHit,
      enableWeight,
      damageTypeOptions,
      diceTypeOptions,
      rangeOptions,
      statOptions,
      attackSubtypeOptions,
      activationTypeOptions,
      spellRangeTypeOptions,
      aoeTypeOptions,
      proficiencyLevelOptions,
      className,
      maxNameLength,
    } = this.props;

    return (
      <div className={`ct-customize-data-editor ${className}`}>
        <div className="ct-customize-data-editor__properties">
          <SelectEditor
            propertyKey={CUSTOMIZE_KEY.ATTACK_SUBTYPE}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.ATTACK_SUBTYPE
            )}
            label="Attack Type"
            options={attackSubtypeOptions}
            onUpdate={this.handleDataUpdate}
            isEnabled={enableAttackSubtype}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.TO_HIT}
            defaultValue={this.getPropertyDefaultValue(CUSTOMIZE_KEY.TO_HIT)}
            label="To Hit Override"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableToHitBonus}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.TO_HIT_BONUS}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.TO_HIT_BONUS
            )}
            label="To Hit Bonus"
            minimumValue={1}
            onUpdate={this.handleDataUpdate}
            isEnabled={enableToHit}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.OVERRIDE}
            defaultValue={this.getPropertyDefaultValue(CUSTOMIZE_KEY.OVERRIDE)}
            label="Override"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableOverride}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.MAGIC_BONUS}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.MAGIC_BONUS
            )}
            label="Magic Bonus"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableMagicBonus}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.MISC_BONUS}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.MISC_BONUS
            )}
            label="Misc Bonus"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableMiscBonus}
          />
          <SelectEditor
            propertyKey={CUSTOMIZE_KEY.RANGE_TYPE}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.RANGE_TYPE
            )}
            label="Range"
            options={rangeOptions}
            onUpdate={this.handleDataUpdate}
            isEnabled={enableRangeType}
          />
          <SelectEditor
            propertyKey={CUSTOMIZE_KEY.STAT}
            defaultValue={this.getPropertyDefaultValue(CUSTOMIZE_KEY.STAT)}
            label="Stat"
            options={statOptions}
            onUpdate={this.handleDataUpdate}
            isEnabled={enableStat}
          />
          <SelectEditor
            propertyKey={CUSTOMIZE_KEY.PROFICIENCY_LEVEL}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.PROFICIENCY_LEVEL
            )}
            label="Proficiency Level"
            options={proficiencyLevelOptions}
            onUpdate={this.handleDataUpdate}
            isEnabled={enableProficiencyLevel}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.DICE_COUNT}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.DICE_COUNT
            )}
            minimumValue={1}
            label="Dice Count"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableDiceCount}
          />
          <SelectEditor
            propertyKey={CUSTOMIZE_KEY.DICE_TYPE}
            defaultValue={this.getPropertyDefaultValue(CUSTOMIZE_KEY.DICE_TYPE)}
            label="Die Type"
            options={diceTypeOptions}
            onUpdate={this.handleDataUpdate}
            isEnabled={enableDiceType}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.FIXED_VALUE}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.FIXED_VALUE
            )}
            minimumValue={1}
            label={this.getPropertyLabelOverride(
              CUSTOMIZE_KEY.FIXED_VALUE,
              "Additional Bonus"
            )}
            onUpdate={this.handleDataUpdate}
            isEnabled={enableFixedValue}
          />
          <SelectEditor
            propertyKey={CUSTOMIZE_KEY.DAMAGE_TYPE}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.DAMAGE_TYPE
            )}
            label="Damage Type"
            options={damageTypeOptions}
            onUpdate={this.handleDataUpdate}
            isEnabled={enableDamageType}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.DAMAGE_BONUS}
            minimumValue={1}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.DAMAGE_BONUS
            )}
            label="Damage Bonus"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableDamageBonus}
          />
          <SelectEditor
            propertyKey={CUSTOMIZE_KEY.SAVE_TYPE}
            defaultValue={this.getPropertyDefaultValue(CUSTOMIZE_KEY.SAVE_TYPE)}
            label="Save Type"
            options={statOptions}
            onUpdate={this.handleDataUpdate}
            isEnabled={enableSaveType}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.SAVE_DC}
            defaultValue={this.getPropertyDefaultValue(CUSTOMIZE_KEY.SAVE_DC)}
            minimumValue={0}
            label="Fixed Save DC"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableSaveDc}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.SAVE_DC_BONUS}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.SAVE_DC_BONUS
            )}
            label="DC Bonus"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableSaveDcBonus}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.COST}
            defaultValue={this.getPropertyDefaultValue(CUSTOMIZE_KEY.COST)}
            minimumValue={0}
            label="Cost Override"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableCost}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.WEIGHT}
            defaultValue={this.getPropertyDefaultValue(CUSTOMIZE_KEY.WEIGHT)}
            minimumValue={0}
            label="Weight Override"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableWeight}
          />
          <SelectEditor
            propertyKey={CUSTOMIZE_KEY.SPELL_RANGE_TYPE}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.SPELL_RANGE_TYPE
            )}
            label="Spell Range Type"
            options={spellRangeTypeOptions}
            onUpdate={this.handleDataUpdate}
            isEnabled={enableSpellRangeType}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.RANGE}
            defaultValue={this.getPropertyDefaultValue(CUSTOMIZE_KEY.RANGE)}
            minimumValue={0}
            label="Range"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableRange}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.LONG_RANGE}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.LONG_RANGE
            )}
            minimumValue={0}
            label="Long Range"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableLongRange}
          />
          <SelectEditor
            propertyKey={CUSTOMIZE_KEY.AOE_TYPE}
            defaultValue={this.getPropertyDefaultValue(CUSTOMIZE_KEY.AOE_TYPE)}
            label="AoE Type"
            options={aoeTypeOptions}
            onUpdate={this.handleDataUpdate}
            isEnabled={enableAoeType}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.AOE_SIZE}
            defaultValue={this.getPropertyDefaultValue(CUSTOMIZE_KEY.AOE_SIZE)}
            minimumValue={0}
            label="AoE Size"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableAoeSize}
          />
          <SelectEditor
            propertyKey={CUSTOMIZE_KEY.ACTIVATION_TYPE}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.ACTIVATION_TYPE
            )}
            label="Activation Type"
            options={activationTypeOptions}
            onUpdate={this.handleDataUpdate}
            isEnabled={enableActivationType}
          />
          <NumberEditor
            propertyKey={CUSTOMIZE_KEY.ACTIVATION_TIME}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.ACTIVATION_TIME
            )}
            minimumValue={0}
            label="Activation Time"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableActivationTime}
          />
          <CheckboxEditor
            propertyKey={CUSTOMIZE_KEY.IS_MARTIAL_ARTS}
            initiallyEnabled={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.IS_MARTIAL_ARTS
            )}
            label="Affected by Martial Arts"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableIsMartialArts}
          />
          <CheckboxEditor
            propertyKey={CUSTOMIZE_KEY.IS_PROFICIENT}
            initiallyEnabled={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.IS_PROFICIENT
            )}
            label="Proficient"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableIsProficient}
          />
          <CheckboxEditor
            propertyKey={CUSTOMIZE_KEY.IS_OFFHAND}
            initiallyEnabled={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.IS_OFFHAND
            )}
            label="Dual Wield"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableIsOffhand}
          />
          <CheckboxEditor
            propertyKey={CUSTOMIZE_KEY.IS_SILVER}
            initiallyEnabled={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.IS_SILVER
            )}
            label="Silvered"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableIsSilver}
          />
          <CheckboxEditor
            propertyKey={CUSTOMIZE_KEY.IS_ADAMANTINE}
            initiallyEnabled={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.IS_ADAMANTINE
            )}
            label="Adamantine"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableIsAdamantine}
          />
          <CheckboxEditor
            propertyKey={CUSTOMIZE_KEY.DISPLAY_AS_ATTACK}
            initiallyEnabled={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.DISPLAY_AS_ATTACK
            )}
            label="Display as Attack"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableDisplayAsAttack}
          />
          <TextEditor
            propertyKey={CUSTOMIZE_KEY.NAME}
            defaultValue={this.getPropertyDefaultValue(CUSTOMIZE_KEY.NAME)}
            label="Name"
            maxLength={maxNameLength}
            onUpdate={this.handleDataUpdate}
            isEnabled={enableName}
            initialFocus={true}
          />
          <TextEditor
            propertyKey={CUSTOMIZE_KEY.NOTES}
            defaultValue={this.getPropertyDefaultValue(CUSTOMIZE_KEY.NOTES)}
            label="Notes"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableNotes}
          />
          <TextAreaEditor
            propertyKey={CUSTOMIZE_KEY.SNIPPET}
            defaultValue={this.getPropertyDefaultValue(CUSTOMIZE_KEY.SNIPPET)}
            label="Snippet"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableSnippet}
          />
          <TextAreaEditor
            propertyKey={CUSTOMIZE_KEY.DESCRIPTION}
            defaultValue={this.getPropertyDefaultValue(
              CUSTOMIZE_KEY.DESCRIPTION
            )}
            label="Description"
            onUpdate={this.handleDataUpdate}
            isEnabled={enableDescription}
          />
        </div>
      </div>
    );
  }
}
