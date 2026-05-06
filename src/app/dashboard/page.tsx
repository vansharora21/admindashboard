'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  alpha,
  useTheme,
  LinearProgress,
  Button,
  IconButton,
  Divider,
  Fade,
  Grow,
  Slide,
  Chip
} from '@mui/material';
import { BarChart, PieChart, LineChart } from '@mui/x-charts';
import People from '@mui/icons-material/People';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Assessment from '@mui/icons-material/Assessment';
import MoreVert from '@mui/icons-material/MoreVert';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { useUserStore } from '@/store/useUserStore';
import { useProductStore } from '@/store/useProductStore';
import Link from 'next/link';

export default function DashboardPage() {
  const theme = useTheme();
  const { total: totalUsers, fetchUsers } = useUserStore();
  const { total: totalProducts, products, fetchProducts } = useProductStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    fetchUsers(1, 0, '').catch(() => {});
    fetchProducts(20, 0, '', 'all').catch(() => {});
  }, [fetchUsers, fetchProducts]);

  // Derived data for charts with fallbacks for "Offline/Static" mode
  const displayProducts = products.length > 0 ? products : [
    { title: 'iPhone 15 Pro', price: 999, category: 'smartphones', thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg' },
    { title: 'MacBook Pro', price: 1999, category: 'laptops', thumbnail: 'https://cdn.dummyjson.com/product-images/6/thumbnail.jpg' },
    { title: 'Samsung Galaxy', price: 899, category: 'smartphones', thumbnail: 'https://cdn.dummyjson.com/product-images/2/thumbnail.jpg' },
    { title: 'Surface Laptop', price: 1499, category: 'laptops', thumbnail: 'https://cdn.dummyjson.com/product-images/8/thumbnail.jpg' },
  ];

  const categoryData = displayProducts.reduce((acc: any, product) => {
    const existing = acc.find((i: any) => i.label === product.category);
    if (existing) existing.value += 1;
    else acc.push({ label: product.category, value: 1 });
    return acc;
  }, []).slice(0, 6);

  const stats = [
    { label: 'Platform Users', value: totalUsers ? totalUsers.toLocaleString() : '2,480', icon: <People />, color: '#1a237e', trend: '+12.5%' },
    { label: 'Active Products', value: totalProducts ? totalProducts.toLocaleString() : '150', icon: <ShoppingCart />, color: '#006a6a', trend: '+4.2%' },
    { label: 'Monthly Revenue', value: '$128.4k', icon: <TrendingUp />, color: '#2e7d32', trend: '+18.7%' },
    { label: 'Service Quality', value: '98%', icon: <Assessment />, color: '#ed6c02', trend: '+1.5%' },
  ];

  if (!mounted) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, pb: 6 }}>
      {/* Welcome Header */}
      <Fade in timeout={800}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h1" sx={{ mb: 0.5, fontSize: { xs: '2rem', md: '2.5rem' } }}>Global Analytics</Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={500}>Comprehensive overview of platform performance and growth metrics.</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
            <Button variant="outlined" sx={{ borderRadius: '12px', flexGrow: { xs: 1, sm: 0 } }}>Download CSV</Button>
            <Button variant="contained" sx={{ borderRadius: '12px', px: 4, flexGrow: { xs: 1, sm: 0 } }}>Live Update</Button>
          </Box>
        </Box>
      </Fade>

      {/* Hero Stats */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid xs={12} sm={6} md={3} key={stat.label}>
            <Grow in timeout={800 + index * 200}>
              <Card 
                sx={{ 
                  height: '100%',
                  p: 1,
                  background: `linear-gradient(135deg, #ffffff 0%, ${alpha(stat.color, 0.03)} 100%)`,
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: alpha(stat.color, 0.1),
                  '&:hover': { transform: 'translateY(-6px)', boxShadow: `0 20px 40px ${alpha(stat.color, 0.1)}` },
                  transition: 'all 0.3s'
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Avatar sx={{ bgcolor: alpha(stat.color, 0.1), color: stat.color, borderRadius: '14px', width: 48, height: 48 }}>
                      {stat.icon}
                    </Avatar>
                    <Chip label={stat.trend} size="small" sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981', fontWeight: 800, fontSize: '10px' }} />
                  </Box>
                  <Typography variant="h2" sx={{ mb: 0.5, fontSize: '2.25rem' }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.65rem' }}>{stat.label}</Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* Main Charts Section */}
      <Grid container spacing={4}>
        <Grid xs={12} lg={8}>
          <Grow in timeout={1200}>
            <Paper 
              sx={{ 
                p: 4, 
                height: { xs: 400, md: 550 }, 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'white',
                border: '1px solid',
                borderColor: alpha('#e2e8f0', 0.6),
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                borderRadius: '32px'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                  <Typography variant="h3" sx={{ fontSize: '1.5rem', mb: 0.5 }}>Inventory Distribution</Typography>
                  <Typography variant="body2" color="text.secondary">Quantity of products across top performing categories</Typography>
                </Box>
                <IconButton><MoreVert /></IconButton>
              </Box>
              <Box sx={{ flexGrow: 1, width: '100%', minHeight: 300 }}>
                <BarChart
                  xAxis={[{ 
                    scaleType: 'band', 
                    data: categoryData.length ? categoryData.map(d => d.label) : ['Loading...'],
                    tickLabelStyle: { fontSize: 10, fontWeight: 600, fill: theme.palette.text.secondary }
                  }]}
                  series={[{ 
                    data: categoryData.length ? categoryData.map(d => d.value) : [0], 
                    color: '#1a237e',
                    label: 'Product Count'
                  }]}
                  borderRadius={8}
                  margin={{ top: 20, bottom: 40, left: 40, right: 20 }}
                />
              </Box>
            </Paper>
          </Grow>
        </Grid>
        <Grid xs={12} lg={4}>
          <Grow in timeout={1400}>
            <Paper 
              sx={{ 
                p: 4, 
                height: { xs: 450, md: 550 }, 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'white',
                border: '1px solid',
                borderColor: alpha('#e2e8f0', 0.6),
                borderRadius: '32px'
              }}
            >
              <Typography variant="h3" sx={{ fontSize: '1.5rem', mb: 0.5 }}>Category Split</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Market share by product category</Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PieChart
                  series={[
                    {
                      data: categoryData.length ? categoryData : [{ label: 'Empty', value: 1 }],
                      innerRadius: 90,
                      outerRadius: 140,
                      paddingAngle: 4,
                      cornerRadius: 10,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                    },
                  ]}
                  height={320}
                />
              </Box>
            </Paper>
          </Grow>
        </Grid>

        <Grid xs={12}>
          <Grow in timeout={1600}>
            <Paper sx={{ p: 4, bgcolor: 'white', border: '1px solid', borderColor: alpha('#e2e8f0', 0.6), borderRadius: '32px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                  <Typography variant="h3" sx={{ fontSize: '1.5rem', mb: 0.5 }}>Performance Trends</Typography>
                  <Typography variant="body2" color="text.secondary">New user acquisition and platform engagement</Typography>
                </Box>
                <Button variant="text" endIcon={<ArrowForward />} sx={{ fontWeight: 800 }}>Detailed Report</Button>
              </Box>
              <Box sx={{ height: 400, width: '100%' }}>
                <LineChart
                  xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], scaleType: 'point' }]}
                  series={[
                    {
                      data: [2, 5.5, 3, 8.5, 4, 7, 5, 9, 6, 11],
                      area: true,
                      color: alpha('#1a237e', 0.8),
                      label: 'Engagement Score'
                    },
                  ]}
                  height={350}
                  margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
                />
              </Box>
            </Paper>
          </Grow>
        </Grid>
      </Grid>

      {/* Catalog Spotlight */}
      <Slide direction="up" in timeout={1800}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h3" sx={{ fontSize: '1.5rem' }}>Inventory Spotlight</Typography>
            <Button component={Link} href="/dashboard/products" variant="outlined" size="small" sx={{ borderRadius: '10px' }}>View Full Catalog</Button>
          </Box>
          <Grid container spacing={3}>
            {displayProducts.slice(0, 4).map((product, idx) => (
              <Grid xs={12} sm={6} md={3} key={idx}>
                <Card sx={{ p: 0, overflow: 'hidden', border: '1px solid', borderColor: 'divider', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 15px 30px rgba(0,0,0,0.05)' }, transition: 'all 0.3s' }}>
                  <Box sx={{ display: 'flex', p: 2, gap: 2, alignItems: 'center' }}>
                    <Avatar src={product.thumbnail} variant="rounded" sx={{ width: 60, height: 60, bgcolor: '#f8fafc', border: '1px solid', borderColor: alpha('#e2e8f0', 0.5) }} />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={800} noWrap sx={{ fontSize: '0.9rem' }}>{product.title}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>{(product.category || 'item').toUpperCase()}</Typography>
                      <Typography variant="subtitle2" color="primary.main" fontWeight={900} sx={{ mt: 0.5 }}>${product.price}</Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Slide>
    </Box>
  );
}
