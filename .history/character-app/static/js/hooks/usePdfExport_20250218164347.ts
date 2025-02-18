import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ApiAdapterUtils,
  ApiRequests,
  characterActions,
  rulesEngineSelectors,
  syncTransactionActions,
} from "../../character-rules-engine";

import { toastMessageActions } from "~/tools/js/Shared/actions";

export interface ExportPdfData {
  exportPdf: () => void;
  pdfUrl: string | null;
  isLoading: boolean;
  isFinished: boolean;
}
export const usePdfExport = (): ExportPdfData => {
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const pdfData = useSelector(rulesEngineSelectors.getPdfExportData);

  const dispatch = useDispatch();

  const exportPdf = useCallback(async () => {
    try {
      setIsLoading(true);

      let syncActivationId: string = "PDF-SYNC";
      dispatch(syncTransactionActions.activate(syncActivationId));

      //This will update the character's spell data before export is created
      //(in case a user is in the builder and has not updated their class spells)
      dispatch(characterActions.loadLazyCharacterData());

      const response = await ApiRequests.postCharacterPdf({
        exportData: JSON.stringify(pdfData),
      });
      const pdfUrl = ApiAdapterUtils.getResponseData(response);

      if (pdfUrl) {
        setPdfUrl(pdfUrl);
        dispatch(syncTransactionActions.deactivate());
      }
    } catch (error) {
      dispatch(
        toastMessageActions.toastError("Error", "An unexpected error occurred.")
      );
    } finally {
      setIsLoading(false);
      setIsFinished(true);
    }
  }, []);
  return { exportPdf, pdfUrl, isLoading, isFinished };
};
