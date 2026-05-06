'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  TextField, 
  InputAdornment, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Card,
  CardContent,
  Pagination,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  alpha,
  useTheme,
  Stack,
  Zoom
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import Add from '@mui/icons-material/Add';
import Star from '@mui/icons-material/Star';
import Close from '@mui/icons-material/Close';
import Inventory from '@mui/icons-material/Inventory';
import CloudUpload from '@mui/icons-material/CloudUpload';
import Info from '@mui/icons-material/Info';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import { useProductStore } from '@/store/useProductStore';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const { products, total, loading, categories, fetchProducts, fetchCategories } = useProductStore();
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [newProduct, setNewProduct] = useState({ title: '', category: '', price: '', stock: '', description: '' });

  const loadData = useCallback(() => {
    fetchProducts(rowsPerPage, (page - 1) * rowsPerPage, searchTerm, selectedCategory);
  }, [page, rowsPerPage, searchTerm, selectedCategory, fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, searchTerm ? 500 : 0);
    return () => clearTimeout(timer);
  }, [loadData, searchTerm]);

  const handleAddProduct = () => {
    setOpenModal(false);
    setSnackbar({ open: true, message: 'New academic item listed successfully!' });
    setNewProduct({ title: '', category: '', price: '', stock: '', description: '' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pb: 6 }}>
      {/* Premium Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 3 }}>
        <Box>
          <Breadcrumbs sx={{ mb: 1 }}>
            <MuiLink component={Link} href="/dashboard" underline="hover" color="inherit" sx={{ fontSize: '12px' }}>Dashboard</MuiLink>
            <Typography color="text.primary" sx={{ fontSize: '12px', fontWeight: 600 }}>Academic Catalog</Typography>
          </Breadcrumbs>
          <Typography variant="h1" sx={{ fontSize: '2.5rem' }}>Resource Inventory</Typography>
          <Typography variant="body1" color="text.secondary">Comprehensive management of educational tools and materials.</Typography>
        </Box>
        
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => setOpenModal(true)}
          sx={{ 
            px: 4, 
            py: 1.5,
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)',
            boxShadow: '0 8px 20px -6px rgba(26, 35, 126, 0.5)',
            '&:hover': { transform: 'scale(1.02)', boxShadow: '0 12px 28px -8px rgba(26, 35, 126, 0.6)' }
          }}
        >
          Add New Item
        </Button>
      </Box>

      {/* Modern Filter Dock */}
      <Paper sx={{ p: 2, borderRadius: '24px', display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', bgcolor: alpha('#fff', 0.8), backdropFilter: 'blur(10px)', border: '1px solid', borderColor: alpha('#e2e8f0', 0.6) }}>
        <TextField
          placeholder="Search items by name or keywords..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 400 }, '& .MuiOutlinedInput-root': { bgcolor: 'white', borderRadius: '14px' } }}
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
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <Select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            sx={{ borderRadius: '14px', bgcolor: 'white' }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat} sx={{ textTransform: 'capitalize' }}>{cat.replace(/-/g, ' ')}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Chip label={`${total} Total Items`} sx={{ fontWeight: 800, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: '10px', height: 36 }} />
      </Paper>

      {loading ? (
        <LoadingSpinner message="Scanning inventory database..." />
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card 
                onClick={() => router.push(`/dashboard/products/${product.id}`)}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: 'white',
                  borderRadius: '24px',
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }
                }}
              >
                <Box sx={{ position: 'relative', pt: '100%', bgcolor: '#f8fafc', borderRadius: '24px 24px 0 0' }}>
                  <Box 
                    component="img"
                    src={product.thumbnail}
                    sx={{ position: 'absolute', top: '15%', left: '15%', width: '70%', height: '70%', objectFit: 'contain' }}
                  />
                  <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
                    <Chip 
                      icon={<Star sx={{ fontSize: '14px !important', color: '#f59e0b' }} />} 
                      label={product.rating} 
                      size="small" 
                      sx={{ bgcolor: 'white', fontWeight: 800, border: '1px solid', borderColor: 'divider' }} 
                    />
                  </Box>
                </Box>
                <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {product.category}
                    </Typography>
                    <Typography variant="h3" sx={{ color: '#1a237e', fontSize: '1.25rem' }}>${product.price}</Typography>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3, height: 42, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {product.title}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                    <Chip label={`${product.stock} Units`} size="small" variant="soft" sx={{ fontSize: '10px', fontWeight: 800 }} />
                    <Chip label="Ready to Ship" size="small" variant="soft" color="success" sx={{ fontSize: '10px', fontWeight: 800 }} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination Container */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination count={Math.ceil(total / rowsPerPage)} page={page} onChange={(e, v) => setPage(v)} color="primary" sx={{ '& .MuiPaginationItem-root': { fontWeight: 700, borderRadius: '12px' } }} />
      </Box>

      {/* ADD ITEM DIALOG - PREMIUM VERSION */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        maxWidth="md" 
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{ sx: { borderRadius: '32px', p: 1, boxShadow: '0 40px 80px rgba(0,0,0,0.2)' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 4 }}>
          <Box>
            <Typography variant="h2" sx={{ fontSize: '1.75rem', mb: 0.5 }}>List New Item</Typography>
            <Typography variant="body2" color="text.secondary">Enter resource specifications for the academic catalog.</Typography>
          </Box>
          <IconButton onClick={() => setOpenModal(false)} sx={{ bgcolor: '#f1f5f9' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>ITEM TITLE</Typography>
                  <TextField fullWidth placeholder="e.g. Advanced Calculus Workbook" value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>CATEGORY</Typography>
                  <FormControl fullWidth>
                    <Select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}>
                      {categories.map(cat => <MenuItem key={cat} value={cat} sx={{ textTransform: 'capitalize' }}>{cat}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </Grid>
            <Grid xs={12} md={6}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>PRICING ($)</Typography>
                  <TextField fullWidth type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} slotProps={{ input: { startAdornment: <InputAdornment position="start"><MonetizationOn sx={{ color: 'primary.main' }} /></InputAdornment> } }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>INITIAL STOCK</Typography>
                  <TextField fullWidth type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Inventory sx={{ color: 'primary.main' }} /></InputAdornment> } }} />
                </Box>
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>PRODUCT DESCRIPTION</Typography>
                <TextField fullWidth multiline rows={4} placeholder="Describe the resource features and academic utility..." />
              </Box>
            </Grid>
            <Grid xs={12}>
              <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed', borderWeight: 2, bgcolor: alpha(theme.palette.primary.main, 0.01), cursor: 'pointer', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.03) } }}>
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2, opacity: 0.5 }} />
                <Typography variant="subtitle2" fontWeight={700}>Upload Resource Media</Typography>
                <Typography variant="caption" color="text.secondary">Drag and drop high-res images here</Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 4, gap: 2 }}>
          <Button onClick={() => setOpenModal(false)} variant="outlined" sx={{ borderRadius: '12px', px: 4 }}>Discard</Button>
          <Button onClick={handleAddProduct} variant="contained" disabled={!newProduct.title} sx={{ borderRadius: '12px', px: 6 }}>Confirm Listing</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: '14px', fontWeight: 600 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
