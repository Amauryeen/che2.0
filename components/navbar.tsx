'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import FolderIcon from '@mui/icons-material/Folder';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const drawerWidth = 230;

interface Props {
  children: React.ReactNode;
  email: string;
  name: string;
  deployment: string | undefined;
}

export default function ResponsiveDrawer(props: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          padding: '0.1rem 1.5rem',
        }}
      >
        <Image src="/favicon.ico" alt="Logo CHE2" width={52} height={52} />
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ textAlign: 'right', flexGrow: 1 }}
        >
          CHE2.0
        </Typography>
      </Box>
      <List>
        <ListItem disablePadding>
          <Box sx={{ width: '100%' }}>
            <Divider />
            <Link href="/">
              <ListItemButton>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Accueil" />
              </ListItemButton>
            </Link>
          </Box>
        </ListItem>
        <ListItem disablePadding>
          <Box sx={{ width: '100%' }}>
            <Link href="/install">
              <ListItemButton>
                <ListItemIcon>
                  <InstallDesktopIcon />
                </ListItemIcon>
                <ListItemText primary="Application" />
              </ListItemButton>
            </Link>
          </Box>
        </ListItem>
        <ListItem disablePadding>
          <Box sx={{ width: '100%' }}>
            <Divider />
            <Link href="/documents">
              <ListItemButton>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="Documents" />
              </ListItemButton>
            </Link>
          </Box>
        </ListItem>
        <ListItem disablePadding>
          <Box sx={{ width: '100%' }}>
            <Link href="/meetings">
              <ListItemButton>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Réunions" />
              </ListItemButton>
            </Link>
          </Box>
        </ListItem>
        <ListItem disablePadding>
          <Box sx={{ width: '100%' }}>
            <Link href="/votes">
              <ListItemButton>
                <ListItemIcon>
                  <HowToVoteIcon />
                </ListItemIcon>
                <ListItemText primary="Votes" />
              </ListItemButton>
            </Link>
          </Box>
        </ListItem>
        <ListItem disablePadding>
          <Box sx={{ width: '100%' }}>
            <Link href="/users">
              <ListItemButton>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Utilisateurs" />
              </ListItemButton>
            </Link>
          </Box>
        </ListItem>
        <ListItem disablePadding>
          <Box sx={{ width: '100%' }}>
            <Divider />
            <Link href="/signout">
              <ListItemButton>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Déconnexion" />
              </ListItemButton>
            </Link>
            <Divider />
          </Box>
        </ListItem>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ padding: '1rem', textAlign: 'center' }}>
        <Typography variant="body2" noWrap component="div">
          <Link href="https://github.com/Amauryeen" target={'_blank'}>
            © 2024 Amaury Grotard
          </Link>
        </Typography>
        <Typography variant="body2" noWrap component="div" fontSize={9}>
          {props.deployment ? `${props.deployment}` : 'Version inconnue'}
        </Typography>
      </Box>
    </div>
  );

  const router = useRouter();

  return (
    <Box>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2 }}
            onClick={() => {
              router.refresh();
              toast.success('La page a été rechargée.');
            }}
          >
            <RefreshIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
            <Typography variant="body2" noWrap component="div">
              {props.name}
            </Typography>
            <Typography variant="caption" noWrap component="div">
              {props.email}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}
