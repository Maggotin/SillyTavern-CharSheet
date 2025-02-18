import React from "react";
import { DispatchProp } from "react-redux";

import {
  LightExportSvg,
  DisabledExportSvg,
  DarkExportSvg,
} from "@dndbeyond/character-components/es";

import { Link } from "~/components/Link";
import { ExportPdfData, usePdfExport } from "~/hooks/usePdfExport";
import { RouteKey } from "~/subApps/builder/constants";

import { BuilderLinkButton } from "../../../../Shared/components/common/LinkButton";
import { appEnvSelectors } from "../../../../Shared/selectors";
import { ClipboardUtils, MobileMessengerUtils } from "../../../../Shared/utils";
import Page from "../../../components/Page";
import { PageBody } from "../../../components/PageBody";
import PageHeader from "../../../components/PageHeader";
import { builderEnvSelectors, builderSelectors } from "../../../selectors";
import { BuilderAppState } from "../../../typings";
import ConnectedBuilderPage from "../ConnectedBuilderPage";

interface Props extends DispatchProp {
  characterId: number | null;
  characterListingUrl: string;
  characterSheetUrl: string;
  isCharacterSheetReady: boolean;
  exportPdfData: ExportPdfData;
}
interface State {
  hasCopied: boolean;
}
class WhatsNext extends React.PureComponent<Props, State> {
  urlInput = React.createRef<HTMLInputElement>();

