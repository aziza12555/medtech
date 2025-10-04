import { IconButton } from "@mui/material";
import { useSidebarStore } from "../store/sidebar.store";
import MenuIcon from "@mui/icons-material/Menu";

export const ToggleButton = () => {
  const toggleSidebar = useSidebarStore((state) => state.toggle);

  return (
    <IconButton
      onClick={toggleSidebar}
      color="inherit"
      aria-label="toggle drawer"
      edge="start"
      sx={{ mr: 2 }}
    >
      <MenuIcon />
    </IconButton>
  );
};
