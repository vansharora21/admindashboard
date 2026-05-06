'use client';

import React from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Divider,
  alpha,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import Dashboard from '@mui/icons-material/Dashboard';
import People from '@mui/icons-material/People';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import Settings from '@mui/icons-material/Settings';
import School from '@mui/icons-material/School';
import Close from '@mui/icons-material/Close';
import { usePathname, useRouter } from 'next/navigation';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard fontSize="small" />, path: '/dashboard' },
  { text: 'User Management', icon: <People fontSize="small" />, path: '/dashboard/users' },
  { text: 'Product Catalog', icon: <ShoppingCart fontSize="small" />, path: '/dashboard/products' },
];

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export default function Sidebar({ mobileOpen, handleDrawerToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawer = (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #1a237e 0%, #0d113d 100%)',
        color: 'white',
        overflow: 'hidden', // Remove scroll
        '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for Chrome/Safari
        msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
        scrollbarWidth: 'none', // Hide scrollbar for Firefox
      }}
    >
      <Box sx={{ p: 2.5, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <School sx={{ fontSize: 20, color: '#fff', opacity: 0.9 }} />
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 900, 
              letterSpacing: '0.5px', 
              color: '#fff', 
              fontSize: '0.85rem',
              textTransform: 'uppercase'
            }}
          >
            Study Abroad
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small" sx={{ color: 'white' }}>
            <Close fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, px: 2 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            px: 1.5, 
            opacity: 0.6, 
            fontWeight: 800, 
            color: '#fff', 
            letterSpacing: '1px', 
            mb: 1.5, 
            display: 'block', 
            fontSize: '0.65rem',
            textTransform: 'uppercase'
          }}
        >
          General
        </Typography>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  onClick={() => {
                    router.push(item.path);
                    if (isMobile) handleDrawerToggle();
                  }}
                  sx={{ 
                    borderRadius: '10px',
                    py: 1,
                    bgcolor: isActive ? alpha('#fff', 0.1) : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? alpha('#fff', 0.15) : 'transparent',
                    '&:hover': { 
                      bgcolor: alpha('#fff', 0.05),
                      transform: 'translateX(2px)'
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#fff' : alpha('#fff', 0.6), minWidth: 32 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    slotProps={{ 
                      primary: { 
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.8rem',
                        color: isActive ? '#fff' : alpha('#fff', 0.8)
                      } 
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 3, borderColor: alpha('#fff', 0.1), mx: 1.5 }} />

        <Typography 
          variant="caption" 
          sx={{ 
            px: 1.5, 
            opacity: 0.6, 
            fontWeight: 800, 
            color: '#fff', 
            letterSpacing: '1px', 
            mb: 1.5, 
            display: 'block', 
            fontSize: '0.65rem',
            textTransform: 'uppercase'
          }}
        >
          System
        </Typography>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => {
                router.push('/dashboard/settings');
                if (isMobile) handleDrawerToggle();
              }}
              sx={{ 
                borderRadius: '10px',
                py: 1,
                bgcolor: pathname === '/dashboard/settings' ? alpha('#fff', 0.1) : 'transparent',
                border: '1px solid',
                borderColor: pathname === '/dashboard/settings' ? alpha('#fff', 0.15) : 'transparent',
                '&:hover': { bgcolor: alpha('#fff', 0.05), transform: 'translateX(2px)' } 
              }}
            >
              <ListItemIcon sx={{ color: pathname === '/dashboard/settings' ? '#fff' : alpha('#fff', 0.6), minWidth: 32 }}>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Settings" 
                slotProps={{ 
                  primary: { 
                    fontWeight: pathname === '/dashboard/settings' ? 700 : 500,
                    fontSize: '0.8rem',
                    color: pathname === '/dashboard/settings' ? '#fff' : alpha('#fff', 0.8)
                  } 
                }} 
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Footer Branding instead of Status */}
      <Box sx={{ p: 3, mt: 'auto', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: alpha('#fff', 0.3), fontWeight: 600, fontSize: '0.65rem' }}>
          v2.4.0 &copy; 2026 Admin Portal
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            border: 'none',
            bgcolor: 'transparent'
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            border: 'none',
            bgcolor: 'transparent'
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
