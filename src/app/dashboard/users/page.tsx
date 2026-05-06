'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination, 
  TextField, 
  InputAdornment, 
  Avatar, 
  Chip,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  alpha,
  Button,
  Tooltip,
  Divider
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import FilterList from '@mui/icons-material/FilterList';
import MoreVert from '@mui/icons-material/MoreVert';
import Mail from '@mui/icons-material/Mail';
import Phone from '@mui/icons-material/Phone';
import Business from '@mui/icons-material/Business';
import Add from '@mui/icons-material/Add';
import { useUserStore } from '@/store/useUserStore';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UsersPage() {
  const { users, total, loading, fetchUsers } = useUserStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const loadData = useCallback(() => {
    fetchUsers(rowsPerPage, page * rowsPerPage, searchTerm);
  }, [page, rowsPerPage, searchTerm, fetchUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, searchTerm ? 500 : 0);
    return () => clearTimeout(timer);
  }, [loadData, searchTerm]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pb: 4 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 3 }}>
        <Box>
          <Breadcrumbs sx={{ mb: 1 }}>
            <MuiLink component={Link} href="/dashboard" underline="hover" color="inherit" sx={{ fontSize: '12px' }}>
              Dashboard
            </MuiLink>
            <Typography color="text.primary" sx={{ fontSize: '12px', fontWeight: 600 }}>Users</Typography>
          </Breadcrumbs>
          <Typography variant="h1">User Directory</Typography>
          <Typography variant="body1" color="text.secondary">Manage and monitor all platform members.</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
          <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: '12px', px: 3 }}>
            Invite User
          </Button>
          <IconButton sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
            <FilterList />
          </IconButton>
        </Box>
      </Box>

      {/* Search & Stats Bar */}
      <Paper sx={{ p: 2, borderRadius: '20px', display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center', bgcolor: alpha('#fff', 0.6), backdropFilter: 'blur(10px)', border: '1px solid', borderColor: alpha('#e2e8f0', 0.6) }}>
        <TextField
          placeholder="Search by name, email or company..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            flexGrow: 1, 
            '& .MuiOutlinedInput-root': { bgcolor: 'white' }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'primary.main', opacity: 0.5 }} />
                </InputAdornment>
              ),
            }
          }}
        />
        <Box sx={{ display: 'flex', gap: 4, px: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL USERS</Typography>
            <Typography variant="h6" fontWeight={800}>{total}</Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>ACTIVE NOW</Typography>
            <Typography variant="h6" fontWeight={800} color="success.main">{Math.floor(total * 0.4)}</Typography>
          </Box>
        </Box>
      </Paper>

      {loading ? (
        <LoadingSpinner message="Synchronizing user data..." />
      ) : isMobile ? (
        /* Mobile Card Layout */
        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid xs={12} key={user.id}>
              <Card 
                onClick={() => router.push(`/dashboard/users/${user.id}`)} 
                sx={{ 
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: alpha('#e2e8f0', 0.6),
                  '&:hover': { cursor: 'pointer', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' },
                  transition: 'all 0.2s'
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '16px !important' }}>
                  <Avatar 
                    src={user.image} 
                    sx={{ width: 60, height: 60, border: '3px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{user.firstName} {user.lastName}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{user.email}</Typography>
                    <Chip label={user.company.name} size="small" variant="soft" sx={{ fontSize: '10px', fontWeight: 700 }} />
                  </Box>
                  <IconButton size="small"><Visibility fontSize="small" color="primary" /></IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Desktop Table Layout */
        <Paper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid', borderColor: alpha('#e2e8f0', 0.6) }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha('#f8fafc', 1) }}>
                  <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '12px', py: 2.5 }}>USER IDENTITY</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '12px' }}>COMMUNICATION</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '12px' }}>GENDER</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '12px' }}>ORGANIZATION</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '12px' }} align="right">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow 
                    key={user.id} 
                    hover 
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.01) } }}
                    onClick={() => router.push(`/dashboard/users/${user.id}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={user.image} sx={{ width: 44, height: 44, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>{user.firstName} {user.lastName}</Typography>
                          <Typography variant="caption" color="text.secondary">UID-{user.id}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Mail sx={{ fontSize: 14, color: 'primary.main', opacity: 0.6 }} />
                          <Typography variant="body2" fontWeight={600}>{user.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone sx={{ fontSize: 14, color: 'primary.main', opacity: 0.6 }} />
                          <Typography variant="caption">{user.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.gender} 
                        size="small" 
                        variant="soft"
                        sx={{ 
                          fontWeight: 800, 
                          textTransform: 'uppercase',
                          fontSize: '10px',
                          bgcolor: user.gender === 'male' ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.secondary.main, 0.08),
                          color: user.gender === 'male' ? 'primary.main' : 'secondary.main'
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{user.company.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{user.company.title}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="View Profile">
                          <IconButton size="small" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                            <Visibility fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small">
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: '1px solid', borderColor: 'divider' }}
          />
        </Paper>
      )}
      
      {/* Mobile Pagination */}
      {isMobile && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
    </Box>
  );
}
