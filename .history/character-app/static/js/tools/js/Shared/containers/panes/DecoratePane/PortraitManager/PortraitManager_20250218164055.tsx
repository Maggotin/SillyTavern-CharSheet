import axios, { Canceler } from "axios";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  ApiRequests,
  ApiAdapterUtils,
  characterActions,
  CharacterPortraitContract,
  Race,
  RaceUtils,
  rulesEngineSelectors,
  DecorationInfo,
  DecorationUtils,
} from "../../rules-engine/es";

import { Button } from "~/components/Button";
import { ACCEPTED_IMAGE_TYPES, FILE_SIZE_3MB } from "~/constants";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";
import DataLoadingStatusEnum from "~/tools/js/Shared/constants/DataLoadingStatusEnum";
import { SharedAppState } from "~/tools/js/Shared/stores/typings";
import { AppLoggerUtils } from "~/tools/js/Shared/utils";
import { CharacterAvatarPortrait } from "~/tools/js/smartComponents/CharacterAvatar";
import LoadingPlaceholder from "~/tools/js/smartComponents/LoadingPlaceholder";

import DecorationPreviewItem from "../DecorationPreviewItem";

interface Props extends DispatchProp {
  decorationInfo: DecorationInfo;
  species: Race | null;
  handleSelectPortrait?: (portrait: CharacterPortraitContract) => void;
}
interface State {
  isCustomPortrait: boolean;
  portraitUploadData: string | null;
  portraitUploadWidth: number | null;
  portraitUploadHeight: number | null;
  portraitUploadValid: boolean | null;
  portraitUploadValidSize: boolean | null;
  portraitData: Array<CharacterPortraitContract>;
  loadingStatus: DataLoadingStatusEnum;
  currentSelection: CharacterPortraitContract | null;
}
class PortraitManager extends React.PureComponent<Props, State> {
  loadPortraitsCanceler: null | Canceler = null;
  portraitUpload = React.createRef<HTMLInputElement>();
  portraitUploadForm = React.createRef<HTMLFormElement>();

  constructor(props) {
    super(props);

    this.state = {
      portraitUploadData: null,
      portraitUploadWidth: null,
      portraitUploadHeight: null,
      portraitUploadValid: null,
      portraitUploadValidSize: null,
      isCustomPortrait: false,
      portraitData: [],
      loadingStatus: DataLoadingStatusEnum.NOT_INITIALIZED,
      currentSelection: null,
    };
  }

  componentDidMount(): void {
    const { decorationInfo } = this.props;
    const currentAvatarId =
      DecorationUtils.getAvatarInfo(decorationInfo).avatarId;

    this.setState({
      loadingStatus: DataLoadingStatusEnum.LOADING,
    });

    ApiRequests.getCharacterGameDataPortraits({
      cancelToken: new axios.CancelToken((c) => {
        this.loadPortraitsCanceler = c;
      }),
    })
      .then((response) => {
        let apiData: Array<CharacterPortraitContract> = [];

        const data = ApiAdapterUtils.getResponseData(response);
        if (data !== null) {
          apiData = data;
        }

        const isCustomPortrait =
          currentAvatarId !== null &&
          !apiData.find((portrait) => portrait.avatarId === currentAvatarId);
        this.setState({
          portraitData: apiData,
          loadingStatus: DataLoadingStatusEnum.LOADED,
          isCustomPortrait,
        });
        this.loadPortraitsCanceler = null;
      })
      .catch(AppLoggerUtils.handleAdhocApiError);
  }

  componentWillUnmount(): void {
    if (this.loadPortraitsCanceler !== null) {
      this.loadPortraitsCanceler();
    }
  }

  handlePortraitClick = (portrait: CharacterPortraitContract): void => {
    const { dispatch, handleSelectPortrait } = this.props;

    if (portrait.avatarId && portrait.avatarUrl) {
      if (handleSelectPortrait) {
        handleSelectPortrait(portrait);
        this.setState({
          currentSelection: portrait,
        });
      } else {
        dispatch(
          characterActions.portraitSet(portrait.avatarId, portrait.avatarUrl)
        );
      }
    }

    this.setState({
      isCustomPortrait: false,
    });
  };

