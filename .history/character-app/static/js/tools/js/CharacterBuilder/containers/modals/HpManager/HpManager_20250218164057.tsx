import React, { HTMLAttributes } from "react";
import { connect, DispatchProp } from "react-redux";

import {
  characterActions,
  CharacterHitPointInfo,
  CharacterPreferences,
  ClassUtils,
  Constants,
  DiceUtils,
  FormatUtils,
  HelperUtils,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
} from "../../rules-engine/es";

import {
  HP_BASE_MAX_VALUE,
  HP_BONUS_VALUE,
  HP_OVERRIDE_MAX_VALUE,
} from "~/subApps/sheet/constants";
import { FormInputField } from "~/tools/js/Shared/components/common/FormInputField";

import { modalActions } from "../../../../Shared/actions/modal";
import { FullscreenModal } from "../../../../Shared/components/common/FullscreenModal";
import { modalSelectors } from "../../../../Shared/selectors";
import PageSubHeader from "../../../components/PageSubHeader";
import { BuilderAppState } from "../../../typings";

interface Props extends DispatchProp {
  ruleData: RuleData;
  hitPointInfo: CharacterHitPointInfo;
  preferences: CharacterPreferences;
  isOpen: boolean;
  modalKey: string;
  maxOverrideHitPoints: number;
}
interface State {
  baseHp: number;
  bonusHp: number | null;
  overrideHp: number | null;
  isDirty: boolean;
}
class HpManager extends React.PureComponent<Props, State> {
  static defaultProps = {
    maxOverrideHitPoints: HP_OVERRIDE_MAX_VALUE,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      baseHp: props.hitPointInfo.baseHp,
      bonusHp: props.hitPointInfo.bonusHp,
      overrideHp: props.hitPointInfo.overrideHp,
      isDirty: false,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { hitPointInfo } = this.props;

    if (hitPointInfo !== prevProps.hitPointInfo) {
      this.setState({
        baseHp: hitPointInfo.baseHp,
        bonusHp: hitPointInfo.bonusHp,
        overrideHp: hitPointInfo.overrideHp,
        isDirty: false,
      });
    }
  }

  reset = (): void => {
    this.setState((prevState: State, props: Props) => ({
      baseHp: props.hitPointInfo.baseHp,
      bonusHp: props.hitPointInfo.bonusHp,
      overrideHp: props.hitPointInfo.overrideHp,
      isDirty: false,
    }));
  };

  handleCancelModal = (): void => {
    const { dispatch, modalKey } = this.props;

    dispatch(modalActions.close(modalKey));
    this.reset();
  };

  handleAcceptModal = (): void => {
    const { dispatch, modalKey, hitPointInfo } = this.props;
    const { isDirty, baseHp, bonusHp, overrideHp } = this.state;

    if (isDirty) {
      if (baseHp !== hitPointInfo.baseHp) {
        dispatch(characterActions.baseHitPointsSet(baseHp));
      }

      if (bonusHp !== hitPointInfo.bonusHp) {
        dispatch(characterActions.bonusHitPointsSet(bonusHp));
      }

      if (overrideHp !== hitPointInfo.overrideHp) {
        dispatch(characterActions.overrideHitPointsSet(overrideHp));
      }
    }

    dispatch(modalActions.close(modalKey));
    this.reset();
  };

  handleBaseHpUpdate = (value: number): void => {
    this.setState({
      baseHp: value,
      isDirty: true,
    });
  };

  handleBonusHpUpdate = (value: number | null): void => {
    this.setState({
      bonusHp: value,
      isDirty: true,
    });
  };

  handleOverrideHpUpdate = (value: number | null): void => {
    const { maxOverrideHitPoints, ruleData } = this.props;

    this.setState({
      overrideHp:
        value === null
          ? null
          : HelperUtils.clampInt(
              value,
              RuleDataUtils.getMinimumHpTotal(ruleData),
              maxOverrideHitPoints
            ),
      isDirty: true,
    });
  };

  transformBaseHp = (value: string): number => {
    const { ruleData } = this.props;
    let parsedNumber = HelperUtils.parseInputInt(
      value,
      RuleDataUtils.getMinimumHpTotal(ruleData)
    );
    return HelperUtils.clampInt(
      parsedNumber,
      RuleDataUtils.getMinimumHpTotal(ruleData),
      HP_BASE_MAX_VALUE
    );
  };

  transformBonusHp = (value: string): number | null => {
    let parsedNumber = HelperUtils.parseInputInt(value);
    if (parsedNumber === null) {
      return parsedNumber;
    }
    return HelperUtils.clampInt(
      parsedNumber,
      HP_BONUS_VALUE.MIN,
      HP_BONUS_VALUE.MAX
    );
  };

  transformOverrideHp = (value: string): number | null => {
    const { ruleData } = this.props;
    let parsedNumber = HelperUtils.parseInputInt(value, null);
    if (parsedNumber === null) {
      return parsedNumber;
    }
    return HelperUtils.clampInt(
      parsedNumber,
      RuleDataUtils.getMinimumHpTotal(ruleData)
    );
  };

