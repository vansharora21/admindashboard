'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  Rating, 
  Chip, 
  Divider, 
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  alpha,
  useTheme
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import LocalOffer from '@mui/icons-material/LocalOffer';
import Star from '@mui/icons-material/Star';
import Inventory from '@mui/icons-material/Inventory';
import Category from '@mui/icons-material/Category';
import Share from '@mui/icons-material/Share';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/store/useProductStore';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  const { getProductById } = useProductStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id as string);
      setProduct(data);
      if (data?.images?.length) setActiveImage(data.images[0]);
      setLoading(false);
    };
    fetchProduct();
  }, [id, getProductById]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!product) return <Typography>Product not found</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pb: 8 }}>
      {/* Header Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Breadcrumbs sx={{ mb: 1 }}>
            <MuiLink component={Link} href="/dashboard" underline="hover" color="inherit" sx={{ fontSize: '12px' }}>Dashboard</MuiLink>
            <MuiLink component={Link} href="/dashboard/products" underline="hover" color="inherit" sx={{ fontSize: '12px' }}>Products</MuiLink>
            <Typography color="text.primary" sx={{ fontSize: '12px', fontWeight: 600 }}>{product.title}</Typography>
          </Breadcrumbs>
          <Typography variant="h1">{product.title}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton sx={{ border: '1px solid', borderColor: 'divider' }}><Share fontSize="small" /></IconButton>
          <IconButton sx={{ border: '1px solid', borderColor: 'divider' }}><FavoriteBorder fontSize="small" /></IconButton>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            onClick={() => router.back()}
            sx={{ borderRadius: '10px' }}
          >
            Back
          </Button>
        </Box>
      </Box>

      <Grid container spacing={5}>
        {/* Visuals Section */}
        <Grid xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: '24px', 
                bgcolor: '#f8fafc', 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 450,
                border: '1px solid',
                borderColor: alpha('#e2e8f0', 0.6),
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box 
                component="img"
                src={activeImage}
                sx={{ 
                  maxWidth: '100%', 
                  maxHeight: 400, 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))',
                  transition: 'all 0.3s ease'
                }}
              />
              <Chip 
                label={`-${product.discountPercentage}% OFF`} 
                color="error" 
                sx={{ position: 'absolute', top: 20, left: 20, fontWeight: 800, borderRadius: '8px' }} 
              />
            </Paper>
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 1 }}>
              {product.images?.map((img: string, idx: number) => (
                <Box 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '12px', 
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: activeImage === img ? 'primary.main' : 'transparent',
                    p: 1,
                    bgcolor: 'white',
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                >
                  <img src={img} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Content Section */}
        <Grid xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip icon={<Category sx={{ fontSize: '16px !important' }} />} label={product.category.toUpperCase()} size="small" variant="soft" sx={{ fontWeight: 700 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ color: '#f59e0b', fontSize: 18 }} />
                  <Typography variant="body2" fontWeight={700}>{product.rating}</Typography>
                  <Typography variant="caption" color="text.secondary">(120 Reviews)</Typography>
                </Box>
              </Box>
              <Typography variant="h1" sx={{ fontSize: '2.5rem', mb: 2, lineHeight: 1.2 }}>{product.title}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>{product.description}</Typography>
            </Box>

            <Divider />

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1 }}>
                <Typography variant="h2" sx={{ fontSize: '2.5rem', color: 'primary.main' }}>
                  ${product.price}
                </Typography>
                <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'text.secondary', opacity: 0.6 }}>
                  ${(product.price * (1 + product.discountPercentage/100)).toFixed(2)}
                </Typography>
              </Box>
              <Typography variant="caption" color="success.main" fontWeight={700}>FREE SHIPPING WORLDWIDE</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <Box sx={{ p: 2, borderRadius: '16px', bgcolor: alpha(theme.palette.primary.main, 0.05), border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.1) }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Inventory sx={{ fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="caption" fontWeight={700}>AVAILABILITY</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={700}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}</Typography>
                  </Box>
                </Grid>
                <Grid xs={6}>
                  <Box sx={{ p: 2, borderRadius: '16px', bgcolor: alpha('#10b981', 0.05), border: '1px solid', borderColor: alpha('#10b981', 0.1) }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocalOffer sx={{ fontSize: 18, color: '#10b981' }} />
                      <Typography variant="caption" fontWeight={700}>BRAND</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={700}>{product.brand || 'Generic'}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" size="large" fullWidth sx={{ py: 2, borderRadius: '14px' }}>Add to Inventory</Button>
              <Button variant="outlined" size="large" fullWidth sx={{ py: 2, borderRadius: '14px' }}>Edit Details</Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
