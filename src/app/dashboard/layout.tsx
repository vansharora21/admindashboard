'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  Toolbar, 
  SpeedDial, 
  SpeedDialAction, 
  SpeedDialIcon,
  alpha,
  useTheme
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import PersonAdd from '@mui/icons-material/PersonAdd';
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';
import Assessment from '@mui/icons-material/Assessment';
import { useAuthStore } from '@/store/useAuthStore';

const drawerWidth = 260;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sync Zustand with NextAuth Session
  useEffect(() => {
    if (status === 'authenticated' && session?.user && !isAuthenticated) {
      // @ts-ignore
      login(session.user, (session.user as any).token || 'mock-token');
    }
  }, [status, session, login, isAuthenticated]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <LoadingSpinner fullScreen />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const actions = [
    { icon: <PersonAdd />, name: 'Add User', onClick: () => router.push('/dashboard/users') },
    { icon: <AddShoppingCart />, name: 'Add Product', onClick: () => router.push('/dashboard/products') },
    { icon: <Assessment />, name: 'New Report', onClick: () => {} },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar /> {/* Spacer for the fixed AppBar */}
        <Box sx={{ flexGrow: 1, maxWidth: '1600px', width: '100%', mx: 'auto' }}>
          {children}
        </Box>
      </Box>

      {/* Premium Quick Action SpeedDial */}
      {!pathname.includes('login') && (
        <SpeedDial
          ariaLabel="Quick Actions"
          sx={{ position: 'fixed', bottom: 32, right: 32 }}
          icon={<SpeedDialIcon />}
          FabProps={{
            sx: {
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
              boxShadow: '0 8px 32px rgba(26, 35, 126, 0.4)'
            }
          }}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
              sx={{
                '& .MuiSpeedDialAction-fab': {
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    transform: 'scale(1.1)' 
                  },
                  transition: 'all 0.2s'
                }
              }}
            />
          ))}
        </SpeedDial>
      )}
    </Box>
  );
}
