import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useSelector } from "react-redux";

import { MaxCharactersDialog } from "~/components/MaxCharactersDialog";
import { useAuth } from "~/contexts/Authentication";
import { useClaimCharacter } from "~/hooks/useClaimCharacter";
import backgroundImage from "~/images/claim.png";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";

import {
  DESKTOP_COMPONENT_START_WIDTH,
  TABLET_COMPONENT_START_WIDTH,
} from "../../config";
import ClaimConfirmationDialog from "../WatchTourDialog/ClaimConfirmationDialog";

const renderButtonContent = (signedIn: boolean) => (
  <Box sx={{ display: "flex", justifyContent: "center", marginLeft: "10px" }}>
    {!signedIn && (
      <Typography
        component="span"
        sx={{
          display: "flex",
          alignItems: "center",
          marginRight: "5px",
          textTransform: "none",
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "16px",
        }}
      >
        Create Account to
      </Typography>
    )}
    <Typography
      component="span"
      sx={{
        display: "flex",
        alignItems: "center",
        textTransform: "none",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "16px",
      }}
    >
      Claim Character
    </Typography>
    <ChevronRightIcon />
  </Box>
);

// z-index of the sidebar controls
const zIndex = 60002;

const createAccountLink = `/create-account?returnUrl=${window.location.pathname}`;

const ClaimPremadeButton: React.FC = () => {
  const params = new URLSearchParams(globalThis.location.search);
  const campaignJoinCode = params.get("campaignJoinCode");
  const isAssigned = params.get("isAssigned") === "false" ? false : true;

  const [isMaxCharacterMessageOpen, setIsMaxCharacterMessageOpen] =
    useState(false);

  const envDimensions = useSelector(appEnvSelectors.getDimensions);

  const { characterSlotLimit, activeCharacterCount } = useSelector(
    appEnvSelectors.getCharacterSlots
  );
  // Character slot limit is null for admin accounts
  const hasOpenSlot =
    characterSlotLimit === null || activeCharacterCount < characterSlotLimit;

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

  const user = useAuth();
  const signedIn = !!user;

  const handleClaimButtonClick = () => {
    hasOpenSlot ? claimCharacter() : setIsMaxCharacterMessageOpen(true);
  };

  return (
    <>
      {envDimensions.window.width >= TABLET_COMPONENT_START_WIDTH ? (
        <Card
          className="claimPremade-button"
          hidden={isFinishedClaimingCharacter && !!newCharacterId}
          sx={{
            zIndex,
            position: "fixed",
            right: 30,
            bottom:
              envDimensions.window.width >= DESKTOP_COMPONENT_START_WIDTH
                ? 30
                : 70,
            width: 300,
            background: "#551710",
            borderRadius: "8px",
            overflow: "visible",
            boxShadow:
              "0px 57px 23px rgba(0, 0, 0, 0.01), 0px 32px 19px rgba(0, 0, 0, 0.05), 0px 14px 14px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.09), 0px 0px 0px rgba(0, 0, 0, 0.09)",
            "&:hover": {
              "& .claimPremade-buttonContent": {
                background: "#F5F3EE",
                boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.25)",
              },
            },
          }}
        >
          <CardActionArea
            sx={{ textAlign: "center" }}
            {...(!signedIn && { href: createAccountLink })}
            onClick={signedIn ? handleClaimButtonClick : undefined}
            disabled={isClaimingCharacter}
          >
            <Box
              component="img"
              src={backgroundImage}
              sx={{ position: "relative", top: -20, width: 244, height: 144 }}
            />
            <CardActions
              className="claimPremade-buttonContent"
              sx={{
                justifyContent: "center",
                height: 48,
                color: "#000000",
                background: "#FFFFFF",

                borderRadius: "0 0 8px 8px",
              }}
            >
              {renderButtonContent(signedIn)}
            </CardActions>
          </CardActionArea>
        </Card>
      ) : (
        <Button
          variant="contained"
          className="claimPremade-button"
          {...(!signedIn && { href: createAccountLink })}
          sx={{
            display:
              isFinishedClaimingCharacter && !!newCharacterId
                ? "none"
                : "inline-flex",
            zIndex,
            position: "fixed",
            left: "50%",
            bottom: 70,
            width: 300,
            height: "50px",
            marginLeft: "-150px",
            color: "#000000",
            backgroundColor: "#FFFFFF",
            boxShadow:
              "0px 57px 23px rgba(0, 0, 0, 0.01), 0px 32px 19px rgba(0, 0, 0, 0.05), 0px 14px 14px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.09), 0px 0px 0px rgba(0, 0, 0, 0.09)",
            "&:hover": {
              backgroundColor: "#F5F3EE",
              boxShadow:
                "0px 57px 23px rgba(0, 0, 0, 0.01), 0px 32px 19px rgba(0, 0, 0, 0.05), 0px 14px 14px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.09), 0px 0px 0px rgba(0, 0, 0, 0.09)",
            },
            "&.Mui-disabled": {
              backgroundColor: "#FFFFFF",
            },
          }}
          onClick={signedIn ? handleClaimButtonClick : undefined}
          disabled={isClaimingCharacter}
        >
          {renderButtonContent(signedIn)}
        </Button>
      )}
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

export default ClaimPremadeButton;
