import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { rulesEngineSelectors } from "../../rules-engine/es";

import characterGalleryImg from "~/images/character-gallery.png";
import characterSheetImg from "~/images/character-sheet.png";
import tadaEmoji from "~/images/tada-emoji.svg?url";

type Props = {
  characterId: number;
  campaignId?: number | null;
};

export const ClaimConfirmationDialog: React.FC<Props> = ({
  characterId,
  campaignId,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const theme = useSelector(rulesEngineSelectors.getCharacterTheme);
  const { isDarkMode } = theme;

  const close = () => {
    window.location.href = `/characters/${characterId}`;
  };

  useEffect(() => {
    characterId && setIsOpen(true);
  }, [characterId]);

  return (
    <Dialog
      onClose={close}
      open={isOpen}
      fullWidth={true}
      sx={{
        "& .MuiPaper-root": {
          maxWidth: "644px",
          backgroundColor: isDarkMode ? "#374045" : "white",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: "24px 32px 16px",
          fontSize: "18px",
          fontWeight: 700,
          color: isDarkMode ? "white" : "#12181C",
        }}
      >
        <Box component="img" src={tadaEmoji} alt="Ta-da emoji" />{" "}
        Congratulations!
        <IconButton
          aria-label="close"
          onClick={close}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: isDarkMode
              ? "rgba(255, 255, 255, 0.54)"
              : "rgba(0, 0, 0, 0.54)",
            "&:hover": {
              backgroundColor: isDarkMode
                ? "rgba(220, 223, 225, 0.08)"
                : "#ECEDEE",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ m: 0, p: "0 24px 24px" }}>
        <Grid container justifyContent="center">
          <DialogContentText
            textAlign={"center"}
            sx={{ color: isDarkMode ? "white" : "#12181C" }}
          >
            Your character has been claimed and is now available:
          </DialogContentText>
          <Grid item container spacing={2}>
            <Grid
              item
              container
              xs={12}
              sm={6}
              direction="column"
              alignItems="center"
            >
              <Box
                component="img"
                sx={{ width: "100%" }}
                src={characterGalleryImg}
                alt="Premade character gallery"
              ></Box>
              <Button
                variant="outlined"
                href="/characters"
                sx={{
                  height: "40px",
                  width: "230px",
                  marginTop: "-20px",

                  color: "#374045",
                  fontSize: "12px",
                  lineHeight: "15px",

                  backgroundColor: "#fff",
                  border: "2px solid #3298ED",
                  borderRadius: "8px",
                  boxShadow: "none",
                  "&:hover": {
                    color: "#fff",

                    backgroundColor: "#232B2F",
                    border: "2px solid #3298ED",
                    boxShadow: "none",
                  },
                }}
              >
                Go to my characters{" "}
                <ArrowForwardIosIcon
                  sx={{ position: "absolute", right: "8px", height: "14px" }}
                />
              </Button>
            </Grid>
            <Grid
              item
              container
              xs={12}
              sm={6}
              direction="column"
              alignItems="center"
            >
              <Box
                component="img"
                sx={{
                  width: "100%",
                }}
                src={characterSheetImg}
                alt="Sample character sheet"
              ></Box>
              <Button
                variant="contained"
                href={`/characters/${characterId}`}
                sx={{
                  height: "40px",
                  width: "230px",
                  marginTop: "-20px",

                  color: "#fff",
                  fontSize: "12px",
                  lineHeight: "15px",

                  backgroundColor: "#3298ED",
                  borderRadius: "8px",
                  boxShadow: "none",
                  "&:hover": {
                    color: "#fff",

                    backgroundColor: "#53ADF0",
                    boxShadow: "none",
                  },
                }}
              >
                View your character{" "}
                <ArrowForwardIosIcon
                  sx={{ position: "absolute", right: "8px", height: "14px" }}
                />
              </Button>
            </Grid>
          </Grid>
          {campaignId && (
            <Link
              href={`/campaigns/${campaignId}`}
              variant="button"
              underline="none"
              sx={{ marginTop: "20px", color: "#3298ED" }}
            >
              or return to your campaign
            </Link>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimConfirmationDialog;
