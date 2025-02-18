import axios, { Canceler } from "axios";
import { uniq } from "lodash";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import { LoadingPlaceholder } from "@dndbeyond/character-components/es";
import {
  ApiRequests,
  ApiAdapterUtils,
  characterActions,
  CharacterPortraitFrameContract,
  rulesEngineSelectors,
  DecorationInfo,
  DecorationUtils,
} from "@dndbeyond/character-rules-engine/es";

import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";

import DataLoadingStatusEnum from "../../../../constants/DataLoadingStatusEnum";
import { SharedAppState } from "../../../../stores/typings";
import { AppLoggerUtils } from "../../../../utils";
import { DecorationPreviewItem } from "../DecorationPreviewItem";

interface FrameGroupInfo {
  label: string;
  frames: Array<CharacterPortraitFrameContract>;
}

interface Props extends DispatchProp {
  decorationInfo: DecorationInfo;
}
interface State {
  frameData: Array<CharacterPortraitFrameContract>;
  loadingStatus: DataLoadingStatusEnum;
}
class FrameManager extends React.PureComponent<Props, State> {
  loadFramesCanceler: null | Canceler = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      frameData: [],
      loadingStatus: DataLoadingStatusEnum.NOT_INITIALIZED,
    };
  }

  componentDidMount(): void {
    this.setState({
      loadingStatus: DataLoadingStatusEnum.LOADING,
    });

    ApiRequests.getCharacterGameDataFrames({
      cancelToken: new axios.CancelToken((c) => {
        this.loadFramesCanceler = c;
      }),
    })
      .then((response) => {
        let apiData: Array<CharacterPortraitFrameContract> = [];

        const data = ApiAdapterUtils.getResponseData(response);
        if (data !== null) {
          apiData = data;
        }

        this.setState({
          frameData: apiData,
          loadingStatus: DataLoadingStatusEnum.LOADED,
        });
        this.loadFramesCanceler = null;
      })
      .catch(AppLoggerUtils.handleAdhocApiError);
  }

  componentWillUnmount(): void {
    if (this.loadFramesCanceler !== null) {
      this.loadFramesCanceler();
    }
  }

  handleFrameClick = (frame: CharacterPortraitFrameContract): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.frameSet(frame));
  };

  handleDefaultFrameClick = (): void => {
    const { dispatch } = this.props;
    dispatch(
      characterActions.frameSet({
        frameAvatarId: null,
        frameAvatarUrl: "",
        decorationKey: null,
        classId: null,
        id: -1,
        name: null,
        raceId: null,
        subRaceId: null,
        tags: null,
      })
    );
  };

  renderFrames = (
    heading: string,
    frames: Array<CharacterPortraitFrameContract>
  ): React.ReactNode => {
    const { decorationInfo } = this.props;
    const currentFrameId =
      DecorationUtils.getAvatarInfo(decorationInfo).frameId;

    return (
      <div className="ct-decoration-manager__group" key={heading}>
        <Heading>{heading}</Heading>
        <div className="ct-decoration-manager__list">
          {frames.map((frame) => (
            <DecorationPreviewItem
              key={frame.id}
              avatarId={frame.frameAvatarId}
              isCurrent={frame.frameAvatarId === currentFrameId}
              onSelected={() => this.handleFrameClick(frame)}
              avatarName={frame.name}
              innerClassName="ct-decoration-manager__item-img"
            >
              <img
                className="ct-decoration-manager__item-frame"
                src={frame.frameAvatarUrl ?? ""}
                alt={`${frame.name} frame preview`}
                loading="lazy"
              />
            </DecorationPreviewItem>
          ))}
        </div>
      </div>
    );
  };

  renderNoFrames = (): React.ReactNode => {
    //TODO DECO CTA
    return (
      <div className="ct-decoration-manager__no-frames">
        You have no extra frames available to choose from.
      </div>
    );
  };

  renderFrameChoices = (): React.ReactNode => {
    const { decorationInfo } = this.props;
    const { frameData } = this.state;
    const currentFrameId =
      DecorationUtils.getAvatarInfo(decorationInfo).frameId;

    let frameTags: Array<string> = uniq(
      frameData.reduce((acc: Array<string>, data) => {
        let tags = data.tags ? data.tags : [];
        return [...acc, ...tags];
      }, [])
    );
    let frameGroups: Array<FrameGroupInfo> = [];
    frameTags.forEach((frameTag) => {
      let frames = frameData.filter(
        (data) => data.tags && data.tags.includes(frameTag)
      );
      frameGroups.push({
        label: frameTag,
        frames,
      });
    });

    return (
      <React.Fragment>
        <div className="ct-decoration-manager__group">
          <Heading>Default</Heading>
          <div className="ct-decoration-manager__list">
            <DecorationPreviewItem
              avatarId={null}
              isCurrent={currentFrameId === null}
              onSelected={this.handleDefaultFrameClick}
              avatarName={"Default"}
            >
              <div className="ct-decoration-manager__item--default" />
            </DecorationPreviewItem>
          </div>
        </div>
        {frameGroups.map((frameGroup) =>
          this.renderFrames(frameGroup.label, frameGroup.frames)
        )}
      </React.Fragment>
    );
  };

  renderContent = (): React.ReactNode => {
    const { frameData } = this.state;

    if (frameData.length > 0) {
      return this.renderFrameChoices();
    } else {
      return this.renderNoFrames();
    }
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
  };
}

export default connect(mapStateToProps)(FrameManager);
