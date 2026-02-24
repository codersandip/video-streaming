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
  ListItemIcon,
  alpha,
  useTheme
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
  const theme = useTheme();
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
    <AppBar
      position="sticky"
      sx={{
        borderRadius: 0,
        mb: 0,
        bgcolor: alpha(theme.palette.background.default, 0.7),
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
        zIndex: theme.zIndex.drawer + 1
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 80 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              mr: 6
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                p: 0.8,
                borderRadius: 2.5,
                display: 'flex',
                mr: 1.5,
                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
              }}
            >
              <PlayIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography
              variant="h5"
              noWrap
              sx={{
                fontWeight: 900,
                letterSpacing: '-1px',
                display: { xs: 'none', md: 'flex' },
                fontSize: '1.6rem'
              }}
            >
              Stream<Box component="span" sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Vault</Box>
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              to="/"
              startIcon={<ExploreIcon />}
              sx={{
                color: 'text.secondary',
                px: 2,
                borderRadius: 2.5,
                '&:hover': { color: 'text.primary', bgcolor: alpha('#fff', 0.05) }
              }}
            >
              Explore
            </Button>
            <Button
              component={Link}
              to="/subscriptions"
              startIcon={<PlansIcon />}
              sx={{
                color: 'text.secondary',
                px: 2,
                borderRadius: 2.5,
                '&:hover': { color: 'text.primary', bgcolor: alpha('#fff', 0.05) }
              }}
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
                    sx={{
                      display: { xs: 'none', sm: 'flex' },
                      borderRadius: 3,
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                      '&:hover': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }
                    }}
                  >
                    Control Center
                  </Button>
                )}
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{
                      p: 0.5,
                      border: '2px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: 'primary.main', transform: 'scale(1.05)' }
                    }}
                  >
                    <Avatar
                      alt={user.name}
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'primary.main',
                        fontWeight: 700,
                        fontSize: '1rem',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                      }}
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
                      width: 240,
                      mt: 1.5,
                      p: 1,
                      borderRadius: 4,
                      bgcolor: alpha(theme.palette.background.paper, 0.95),
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  </Box>
                  <Divider sx={{ my: 1, opacity: 0.5 }} />
                  <MenuItem onClick={handleProfile} sx={{ borderRadius: 2, py: 1.2 }}>
                    <ListItemIcon><UserIcon fontSize="small" /></ListItemIcon>
                    Your Profile
                  </MenuItem>
                  {user.role === 'admin' && (
                    <MenuItem onClick={handleAdmin} sx={{ borderRadius: 2, py: 1.2, display: { xs: 'flex', sm: 'none' } }}>
                      <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                      Control Center
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout} sx={{ borderRadius: 2, py: 1.2, color: 'error.main' }}>
                    <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="text"
                  sx={{ color: 'text.primary', fontWeight: 700 }}
                >
                  Log In
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)'
                  }}
                >
                  Get Started
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
