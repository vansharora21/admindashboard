'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  InputAdornment, 
  Alert,
  alpha,
  useTheme,
  CircularProgress
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Lock from '@mui/icons-material/Lock';
import Person from '@mui/icons-material/Person';
import School from '@mui/icons-material/School';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const [username, setUsername] = useState('admin'); 
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // STATIC LOGIN BYPASS (Commenting out real API auth as requested)
    /*
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.token) {
        setError(data.message || 'Invalid credentials.');
        setLoading(false);
        return;
      }
      const result = await signIn('credentials', { username, password, redirect: false });
      if (result?.error) {
        setError('Auth service error.');
        setLoading(false);
      } else {
        login(data, data.token);
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Connection error.');
      setLoading(false);
    }
    */

    // MOCK SUCCESSFUL LOGIN
    setTimeout(async () => {
      const mockUser = {
        id: 1,
        username: username,
        email: 'admin@studyabroad.com',
        firstName: 'System',
        lastName: 'Administrator',
        gender: 'other',
        image: 'https://robohash.org/admin.png',
        token: 'static-mock-token-12345'
      };

      // Still try to sign in to NextAuth but with mock logic handled in authOptions
      await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      login(mockUser, mockUser.token);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: '#0f172a',
        position: 'relative',
        overflow: 'hidden',
        p: 3
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%', 
          background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
          zIndex: 0
        }} 
      />
      
      <Box 
        sx={{ 
          position: 'absolute', 
          width: '60vw', 
          height: '60vw', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(26, 35, 126, 0.15) 0%, transparent 70%)',
          top: '-15%',
          left: '-15%',
          animation: 'float 25s infinite ease-in-out',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(5%, 8%)' }
          }
        }} 
      />
      <Box 
        sx={{ 
          position: 'absolute', 
          width: '50vw', 
          height: '50vw', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(0, 106, 106, 0.1) 0%, transparent 70%)',
          bottom: '-10%',
          right: '-10%',
          animation: 'float2 30s infinite ease-in-out',
          '@keyframes float2': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(-5%, -10%)' }
          }
        }} 
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 4, md: 6 }, 
            borderRadius: '32px', 
            bgcolor: alpha('#ffffff', 0.95),
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: alpha('#ffffff', 0.8),
            boxShadow: '0 40px 100px -20px rgba(0,0,0,0.4)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box 
              sx={{ 
                width: 64, 
                height: 64, 
                bgcolor: 'primary.main', 
                borderRadius: '18px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 3,
                boxShadow: '0 10px 25px -5px rgba(26, 35, 126, 0.4)',
                animation: 'pulse 3s infinite ease-in-out',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' }
                }
              }}
            >
              <School sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Typography variant="h1" sx={{ fontSize: '2.5rem', mb: 1, color: '#0f172a', fontWeight: 900 }}>Welcome Back</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600, opacity: 0.8 }}>Admin Dashboard Access (Static Mode)</Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', ml: 1, mb: 1, display: 'block', letterSpacing: '0.8px' }}>
                ADMIN USERNAME
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter any username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    bgcolor: '#f8fafc',
                    '& fieldset': { borderColor: alpha('#e2e8f0', 1) },
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  }
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', ml: 1, mb: 1, display: 'block', letterSpacing: '0.8px' }}>
                SECURE PASSWORD
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    bgcolor: '#f8fafc',
                    '& fieldset': { borderColor: alpha('#e2e8f0', 1) },
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  }
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ 
                py: 2, 
                borderRadius: '16px', 
                fontSize: '1rem', 
                fontWeight: 800,
                mt: 2,
                background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)',
                boxShadow: '0 15px 30px -10px rgba(26, 35, 126, 0.4)',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 20px 40px -10px rgba(26, 35, 126, 0.5)' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Enter Dashboard'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
