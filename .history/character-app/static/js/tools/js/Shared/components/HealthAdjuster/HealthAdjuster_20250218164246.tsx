import React from "react";

import {
  CharacterHitPointChange,
  CharacterUtils,
  HelperUtils,
  HitPointInfo,
} from "../../character-rules-engine/es";

import ThemeButton from "../common/Button/ThemeButton";

interface Props {
  hitPointInfo: HitPointInfo;
  enableVibration: boolean;
  onSave?: (amount: number) => void;
  onCancel?: () => void;
  vibrationAmount: number;
}
interface State {
  tickCount: number;
  healingAmount: number | null;
  damageAmount: number | null;
  isDirtyHitPoints: boolean;
}
export default class HealthAdjuster extends React.PureComponent<Props, State> {
  static defaultProps = {
    enableVibration: true,
    vibrationAmount: 15,
  };

  defaultState = {
    tickCount: 0,
    healingAmount: 0,
    damageAmount: 0,
    isDirtyHitPoints: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.defaultState,
    };
  }

  reset = (): void => {
    this.setState(this.defaultState);
  };

  getDirtyHitPointsChange = (): number => {
    const { tickCount, healingAmount, damageAmount } = this.state;

    let healingAmountValue: number = healingAmount === null ? 0 : healingAmount;
    let damageAmountValue: number = damageAmount === null ? 0 : damageAmount;

    return tickCount + healingAmountValue + damageAmountValue;
  };

  calculateHitPoints = (): CharacterHitPointChange => {
    const { hitPointInfo } = this.props;

    return CharacterUtils.calculateHitPoints(
      hitPointInfo,
      this.getDirtyHitPointsChange()
    );
  };

  handleIncrease = (): void => {
    const { enableVibration, vibrationAmount } = this.props;

    this.setState((prevState: State) => {
      let newHealing: number | null = prevState.healingAmount;
      let newDamage: number | null = prevState.damageAmount;

      if (prevState.damageAmount === null || prevState.damageAmount === 0) {
        newHealing =
          prevState.healingAmount === null ? 1 : prevState.healingAmount + 1;
        newDamage = 0;
      } else if (prevState.damageAmount < 0) {
        newDamage = prevState.damageAmount + 1;
      }

      return {
        healingAmount: newHealing,
        damageAmount: newDamage,
        isDirtyHitPoints: true,
      };
    });

    if (enableVibration && navigator.vibrate) {
      navigator.vibrate(vibrationAmount);
    }
  };

  handleDecrease = (): void => {
    const { enableVibration, vibrationAmount } = this.props;

    this.setState((prevState: State) => {
      let newHealing: number | null = prevState.healingAmount;
      let newDamage: number | null = prevState.damageAmount;

      if (prevState.healingAmount === null || prevState.healingAmount === 0) {
        newDamage =
          prevState.damageAmount === null ? -1 : prevState.damageAmount - 1;
        newHealing = 0;
      } else if (prevState.healingAmount > 0) {
        newHealing = prevState.healingAmount - 1;
      }

      return {
        healingAmount: newHealing,
        damageAmount: newDamage,
        isDirtyHitPoints: true,
      };
    });

    if (enableVibration && navigator.vibrate) {
      navigator.vibrate(vibrationAmount);
    }
  };

  handleTickChange = (tickCount: number): void => {
    const { enableVibration, vibrationAmount } = this.props;

    this.setState({
      tickCount,
      isDirtyHitPoints: true,
    });

    if (enableVibration && navigator.vibrate) {
      navigator.vibrate(vibrationAmount);
    }
  };

  handleHealingSet = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    let value = HelperUtils.parseInputInt(evt.target.value);

    this.setState({
      tickCount: 0,
      healingAmount: value === null ? value : HelperUtils.clampInt(value, 0),
      damageAmount: 0,
      isDirtyHitPoints: true,
    });
  };

  handleDamageSet = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    let value = HelperUtils.parseInputInt(evt.target.value);

    this.setState({
      tickCount: 0,
      healingAmount: 0,
      damageAmount:
        value === null ? value : HelperUtils.clampInt(value, 0) * -1,
      isDirtyHitPoints: true,
    });
  };

  handleSave = (): void => {
    const { onSave } = this.props;

    if (onSave) {
      onSave(this.getDirtyHitPointsChange());
    }

    this.reset();
  };

  handleCancel = (): void => {
    const { onCancel } = this.props;

    if (onCancel) {
      onCancel();
    }

    this.reset();
  };

  renderActions = (): React.ReactNode => {
    const { isDirtyHitPoints } = this.state;

    if (!isDirtyHitPoints) {
      return null;
    }

    return (
      <div className="ct-health-adjuster__actions">
        <div className="ct-health-adjuster__action">
          <ThemeButton onClick={this.handleSave}>Apply Changes</ThemeButton>
        </div>
        <div className="ct-health-adjuster__action">
          <ThemeButton onClick={this.handleCancel} style="outline">
            Cancel
          </ThemeButton>
        </div>
      </div>
    );
  };

  render() {
    const { healingAmount, damageAmount } = this.state;
    const { hitPointInfo } = this.props;

    let healingDisplay: React.ReactText =
      healingAmount === null ? "" : Math.max(this.getDirtyHitPointsChange(), 0);
    let damageDisplay: React.ReactText =
      damageAmount === null
        ? ""
        : Math.abs(Math.min(this.getDirtyHitPointsChange(), 0));

    const { newTemp, newHp } = this.calculateHitPoints();

    let hpDiffClassNames: Array<string> = ["ct-health-adjuster__new"];
    if (newHp > hitPointInfo.remainingHp) {
      hpDiffClassNames.push("ct-health-adjuster__status--positive");
    } else if (newHp < hitPointInfo.remainingHp) {
      hpDiffClassNames.push("ct-health-adjuster__status--negative");
    }

    let tempDiffClassNames: Array<string> = ["ct-health-adjuster__new"];
    if (hitPointInfo.tempHp !== null) {
      if (newTemp > hitPointInfo.tempHp) {
        tempDiffClassNames.push("ct-health-adjuster__status--positive");
      } else if (newTemp < hitPointInfo.tempHp) {
        tempDiffClassNames.push("ct-health-adjuster__status--negative");
      }
    }

    return (
      <div className="ct-health-adjuster">
        <div className="ct-health-adjuster__controls">
          <div className="ct-health-adjuster__details">
            <div className="ct-health-adjuster__healing">
              <div className="ct-health-adjuster__healing-label">Healing</div>
              <div className="ct-health-adjuster__healing-value">
                <input
                  className="ct-health-adjuster__healing-input"
                  type="number"
                  value={healingDisplay}
                  onChange={this.handleHealingSet}
                />
              </div>
            </div>
            <div className="ct-health-adjuster__updates">
              <div className={hpDiffClassNames.join(" ")}>
                <div className="ct-health-adjuster__new-label">New HP</div>
                <div className="ct-health-adjuster__new-value">{newHp}</div>
              </div>
              {hitPointInfo.tempHp !== null && hitPointInfo.tempHp > 0 && (
                <div className={tempDiffClassNames.join(" ")}>
                  <div className="ct-health-adjuster__new-label">New Temp</div>
                  <div className="ct-health-adjuster__new-value">{newTemp}</div>
                </div>
              )}
            </div>
            <div className="ct-health-adjuster__damage">
              <div className="ct-health-adjuster__damage-label">Damage</div>
              <div className="ct-health-adjuster__damage-value">
                <input
                  className="ct-health-adjuster__damage-input"
                  type="number"
                  value={damageDisplay}
                  onChange={this.handleDamageSet}
                />
              </div>
            </div>
          </div>
          <div className="ct-health-adjuster__buttons">
            <div className="ct-health-adjuster__button ct-health-adjuster__button--increase">
              <ThemeButton
                className="action-increase"
                onClick={this.handleIncrease}
              />
            </div>
            <div className="ct-health-adjuster__button ct-health-adjuster__button--decrease">
              <ThemeButton
                className="action-decrease"
                onClick={this.handleDecrease}
              />
            </div>
          </div>
        </div>
        {this.renderActions()}
      </div>
    );
  }
}
