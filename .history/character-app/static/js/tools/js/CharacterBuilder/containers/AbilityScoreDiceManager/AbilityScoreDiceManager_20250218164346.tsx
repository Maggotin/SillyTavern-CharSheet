import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect, DispatchProp } from "react-redux";

import {
  DiceRollGroupManager,
  LoadingPlaceholder,
} from "../../character-components/es";
import {
  Ability,
  AbilityUtils,
  characterActions,
  CharacterConfiguration,
  DiceRolls,
  HelperUtils,
  HtmlSelectOption,
  RollResultContract,
  rulesEngineSelectors,
  Constants,
  RollGroupContract,
} from "../../character-rules-engine/es";
import {
  DiceNotation,
  DiceOperation,
  DieTerm,
  RollRequest,
  RollRequestRoll,
} from "../../dice";

import { rollResultActions } from "../../../Shared/actions/rollResult";
import * as toastActions from "../../../Shared/actions/toastMessage/actions";
import DataLoadingStatusEnum from "../../../Shared/constants/DataLoadingStatusEnum";
import { rollResultSelectors } from "../../../Shared/selectors";
import {
  RollResultUtils,
  RollResultGroupsLookup,
  RollStatusLookup,
} from "../../../Shared/utils";
import { BuilderAppState } from "../../typings";

interface AbilityScore {
  statId: number | null;
  value: number | null;
}
interface AbilityScoreDiceManagerProps extends DispatchProp {
  abilities: Array<Ability>;
  configuration: CharacterConfiguration;
  rollResultGroupsLookup: RollResultGroupsLookup;
  simulatedGroupsLookup: RollResultGroupsLookup;
  rollStatusLookup: RollStatusLookup;
}
const AbilityScoreDiceManager: React.FunctionComponent<
  AbilityScoreDiceManagerProps
