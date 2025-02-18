import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { useState, createContext, useEffect, useMemo } from "react";
import { prefixer } from "stylis";

import { getTheme } from "~/theme";

type PaletteOpt = "light" | "dark";

interface Manager {
  lightOrDark: PaletteOpt;
  primary?: string;
}

interface ThemeManagerContext {
  manager: Manager;
  setManager: (manager: Manager) => void;
}

export const ThemeManager = createContext<ThemeManagerContext>(null!);
export const ThemeManagerProvider = ({
  children,
  manager: propsManager,
}: {
  children: React.ReactNode;
  manager?: Manager;
}) => {
  const [manager, setManager] = useState<Manager>(
    propsManager || {
      lightOrDark: "light",
    }
  );
  useEffect(() => {
    if (propsManager) {
      setManager(propsManager);
    }
  }, [propsManager]);
  // HACK
  /**
   * We are doing some hacky things to
   * win is styling conflicts this can
   * go away once we no longer need
   * waterdeep styles
   */
  function hack__createExtraScopePlugin(...extra) {
    const scopes = extra.map((scope) => `${scope.trim()} `);
    return (element) => {
      if (element.type !== "rule") {
        return;
      }

      if (element.root?.type === "@keyframes") {
        return;
      }

      element.props = element.props
        .map((prop) => scopes.map((scope) => scope + prop))
        .reduce((scopesArray, scope) => scopesArray.concat(scope), []);
    };
  }

  const hack__cache = useMemo(
    () =>
      createCache({
        key: "ddb-character-app",
        container: document.body,
        prepend: true,
        stylisPlugins: [
          hack__createExtraScopePlugin("body"),
          // has to be included manually when customizing `stylisPlugins` if you want to have vendor prefixes added automatically
          prefixer,
        ],
      }),
    []
  );
  /**
   * End the hack
   */
  const theme = getTheme(manager.lightOrDark, manager.primary);
  return (
    <ThemeManager.Provider value={{ manager, setManager }}>
      <CacheProvider value={hack__cache}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </CacheProvider>
    </ThemeManager.Provider>
  );
};
