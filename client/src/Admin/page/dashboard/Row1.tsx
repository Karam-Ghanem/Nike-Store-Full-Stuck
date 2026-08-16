import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Card from './card';
import EmailIcon from '@mui/icons-material/Email';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TrafficIcon from '@mui/icons-material/Traffic';
import type { AdminDashboardMetrics } from '@/api/commerce';

interface Props {
  metrics: AdminDashboardMetrics | null;
}

const metricPie = (value: number, id: string) => [
  { id, label: id, value: Math.max(value, 1) },
  { id: 'remaining', label: 'Remaining', value: 1 },
];

const Row1 = ({ metrics }: Props) => {
  const theme = useTheme();
  const value = (key: keyof AdminDashboardMetrics) => Number(metrics?.[key] ?? 0);

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
        data={metricPie(value('total_reviews'), 'reviews')}
        scheme="nivo"
      />
      <Card
        icon={<PointOfSaleIcon sx={{ fontSize: { xs: '22px', sm: '24px', md: '26px' }, color: theme.palette.secondary.main }} />}
        title={metrics ? `${metrics.total_sales.toFixed(2)} $` : '—'}
        subTitle="Sales obtained"
        increase="Live"
        data={metricPie(value('total_sales'), 'sales')}
        scheme="category10"
      />
      <Card
        icon={<PersonAddIcon sx={{ fontSize: { xs: '22px', sm: '24px', md: '26px' }, color: theme.palette.secondary.main }} />}
        title={metrics ? String(metrics.total_users) : '—'}
        subTitle="Registered users"
        increase="Live"
        data={metricPie(value('total_users'), 'users')}
        scheme="accent"
      />
      <Card
        icon={<TrafficIcon sx={{ fontSize: { xs: '22px', sm: '24px', md: '26px' }, color: theme.palette.secondary.main }} />}
        title={metrics ? String(metrics.active_products) : '—'}
        subTitle="Active products"
        increase="Live"
        data={metricPie(value('active_products'), 'products')}
        scheme="dark2"
      />
    </Stack>
  );
};

export default Row1;
