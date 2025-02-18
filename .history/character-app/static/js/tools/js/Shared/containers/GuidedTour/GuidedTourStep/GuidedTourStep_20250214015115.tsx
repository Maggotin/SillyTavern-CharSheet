import { Button, Typography } from "@mui/material";
import { useTour } from "@reactour/tour";
import { useSelector } from "react-redux";

import { rulesEngineSelectors } from "@dndbeyond/character-rules-engine";

import { checkContrast } from "../../../utils/Color";

export default ({ title, content, showClose = false }) => {
  const { themeColor, backgroundColor, isDarkMode } = useSelector(
    rulesEngineSelectors.getCharacterTheme
  );
  const { setIsOpen } = useTour();
  const accentColor = checkContrast(backgroundColor, themeColor)
    ? themeColor
    : "#C53131";

  return (
    <>
      <Typography variant="h4" component="p" mb={1}>
        {title}
      </Typography>
      <Typography
        component="div"
        variant="body2"
        sx={{ a: { color: accentColor, textDecoration: "none" } }}
      >
        {content}
      </Typography>
      {showClose && (
        <Button
          variant="outlined"
          onClick={() => setIsOpen(false)}
          sx={{
            display: "inherit",
            my: 1,
            mx: "auto",
            fontSize: 12,
            color: isDarkMode
              ? "rgba(255,255,255,0.9) !important"
              : "rgba(0,0,0,0.9) !important",
            borderColor: accentColor,
          }}
        >
          Start Playing!
        </Button>
      )}
    </>
  );
};
