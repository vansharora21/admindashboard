'use client';

import React from 'react';
import { Box, CircularProgress, Typography, alpha } from '@mui/material';
import School from '@mui/icons-material/School';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

export default function LoadingSpinner({ fullScreen = false, message = 'Initializing...' }: LoadingSpinnerProps) {
  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress 
          size={80} 
          thickness={2} 
          sx={{ 
            color: alpha('#1a237e', 0.1),
            position: 'absolute'
          }} 
          variant="determinate"
          value={100}
        />
        <CircularProgress 
          size={80} 
          thickness={2} 
          sx={{ 
            color: 'primary.main',
            animationDuration: '1.5s',
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            animation: 'pulse 2s infinite ease-in-out',
            '@keyframes pulse': {
              '0%': { transform: 'scale(0.95)', opacity: 0.8 },
              '50%': { transform: 'scale(1.05)', opacity: 1 },
              '100%': { transform: 'scale(0.95)', opacity: 0.8 },
            }
          }}
        >
          <School sx={{ fontSize: 32, color: 'primary.main' }} />
        </Box>
      </Box>
      {message && (
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 700, 
            color: 'text.primary',
            letterSpacing: '0.5px',
            opacity: 0.8
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
          width: '100vw', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: '#f8fafc',
          zIndex: 9999,
          position: 'fixed',
          top: 0,
          left: 0
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box sx={{ py: 12, width: '100%', display: 'flex', justifyContent: 'center' }}>
      {content}
    </Box>
  );
}