  constructor(props: Props) {
    super(props);

    this.state = {
      hasCopied: false,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const {
      exportPdfData: { pdfUrl },
    } = this.props;

    if (pdfUrl !== null) {
      this.selectUrlInput();
    }
  }

  handleExportPdf = (evt: React.MouseEvent): void => {
    const {
      isCharacterSheetReady,
      exportPdfData: { exportPdf, isLoading, isFinished },
    } = this.props;

    if (isCharacterSheetReady && !isLoading && !isFinished) {
      exportPdf();
    }
  };

  selectUrlInput = (): void => {
    if (this.urlInput.current) {
      this.urlInput.current.focus();
      this.urlInput.current.setSelectionRange(
        0,
        this.urlInput.current.value.length
      );
    }
  };

  handleClick = (evt: React.MouseEvent): void => {
    const {
      exportPdfData: { pdfUrl },
    } = this.props;

    ClipboardUtils.copyTextToClipboard(pdfUrl === null ? "" : pdfUrl);
    this.setState({
      hasCopied: true,
    });
  };

  handleSheetShowClick = (isDisabled: boolean) => {
    const { characterId } = this.props;

    if (characterId !== null && !isDisabled) {
      MobileMessengerUtils.sendMessage(
        MobileMessengerUtils.createShowCharacterSheetMessage(characterId)
      );
    }
  };

  renderPdfButton = (): React.ReactNode => {
    const {
      isCharacterSheetReady,
      exportPdfData: { isLoading, isFinished },
    } = this.props;
    // const { pdfLoadingStatus } = this.state;

    let pdfButtonClasses: Array<string> = [
      "ct-button",
      "builder-button",
      "whats-next-action-pdf",
      "character-button-oversized",
      "character-tools-export-pdf-button",
    ];
    let iconNode: React.ReactNode;
    if (isCharacterSheetReady) {
      iconNode = <LightExportSvg />;
    } else {
      pdfButtonClasses.push("character-button-disabled");
      pdfButtonClasses.push("character-button-oversized-disabled");

      iconNode = <DisabledExportSvg />;
    }

    if (isLoading) {
      return (
        <div
          className={pdfButtonClasses.join(" ")}
          onClick={this.handleExportPdf}
        >
          <span className="whats-next-action-icon">{iconNode}</span>
          <span className="whats-next-action-text">Exporting PDF...</span>
        </div>
      );
    } else if (isFinished) {
      pdfButtonClasses.push("whats-next-action-confirmed");
      return (
        <div
          className={pdfButtonClasses.join(" ")}
          onClick={this.handleExportPdf}
        >
          <span className="whats-next-action-icon">✓</span>
        </div>
      );
    }

    pdfButtonClasses.push("whats-next-action-clickable");

    return (
      <div
        className={pdfButtonClasses.join(" ")}
        onClick={this.handleExportPdf}
      >
        <span className="whats-next-action-icon">{iconNode}</span>
        <span className="whats-next-action-text">Export to PDF</span>
      </div>
    );
  };

  renderPdfData = (): React.ReactNode => {
    const {
      exportPdfData: { pdfUrl, isFinished },
    } = this.props;
    const { hasCopied } = this.state;

    if (!isFinished || pdfUrl === null) {
      return null;
    }

    return (
      <div className="whats-next-pdf-data">
        <div className="whats-next-pdf-data-splash-icon">
          <DarkExportSvg />
        </div>
        <div className="whats-next-pdf-data-header">PDF Generated</div>
        <div className="whats-next-pdf-data-url">
          <input
            type="text"
            value={pdfUrl ? pdfUrl.replace(/https*:\/\//, "") : ""}
            className="whats-next-pdf-data-input"
            ref={this.urlInput}
          />
        </div>
        <div
          className="whats-next-pdf-data-clipboard"
          onClick={this.handleClick}
        >
          {hasCopied ? (
            <React.Fragment>Copied! &#x2714;</React.Fragment>
          ) : (
            "Click to Copy"
          )}
        </div>
        {pdfUrl !== null && (
          <div className="whats-next-pdf-data-download">
            <BuilderLinkButton
              url={pdfUrl}
              size={"large"}
              download={true}
              className="whats-next-pdf-data-download-link"
            >
              Click to Download
            </BuilderLinkButton>
          </div>
        )}
      </div>
    );
  };

  render() {
    const { characterListingUrl, characterSheetUrl, isCharacterSheetReady } =
      this.props;

    return (
      <Page clsNames={["whats-next"]}>
        <PageBody>
          <p>
            Once you have completed creating your character, you can view your
            statistics on the digital character sheet or export it for printing.
          </p>

          <div className="whats-next-actions">
            <div className="whats-next-action">
              <BuilderLinkButton
                url={characterSheetUrl}
                className="whats-next-action-sheet-link"
                size="oversized"
                disabled={!isCharacterSheetReady}
                onClick={this.handleSheetShowClick}
              >
                <div className="whats-next-action-text">
                  <div className="whats-next-action-text">
                    View Character Sheet
                    {!isCharacterSheetReady && (
                      <span className="whats-next-action-subtext">
                        Unavailable - Character Incomplete
                      </span>
                    )}
                  </div>
                </div>
              </BuilderLinkButton>
            </div>
            <div className="whats-next-action">{this.renderPdfButton()}</div>
          </div>
          {this.renderPdfData()}
          <div className="whats-next-characters">
            <Link href={characterListingUrl}>View all my characters</Link>
          </div>

          <PageHeader>Come Together</PageHeader>

          <p>
            Most D&amp;D characters don't work alone. Each character plays a
            role within a party, a group of adventurers working together for a
            common purpose. Talk to your fellow players and your DM to decide
            whether your characters know one another, how they met, and what
            sorts of quests the group might undertake.
          </p>

          <p>
            A campaign is a series of adventures undertaken by your group's
            characters. If your DM has a campaign, you can join it by visiting
            the invite link for the campaign. You can also start your own.
          </p>

          <div className="whats-next-campaign">
            <Link href="/campaigns/create" className="whats-next-campaign-link">
              Start a new campaign
            </Link>
          </div>
        </PageBody>
      </Page>
    );
  }
}

function WhatsNextContainer(props) {
  const exportPdfData = usePdfExport();
  return <WhatsNext {...props} exportPdfData={exportPdfData} />;
}

export default ConnectedBuilderPage(
  WhatsNextContainer,
  RouteKey.WHATS_NEXT,
  (state: BuilderAppState) => {
    return {
      characterId: appEnvSelectors.getCharacterId(state),
      characterListingUrl: builderEnvSelectors.getProfileCharacterListingUrl(),
      characterSheetUrl: builderEnvSelectors.getCharacterSheetUrl(state),
      isCharacterSheetReady: builderSelectors.checkIsCharacterSheetReady(state),
    };
  }
);
