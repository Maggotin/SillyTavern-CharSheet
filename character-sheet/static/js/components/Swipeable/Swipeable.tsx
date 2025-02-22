import { useSwipeable } from "react-swipeable";

export const Swipeable = ({
  handlerFunctions,
  deltaOverride = 75,
  ...props
}) => {
  const handlers = useSwipeable({ ...handlerFunctions, delta: deltaOverride });

  return <div className="swipeable" {...handlers} {...props}></div>;
};
