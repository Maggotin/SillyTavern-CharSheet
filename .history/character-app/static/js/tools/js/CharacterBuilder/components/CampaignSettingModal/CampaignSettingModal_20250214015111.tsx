import CloseIcon from "@mui/icons-material/Close";
import { Button, Container, Dialog, Grid, IconButton } from "@mui/material";

import { CampaignSettingContract } from "@dndbeyond/character-rules-engine";

import CampaignSettingCard from "../CampaignSettingCard";
import CampaignSettingScrollspy from "../CampaignSettingScrollspy";

interface CampaignSettingModalProps {
  campaignSettings: Array<CampaignSettingContract>;
  handleSettingChange: (id: number) => void;
  handleSelectionChange: (id: number) => void;
  selectedSettingId: number;
  preselectedSettingId: number | null;
  showModal: boolean;
  setShowModal: (value?: boolean) => void;
  sources: Array<{
    id: number;
    name: string;
    description: string;
    hasAccess: boolean;
  }>;
}

export const CampaignSettingModal = ({
  campaignSettings,
  handleSettingChange,
  handleSelectionChange,
  selectedSettingId,
  preselectedSettingId,
  showModal,
  setShowModal,
  sources,
}: CampaignSettingModalProps) => {
  // Use array of ids to get setting names
  const getSettingNames = (ids: number[]): string[] => {
    // Get all items in the same order
    const sorted = ids.sort((a, b) => a - b);
    const names: string[] = [];
    let coreRules = false;

    // If ids match Core rules, set flag to true so name can be changed
    if (
      sorted.includes(1) &&
      sorted.includes(2) &&
      sorted.includes(3) &&
      sorted.includes(5)
    )
      coreRules = true;

    for (let i = 0; i < sorted.length; i++) {
      // loop through ids
      for (let k = 0; k < sources.length; k++) {
        // loop through sources
        if (sorted[i] === sources[k].id) {
          names.push(sources[k].description);
        }
      }
    }

    if (coreRules) names.splice(0, 4, "Core Rules");

    return names;
  };

  const handleConfirm = () => {
    // If setting is unchanged, just close modal to keep any custom sources
    if (preselectedSettingId === selectedSettingId) {
      setShowModal(false);
    }
    // If new setting, update the selected setting and close modal
    else {
      handleSettingChange(preselectedSettingId || 1);
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    handleSelectionChange(selectedSettingId);

    // HACK: MUI Dialog is adding these due to how we are handling scrolling, but they are not being
    // removed until a transition finishes once the Dialog closes, which was causing the background
    // image to visibly shift. This causes the shift to happen immediately on close so it is imperceptible.
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("padding-right");
  };

  return (
    <Dialog
      open={showModal}
      onClose={handleClose}
      transitionDuration={{ enter: 0, exit: 0 }}
      scroll="body"
      maxWidth="xl"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        ".MuiBackdrop-root": {
          background: "rgba(35,34,34,0.95)",
          backdropFilter: "blur(3px)",
        },
        ".MuiDialog-paper": { background: "transparent", boxShadow: "none" },
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={{
          position: "fixed",
          top: 10,
          right: 10,
          color: "primary.contrastText",
          zIndex: 4,
          padding: { xs: 0, lg: 2 },
          opacity: 0.7,
          transition: "opacity 0.3s",
          "&:hover": { opacity: 1 },
        }}
      >
        <CloseIcon sx={{ fontSize: 32 }} />
      </IconButton>
      <CampaignSettingScrollspy
        parentSelector=".MuiDialog-scrollBody"
        childSelector=".campaign-setting__card"
        selectedClass="selected"
        preselectedSettingId={preselectedSettingId}
      >
        <Container sx={{ p: 4 }}>
          <Grid
            container
            columnSpacing={3}
            rowSpacing={10}
            sx={{ mt: "-30px" }}
          >
            {campaignSettings.map((setting, i) => (
              <Grid
                item
                xs={12}
                md={6}
                lg={4}
                key={setting.id}
                id={`setting-${setting.id}`}
                className={`campaign-setting__card ${
                  preselectedSettingId === setting.id ? "selected" : ""
                }`}
              >
                <CampaignSettingCard
                  id={setting.id}
                  bgImage={setting.backgroundImageUrl}
                  fgImage={setting.foregroundImageUrl}
                  name={setting.name}
                  description={setting.description}
                  selected={preselectedSettingId === setting.id}
                  sources={getSettingNames(
                    setting.availableSources.map((s) => s.sourceId)
                  )}
                  handleClick={handleSelectionChange}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </CampaignSettingScrollspy>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleConfirm}
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
          zIndex: 4,
          pl: 4,
          pr: 4,
        }}
      >
        Confirm &rarr;
      </Button>
    </Dialog>
  );
};
