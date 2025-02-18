import { FC, HTMLAttributes, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import {
  LoadingPlaceholder,
  ThemedShareSvg,
} from "../../character-components/es";
import {
  ApiAdapterUtils,
  ApiRequests,
  characterActions,
} from "../../character-rules-engine";

import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";

import { ClipboardUtils } from "../../../utils";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const ShareUrlPane: FC<Props> = ({ ...props }) => {
  const dispatch = useDispatch();
  const urlInput = useRef<HTMLInputElement>(null);
  const { characterTheme } = useCharacterEngine();

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getShareUrl = async () => {
      const response = await ApiRequests.getCharacterShareUrl();
      const shareUrl = ApiAdapterUtils.getResponseData(response);

      if (shareUrl) {
        setIsLoading(false);
        dispatch(characterActions.SendSocialImageData());
      }
      setShareUrl(shareUrl);
    };

    getShareUrl();
  }, []);

  useEffect(() => {
    if (shareUrl) {
      selectUrlInput();
    }
  }, [shareUrl]);

  const selectUrlInput = (): void => {
    if (urlInput.current) {
      urlInput.current.focus();
      urlInput.current.setSelectionRange(0, urlInput.current.value.length);
    }
  };

  const handleClick = (evt: React.MouseEvent): void => {
    ClipboardUtils.copyTextToClipboard(shareUrl === null ? "" : shareUrl);
    setHasCopied(true);
  };

  return (
    <div className="ct-share-url-pane" {...props}>
      <div className="ct-share-url-pane__splash-icon">
        <ThemedShareSvg theme={characterTheme} />
      </div>
      <Header>Shareable Link Generated</Header>
      <div className="ct-share-url-pane__url">
        <input
          type="text"
          defaultValue={shareUrl ? shareUrl.replace(/https*:\/\//, "") : ""}
          readOnly
          className="ct-share-url-pane__input"
          ref={urlInput}
        />
      </div>
      {isLoading && <LoadingPlaceholder label={"Loading shareable link..."} />}
      <div className="ct-share-url-pane__clipboard" onClick={handleClick}>
        {hasCopied ? <>Copied! &#x2714;</> : "Click to Copy"}
      </div>
    </div>
  );
};
