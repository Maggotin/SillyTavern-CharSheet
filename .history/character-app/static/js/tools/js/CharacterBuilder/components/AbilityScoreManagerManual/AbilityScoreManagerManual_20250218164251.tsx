import {
  AbilityManager,
  HelperUtils,
} from "../../character-rules-engine/es";
import { FormInputField } from "~/tools/js/Shared/components/common/FormInputField";


interface Props {
  abilities: Array<AbilityManager>;
  minScore?: number;
  maxScore?: number;
}

export default function AbilityScoreManagerManual({
  abilities,
  minScore = 3,
  maxScore = 18,
}: Props) {
  const handleTransformValueOnBlur = (value: string): number | null => {
    const parsedValue = HelperUtils.parseInputInt(value);
    let clampedValue: number | null = null;
    if (parsedValue !== null) {
      clampedValue = HelperUtils.clampInt(parsedValue, minScore, maxScore);
    }

    return clampedValue;
  };

  return (
    <div className=" ability-score-manager ability-score-manager-manual">
      <div className="ability-score-manager-stats">
        {abilities.map((abilityScore) => (
          <div
            className="ability-score-manager-stat"
            key={abilityScore.getId()}
            data-stat-id={abilityScore.getId()}
          >
            <FormInputField
              transformValueOnBlur={handleTransformValueOnBlur}
              onBlur={(value) => abilityScore.handleScoreChange(Number(value))}
              label={abilityScore.getLabel() ?? ""}
              initialValue={abilityScore.getBaseScore()}
            />
            <div className="ability-score-manager-stat-total">
              Total: {abilityScore.getTotalScore() ?? "--"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
