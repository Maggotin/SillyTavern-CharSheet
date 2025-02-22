import { createContext, FC, useContext, useState } from "react";

import { BuilderMethod } from "../../types";

export interface BuilderContextType {
  builderMethod: BuilderMethod | null;
  isCharacterLoading: boolean;
  isCharacterLoaded: boolean;
  pdfUrl: string | null;
  setBuilderMethod: (method: BuilderMethod) => void;
  suggestedNames: string[];
}

export const BuilderContext = createContext<BuilderContextType>({
  builderMethod: null,
  isCharacterLoading: true,
  isCharacterLoaded: false,
  pdfUrl: null,
  setBuilderMethod: () => {},
  suggestedNames: [],
});

export const BuilderProvider: FC = ({ children }) => {
  const [builderMethod, setBuilderMethodState] = useState<BuilderMethod | null>(
    null
  );
  const [isCharacterLoading, setIsCharacterLoading] = useState(true);
  const [isCharacterLoaded, setIsCharacterLoaded] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [suggestedNames, setSuggestedNames] = useState<string[]>([]);

  const setBuilderMethod = async (method: BuilderMethod) => {
    // Handle setting the builder method via fetch
  };

  // const response = yield call(ApiRequests.getCharacterRuleData, {
  //   params: { v: appConfig.version },
  // });
  // const data: UnpackMakeApiResponseData<
  //   typeof ApiRequests.getCharacterRuleData
  // > | null = ApiAdapterUtils.getResponseData(response);

  // if (data !== null) {
  //   yield put(ruleDataActions.dataSet(data));
  // }
  // yield put(builderActions.builderMethodSetCommit(action.payload));

  return (
    <BuilderContext.Provider
      value={{
        builderMethod,
        isCharacterLoading,
        isCharacterLoaded,
        pdfUrl,
        setBuilderMethod,
        suggestedNames,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilderContext = () => {
  return useContext(BuilderContext);
};
