import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  styled
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Security,
  DirectionsCar,
  Build,
  DeviceHub,
  Person,
  ChevronLeft,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import SecurityLogger from '../../services/logger';
import AppRoutes from '../../routes';

const drawerWidth = 240;

const BatLogo = styled('img')({
  height: 40,
  marginRight: 16,
});

const Root = styled('div')({
  display: 'flex',
  minHeight: '100vh',
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
  },
}));

function Layout() {
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      // Registrar log de logout antes de fazer o logout
      await SecurityLogger.logLogout('127.0.0.1'); // TODO: Pegar IP real
      
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Erro ao registrar log de logout:', error);
      // Mesmo com erro no log, continuar com o logout
      dispatch(logout());
      navigate('/login');
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Segurança', icon: <Security />, path: '/security' },
    { text: 'Veículos', icon: <DirectionsCar />, path: '/vehicles' },
    { text: 'Equipamentos', icon: <Build />, path: '/equipment' },
    { text: 'Dispositivos', icon: <DeviceHub />, path: '/devices' },
  ];

  return (
    <Root>
      <CssBaseline />
      <StyledAppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ marginRight: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <BatLogo
              src="/logo_batman.png"
              alt="Batman Logo"
            />
            <Typography variant="h6" noWrap component="div">
              Gabriel Dev - Wayne Industries
            </Typography>
          </Box>
          <Box>
            <IconButton
              onClick={handleMenuOpen}
              size="large"
              edge="end"
              aria-label="conta do usuário"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <Person />
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                Perfil
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
                Sair
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </StyledAppBar>
      <StyledDrawer variant="permanent" open={open}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeft />
          </IconButton>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 193, 7, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 193, 7, 0.25)',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: open ? 1 : 0,
                  color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                }}
              />
            </ListItem>
          ))}
        </List>
      </StyledDrawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 10,
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <AppRoutes />
      </Box>
    </Root>
  );
}

export default Layout; 