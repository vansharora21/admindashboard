'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Avatar, 
  Divider, 
  Button, 
  Breadcrumbs,
  Link as MuiLink,
  Card,
  CardContent,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Email from '@mui/icons-material/Email';
import Phone from '@mui/icons-material/Phone';
import LocationOn from '@mui/icons-material/LocationOn';
import Business from '@mui/icons-material/Business';
import Person from '@mui/icons-material/Person';
import Cake from '@mui/icons-material/Cake';
import Wc from '@mui/icons-material/Wc';
import { useParams, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  const { getUserById } = useUserStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserById(id as string);
      setUser(data);
      setLoading(false);
    };
    fetchUser();
  }, [id, getUserById]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Typography>User not found</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pb: 6 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Breadcrumbs sx={{ mb: 1 }}>
            <MuiLink component={Link} href="/dashboard" underline="hover" color="inherit" sx={{ fontSize: '12px' }}>Dashboard</MuiLink>
            <MuiLink component={Link} href="/dashboard/users" underline="hover" color="inherit" sx={{ fontSize: '12px' }}>Users</MuiLink>
            <Typography color="text.primary" sx={{ fontSize: '12px', fontWeight: 600 }}>{user.firstName} {user.lastName}</Typography>
          </Breadcrumbs>
          <Typography variant="h1">User Profile</Typography>
        </Box>
        <Button 
          variant="outlined"
          startIcon={<ArrowBack />} 
          onClick={() => router.back()}
          sx={{ borderRadius: '10px' }}
        >
          Back to List
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 4, 
              borderRadius: '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 3,
              background: `linear-gradient(135deg, #ffffff 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
              border: '1px solid',
              borderColor: alpha('#e2e8f0', 0.6),
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Avatar 
                src={user.image} 
                sx={{ 
                  width: 140, 
                  height: 140, 
                  border: '6px solid white', 
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)' 
                }} 
              />
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 5, 
                  right: 5, 
                  width: 24, 
                  height: 24, 
                  bgcolor: 'success.main', 
                  borderRadius: '50%', 
                  border: '3px solid white' 
                }} 
              />
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ mb: 0.5 }}>{user.firstName} {user.lastName}</Typography>
              <Typography variant="body1" color="text.secondary" fontWeight={600}>@{user.username}</Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Chip label="Verified" color="success" size="small" variant="soft" sx={{ fontWeight: 700 }} />
                <Chip label={user.role || 'Admin'} color="primary" size="small" variant="soft" sx={{ fontWeight: 700 }} />
              </Box>
            </Box>
            
            <Divider sx={{ width: '100%' }} />
            
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 36, height: 36 }}>
                  <Email fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Email Address</Typography>
                  <Typography variant="body2" fontWeight={700}>{user.email}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981', width: 36, height: 36 }}>
                  <Phone fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Phone Number</Typography>
                  <Typography variant="body2" fontWeight={700}>{user.phone}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b', width: 36, height: 36 }}>
                  <LocationOn fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Location</Typography>
                  <Typography variant="body2" fontWeight={700}>{user.address?.city}, {user.address?.state}</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Detailed Info */}
        <Grid xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Personal Details */}
            <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid', borderColor: alpha('#e2e8f0', 0.6) }}>
              <Typography variant="h3" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Person sx={{ color: 'primary.main' }} /> Personal Information
              </Typography>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: alpha('#f8fafc', 0.8), borderRadius: '16px' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>BIRTH DATE</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                      <Cake sx={{ color: 'primary.main', opacity: 0.6 }} />
                      <Typography variant="body1" fontWeight={700}>{user.birthDate}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: alpha('#f8fafc', 0.8), borderRadius: '16px' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>GENDER</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                      <Wc sx={{ color: 'primary.main', opacity: 0.6 }} />
                      <Typography variant="body1" fontWeight={700} sx={{ textTransform: 'capitalize' }}>{user.gender}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: alpha('#f8fafc', 0.8), borderRadius: '16px' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>PHYSICAL STATS</Typography>
                    <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Height</Typography>
                        <Typography variant="body2" fontWeight={700}>{user.height} cm</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Weight</Typography>
                        <Typography variant="body2" fontWeight={700}>{user.weight} kg</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Eye Color</Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ textTransform: 'capitalize' }}>{user.eyeColor}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Professional Details */}
            <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid', borderColor: alpha('#e2e8f0', 0.6) }}>
              <Typography variant="h3" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Business sx={{ color: 'primary.main' }} /> Professional Details
              </Typography>
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: '20px', border: '1px dashed', borderColor: 'primary.light' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <Avatar variant="rounded" sx={{ width: 64, height: 64, bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
                    <Business sx={{ fontSize: 32, color: 'primary.main' }} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>{user.company?.name}</Typography>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>{user.company?.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                      {user.company?.department} Department &bull; {user.company?.address?.address}, {user.company?.address?.city}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
