import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Card from './card';
import EmailIcon from '@mui/icons-material/Email';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TrafficIcon from '@mui/icons-material/Traffic';
import { data1, data2, data3, data4 } from './data';
import { commerceApi, type AdminDashboardMetrics } from '@/api/commerce';

const Row1 = () => {
  const theme = useTheme();
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);

  useEffect(() => {
    void commerceApi.getAdminDashboard().then(setMetrics).catch(() => undefined);
  }, []);

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      flexWrap="wrap"
      gap={{ xs: 1.5, sm: 2, md: 2 }}
      justifyContent={{ xs: 'center', sm: 'space-between' }}
      alignItems="center"
    >
      <Card
        icon={<EmailIcon sx={{ fontSize: { xs: '22px', sm: '24px', md: '26px' }, color: theme.palette.secondary.main }} />}
        title={metrics ? String(metrics.total_reviews) : '—'}
        subTitle="Reviews"
        increase="Live"
        data={data1}
        scheme="nivo"
      />
      <Card
        icon={<PointOfSaleIcon sx={{ fontSize: { xs: '22px', sm: '24px', md: '26px' }, color: theme.palette.secondary.main }} />}
        title={metrics ? `${metrics.total_sales.toFixed(2)} $` : '—'}
        subTitle="Sales obtained"
        increase="Live"
        data={data2}
        scheme="category10"
      />
      <Card
        icon={<PersonAddIcon sx={{ fontSize: { xs: '22px', sm: '24px', md: '26px' }, color: theme.palette.secondary.main }} />}
        title={metrics ? String(metrics.total_users) : '—'}
        subTitle="Registered users"
        increase="Live"
        data={data3}
        scheme="accent"
      />
      <Card
        icon={<TrafficIcon sx={{ fontSize: { xs: '22px', sm: '24px', md: '26px' }, color: theme.palette.secondary.main }} />}
        title={metrics ? String(metrics.active_products) : '—'}
        subTitle="Active products"
        increase="Live"
        data={data4}
        scheme="dark2"
      />
    </Stack>
  );
};

export default Row1;
