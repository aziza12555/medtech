import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import Profile from "./navigate/profile";
import { ToggleButton } from "./sidebartoggler";

function Navbar() {
  return (
    <div>
      <AppBar
        sx={{
          width: "100%",
          bgcolor: "#769382",
          color: "#fff",
          transition: "width 0.3s, margin-left 0.3s",
          position: "static",
        }}
      >
        <Toolbar>
          <ToggleButton />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            MedTech Klinika
          </Typography>
          <Profile />
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
