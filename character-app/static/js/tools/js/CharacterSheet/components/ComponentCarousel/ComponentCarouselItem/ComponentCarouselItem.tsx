import React from "react";

interface Props {
  itemKey: string;
  PlaceholderComponent: React.ElementType;
  placeholderProps?: any;
  ContentComponent: React.ElementType;
  isEnabled: boolean;
}
export default class ComponentCarouselItem extends React.PureComponent<Props> {
  static defaultProps = {
    isEnabled: true,
  };

  render() {
    return null;
  }
}