  isPortraitAvailableForSpecies = (
    portrait: CharacterPortraitContract,
    species: Race | null
  ): boolean => {
    let currentSpeciesId: number | null = null;
    let currentSpeciesOptionId: number | null = null;
    if (species) {
      const baseSpeciesId = RaceUtils.getBaseRaceId(species);
      const entitySpeciesId = RaceUtils.getEntityRaceId(species);
      currentSpeciesId =
        baseSpeciesId !== null ? baseSpeciesId : entitySpeciesId;
      currentSpeciesOptionId = baseSpeciesId !== null ? entitySpeciesId : null;
    }

    if (portrait.raceId !== null && currentSpeciesId === portrait.raceId) {
      return true;
    }
    if (
      portrait.subRaceId !== null &&
      currentSpeciesOptionId === portrait.subRaceId
    ) {
      return true;
    }

    return false;
  };

  handlePortraitUpload = (): void => {
    const { dispatch } = this.props;
    const { portraitUploadData } = this.state;

    if (portraitUploadData !== null) {
      dispatch(characterActions.portraitUpload(portraitUploadData));
    }

    this.setState({
      portraitUploadData: null,
      portraitUploadWidth: null,
      portraitUploadHeight: null,
      portraitUploadValid: null,
      portraitUploadValidSize: null,
      isCustomPortrait: true,
    });

    if (this.portraitUploadForm.current) {
      this.portraitUploadForm.current.reset();
    }
  };

  handleCustomPortraitChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const fileInput = this.portraitUpload.current;

    if (fileInput && fileInput.files && fileInput.files[0]) {
      let reader = new FileReader();
      let file = fileInput.files[0];

      let validFile: boolean = true;
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        this.setState({
          portraitUploadValid: false,
          portraitUploadValidSize: null,
        });
        validFile = false;
      }
      if (file.size > FILE_SIZE_3MB) {
        this.setState({
          portraitUploadValid: null,
          portraitUploadValidSize: false,
        });
        validFile = false;
      }

      if (validFile) {
        reader.onload = (e: ProgressEvent) => {
          let imageData = reader.result;
          if (typeof imageData === "string") {
            this.setState({
              portraitUploadData: imageData,
              portraitUploadValid: true,
              portraitUploadValidSize: true,
            });

            let img = new Image();
            img.onload = () => {
              this.setState({
                portraitUploadWidth: img.width,
                portraitUploadHeight: img.height,
              });
            };

            img.src = imageData;
          }
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.setState({
        portraitUploadData: null,
        portraitUploadWidth: null,
        portraitUploadHeight: null,
        portraitUploadValid: null,
        portraitUploadValidSize: null,
      });
    }
  };

  renderPortraits = (
    heading: string,
    portraits: Array<CharacterPortraitContract>
  ): React.ReactNode => {
    const { decorationInfo } = this.props;

    return (
      <div className="ct-decoration-manager__group">
        <Heading>{heading}</Heading>
        <div className="ct-decoration-manager__list">
          {portraits.map((portrait) => (
            <DecorationPreviewItem
              key={portrait.id}
              avatarId={portrait.avatarId}
              isSelected={this.state.currentSelection === portrait}
              isCurrent={
                DecorationUtils.getAvatarInfo(decorationInfo).avatarId ===
                portrait.avatarId
              }
              onSelected={() => this.handlePortraitClick(portrait)}
              innerClassName="ct-decoration-manager__item-img"
            >
              <CharacterAvatarPortrait avatarUrl={portrait.avatarUrl} />
            </DecorationPreviewItem>
          ))}
        </div>
      </div>
    );
  };

