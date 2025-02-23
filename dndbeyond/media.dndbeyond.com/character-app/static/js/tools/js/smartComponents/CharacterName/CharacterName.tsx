import Typography from "@mui/material/Typography";

import { DefaultCharacterName as DefaultName } from "~/constants";

interface Props {
  defaultCharacterName?: string;
  isDead?: boolean;
  isFaceMenu?: boolean;
  name: string;
}

export default function CharacterName({
  defaultCharacterName = DefaultName,
  isDead = false,
  isFaceMenu = false,
  name,
}: Props) {
  let displayName: string = name ? name : defaultCharacterName;
  if (isDead) {
    displayName = `(Dead) ${displayName}`;
  }

  return (
    <Typography
      variant="h4"
      component="h1"
      style={{ fontFamily: "Roboto Condensed" }}
      sx={{
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        fontSize: isFaceMenu ? "24px" : { xs: "18px", sm: "24px" },
        lineHeight: 1.4,
        letterSpacing: "normal",
      }}
    >
      {displayName}
    </Typography>
  );
}