  render() {
    const {
      isOpen,
      hitPointInfo,
      preferences,
      ruleData,
      maxOverrideHitPoints,
    } = this.props;
    const { baseHp, bonusHp, overrideHp } = this.state;

    let totalHp: number =
      baseHp +
      hitPointInfo.totalHitPointSources +
      (bonusHp === null ? 0 : bonusHp);
    if (overrideHp !== null) {
      totalHp = overrideHp;
    }

    totalHp = Math.max(RuleDataUtils.getMinimumHpTotal(ruleData), totalHp);

    return (
      <FullscreenModal
        clsNames={["manage-hp-modal"]}
        onCancel={this.handleCancelModal}
        onAccept={this.handleAcceptModal}
        isOpen={isOpen}
        heading="Manage Hit Points"
      >
        <div className="hp-manager">
          <div className="hp-manager-total">
            <div className="hp-manager-total-label">Maximum Hit Points</div>
            <div className="hp-manager-total-value">{totalHp}</div>
          </div>
          <div className="hp-manager-inputs">
            <div className="hp-manager-input hp-manager-input-maxhp">
              {preferences.hitPointType ===
              Constants.PreferenceHitPointTypeEnum.FIXED ? (
                <div className="hp-manager-input-readonly">
                  <div className="builder-field-heading hp-manager-input-readonly-label">
                    Fixed HP
                  </div>
                  <div className="hp-manager-input-readonly-value">
                    {baseHp}
                  </div>
                </div>
              ) : (
                <FormInputField
                  label="Rolled HP"
                  initialValue={baseHp}
                  type="number"
                  onBlur={this.handleBaseHpUpdate}
                  transformValueOnBlur={this.transformBaseHp}
                />
              )}
            </div>
            <div className="hp-manager-input hp-manager-input-maxhp">
              <FormInputField
                label="HP Modifier"
                initialValue={bonusHp}
                type="number"
                onBlur={this.handleBonusHpUpdate}
                placeholder={"--"}
                transformValueOnBlur={this.transformBonusHp}
              />
            </div>
            <div className="hp-manager-input hp-manager-input-maxhp">
              <FormInputField
                inputAttributes={
                  {
                    min: RuleDataUtils.getMinimumHpTotal(ruleData),
                    max: maxOverrideHitPoints,
                  } as HTMLAttributes<HTMLInputElement>
                }
                label="Override HP"
                initialValue={overrideHp}
                type="number"
                onBlur={this.handleOverrideHpUpdate}
                placeholder={"--"}
                transformValueOnBlur={this.transformOverrideHp}
              />
            </div>
          </div>
          {hitPointInfo.hitPointSources.length > 0 && (
            <div className="hp-manager-sources">
              <div className="hp-manager-sources-heading">
                Hit Point Bonuses
              </div>
              <div className="hp-manager-sources-list">
                {hitPointInfo.hitPointSources.map((hitPointSource, idx) => (
                  <div
                    className="classes-manage-hitspoints-sources-item"
                    key={`${idx}:${hitPointSource.source}`}
                  >
                    {FormatUtils.renderSignedNumber(hitPointSource.amount)} from{" "}
                    {hitPointSource.source}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="hp-manager-info">
            <div className="hp-manager-hitdice">
              <PageSubHeader>Hit Dice</PageSubHeader>
              {hitPointInfo.classesHitDice.map((classHitDice) => (
                <div
                  className="hp-manager-hitdice-die"
                  key={ClassUtils.getId(classHitDice.charClass)}
                >
                  <span className="hp-manager-label">
                    {ClassUtils.getName(classHitDice.charClass)}:
                  </span>
                  <span className="hp-manager-data">
                    {DiceUtils.renderDie(classHitDice.dice)}
                  </span>
                </div>
              ))}
            </div>
            <div className="hp-manager-possibilities">
              <PageSubHeader>Potential Values</PageSubHeader>
              <div className="hp-manager-fixed">
                <span className="hp-manager-label">Total Fixed Value HP:</span>
                <span className="hp-manager-data">
                  {hitPointInfo.totalFixedValueHp}
                </span>
              </div>
              <div className="hp-manager-average">
                <span className="hp-manager-label">Total Average HP:</span>
                <span className="hp-manager-data">
                  {hitPointInfo.totalAverageHp}
                </span>
              </div>
              <div className="hp-manager-max">
                <span className="hp-manager-label">Total Possible HP:</span>
                <span className="hp-manager-data">
                  {hitPointInfo.possibleMaxHitPoints}
                </span>
              </div>
            </div>
          </div>
          <div className="hp-manager-help">
            <PageSubHeader>Max Hit Points</PageSubHeader>
            <p>
              Your hit point maximum is determined by the number you roll for
              your hit dice each level or a fixed value determined by your hit
              dice and your Constitution modifier
            </p>

            <PageSubHeader>Bonus Hit Points</PageSubHeader>
            <p>
              Use this field to record any miscellaneous bonus hit points you
              want to add to your normal hit point maximum. These hit points are
              different from temporary hit points, which you can add on your
              character sheet during play.
            </p>

            <PageSubHeader>Override Hit Points</PageSubHeader>
            <p>
              Use this field to override your typical hit point maximum. The
              number you enter here will display as your hit point maximum on
              your character sheet.
            </p>
          </div>
        </div>
      </FullscreenModal>
    );
  }
}

function mapStateToProps(state: BuilderAppState) {
  const modalKey = "hp";

  return {
    modalKey,
    isOpen: modalSelectors.getOpenStatus(state, modalKey),
    hitPointInfo: rulesEngineSelectors.getHitPointInfo(state),
    preferences: rulesEngineSelectors.getCharacterPreferences(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
  };
}

export default connect(mapStateToProps)(HpManager);
