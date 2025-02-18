import CloseIcon from "@mui/icons-material/Close";
import VideocamIcon from "@mui/icons-material/Videocam";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { rulesEngineSelectors } from "@dndbeyond/character-rules-engine/es";

import { MaxCharactersDialog } from "~/components/MaxCharactersDialog";
import { useAuth } from "~/contexts/Authentication";
import { useClaimCharacter } from "~/hooks/useClaimCharacter";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";

import ClaimConfirmationDialog from "./ClaimConfirmationDialog";

export const WatchTourDialog: React.FC = () => {
  const theme = useSelector(rulesEngineSelectors.getCharacterTheme);
  const { isDarkMode } = theme;

  const params = new URLSearchParams(globalThis.location.search);
  const campaignJoinCode = params.get("campaignJoinCode");
  const isAssigned = params.get("isAssigned") === "false" ? false : true;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { characterSlotLimit, activeCharacterCount } = useSelector(
    appEnvSelectors.getCharacterSlots
  );
  // Character slot limit is null for admin accounts
  const hasOpenSlot =
    characterSlotLimit === null || activeCharacterCount < characterSlotLimit;

  const [isMaxCharacterMessageOpen, setIsMaxCharacterMessageOpen] =
    useState(false);

  const user = useAuth();
  const signedIn = !!user;

  const signupLink = `/create-account?returnUrl=${window.location.pathname}`;

  const [
    claimCharacter,
    isClaimingCharacter,
    isFinishedClaimingCharacter,
    newCharacterId,
    campaignId,
  ] = useClaimCharacter({
    campaignJoinCode,
    isAssigned,
  });

  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };

  const handleClaim = () => {
    if (hasOpenSlot) {
      claimCharacter();
    } else {
      setIsMaxCharacterMessageOpen(true);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isFinishedClaimingCharacter) {
      setIsOpen(false);
    }
  }, [isFinishedClaimingCharacter]);

  return (
    <>
      <Button
        variant="contained"
        onClick={open}
        sx={{
          color: "white",
          fontSize: "12px",
          lineHeight: "15px",
          width: "fit-content",
          padding: "12px 32px",
          backgroundColor: "#C50009",
          borderRadius: "8px",
          boxShadow: "none",
          "&:hover": { backgroundColor: "#A7080B", boxShadow: "none" },
        }}
      >
        <VideocamIcon sx={{ m: "-5px 0" }} />
        &nbsp;Watch Tour
      </Button>
      <Dialog
        onClose={close}
        open={isOpen}
        fullWidth={true}
        maxWidth={"sm"}
        sx={{
          " .MuiPaper-root": {
            backgroundColor: isDarkMode ? "#374045" : "white",
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: "24px 32px 8px",
            fontSize: "18px",
            fontWeight: 700,
            color: isDarkMode ? "white" : "#12181C",
          }}
        >
          D&D Beyond Character Sheet Tour
          <IconButton
            aria-label="close"
            onClick={close}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: isDarkMode
                ? "rbga(255, 255, 255, 0.54)"
                : "rgba(0, 0, 0, 0.54)",
              "&:hover": "#ECEDEE",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ m: 0, p: "0 32px 24px" }}>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 0,
                paddingBottom: "56.25%",
              }}
            >
              <iframe
                src="https://www.youtube-nocookie.com/embed/ChYPIdCrBdE"
                title="D&D Beyond Sheet Tour"
                style={{
                  border: 0,
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "gray",
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </div>
            <DialogContentText
              sx={{
                color: isDarkMode ? "white" : "#12181C",
                " a": {
                  color: "#3298ED",
                  textDecoration: "none",
                },
                " a:hover": { color: "#53ADF0" },
              }}
            >
              For a complete guide to getting your game started, see{" "}
              <a href="https://www.dndbeyond.com/posts/754-how-to-play-dungeons-dragons-using-d-d-beyond">
                How to Play Dungeons & Dragons Using D&D Beyond
              </a>
              .
            </DialogContentText>
            <Button
              variant="contained"
              disabled={isClaimingCharacter}
              {...(!signedIn && { href: signupLink })}
              {...(signedIn && { onClick: handleClaim })}
              sx={{
                color: "white",
                fontSize: "12px",
                lineHeight: "15px",
                width: "fit-content",
                padding: "12px 32px",
                m: "auto",
                backgroundColor: "#3298ED",
                borderRadius: "8px",
                boxShadow: "none",
                "&:hover": { backgroundColor: "#53ADF0", boxShadow: "none" },
              }}
            >
              Claim Character
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <MaxCharactersDialog
        open={isMaxCharacterMessageOpen}
        onClose={() => setIsMaxCharacterMessageOpen(false)}
        useMyCharactersLink
      />
      {isFinishedClaimingCharacter && !!newCharacterId && (
        <ClaimConfirmationDialog
          characterId={newCharacterId}
          campaignId={campaignId}
        />
      )}
    </>
  );
};

export default WatchTourDialog;
