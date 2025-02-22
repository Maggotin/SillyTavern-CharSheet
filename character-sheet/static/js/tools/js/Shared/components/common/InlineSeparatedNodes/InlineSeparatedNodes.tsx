import React from "react";

interface Props {
  nodes: Array<React.ReactNode>;
  sep?: string;
}

export default function InlineSeparatedNodes({ nodes, sep = ", " }: Props) {
  return (
    <React.Fragment>
      {nodes.map((node, idx) => (
        <React.Fragment key={idx}>
          {node}
          {idx < nodes.length - 1 && sep}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
