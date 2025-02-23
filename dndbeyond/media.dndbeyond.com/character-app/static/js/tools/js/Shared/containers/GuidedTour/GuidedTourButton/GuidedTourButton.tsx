import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { Button } from "@mui/material";
import { useTour } from "@reactour/tour";

export default () => {
  const { setIsOpen } = useTour();

  return (
    <Button
      className="ct-character-guided-tour"
      variant="contained"
      color="info"
      onClick={() => setIsOpen(true)}
      sx={{
        position: "fixed",
        zIndex: 9,
        p: 1,
        borderRadius: "100%",
        minWidth: 0,
        bottom: { xs: 100, md: 20 },
        right: 20,
      }}
    >
      <QuestionMarkIcon />
    </Button>
  );
};
