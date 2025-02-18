import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import { FormatUtils } from "../../rules-engine/es";

interface HtmlContentProps extends HTMLAttributes<HTMLDivElement> {
  html: string;
  className?: string;
  withoutTooltips?: boolean;
}

export const HtmlContent: FC<HtmlContentProps> = ({
  html,
  className = "",
  withoutTooltips,
  ...props
}) => (
  <div
    className={clsx(["ddbc-html-content", className])}
    dangerouslySetInnerHTML={{
      __html: withoutTooltips ? FormatUtils.stripTooltipTags(html) : html,
    }}
    {...props}
  />
);
