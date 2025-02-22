import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { MaxCharactersMessageText } from "~/components/MaxCharactersMessageText";

import { DDB_MEDIA_URL } from "../constants";

export const MaxCharactersMessage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 114px)",
        background: `url("${DDB_MEDIA_URL}/attachments/1/614/builder1k.jpg") no-repeat center 0px, url("${DDB_MEDIA_URL}/attachments/0/84/background_texture.png") #f9f9f9 !important`,
      }}
      justifyContent="center"
      display="flex"
    >
      <Stack
        justifyContent="center"
        sx={{
          padding: "20px",
          "& > :not(style)": { padding: "20px" },
          maxWidth: "650px",
          height: "auto",
        }}
      >
        <MaxCharactersMessageText includeTitle={true} useLinks={true} />
      </Stack>
    </Box>
  );
};

export default MaxCharactersMessage;
