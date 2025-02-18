import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";

import { FontProvider } from "../../ftui-components";
import "../../ttui/styles/palette.css";
import wayOfLight from "../../ttui/themes/wayOfLight";

import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/Authentication";
import { FeatureFlagProvider } from "./contexts/FeatureFlag";
import { FiltersProvider } from "./contexts/Filters";
import { HeadContextProvider } from "./contexts/Head";
import { ThemeManagerProvider } from "./contexts/ThemeManager";
import { reportWebVitals } from "./helpers/reportWebVitals";
import { Routes } from "./routes";
import "./styles/global.css";
import "./styles/index.scss";
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/waterdeep-stat-blocks.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60 * 60 * 1000 } },
});

const fonts = [
  {
    family: "Tiamat Condensed SC",
    type: "woff2",
    url: "https://www.dndbeyond.com/fonts/tiamatcondensedsc-regular-webfont.woff2",
  },
  {
    family: "MrsEavesSmallCaps",
    type: "truetype",
    url: "https://www.dndbeyond.com/content/skins/waterdeep/fonts/MrsEavesSmallCaps.ttf",
  },
];

const App = () => (
  <>
    <style>{wayOfLight}</style>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeManagerProvider manager={{ lightOrDark: "light" }}>
          <FontProvider fonts={fonts} />
          <HeadContextProvider>
            <AuthProvider>
              <FeatureFlagProvider>
                <FiltersProvider>
                  <Layout>
                    <Routes />
                  </Layout>
                </FiltersProvider>
              </FeatureFlagProvider>
            </AuthProvider>
          </HeadContextProvider>
        </ThemeManagerProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </>
);

ReactDOM.render(<App />, document.getElementById("character-tools-target"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
