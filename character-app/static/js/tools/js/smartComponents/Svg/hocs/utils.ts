import * as React from "react";

export function getDisplayName(
  WrappedComponent: React.ComponentType<React.ComponentProps<any>>
) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
