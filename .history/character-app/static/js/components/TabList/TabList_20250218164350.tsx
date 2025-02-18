import clsx from "clsx";
import { FC, HTMLAttributes, ReactNode, useState } from "react";

import ChevronDown from "../../fontawesome-cache/svgs/solid/chevron-down.svg";

import { Popover } from "../Popover";
import styles from "./styles.module.css";

interface TabItem {
  label: ReactNode;
  content: ReactNode;
  className?: string;
  id: string;
}

interface TabListProps extends HTMLAttributes<HTMLElement> {
  tabs: Array<TabItem | null>;
  variant?: "default" | "collapse" | "toggle";
  defaultActiveId?: string;
  maxNavItemsShow?: number;
}

export const TabList: FC<TabListProps> = ({
  tabs,
  defaultActiveId,
  maxNavItemsShow = 7,
  variant = "default",
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(
    defaultActiveId ? defaultActiveId : tabs[0]?.id
  );
  const [isTabVisible, setIsTabVisible] = useState(activeTab !== "");

  const handleTabClick = (id: string) => {
    if (id === activeTab && variant === "collapse") {
      setIsTabVisible(!isTabVisible);
    }

    if (id === activeTab && variant === "toggle") {
      setActiveTab("");
    }

    if (id !== activeTab) {
      setActiveTab(id);
      setIsTabVisible(true);
    }
  };
  const tabsWithContent = tabs.filter((tab) => tab);
  const visibleTabs = tabsWithContent.slice(0, maxNavItemsShow);
  const hiddenTabs = tabsWithContent.slice(maxNavItemsShow);
  const selectedTab = tabs.find((tab) => tab?.id === activeTab);

  return (
    <div {...props}>
      <menu className={styles.tabs}>
        {/* List of visible tabs */}
        {visibleTabs.map((tab: TabItem) => (
          <li key={tab.id}>
            <button
              className={styles.tabButton}
              role="radio"
              aria-checked={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
              {variant !== "default" && (
                <ChevronDown className={!isTabVisible ? styles.closed : ""} />
              )}
            </button>
          </li>
        ))}

        {/* Toggle and menu for hidden tabs */}
        {hiddenTabs.length > 0 && (
          <li>
            <Popover
              className={styles.morePopover}
              variant="menu"
              trigger={<button className={styles.tabButton}>More</button>}
            >
              <menu className={styles.moreMenu}>
                {hiddenTabs.map((tab: TabItem) => (
                  <li key={tab.id}>
                    <button
                      className={styles.tabButton}
                      role="radio"
                      aria-checked={activeTab === tab.id}
                      onClick={() => handleTabClick(tab.id)}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </menu>
            </Popover>
          </li>
        )}
      </menu>

      {/* Content of the active tab */}
      <div className={clsx([styles.tabContent, selectedTab?.className])}>
        {isTabVisible && activeTab !== "" && selectedTab?.content}
      </div>
    </div>
  );
};
