import { FC, HTMLAttributes, useEffect, useRef, useState } from "react";

import {
  LoadingPlaceholder,
  ThemedExportSvg,
} from "@dndbeyond/character-components/es";

import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { usePdfExport } from "~/hooks/usePdfExport";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";

import { ThemeLinkButton } from "../../../components/common/LinkButton";
import { ClipboardUtils } from "../../../utils";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const ExportPdfPane: FC<Props> = ({ ...props }) => {
  const urlInput = useRef<HTMLInputElement>(null);
  const { characterTheme } = useCharacterEngine();

  const [hasCopied, setHasCopied] = useState(false);
  const { exportPdf, pdfUrl, isLoading } = usePdfExport();

  useEffect(() => {
    exportPdf();
  }, []);

  useEffect(() => {
    if (pdfUrl) {
      selectUrlInput();
    }
  }, [pdfUrl]);

  const selectUrlInput = (): void => {
    if (urlInput.current) {
      urlInput.current.focus();
      urlInput.current.setSelectionRange(0, urlInput.current.value.length);
    }
  };

  const handleClick = (evt: React.MouseEvent): void => {
    ClipboardUtils.copyTextToClipboard(pdfUrl === null ? "" : pdfUrl);
    setHasCopied(true);
  };

  return (
    <div className="ct-export-pdf-pane" {...props}>
      <div className="ct-export-pdf-pane__splash-icon">
        <ThemedExportSvg theme={characterTheme} />
      </div>
      <Header>PDF Generated</Header>
      <div className="ct-export-pdf-pane__url">
        <input
          type="text"
          defaultValue={pdfUrl ? pdfUrl.replace(/https*:\/\//, "") : ""}
          readOnly
          className="ct-export-pdf-pane__input"
          ref={urlInput}
        />
      </div>
      {isLoading && <LoadingPlaceholder label={"Loading PDF..."} />}
      <div className="ct-export-pdf-pane__clipboard" onClick={handleClick}>
        {hasCopied ? <>Copied! &#x2714;</> : "Click to Copy"}
      </div>
      {pdfUrl !== null && (
        <div className="ct-export-pdf-pane__download">
          <ThemeLinkButton
            url={pdfUrl}
            size={"large"}
            download={true}
            className="ct-export-pdf-pane__download-link"
          >
            Click to Download
          </ThemeLinkButton>
        </div>
      )}
    </div>
  );
};
