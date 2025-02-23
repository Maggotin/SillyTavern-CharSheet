import axios, { Canceler } from "axios";
import { uniq } from "lodash";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import { LoadingPlaceholder } from "@dndbeyond/character-components/es";
import {
  ApiRequests,
  ApiAdapterUtils,
  characterActions,
  CharacterBackdropContract,
  CharClass,
  ClassUtils,
  rulesEngineSelectors,
  DecorationInfo,
  DecorationUtils,
} from "@dndbeyond/character-rules-engine/es";

import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";

import DataLoadingStatusEnum from "../../../../constants/DataLoadingStatusEnum";
import { SharedAppState } from "../../../../stores/typings";
import { AppLoggerUtils } from "../../../../utils";
import { DecorationPreviewItem } from "../DecorationPreviewItem";

interface BackdropGroups {
  label: string;
  backdrops: Array<CharacterBackdropContract>;
}
interface Props extends DispatchProp {
  decorationInfo: DecorationInfo;
  startingClass: CharClass | null;
}
interface State {
  backdropData: Array<CharacterBackdropContract>;
  loadingStatus: DataLoadingStatusEnum;
}
class BackdropManager extends React.PureComponent<Props, State> {
  loadBackdropsCanceler: null | Canceler = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      backdropData: [],
      loadingStatus: DataLoadingStatusEnum.NOT_INITIALIZED,
    };
  }

  componentDidMount(): void {
    this.setState({
      loadingStatus: DataLoadingStatusEnum.LOADING,
    });

    ApiRequests.getCharacterGameDataBackdrops({
      cancelToken: new axios.CancelToken((c) => {
        this.loadBackdropsCanceler = c;
      }),
    })
      .then((response) => {
        let apiData: Array<CharacterBackdropContract> = [];

        const data = ApiAdapterUtils.getResponseData(response);
        if (data !== null) {
          apiData = data;
        }

        this.setState({
          backdropData: apiData,
          loadingStatus: DataLoadingStatusEnum.LOADED,
        });
        this.loadBackdropsCanceler = null;
      })
      .catch(AppLoggerUtils.handleAdhocApiError);
  }

  componentWillUnmount(): void {
    if (this.loadBackdropsCanceler !== null) {
      this.loadBackdropsCanceler();
    }
  }

  handleBackdropClick = (backdrop: CharacterBackdropContract): void => {
    const { dispatch } = this.props;

    dispatch(characterActions.backdropSet(backdrop));
  };

  handleDefaultBackdropClick = (): void => {
    const { dispatch } = this.props;
    dispatch(
      characterActions.backdropSet({
        backdropAvatarId: null,
        backdropAvatarUrl: "",
        largeBackdropAvatarId: null,
        largeBackdropAvatarUrl: "",
        smallBackdropAvatarId: null,
        smallBackdropAvatarUrl: "",
        thumbnailBackdropAvatarId: null,
        thumbnailBackdropAvatarUrl: "",
      })
    );
  };

  renderItems = (
    heading: string,
    backdrops: Array<CharacterBackdropContract>
  ): React.ReactNode => {
    const { decorationInfo } = this.props;
    const currentBackdrop = DecorationUtils.getBackdropInfo(decorationInfo);
    return (
      <div className="ct-decoration-manager__group" key={heading}>
        <Heading>{heading}</Heading>
        <div className="ct-decoration-manager__list">
          {backdrops.map((backdrop) => (
            <DecorationPreviewItem
              key={backdrop.id}
              avatarId={backdrop.thumbnailBackdropAvatarId}
              avatarName={backdrop.name}
              isCurrent={
                backdrop.backdropAvatarId === currentBackdrop.backdropAvatarId
              }
              onSelected={() => this.handleBackdropClick(backdrop)}
              innerClassName="ct-decoration-manager__item-img"
            >
              <img
                className="ct-decoration-manager__item-img"
                src={backdrop.thumbnailBackdropAvatarUrl ?? ""}
                alt={`${backdrop.name} backdrop preview`}
                loading="lazy"
              />
            </DecorationPreviewItem>
          ))}
        </div>
      </div>
    );
  };

  renderContent = (): React.ReactNode => {
    const { decorationInfo, startingClass } = this.props;
    const { backdropData } = this.state;

    const currentBackdrop = DecorationUtils.getBackdropInfo(decorationInfo);
    let startingClassBackdrop: CharacterBackdropContract | null = null;

    if (startingClass) {
      const startingClassBackdropData = backdropData.find(
        (data) => data.classId === ClassUtils.getId(startingClass)
      );
      startingClassBackdrop = startingClassBackdropData
        ? startingClassBackdropData
        : null;
    }

    let backdropTags: Array<string> = uniq(
      backdropData.reduce((acc, data) => {
        let tags = data.tags ? data.tags : [];
        return [...acc, ...tags];
      }, [])
    );

    let backdropGroups: Array<BackdropGroups> = [];
    backdropTags.forEach((backdropTag) => {
      let backdrops = backdropData.filter(
        (data) => data.tags && data.tags.includes(backdropTag)
      );
      backdropGroups.push({
        label: backdropTag,
        backdrops,
      });
    });

    return (
      <React.Fragment>
        {startingClassBackdrop && (
          <div className="ct-decoration-manager__group">
            <Heading>Default</Heading>
            <div className="ct-decoration-manager__list">
              <DecorationPreviewItem
                avatarId={startingClassBackdrop.backdropAvatarId}
                avatarName={startingClassBackdrop.name}
                isCurrent={currentBackdrop.backdropAvatarId === null}
                onSelected={this.handleDefaultBackdropClick}
              >
                <img
                  className="ct-decoration-manager__item-img"
                  src={startingClassBackdrop.thumbnailBackdropAvatarUrl ?? ""}
                  alt={`${startingClassBackdrop.name} backdrop preview`}
                  loading="lazy"
                />
              </DecorationPreviewItem>
            </div>
          </div>
        )}
        {backdropGroups.map((backdropGroup) =>
          this.renderItems(backdropGroup.label, backdropGroup.backdrops)
        )}
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
    startingClass: rulesEngineSelectors.getStartingClass(state),
  };
}

export default connect(mapStateToProps)(BackdropManager);
