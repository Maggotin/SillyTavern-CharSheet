import clsx from "clsx";
import { AnchorHTMLAttributes, FC } from "react";
import { Link as RouterLink } from "react-router-dom";

interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "onClick"> {
  onClick?: Function;
  useTheme?: boolean;
  useRouter?: boolean;
}

export const Link: FC<LinkProps> = ({
  children,
  className,
  href,
  onClick,
  useTheme,
  useRouter,
  ...props
}) => {
  //TODO - refactor to handle stop propagation on the oustide of this component (about 7 or so files to change)
  const handleClick = (e: React.MouseEvent): void => {
    if (onClick) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      onClick();
    }
  };

  if (useRouter)
    return (
      <RouterLink
        className={className}
        onClick={handleClick}
        to={href || ""}
        {...props}
      >
        {children}
      </RouterLink>
    );

  return (
    <a
      className={clsx(["ddbc-link", useTheme && "ddbc-theme-link", className])}
      onClick={handleClick}
      href={href}
      {...props}
    >
      {children}
    </a>
  );
};
