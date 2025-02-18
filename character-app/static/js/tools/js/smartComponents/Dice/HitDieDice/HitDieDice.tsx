import * as React from "react";

import { DiceComponents } from "@dndbeyond/dice-components";

export interface Props {}
class HitDie extends React.PureComponent<Props> {
  render() {
    const { children } = this.props;

    return <React.Fragment>{children}</React.Fragment>;
  }
}
export default DiceComponents.withDiceRoll(HitDie);
