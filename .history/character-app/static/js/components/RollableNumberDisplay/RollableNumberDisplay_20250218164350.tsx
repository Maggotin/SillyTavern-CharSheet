import { FC } from "react";

import { DiceComponents } from "../../dice-components";
import { RollableComponentProps } from "../../dice-components/dist/types/src/components/withDiceRoll";

import {
  NumberDisplay,
  NumberDisplayProps,
} from "../NumberDisplay/NumberDisplay";

/*
    RollableComponent and RollableNumberDisplay are a replacement for SignedNumberDice.
    SignedNumberDice was essentially wrapping the NumberDisplay component inside a button, which
    could be clicked to roll dice with whatever the modifier was in NumberDisplay.
    
    SignedNumberDice had a bunch of props it was attempting to send to NumberDisplay, though, which
    NumberDisplay did not need.
    
    This new component extends the NumberDisplay props and the RollableComponentProps, but only sends
    NumberDisplay the props that it actually needs. This means NumberDisplay can spread other props
    it receives as HTML attributes, as it should.
*/

interface Props
  extends Omit<NumberDisplayProps, "onClick">,
    RollableComponentProps {
  "data-testid"?: string;
}

const RollableComponent: FC<Props> = ({
  number,
  type,
  isModified,
  size,
  numberFallback,
  className,
  ...props
}) => (
  <NumberDisplay
    number={number}
    type={type}
    isModified={isModified}
    size={size}
    numberFallback={numberFallback}
    className={className}
    data-testid={props["data-testid"]}
  />
);

export const RollableNumberDisplay =
  DiceComponents.withDiceRoll(RollableComponent);
