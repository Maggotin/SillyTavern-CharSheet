import { useMediaQuery } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";

import {
  Constants,
  rulesEngineSelectors,
} from "../../character-rules-engine";

import { useFeatureFlags } from "~/contexts/FeatureFlag";

import { GuidedTour } from "../../../Shared/containers/GuidedTour";
import { getCharacterSheetSteps } from "./getCharacterSheetSteps";

const CharacterSheetGuidedTour = ({ children }) => {
  const [step, setStep] = useState(0);
  const { characterSheetTourFlag } = useFeatureFlags();
  const isTablet = useMediaQuery("(min-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const ready = useSelector(rulesEngineSelectors.isCharacterSheetReady);
  // const hasSpells = useSelector(rulesEngineSelectors.hasSpells);
  const [loading, setLoading] = useState(true);

  const setCurrentStep = (currentStep) => {
    switch (currentStep) {
      case 11: {
        if (!isTablet && !isDesktop) {
          const toggle = document.querySelector(
            "[class^='styles_navToggle']"
          ) as HTMLButtonElement;
          toggle?.click();
        }
        break;
      }
      case 13: {
        if (isTablet && !isDesktop) {
          const toggle = document.querySelector(
            "[class^='styles_navToggle']"
          ) as HTMLButtonElement;
          toggle?.click();
        }
        break;
      }
      default:
        break;
    }
    setStep(currentStep);
  };

  useEffect(() => {
    // If character sheet has loaded, enable tour
    if (ready) setLoading(false);
  }, [ready]);

  return (
    <>
      {characterSheetTourFlag && !loading ? (
        <GuidedTour
          steps={getCharacterSheetSteps(false, isTablet, isDesktop)}
          step={step}
          setStep={setCurrentStep}
          showOnFirstLoad={true}
          cookieName="characterSheetGuidedTour"
        >
          {children}
        </GuidedTour>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default CharacterSheetGuidedTour;
