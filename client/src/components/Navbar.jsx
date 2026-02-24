import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Container,
  Tooltip,
  Divider,
  ListItemIcon
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Logout as LogoutIcon,
  Person as UserIcon,
  Dashboard as DashboardIcon,
  Explore as ExploreIcon,
  Subscriptions as PlansIcon
} from '@mui/icons-material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleCloseUserMenu();
    navigate('/profile');
  };

  const handleAdmin = () => {
    handleCloseUserMenu();
    navigate('/admin');
  };

  return (
    <AppBar position="sticky" sx={{ borderRadius: 0, mb: 4, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              mr: 4
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, primary.main, secondary.main)',
                p: 0.5,
                borderRadius: 2,
                display: 'flex',
                mr: 1
              }}
            >
              <PlayIcon sx={{ color: 'white' }} />
            </Box>
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.5px',
                display: { xs: 'none', md: 'flex' },
              }}
            >
              Stream<Box component="span" sx={{ color: 'primary.main' }}>Vault</Box>
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              to="/"
              startIcon={<ExploreIcon />}
              sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
            >
              Explore
            </Button>
            <Button
              component={Link}
              to="/subscriptions"
              startIcon={<PlansIcon />}
              sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
            >
              Plans
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Button
                    variant="outlined"
                    startIcon={<DashboardIcon />}
                    onClick={handleAdmin}
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  >
                    Admin
                  </Button>
                )}
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5, border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Avatar
                      alt={user.name}
                      sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    sx: {
                      width: 200,
                      mt: 1.5,
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleProfile}>
                    <ListItemIcon><UserIcon fontSize="small" /></ListItemIcon>
                    Profile
                  </MenuItem>
                  {user.role === 'admin' && (
                    <MenuItem onClick={handleAdmin} sx={{ display: { xs: 'flex', sm: 'none' } }}>
                      <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                      Admin
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button component={Link} to="/login" variant="outlined">
                  Login
                </Button>
                <Button component={Link} to="/register" variant="contained">
                  Join Now
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
