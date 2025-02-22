import {
  spring,
  TransitionMotion,
  TransitionStyle,
} from "@serprex/react-motion";
import { uniqueId, throttle } from "lodash";
import React from "react";
import { DOWN, SwipeEventData, UP } from "react-swipeable";

import { Swipeable } from "~/components/Swipeable";

import { AppEnvDimensionsState } from "../../../Shared/stores/typings";
import { ComponentCarouselItem } from "./ComponentCarouselItem";

interface CarouselWindowItem {
  offset: number;
  idx: number;
  key: string;
}

interface Props {
  activeItemKey: string;
  onItemChange?: (newKey: string | null, oldKey: string | null) => void;
  overscanAmount: number;
  changingWaitTime: number;
  changeStartDelta: number;
  resizeThrottleTime: number;
  resizeBlockWaitTime: number;
  envDimensions: AppEnvDimensionsState;
  children:
    | Array<React.ReactElement<ComponentCarouselItem>>
    | React.ReactElement<ComponentCarouselItem>;
}

interface WindowsItemState {
  windowItems: Array<CarouselWindowItem>;
  currentIdx: number;
  swipedAmount: number;
}
interface State extends WindowsItemState {
  activeIdx: number;
  placeholderWidth: number;
  filteredChildren: Array<ComponentCarouselItem>;
  childByIdxLookup: Record<number, ComponentCarouselItem>;
  childrenCount: number;
  isChanging: boolean;
  isResizeBlocked: boolean;
}
export default class ComponentCarousel extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    overscanAmount: 2,
    changingWaitTime: 550,
    changeStartDelta: 75,
    resizeThrottleTime: 300,
    resizeBlockWaitTime: 2000,
  };

  placeholderRef = React.createRef<HTMLDivElement>();
  changingRafId: number | null = null;
  changingStartTime: number | null = null;
  resizeBlockRafId: number | null = null;
  resizeBlockStartTime: number | null = null;
  orientationHandler: () => void;
  resizeHandler: () => void;

  constructor(props) {
    super(props);

    this.state = {
      activeIdx: 0,
      currentIdx: 0,
      swipedAmount: 0,
      placeholderWidth: 0,
      childByIdxLookup: {},
      childrenCount: 0,
      windowItems: [],
      filteredChildren: [],
      isChanging: false,
      isResizeBlocked: false,
    };
  }

  static getDerivedStateFromProps(props: Props, state: State): State {
    const { children, activeItemKey } = props;

    let activeIdx: number = 0;

    //TODO need to refactor to better handle this and not require any
    let filteredChildren: Array<any> = [];
    if (children) {
      filteredChildren = React.Children.toArray(children).filter(
        (child: any) => !!child && child.props.isEnabled
      );
    }
    React.Children.forEach(filteredChildren, (child, idx) => {
      if (!child) {
        return;
      }

      const { itemKey, isEnabled } = child.props;

      if (isEnabled && itemKey === activeItemKey) {
        activeIdx = idx;
      }
    });

    let childByIdxLookup: Record<number, ComponentCarouselItem> =
      filteredChildren.reduce(
        (acc, child, idx) => ({
          ...acc,
          [idx]: child,
        }),
        {}
      );

    let newState: State = {
      ...state,
      activeIdx,
      currentIdx: activeIdx,
      filteredChildren,
      childrenCount: filteredChildren.length,
      childByIdxLookup,
    };

    let windowItemsState: WindowsItemState = state.isChanging
      ? state
      : ComponentCarousel.deriveWindowItemsState(props, newState);

    return {
      ...newState,
      ...windowItemsState,
    };
  }

  componentDidMount() {
    this.initResizeHandlers();
    this.updatePlaceholderDimensions();
  }

  componentWillUnmount() {
    this.destroyResizeHandlers();
    this.stopChangeCheckLoop();
    this.stopResizeBlockCheckLoop();
  }

  destroyResizeHandlers = (): void => {
    window.removeEventListener("resize", this.resizeHandler);
    window.removeEventListener("orientationchange", this.orientationHandler);
  };

  initResizeHandlers = (): void => {
    const { resizeThrottleTime, envDimensions } = this.props;

    this.resizeHandler = throttle(() => {
      if (!this.state.isResizeBlocked) {
        this.updatePlaceholderDimensions();
      }
    }, resizeThrottleTime);

    this.orientationHandler = throttle(() => {
      let oldSize: number = envDimensions ? envDimensions.window.width : 0;
      let count: number = 0;
      let orientationIntervalId: number | undefined;
      orientationIntervalId = window.setInterval(() => {
        let newEnvWidth = envDimensions ? envDimensions.window.width : oldSize;
        if (oldSize !== newEnvWidth || count > 15) {
          window.clearInterval(orientationIntervalId);
          return;
        }
        if (oldSize !== window.innerWidth) {
          this.updatePlaceholderDimensions();
        }
        count++;
      }, 100);
    }, resizeThrottleTime);

    window.addEventListener("resize", this.resizeHandler);
    window.addEventListener("orientationchange", this.orientationHandler);
  };

  updatePlaceholderDimensions = (): void => {
    if (this.placeholderRef.current) {
      let placeholderWidth = this.placeholderRef.current.offsetWidth;
      this.setState(
        {
          placeholderWidth,
        },
        this.updateWindowItems
      );
    }
  };

  getItemKeyByIdx = (itemIdx: number): string | null => {
    const { filteredChildren } = this.state;

    let itemKey: string | null = null;

    React.Children.forEach(filteredChildren, (child, idx) => {
      if (itemIdx === idx) {
        itemKey = child.props.itemKey;
      }
    });

    return itemKey;
  };

  static getSwipedItemPosIdx = (
    activeIdx: number,
    placeholderWidth: number,
    swipedAmount: number
  ): number => {
    if (placeholderWidth === 0) {
      return 0;
    }
    let swipedSlideCount = Math.round(swipedAmount / placeholderWidth);
    return activeIdx - swipedSlideCount; // subtract because of swipe direction makes it negative going right
  };

  // Need to be able to get what array index to use based on a position index that is both positive, zero, and negative
  //   example: [a, b, c, d, e, f, g, h] (length = 8)
  //     position index: -11 -10 -9 -8 -7 -6 -5 -4 -3 -2 -1 0 1 2 3 4 5 6 7 8 9 10
  //     array index:      5   6  7  0  1  2  3  4  5  6  7 0 1 2 3 4 5 6 7 0 1  2
  //
  //     position index "-9" gives letter "h"
  static getArrayIdxByPositionIdx = (
    posIndex: number,
    total: number
  ): number => {
    if (posIndex >= 0) {
      return posIndex % total;
    } else {
      const indexMod = Math.abs(posIndex) % total;
      return (indexMod === 0 ? 0 : 1) * (total - indexMod);
    }
  };

  runChangeCheck = (callback: () => void): void => {
    const { changingWaitTime } = this.props;

    if (
      this.changingStartTime !== null &&
      Number(new Date()) - this.changingStartTime > changingWaitTime
    ) {
      callback();
    } else {
      this.changingRafId = window.requestAnimationFrame(
        this.runChangeCheck.bind(this, callback)
      );
    }
  };

  startChangeCheckLoop = (callback: () => void): void => {
    this.changingStartTime = Number(new Date());
    this.stopChangeCheckLoop();
    this.changingRafId = window.requestAnimationFrame(
      this.runChangeCheck.bind(this, callback)
    );
  };

  stopChangeCheckLoop = (): void => {
    if (this.changingRafId !== null) {
      window.cancelAnimationFrame(this.changingRafId);
    }
  };

  startResizeBlockCheckLoop = (callback: () => void): void => {
    this.resizeBlockStartTime = Number(new Date());
    this.stopResizeBlockCheckLoop();
    this.resizeBlockRafId = window.requestAnimationFrame(
      this.runResizeBlockCheck.bind(this, callback)
    );
  };

  stopResizeBlockCheckLoop = (): void => {
    if (this.resizeBlockRafId !== null) {
      window.cancelAnimationFrame(this.resizeBlockRafId);
    }
  };

  runResizeBlockCheck = (callback: () => void): void => {
    const { resizeBlockWaitTime } = this.props;

    if (
      this.resizeBlockStartTime !== null &&
      Number(new Date()) - this.resizeBlockStartTime > resizeBlockWaitTime
    ) {
      callback();
    } else {
      this.resizeBlockRafId = window.requestAnimationFrame(
        this.runResizeBlockCheck.bind(this, callback)
      );
    }
  };

  static deriveWindowItemsState = (
    props: Props,
    state: State
  ): WindowsItemState => {
    const { overscanAmount } = props;
    const {
      windowItems,
      placeholderWidth,
      swipedAmount,
      childrenCount,
      currentIdx,
    } = state;

    let currentPosIdx: number = ComponentCarousel.getSwipedItemPosIdx(
      currentIdx,
      placeholderWidth,
      swipedAmount
    );
    let startIdx: number = currentPosIdx - overscanAmount;
    let endIdx: number = currentPosIdx + overscanAmount;

    let newWindowItems: Array<CarouselWindowItem> = [];
    if (childrenCount > 0) {
      let offset: number = -1 * overscanAmount;
      for (let i = startIdx; i <= endIdx; i++) {
        let itemIdx = ComponentCarousel.getArrayIdxByPositionIdx(
          i,
          childrenCount
        );
        let existingItem = windowItems.find(
          (windowItem) => windowItem.idx === itemIdx
        );

        newWindowItems.push({
          offset,
          idx: itemIdx,
          key: existingItem ? existingItem.key : uniqueId(),
        });

        offset++;
      }
    }

    return {
      windowItems: newWindowItems,
      currentIdx: currentPosIdx,
      swipedAmount: 0,
    };
  };

  updateWindowItems = (startDelayedChange: boolean = false): void => {
    const { childrenCount, activeIdx } = this.state;

    let windowItemsState = ComponentCarousel.deriveWindowItemsState(
      this.props,
      this.state
    );

    this.setState(windowItemsState);

    if (startDelayedChange) {
      this.startChangeCheckLoop(() => {
        let newActiveIdx = ComponentCarousel.getArrayIdxByPositionIdx(
          windowItemsState.currentIdx,
          childrenCount
        );
        this.handleItemChange(newActiveIdx, activeIdx);
      });
    }
  };

  handleSwiping = ({ deltaX, dir }: SwipeEventData): void => {
    const isVerticalChange = [UP, DOWN].includes(dir);

    if (!isVerticalChange) {
      this.stopChangeCheckLoop();
      this.setState((prevState) => {
        return {
          swipedAmount: deltaX,
          isChanging: true,
          isResizeBlocked: true,
        };
      });
    }
  };

  handleSwipedHorizontal = ({
    event,
    deltaX,
    velocity,
  }: SwipeEventData): void => {
    const isFlick = velocity > 0.1;
    const { placeholderWidth } = this.state;
    const { changeStartDelta } = this.props;

    let newSwipedAmount: number = 0;
    if (isFlick) {
      if (deltaX > 0) {
        newSwipedAmount = placeholderWidth;
      } else if (deltaX < 0) {
        newSwipedAmount = -1 * placeholderWidth;
      }
    }

    this.setState(
      (prevState) => {
        let isChanging: boolean =
          isFlick || Math.abs(deltaX) <= changeStartDelta;
        return {
          swipedAmount: isFlick ? newSwipedAmount : prevState.swipedAmount,
          isChanging,
          isResizeBlocked: isChanging,
        };
      },
      () => {
        this.updateWindowItems(true);
      }
    );
  };

  handleItemChange = (newItemIdx: number, oldItemIdx: number): void => {
    const { onItemChange } = this.props;

    if (onItemChange) {
      onItemChange(
        this.getItemKeyByIdx(newItemIdx),
        this.getItemKeyByIdx(oldItemIdx)
      );
      this.stopChangeCheckLoop();
      this.setState({
        activeIdx: newItemIdx,
        isChanging: false,
      });

      this.startResizeBlockCheckLoop(() => {
        this.setState({
          isResizeBlocked: false,
        });
      });
    }
  };

  handlePlaceholderClick = (newIdx: number, evt: React.MouseEvent): void => {
    const { activeIdx } = this.state;
    const { onItemChange } = this.props;

    if (onItemChange) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      this.handleItemChange(newIdx, activeIdx);
    }
  };

  static getItemPositionX = (
    swipedAmount: number,
    offset: number,
    placeholderWidth: number
  ): number => {
    let itemPositionX = swipedAmount + offset * placeholderWidth;

    if (itemPositionX >= 0) {
      return Math.min(placeholderWidth * 2, itemPositionX);
    } else {
      return Math.max(-1 * placeholderWidth * 2, itemPositionX);
    }
  };

  renderPlaceholders = (): React.ReactNode => {
    const {
      childByIdxLookup,
      windowItems,
      swipedAmount,
      placeholderWidth,
      isChanging,
    } = this.state;

    let placeholderStyles: Array<TransitionStyle> = windowItems.map(
      (windowItem) => {
        const child = childByIdxLookup[windowItem.idx];

        return {
          key: windowItem.key,
          style: {
            transform: spring(
              ComponentCarousel.getItemPositionX(
                swipedAmount,
                windowItem.offset,
                placeholderWidth
              ),
              { stiffness: 400, damping: 30 }
            ),
          },
          data: {
            offset: windowItem.offset,
            itemIdx: windowItem.idx,
            child,
          },
        };
      }
    );

    let classNames: Array<string> = ["ct-component-carousel__placeholders"];
    if (isChanging) {
      classNames.push("ct-component-carousel__placeholders--changing");
    }

    return (
      <div className={classNames.join(" ")} ref={this.placeholderRef}>
        <TransitionMotion styles={placeholderStyles}>
          {(interpolatedStyles) => (
            <React.Fragment>
              {interpolatedStyles.map((config) => {
                const { PlaceholderComponent, placeholderProps, itemKey } =
                  config.data.child.props;

                return (
                  <div
                    className="ct-component-carousel__placeholder"
                    key={config.key}
                    onClick={this.handlePlaceholderClick.bind(
                      this,
                      config.data.itemIdx
                    )}
                    style={{
                      transform: `translateX(${config.style.transform}px)`,
                    }}
                  >
                    <PlaceholderComponent {...placeholderProps} />
                  </div>
                );
              })}
            </React.Fragment>
          )}
        </TransitionMotion>
      </div>
    );
    //`
  };

  renderActiveComponent = (): React.ReactNode => {
    const { activeIdx, childByIdxLookup, filteredChildren } = this.state;

    if (activeIdx === null || !filteredChildren.length) {
      return null;
    }

    let child = childByIdxLookup[activeIdx];
    const { ContentComponent } = child.props;

    return (
      <div className="ct-component-carousel__active">
        <ContentComponent key={child.props.itemKey} />
      </div>
    );
  };

  render() {
    return (
      <Swipeable
        handlerFunctions={{
          onSwiping: this.handleSwiping,
          onSwipedLeft: this.handleSwipedHorizontal,
          onSwipedRight: this.handleSwipedHorizontal,
        }}
      >
        <div className="ct-component-carousel">
          {this.renderPlaceholders()}
          {this.renderActiveComponent()}
        </div>
      </Swipeable>
    );
  }
}
