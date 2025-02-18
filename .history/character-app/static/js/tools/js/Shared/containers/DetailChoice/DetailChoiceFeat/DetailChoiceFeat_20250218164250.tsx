import { FC } from "react";
import { useDispatch } from "react-redux";

import {
  characterActions,
  ChoiceUtils,
  FeatUtils,
} from "../../character-rules-engine/es";

import { useCharacterEngine } from "~/hooks/useCharacterEngine";

import { DetailChoice } from "../DetailChoice";

//This component is a wrapper for DetailChoice that is specifically for Feats
//given a featId, it will render the choices for that feat
//used in FeatDetail, FeatPane and FeatureChoice (for feats that are given by Class Features, Species Traits and Backgrounds)

export interface Props {
  featId: number;
}

export const DetailChoiceFeat: FC<Props> = ({ featId }) => {
  const dispatch = useDispatch();
  const { entityRestrictionData, choiceInfo, feats, ruleData } =
    useCharacterEngine();

  const handleChoiceChange = (
    id: string | null,
    type: number,
    subType: number | null,
    value: any
  ): void => {
    if (id !== null) {
      dispatch(characterActions.featChoiceSetRequest(featId, type, id, value));
    }
  };

  const feat = feats.find((feat) => FeatUtils.getId(feat) === featId);

  if (!feat) {
    return null;
  }

  const choices = FeatUtils.getChoices(feat);
  if (choices.length === 0) {
    return null;
  }

  return (
    <div className="ct-detail-choice-feat">
      {choices.map((choice) => {
        const id = ChoiceUtils.getId(choice);

        const { description, options: featChoiceOptions } =
          ChoiceUtils.getSortedChoiceOptionsInfo(
            choice,
            ruleData,
            entityRestrictionData
          );

        return (
          <DetailChoice
            {...choice}
            label={choice.label}
            choice={choice}
            key={id !== null ? id : ""}
            options={featChoiceOptions}
            onChange={handleChoiceChange}
            choiceInfo={choiceInfo}
            showBackgroundProficiencyOptions={true}
            description={description}
          />
        );
      })}
    </div>
  );
};
