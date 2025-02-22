import MuiCheckbox from "@mui/material/Checkbox";

export const Checkbox = ({ onChange, checked, name, disabled = false }) => {
  return (
    <MuiCheckbox
      onChange={onChange}
      checked={checked}
      name={name}
      sx={{
        color: disabled ? "text.secondary" : "primary.light",
        "&.Mui-checked": {
          color: "secondary.main",
        },
      }}
    />
  );
};
