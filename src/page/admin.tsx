import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { FaUserDoctor } from "react-icons/fa6";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { FaUserTie } from "react-icons/fa";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

export default function MedTechDrawer(props: Props) {
  const { window } = props;
  const [drawerOpen, setDrawerOpen] = React.useState(true); // Sidebar default ochiq

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon /> },
    { text: 'Admin Page', icon: <MenuIcon /> },
    { text: 'Patients', icon: <PeopleIcon /> },
    { text: 'Doktors', icon: <FaUserDoctor /> },
    { text: 'Receptions', icon: <FaUserTie /> },
    { text: 'Settings', icon: <SettingsIcon /> },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map(({ text, icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
          ml: drawerOpen ? `${drawerWidth}px` : 0,
          bgcolor: '#769382',
          color: '#fff',
          transition: 'width 0.3s, margin-left 0.3s',
        }}
      >
        <Toolbar>
          {/* MenuIcon MedTech yozuvi yonida */}
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            MedTech Klinika
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Desktopda permanent drawer, mobilda temporary */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Temporary drawer (modal) mobil uchun */}
        <Drawer
          container={container}
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Permanent drawer desktop uchun */}
        <Drawer
          variant="persistent"
          open={drawerOpen}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              transition: 'width 0.3s',
              overflowX: 'hidden',
              ...(drawerOpen ? {} : { width: 0 }),
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '64px',
          width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
          transition: 'width 0.3s, margin-left 0.3s',
        }}
      >
        {/* Bu yerga asosiy kontent */}
      </Box>
    </Box>
  );
}