> = ({
  abilities,
  configuration,
  rollResultGroupsLookup,
  simulatedGroupsLookup,
  rollStatusLookup,
  dispatch,
}) => {
  const SIMULATED_GROUP_COUNT: number = 1;
  const SIMULATED_ROLL_RESULT_COUNT: number = 6;

  const [loadingStatus, setLoadingStatus] = useState(
    DataLoadingStatusEnum.NOT_INITIALIZED
  );

  const componentKey = useMemo<string | null>(
    () =>
      configuration.abilityScoreType
        ? DiceRolls.generateAbilityManagerKey(configuration.abilityScoreType)
        : null,
    [configuration]
  );

  useEffect(() => {
    if (componentKey) {
      setLoadingStatus(DataLoadingStatusEnum.LOADING);
      dispatch(
        rollResultActions.rollResultGroupsLoad(
          componentKey,
          SIMULATED_GROUP_COUNT,
          SIMULATED_ROLL_RESULT_COUNT
        )
      );
    }
  }, [setLoadingStatus]);

  const diceRollGroups = useMemo<Array<RollGroupContract> | null>(() => {
    if (!componentKey) {
      return null;
    }

    let groups: Array<RollGroupContract> = [];
    const simulatedGroups = RollResultUtils.getComponentOrderedGroups(
      componentKey,
      simulatedGroupsLookup
    );
    if (simulatedGroups.length) {
      groups = simulatedGroups;
    } else {
      groups = RollResultUtils.getComponentOrderedGroups(
        componentKey,
        rollResultGroupsLookup
      );
    }

    setLoadingStatus(DataLoadingStatusEnum.LOADED);

    return groups.map((group) => {
      return {
        ...group,
        rollResults: RollResultUtils.getGroupOrderedRollResults(
          group.rollResults
        ),
      };
    });
  }, [
    simulatedGroupsLookup,
    rollResultGroupsLookup,
    componentKey,
    setLoadingStatus,
  ]);

  const diceRollRequest = useMemo<RollRequest>(() => {
    const dieTerm: DieTerm = new DieTerm(4, "d6", DiceOperation.Max, 3);
    const rollRequestRoll = new RollRequestRoll(new DiceNotation([dieTerm]));
    return {
      action: "Ability Score",
      rolls: [rollRequestRoll],
    };
  }, []);

  const abilityStatOptions = useMemo<Array<HtmlSelectOption>>(() => {
    return abilities.map((ability) => {
      return {
        label: AbilityUtils.getName(ability),
        value: String(AbilityUtils.getId(ability)),
      };
    });
  }, [abilities]);

  const handleRollError = useCallback((title: string): void => {
    dispatch(
      toastActions.toastError(title, "Please wait a few seconds and try again")
    );
  }, []);

  const handleAddGroup = useCallback((): void => {
    if (componentKey) {
      dispatch(
        rollResultActions.rollResultGroupCreate(
          componentKey,
          SIMULATED_ROLL_RESULT_COUNT
        )
      );
    }
  }, [componentKey]);

  const handleRemoveGroup = useCallback(
    (groupKey: string, nextGroupKey: string | null): void => {
      if (componentKey) {
        dispatch(
          rollResultActions.rollResultGroupDestroy(
            componentKey,
            groupKey,
            nextGroupKey
          )
        );
      }
    },
    [componentKey]
  );

  const handleUpdateGroupRolls = useCallback(
    (groupKey: string, rollResults: Array<RollResultContract>): void => {
      if (componentKey) {
        dispatch(
          rollResultActions.rollResultGroupDiceRollsSet(
            componentKey,
            groupKey,
            rollResults
          )
        );
      }
    },
    [componentKey]
  );

  const handleSetScores = useCallback(
    (groupKey: string, rollResults: Array<RollResultContract>): void => {
      const abilityScores: Array<AbilityScore> = rollResults
        .filter(
          (roll) => roll.assignedValue !== null && roll.rollTotal !== null
        )
        .map((roll) => ({
          statId: roll.assignedValue
            ? HelperUtils.parseInputInt(roll.assignedValue)
            : null,
          value: roll.rollTotal,
        }));

      abilityScores.forEach((score) => {
        // Flash ability score input if it was changed
        const abilityScoreElement: HTMLElement | null = document.querySelector(
          `.ability-score-manager [data-stat-id="${score.statId}"] input`
        );
        if (abilityScoreElement !== null) {
          abilityScoreElement.classList.add("builder-field-update-animation");
          setTimeout(() => {
            abilityScoreElement.classList.remove(
              "builder-field-update-animation"
            );
          }, 1000);
        }

        if (score.statId) {
          dispatch(
            characterActions.abilityScoreSet(
              score.statId,
              Constants.AbilityScoreStatTypeEnum.BASE,
              score.value
            )
          );
        }
      });
    },
    []
  );

  const handleResetGroup = useCallback(
    (groupKey: string, rollResults: Array<RollResultContract>) => {
      rollResults = rollResults.map((rollResult: RollResultContract) => ({
        ...rollResult,
        rollTotal: null,
        rollValues: [],
        assignedValue: null,
      }));

      if (componentKey) {
        dispatch(
          rollResultActions.rollResultGroupReset(
            componentKey,
            groupKey,
            rollResults
          )
        );
      }
    },
    [componentKey]
  );

  const handleDiceRollSet = useCallback(
    (
      rollKey: string,
      properties: Omit<Partial<RollResultContract>, "rollKey">,
      nextRollKey: string | null
    ) => {
      if (componentKey) {
        dispatch(
          rollResultActions.rollResultDiceRollSet(
            rollKey,
            properties,
            nextRollKey
          )
        );
      }
    },
    [componentKey]
  );

  const handleSetRollStatus = useCallback(
    (rollKey: string, status: DataLoadingStatusEnum) => {
      dispatch(rollResultActions.rollResultDiceRollStatusSet(rollKey, status));
    },
    [rollStatusLookup]
  );

  if (!componentKey || !diceRollGroups?.length) {
    return null;
  }

  return (
    <div className="ct-ability-score-dice-manager">
      {loadingStatus !== DataLoadingStatusEnum.LOADED ? (
        <LoadingPlaceholder label="Loading Dice Groups" />
      ) : (
        <DiceRollGroupManager
          componentKey={componentKey}
          groups={diceRollGroups}
          showAddGroupButton={true}
          onAddGroup={handleAddGroup}
          options={abilityStatOptions}
          diceRollRequest={diceRollRequest}
          exclusiveOptions={true}
          confirmButtonText="Apply Ability Scores"
          onConfirm={handleSetScores}
          onUpdateGroup={handleUpdateGroupRolls}
          onRollError={handleRollError}
          onRemoveGroup={handleRemoveGroup}
          onResetGroup={handleResetGroup}
          onUpdateDiceRoll={handleDiceRollSet}
          onSetRollStatus={handleSetRollStatus}
          rollStatusLookup={rollStatusLookup}
        />
      )}
    </div>
  );
};

function mapStateToProps(state: BuilderAppState) {
  return {
    configuration: rulesEngineSelectors.getCharacterConfiguration(state),
    abilities: rulesEngineSelectors.getAbilities(state),
    rollStatusLookup: rollResultSelectors.getRollStatusLookup(state),
    rollResultGroupsLookup:
      rollResultSelectors.getRollResultComponentGroupsLookup(state),
    simulatedGroupsLookup:
      rollResultSelectors.getRollResultComponentSimulatedGroupsLookup(state),
  };
}

export default connect(mapStateToProps)(AbilityScoreDiceManager);
