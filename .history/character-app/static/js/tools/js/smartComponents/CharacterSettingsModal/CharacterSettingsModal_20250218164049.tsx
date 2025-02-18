import CloseIcon from "@mui/icons-material/Close";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import { useContext } from "react";

import { RuleDataUtils } from "../../rules-engine/es";

import { SourceCategoryDescription } from "~/constants";
import { useFeatureFlags } from "~/contexts/FeatureFlag";
import { generateCharacterPreferences } from "~/helpers/generateCharacterPreferences";
import PreferenceUpdateLocation from "~/tools/js/Shared/constants/PreferenceUpdateLocation";

import {
  CheckboxInfo,
  FormCheckBoxesField,
} from "../../Shared/components/common/FormCheckBoxesField";
import AbilitySummary from "../AbilitySummary";
import PrivacyTypeRadio from "../PrivacyTypeRadio";
import { UserPreferenceContext } from "../UserPreference";
import styles from "./styles.module.css";

interface CharacterSettingsModalProps {
  open: boolean;
  updateLocation: PreferenceUpdateLocation;
  handleClose: () => void;
}

const CharacterSettingsModal = ({
  open,
  updateLocation,
  handleClose,
}: CharacterSettingsModalProps) => {
  const {
    privacyType,
    isDarkModeEnabled,
    abilityScoreDisplayType,
    updatePreferences,
    ruleData,
    defaultEnabledSourceCategories,
    isHomebrewEnabled,
  } = useContext(UserPreferenceContext);

  const { featureFlags } = useFeatureFlags();

  const preferences = generateCharacterPreferences(featureFlags);

  const getTheme = (darkMode: boolean) => ({
    name: "DDB Red",
    backgroundColor: darkMode ? "#10161ADB" : "#FEFEFE",
    isDefault: true,
    themeColor: "#C53131",
    themeColorId: null,
    isDarkMode: darkMode || false,
  });

  const rollContext = {
    entityId: "52962664",
    entityType: "character",
    name: "Stor Hornraven",
    avatarUrl:
      "https://stg.dndbeyond.com/avatars/18589/680/1581111423-52962664.jpeg?width=150&height=150&fit=crop&quality=95&auto=webp",
  };

  const handleSourceCategoryChange = (
    sourceId: number,
    isActive: boolean
  ): void => {
    const newSourceCategories = {
      ...defaultEnabledSourceCategories,
      [sourceId]: isActive,
    };

    updatePreferences({
      privacyType,
      isDarkModeEnabled,
      abilityScoreDisplayType,
      updateLocation,
      defaultEnabledSourceCategories: newSourceCategories,
      isHomebrewEnabled,
    });
  };

  let sourceToggles: Array<CheckboxInfo> = [];
  let partneredSourceCheckboxes: Array<CheckboxInfo> = [];
  let allPartneredSources: Array<number> = [];

  if (ruleData) {
    const activeSourceCategories = Object.keys(defaultEnabledSourceCategories)
      .filter((key) => defaultEnabledSourceCategories[key])
      .map(Number);
    RuleDataUtils.getSourceCategories(ruleData).forEach((sourceCategory) => {
      if (!sourceCategory.isToggleable) {
        return null;
      }

      const checkbox: CheckboxInfo = {
        label: `${sourceCategory.name}`,
        initiallyEnabled: activeSourceCategories.includes(sourceCategory.id),
        onChange: handleSourceCategoryChange.bind(this, sourceCategory.id),
        sortOrder: sourceCategory.sortOrder,
        description: sourceCategory.description ?? "",
      };

      if (sourceCategory.isPartneredContent) {
        delete checkbox.description;
        partneredSourceCheckboxes.push(checkbox);
        allPartneredSources.push(sourceCategory.id);
      } else {
        sourceToggles.push(checkbox);
      }
    });

    //Add Homebrew to sources for display
    sourceToggles.push({
      label: "Homebrew",
      initiallyEnabled: isHomebrewEnabled,
      description: SourceCategoryDescription.homebrew,
      onChange: (isActive: boolean) => {
        updatePreferences({
          privacyType,
          isDarkModeEnabled,
          abilityScoreDisplayType,
          updateLocation,
          defaultEnabledSourceCategories,
          isHomebrewEnabled: isActive,
        });
      },

      sortOrder: 0,
    });
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className={clsx(styles.modal)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper className={clsx(styles.content)}>
        <Stack
          direction="row"
          alignItems="center"
          style={{ padding: 16, borderBottom: "1px solid #A2ACB2" }}
        >
          <SettingsOutlinedIcon
            style={{
              color: "rgba(0,0,0,0.54)",
              marginRight: 5,
              height: 22,
              width: 22,
            }}
          />
          <label className={clsx(styles.modalTitle)}>
            Default Character Settings
          </label>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            size="small"
            style={{
              marginLeft: "auto",
              color: "rgba(0,0,0,0.54)",
            }}
          >
            <CloseIcon style={{ width: 20 }} />
          </IconButton>
        </Stack>
        <Box style={{ padding: 16 }}>
          <label className={clsx(styles.modalDescription)}>
            These settings apply defaults to all new Characters you create. Any
            settings you apply to a specific Character will override the choices
            you make here.
          </label>

          <>
            <FormCheckBoxesField
              heading="Sources"
              description={SourceCategoryDescription.official}
              checkboxes={sourceToggles}
              showAccordion={false}
            />

            <FormCheckBoxesField
              heading="Partnered Content"
              description={SourceCategoryDescription.partnered}
              checkboxes={partneredSourceCheckboxes}
              checkUncheckAllEnabled={true}
              showAccordion={false}
              accordionHeading="Choose Partners"
              allText="All"
            />
          </>

          <PrivacyTypeRadio
            color="info"
            initialValue={privacyType}
            handleChange={(e) =>
              updatePreferences({
                isDarkModeEnabled,
                abilityScoreDisplayType,
                updateLocation,
                privacyType: parseInt(e.target.value),
                defaultEnabledSourceCategories,
                isHomebrewEnabled,
              })
            }
          />
          <p
            style={{
              color: "#000",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: -0.5,
              textTransform: "uppercase",
              margin: "19px 0 0",
              padding: "10px 0",
            }}
          >
            Display
          </p>
          <Grid container>
            <Grid item xs={12} md={8}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="info"
                      checked={isDarkModeEnabled}
                      onChange={(e) =>
                        updatePreferences({
                          privacyType,
                          abilityScoreDisplayType,
                          updateLocation,
                          isDarkModeEnabled: e.target.checked,
                          defaultEnabledSourceCategories,
                          isHomebrewEnabled,
                        })
                      }
                      style={{ paddingTop: 0 }}
                    />
                  }
                  label={
                    <>
                      <p style={{ margin: 0, fontSize: 14 }}>Underdark Mode</p>
                      <Typography
                        sx={{
                          color: "grey.500",
                          margin: 0,
                          fontSize: 12,
                          lineHeight: 1,
                        }}
                      >
                        Activate dark mode for Character Sheets.
                      </Typography>
                    </>
                  }
                  sx={{ display: "flex", alignItems: "flex-start" }}
                />
              </FormControl>
              <FormControl style={{ marginTop: 24 }}>
                <FormLabel>
                  <p style={{ margin: 0, fontSize: 14, color: "#000" }}>
                    Ability Scores / Modifiers
                  </p>
                  <Typography
                    sx={{
                      color: "grey.500",
                      margin: "0 0 16px",
                      fontSize: 12,
                      lineHeight: 1,
                    }}
                  >
                    Reverse the display of Ability Scores and Modifiers.{" "}
                  </Typography>
                </FormLabel>
                <FormControl>
                  <ToggleButtonGroup
                    color="info"
                    value={abilityScoreDisplayType}
                    exclusive
                    onChange={(e, value) => {
                      if (value !== null)
                        updatePreferences({
                          privacyType,
                          isDarkModeEnabled,
                          updateLocation,
                          abilityScoreDisplayType: value,
                          defaultEnabledSourceCategories,
                          isHomebrewEnabled,
                        });
                    }}
                    aria-label="Platform"
                  >
                    <ToggleButton value={2}>Modifiers Top</ToggleButton>
                    <ToggleButton value={1}>Scores Top</ToggleButton>
                  </ToggleButtonGroup>
                </FormControl>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-end"
            >
              <Box
                sx={{
                  backgroundColor: "grey.50",
                  border: "1px solid transparent",
                  borderColor: "grey.200",
                  borderRadius: 1,
                  display: "inline-block",
                  py: 1,
                  px: 2,
                }}
              >
                <p style={{ textAlign: "center", marginBottom: 4 }}>Preview</p>
                <AbilitySummary
                  ability={{ name: "Strength", score: 14, modifier: 2 }}
                  preferences={{
                    ...preferences,
                    abilityScoreDisplayType: abilityScoreDisplayType,
                  }}
                  theme={getTheme(isDarkModeEnabled || false)}
                  onClick={(e) => e.getBaseScore()}
                  rollContext={rollContext}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Modal>
  );
};

export default CharacterSettingsModal;