  renderPortraitUploader = (): React.ReactNode => {
    const {
      isCustomPortrait,
      portraitUploadData,
      portraitUploadValid,
      portraitUploadValidSize,
    } = this.state;

    let setButtonLabel: string = "Set Portrait";
    if (isCustomPortrait) {
      setButtonLabel = "Change Portrait";
    }

    let confirmNode: React.ReactNode;
    if (portraitUploadValid !== null && !portraitUploadValid) {
      confirmNode = (
        <div className="ct-decoration-manager__upload-warning">
          Cannot upload the selected file type. <br />
          Acceptable file types are jpg, gif, and png.
        </div>
      );
    } else if (portraitUploadValidSize !== null && !portraitUploadValidSize) {
      confirmNode = (
        <div className="ct-decoration-manager__upload-warning">
          Cannot upload the selected file as it exceeds the maximum file size of
          3MB.
        </div>
      );
    } else if (portraitUploadData) {
      confirmNode = (
        <div className="ct-decoration-manager__upload-confirm">
          <div className="ct-decoration-manager__upload-image">
            <div className="ct-decoration-manager__upload-image-heading">
              Preview
            </div>
            <CharacterAvatarPortrait
              className="ct-decoration-manager__upload-image-preview"
              avatarUrl={portraitUploadData}
            />
          </div>
          <div className="ct-decoration-manager__upload-action">
            <Button
              themed
              onClick={this.handlePortraitUpload}
              disabled={portraitUploadData === null}
              size="x-small"
            >
              {setButtonLabel}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="ct-decoration-manager__upload">
        <div className="ct-decoration-manager__upload-heading">
          <Heading>Upload Portrait</Heading>
          <div className="ct-decoration-manager__upload-heading-rules">
            Recommended Size: 150 x 150 Pixels, Maximum File Size: 3MB
          </div>
        </div>
        <form
          className="ct-decoration-manager__upload-form"
          ref={this.portraitUploadForm}
        >
          <div className="ct-decoration-manager__upload-file">
            <input
              className="ct-decoration-manager__upload-file-input"
              type="file"
              ref={this.portraitUpload}
              onChange={this.handleCustomPortraitChange}
            />
          </div>
        </form>
        {confirmNode}
      </div>
    );
  };

  renderUploadedPortrait = (): React.ReactNode => {
    const { decorationInfo } = this.props;
    const { isCustomPortrait } = this.state;

    if (!isCustomPortrait) {
      return null;
    }

    const avatarUrl = DecorationUtils.getAvatarInfo(decorationInfo).avatarUrl;

    return (
      <div className="ct-decoration-manager__custom">
        <Heading>Current Custom Portrait</Heading>
        <div className="ct-decoration-manager__custom-content">
          <div className="ct-decoration-manager__custom-preview">
            <CharacterAvatarPortrait avatarUrl={avatarUrl} />
          </div>
        </div>
      </div>
    );
  };

  renderContent = (): React.ReactNode => {
    const { species } = this.props;
    const { portraitData } = this.state;

    let speciesPortraits: CharacterPortraitContract[] = [];
    let otherPortraits = portraitData;
    if (species) {
      speciesPortraits = portraitData.filter((portrait) =>
        this.isPortraitAvailableForSpecies(portrait, species)
      );
      otherPortraits = portraitData.filter(
        (portrait) => !this.isPortraitAvailableForSpecies(portrait, species)
      );
    }

    const otherPortraitLabel: string =
      speciesPortraits.length > 0 ? "Other Portraits" : "Portraits";
    return (
      <React.Fragment>
        {this.renderUploadedPortrait()}
        {this.renderPortraitUploader()}
        {species &&
          speciesPortraits.length > 0 &&
          this.renderPortraits(
            `${species.fullName} Portraits`,
            speciesPortraits
          )}
        {this.renderPortraits(otherPortraitLabel, otherPortraits)}
      </React.Fragment>
    );
  };

  render() {
    const { loadingStatus } = this.state;

    let contentNode: React.ReactNode;
    if (loadingStatus === DataLoadingStatusEnum.LOADED) {
      contentNode = this.renderContent();
    } else {
      contentNode = <LoadingPlaceholder />;
    }

    return <div className="ct-decoration-manager">{contentNode}</div>;
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    decorationInfo: rulesEngineSelectors.getDecorationInfo(state),
    species: rulesEngineSelectors.getRace(state),
  };
}

export default connect(mapStateToProps)(PortraitManager);
