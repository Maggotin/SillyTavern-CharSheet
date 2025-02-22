import clsx from "clsx";
import { ChangeEvent, FC, HTMLAttributes } from "react";

import styles from "./styles.module.css";

export interface SearchProps extends HTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Search: FC<SearchProps> = ({
  className,
  placeholder = "Search...",
  value,
  onChange,
  ...props
}) => (
  <input
    type="search"
    className={clsx([styles.search, className])}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    spellCheck={false}
    autoComplete={"off"}
    {...props}
  />
);
{
  /* {showAddAmountControls ? this.renderAmountControls() : null} */
}
