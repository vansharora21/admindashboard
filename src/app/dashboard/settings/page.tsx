'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Switch, 
  FormControlLabel, 
  Divider, 
  Avatar, 
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  alpha,
  useTheme
} from '@mui/material';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Notifications from '@mui/icons-material/Notifications';
import Security from '@mui/icons-material/Security';
import Language from '@mui/icons-material/Language';
import Save from '@mui/icons-material/Save';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const theme = useTheme();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Breadcrumbs sx={{ mb: 1 }}>
          <MuiLink component={Link} href="/dashboard" underline="hover" color="inherit" sx={{ fontSize: '12px' }}>
            Dashboard
          </MuiLink>
          <Typography color="text.primary" sx={{ fontSize: '12px', fontWeight: 600 }}>Settings</Typography>
        </Breadcrumbs>
        <Typography variant="h1">Account Settings</Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
              <Avatar 
                src={user?.image} 
                sx={{ width: 120, height: 120, border: '4px solid white', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} 
              />
              <IconButton 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: 0, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
                size="small"
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="h3">{user?.firstName} {user?.lastName}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Administrator</Typography>
            <Button variant="outlined" fullWidth sx={{ mb: 1 }}>Change Password</Button>
            <Button variant="text" color="error" fullWidth>Deactivate Account</Button>
          </Paper>
        </Grid>

        {/* Details Section */}
        <Grid xs={12} md={8}>
          <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
              <Typography variant="h3" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PersonIcon sx={{ color: 'primary.main' }} /> General Information
              </Typography>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
                  <TextField fullWidth label="First Name" defaultValue={user?.firstName} size="small" />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField fullWidth label="Last Name" defaultValue={user?.lastName} size="small" />
                </Grid>
                <Grid xs={12}>
                  <TextField fullWidth label="Email Address" defaultValue={user?.email} size="small" />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h3" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Notifications sx={{ color: 'primary.main' }} /> Notifications
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel 
                  control={<Switch checked={notifications.email} onChange={(e) => setNotifications({...notifications, email: e.target.checked})} />} 
                  label="Email Notifications" 
                />
                <FormControlLabel 
                  control={<Switch checked={notifications.push} onChange={(e) => setNotifications({...notifications, push: e.target.checked})} />} 
                  label="Push Notifications" 
                />
                <FormControlLabel 
                  control={<Switch checked={notifications.sms} onChange={(e) => setNotifications({...notifications, sms: e.target.checked})} />} 
                  label="SMS Alerts" 
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" startIcon={<Save />}>Save Changes</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

// Simple fallback for PersonIcon if it's not imported
function PersonIcon(props: any) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
