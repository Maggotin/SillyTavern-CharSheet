import clsx from "clsx";
import { FC, HTMLAttributes } from "react";
import { useMatch } from "react-router-dom";

import { Footer } from "../../ttui/components/Footer";
import { MegaMenu } from "../../ttui/components/MegaMenu";
import { Sitebar } from "../../ttui/components/Sitebar";

import config from "~/config";
import useUser from "~/hooks/useUser";

import styles from "./styles.module.css";

const BASE_PATHNAME = config.basePathname;

interface LayoutProps extends HTMLAttributes<HTMLDivElement> {}

export const Layout: FC<LayoutProps> = ({ children, ...props }) => {
  const isDev = process.env.NODE_ENV === "development";
  const user = useUser();
  const matchSheet = useMatch(`${BASE_PATHNAME}/:characterId/`);

  // Don't show the navigation in production
  if (!isDev) return <>{children}</>;

  return (
    <div {...props}>
      {/* TODO: fetch navItems */}
      <div className={styles.siteStyles}>
        <Sitebar user={user as any} navItems={[]} />
        {/* TODO: fetch sources */}
        <MegaMenu sources={[]} />
      </div>
      <div className={clsx(["container", styles.devContainer])}>{children}</div>
      {!matchSheet && (
        <div className={styles.siteStyles}>
          <Footer />
        </div>
      )}
    </div>
  );
};
