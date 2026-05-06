'use client';

import React from 'react';
import { 
  AppBar, 
  Avatar, 
  Box, 
  IconButton, 
  Toolbar, 
  Typography, 
  Badge,
  Tooltip,
  TextField,
  InputAdornment,
  alpha,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider as MuiDivider,
  Chip
} from '@mui/material';
import NotificationsNone from '@mui/icons-material/NotificationsNone';
import Search from '@mui/icons-material/Search';
import Help from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import Logout from '@mui/icons-material/Logout';
import Person from '@mui/icons-material/Person';
import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const drawerWidth = 260;

interface NavbarProps {
  handleDrawerToggle: () => void;
}

export default function Navbar({ handleDrawerToggle }: NavbarProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifyAnchorEl, setNotifyAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotifyOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotifyAnchorEl(event.currentTarget);
  };

  const handleNotifyClose = () => {
    setNotifyAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    logout();
    await signOut({ callbackUrl: '/login' });
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      router.push(`/dashboard/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const notifications = [
    { id: 1, title: 'New User Registered', time: '5 min ago', type: 'info', read: false },
    { id: 2, title: 'Stock Alert: iPhone 14', time: '1 hour ago', type: 'error', read: false },
    { id: 3, title: 'System Update Complete', time: '3 hours ago', type: 'success', read: true },
    { id: 4, title: 'New Order Received', time: 'Yesterday', type: 'warning', read: true },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: alpha('#fff', 0.8),
        backdropFilter: 'blur(8px)',
        color: 'text.primary',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: alpha('#e2e8f0', 0.6),
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 800, 
              fontSize: '1.25rem', 
              display: { xs: 'none', sm: 'block' },
              color: 'primary.main',
              letterSpacing: '-0.5px'
            }}
          >
            Global Dashboard
          </Typography>
        </Box>

        {/* Centered Search Bar */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', px: 4 }}>
            <TextField
              placeholder="Quick search products..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              sx={{ 
                width: '100%', 
                maxWidth: 400,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: alpha('#f1f5f9', 0.5),
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1px' },
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Notifications">
            <IconButton onClick={handleNotifyOpen} sx={{ color: 'text.secondary' }}>
              <Badge badgeContent={2} color="error" slotProps={{ badge: { sx: { fontSize: '10px', height: 16, minWidth: 16 } } }}>
                <NotificationsNone />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notifyAnchorEl}
            open={Boolean(notifyAnchorEl)}
            onClose={handleNotifyClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: '16px',
                width: 320,
                maxHeight: 480,
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                border: '1px solid',
                borderColor: alpha('#e2e8f0', 0.6),
                p: 0
              }
            }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={800}>Notifications</Typography>
              <Chip label="2 New" size="small" color="primary" sx={{ height: 20, fontSize: '10px', fontWeight: 800 }} />
            </Box>
            <Box sx={{ py: 1 }}>
              {notifications.map((notif) => (
                <MenuItem key={notif.id} onClick={handleNotifyClose} sx={{ px: 2, py: 1.5, gap: 2, borderBottom: '1px solid', borderColor: alpha('#f1f5f9', 1), '&:last-child': { borderBottom: 0 } }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: notif.read ? 'transparent' : 'primary.main', flexShrink: 0 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight={notif.read ? 500 : 700} sx={{ lineHeight: 1.3 }}>{notif.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{notif.time}</Typography>
                  </Box>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: notif.type === 'error' ? 'error.main' : notif.type === 'success' ? 'success.main' : 'info.main' }} />
                </MenuItem>
              ))}
            </Box>
            <Box sx={{ p: 1.5, textAlign: 'center', bgcolor: alpha('#f8fafc', 0.8) }}>
              <Typography variant="caption" color="primary.main" fontWeight={800} sx={{ cursor: 'pointer' }}>VIEW ALL NOTIFICATIONS</Typography>
            </Box>
          </Menu>
          
          <Box 
            onClick={handleMenuOpen}
            sx={{ 
              ml: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              p: 0.5, 
              pr: 2, 
              borderRadius: '20px', 
              bgcolor: alpha('#f1f5f9', 0.8), 
              border: '1px solid', 
              borderColor: alpha('#e2e8f0', 0.6),
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { bgcolor: alpha('#f1f5f9', 1), transform: 'translateY(-1px)' }
            }}
          >
            <Avatar 
              src={user?.image} 
              alt={user?.firstName}
              sx={{ 
                width: 32, 
                height: 32, 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1 }}>{user?.firstName} {user?.lastName}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px', fontWeight: 600 }}>ADMINISTRATOR</Typography>
            </Box>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: '12px',
                minWidth: 180,
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                border: '1px solid',
                borderColor: alpha('#e2e8f0', 0.6)
              }
            }}
          >
            <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 'auto !important' }}><Person fontSize="small" /></ListItemIcon>
              <Typography variant="body2" fontWeight={600}>My Profile</Typography>
            </MenuItem>
            <MuiDivider />
            <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.5, color: 'error.main' }}>
              <ListItemIcon sx={{ minWidth: 'auto !important', color: 'inherit' }}><Logout fontSize="small" /></ListItemIcon>
              <Typography variant="body2" fontWeight={600}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
