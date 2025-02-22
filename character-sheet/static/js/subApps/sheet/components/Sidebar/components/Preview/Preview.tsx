import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

interface PreviewProps extends HTMLAttributes<HTMLDivElement> {
  imageUrl?: string;
}

export const Preview: FC<PreviewProps> = ({
  children,
  className,
  imageUrl,
  ...props
}) => (
  <div className={clsx(["ct-sidebar__header-preview", className])} {...props}>
    {imageUrl ? (
      <div
        role="presentation"
        className="ct-sidebar__header-preview-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
    ) : (
      children
    )}
  </div>
);
