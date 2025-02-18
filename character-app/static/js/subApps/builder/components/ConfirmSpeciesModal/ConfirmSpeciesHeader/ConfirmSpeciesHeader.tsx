import clsx from "clsx";
import { FC, HTMLAttributes, ReactNode } from "react";

import { HtmlContent } from "~/components/HtmlContent";
import { LegacyBadge } from "~/components/LegacyBadge";

import styles from "./styles.module.css";

export interface ConfirmSpeciesHeaderProps
  extends HTMLAttributes<HTMLDivElement> {
  heading: string;
  content: string;
  imageUrl: string;
  isLegacy?: boolean;
  sources?: ReactNode;
}

export const ConfirmSpeciesHeader: FC<ConfirmSpeciesHeaderProps> = ({
  className,
  heading,
  content,
  imageUrl,
  isLegacy,
  sources,
  ...props
}) => {
  return (
    <div className={clsx([styles.confirmSpeciesHeader, className])} {...props}>
      <div>
        <h3 className={styles.fullName}>
          {heading}
          {isLegacy && <LegacyBadge id={heading || ""} />}
        </h3>
        {sources}
        <HtmlContent html={content} withoutTooltips />
      </div>
      <img className={styles.image} src={imageUrl} alt={heading} />
    </div>
  );
};
