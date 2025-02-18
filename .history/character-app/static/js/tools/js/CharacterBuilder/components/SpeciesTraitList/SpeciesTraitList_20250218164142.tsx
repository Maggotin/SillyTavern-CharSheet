import React from "react";

import {
  AnySimpleDataType,
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiResponse,
  CharacterPreferences,
  ChoiceData,
  DefinitionPool,
  FeatDefinitionContract,
  FeatLookup,
  OptionalOriginLookup,
  PrerequisiteData,
  RacialTrait,
  RacialTraitUtils,
} from "@dndbeyond/character-rules-engine/es";

import { SpeciesManageSpeciesTrait } from "../../containers/pages/SpeciesManage";

interface Props {
  speciesTraits: RacialTrait[];
  featLookup: FeatLookup;
  loadAvailableFeats: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<FeatDefinitionContract[]>>;
  handleSpeciesTraitChoiceChange: (
    speciesTraitId: number,
    choiceId: string,
    choiceType: number,
    optionValue: AnySimpleDataType
  ) => void;
  choiceInfo: ChoiceData;
  prerequisiteData: PrerequisiteData;
  preferences: CharacterPreferences;
  optionalOriginLookup: OptionalOriginLookup;
  definitionPool: DefinitionPool;
  speciesName?: string | null;
}

const SpeciesTraitList: React.FC<Props> = ({
  speciesTraits,
  featLookup,
  loadAvailableFeats,
  handleSpeciesTraitChoiceChange,
  choiceInfo,
  prerequisiteData,
  preferences,
  optionalOriginLookup,
  definitionPool,
  speciesName,
}) => {
  return (
    <>
      {speciesTraits.map((speciesTrait) => (
        <SpeciesManageSpeciesTrait
          key={RacialTraitUtils.getId(speciesTrait)}
          speciesTrait={speciesTrait}
          featLookup={featLookup}
          loadAvailableFeats={loadAvailableFeats}
          onChoiceChange={handleSpeciesTraitChoiceChange}
          choiceInfo={choiceInfo}
          prerequisiteData={prerequisiteData}
          preferences={preferences}
          optionalOriginLookup={optionalOriginLookup}
          definitionPool={definitionPool}
          speciesName={speciesName}
        />
      ))}
    </>
  );
};

export default SpeciesTraitList;
