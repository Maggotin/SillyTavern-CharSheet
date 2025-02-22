import SettingsIcon from "@mui/icons-material/Settings";
import Button from "@mui/material/Button";

import { useSidebar } from "~/contexts/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

interface Props {
  context: string;
  isReadonly: boolean;
}

const SettingsButton: React.FC<Props> = ({ context, isReadonly }) => {
  const {
    pane: { paneHistoryPush },
  } = useSidebar();
  return !isReadonly ? (
    <Button
      onClick={(evt) => {
        paneHistoryPush(PaneComponentEnum.SETTINGS, {
          context,
        });
      }}
      variant="text"
      startIcon={<SettingsIcon />}
    >
      Settings
    </Button>
  ) : null;
};

export default SettingsButton;
