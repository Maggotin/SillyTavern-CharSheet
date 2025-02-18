import { Box } from "@mui/material";
import { StepType, TourContext, TourProvider } from "@reactour/tour";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";

import { rulesEngineSelectors } from "@dndbeyond/character-rules-engine";

import { checkContrast } from "../../utils/Color";
import GuidedTourButton from "./GuidedTourButton";

interface GuidedTourProps {
  children?: ReactNode;
  steps?: StepType[];
  step?: number;
  setStep?: SetStateAction<any>;
  beforeClose?: (target: Element | null) => void;
  afterOpen?: (target: Element | null) => void;
  showOnFirstLoad?: boolean;
  cookieName?: string;
}

export default ({
  children,
  step,
  setStep,
  steps = [],
  beforeClose,
  afterOpen,
  showOnFirstLoad,
  cookieName = "ddbGuidedTour",
}: GuidedTourProps) => {
  const [defaultStep, setDefaultStep] = useState(0);
  const { isDarkMode, backgroundColor, themeColor } = useSelector(
    rulesEngineSelectors.getCharacterTheme
  );
  const bgColor = backgroundColor.slice(0, 7);
  const accentColor = checkContrast(backgroundColor, themeColor)
    ? themeColor
    : "#C53131";

  const handleBeforeClose = () => {
    const html = document.querySelector("html");
    if (html) html.style.overflowY = "visible";
    if (beforeClose) beforeClose(null);
  };

  const handleAfterOpen = () => {
    const html = document.querySelector("html");
    if (html) html.style.overflowY = "hidden";
    if (afterOpen) afterOpen(null);
  };

  const handleLoad = (setIsOpen: Dispatch<SetStateAction<boolean>>) => {
    if (showOnFirstLoad) {
      const viewedTour = localStorage.getItem(cookieName);

      if (!viewedTour) {
        setIsOpen(true);
        localStorage.setItem(cookieName, "true");
      }
    }
  };

  return (
    <Box
      sx={{
        ".reactour__popover": {
          backgroundColor: `${bgColor} !important`,
          color: isDarkMode
            ? "rgba(255,255,255,0.9) !important"
            : "rgba(0,0,0,0.9) !important",
          borderRadius: 1,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.3) !important"
            : "rgba(0,0,0,0.3) !important",
        },
      }}
    >
      <TourProvider
        steps={steps}
        currentStep={step || defaultStep}
        setCurrentStep={setStep || setDefaultStep}
        afterOpen={handleAfterOpen}
        beforeClose={handleBeforeClose}
        showDots={false}
        styles={{
          badge: (base) => ({
            ...base,
            backgroundColor: accentColor,
            color: bgColor,
            fontWeight: 700,
          }),
          close: (base) => ({
            ...base,
            color: isDarkMode ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
          }),
          dot: (base, status) => ({
            ...base,
            background: status?.current ? accentColor : "transparent",
            color: status?.current ? accentColor : "transparent",
          }),
        }}
      >
        <TourContext.Consumer>
          {({ setIsOpen }) => (
            <div onLoad={() => handleLoad(setIsOpen)}>
              {children}
              <GuidedTourButton />
            </div>
          )}
        </TourContext.Consumer>
      </TourProvider>
    </Box>
  );
};
