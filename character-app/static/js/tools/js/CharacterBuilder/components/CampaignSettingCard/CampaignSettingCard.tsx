import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import bg from "~/images/campaign-setting-background.jpg";
import dani from "~/images/dani.png";

interface Props {
  id: number;
  bgImage: string;
  fgImage: string;
  name: string;
  description: string;
  selected: boolean;
  sources: Array<string>;
  handleClick: (id: number) => void;
}

const chipStyles = (selected: boolean) => ({
  borderColor: selected ? "primary.contrastText" : "primary.light",
  background: "rgba(35,34,34,0.5)",
  borderRadius: "8px",
  "*": { color: selected ? "primary.contrastText" : "primary.light" },
});

const selectedChipStyles = {
  ...chipStyles(true),
  position: "absolute",
  top: 20,
  left: 20,
};

export default ({
  id,
  bgImage = bg,
  fgImage = dani,
  handleClick,
  name,
  description,
  selected,
  sources,
}: Props) => (
  <ButtonBase
    onClick={() => handleClick(id)}
    sx={{
      position: "relative",
      width: "100%",
      display: "block",
      mt: [3, 12, 3],
    }}
  >
    <Card
      sx={{
        border: selected ? "1px solid #ffffff" : "1px solid transparent",
        borderRadius: 3,
        background: "#232222",
        textAlign: "left",
        color: "primary.contrastText",
      }}
    >
      <Box
        sx={{
          position: "relative",
          "&:after": {
            content: '""',
            display: "block",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            background:
              "linear-gradient(transparent 20%, rgba(35,34,34,0.6) 90%, #232222)",
            zIndex: 3,
          },
        }}
      >
        {(selected && (
          <Chip
            variant="outlined"
            size="small"
            label="Selected"
            icon={<RadioButtonCheckedIcon />}
            sx={selectedChipStyles}
          />
        )) || (
          <Chip
            variant="outlined"
            size="small"
            label="Select"
            icon={<RadioButtonUncheckedIcon />}
            sx={selectedChipStyles}
          />
        )}
        <CardMedia component="img" height="140" image={bgImage} alt={name} />
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h3" component="div">
          {name}
        </Typography>
        <Typography variant="body2">{description}</Typography>
        <Stack
          direction="row"
          sx={{
            mt: 3,
            ".MuiTypography-root": { m: "2px" },
            ".MuiChip-root": { m: "2px" },
          }}
        >
          <Typography
            sx={{ fontSize: 13, textTransform: "uppercase", opacity: 0.6 }}
          >
            Sources:
          </Typography>
          <Box>
            {sources.slice(0, 6).map((s) => (
              <Chip
                label={s}
                key={s}
                variant="outlined"
                size="small"
                sx={chipStyles(selected)}
              />
            ))}
          </Box>
        </Stack>
      </CardContent>
    </Card>
    <Box
      component="img"
      src={fgImage}
      sx={{
        width: [300, 400, 300],
        position: "absolute",
        bottom: "calc(100% - 140px)",
        right: 1,
      }}
    />
  </ButtonBase>
);
