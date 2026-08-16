import { Box, LinearProgress, Paper, Stack, Typography, useTheme } from "@mui/material";
import Pie from "../../page/pieChart/pie";
import Bar from "../../page/barChart/bar";
import type { AdminDashboardMetrics } from "@/api/commerce";

interface Props {
  metrics: AdminDashboardMetrics | null;
}

const Row3 = ({ metrics }: Props) => {
  const theme = useTheme();
  const categories = metrics?.sales_by_category ?? [];
  const maxCategoryValue = Math.max(...categories.map((item) => item.revenue), 1);

  return (
    <Stack
      gap={{ xs: 1.5, sm: 2, md: 2 }}
      direction={{ xs: "column", sm: "column", md: "row" }}
      flexWrap="wrap"
      mt={1.4}
      justifyContent="space-between"
      alignItems={{ xs: "center", md: "stretch" }}
    >
      <Paper sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: "100%", md: "300px" }, width: { md: "32%", lg: "30%" }, p: { xs: 1, sm: 1.5, md: 2 } }}>
        <Typography color={theme.palette.secondary.main} sx={{ padding: { xs: "15px 15px 0 15px", md: "30px 30px 0 30px" } }} variant="h6" fontWeight="600" fontSize={{ xs: "14px", sm: "16px", md: "18px" }}>
          Order Status
        </Typography>
        <Pie isDashbord data={metrics?.status_breakdown} />
        <Typography variant="body2" align="center" pb={2} fontSize={{ xs: "11px", sm: "12px", md: "14px" }}>
          {metrics ? `${metrics.total_orders} total orders` : "Loading..."}
        </Typography>
      </Paper>

      <Paper sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: "100%", md: "300px" }, width: { md: "32%", lg: "33%" }, p: { xs: 1, sm: 1.5, md: 2 } }}>
        <Typography color={theme.palette.secondary.main} variant="h6" fontWeight="600" sx={{ padding: { xs: "15px 15px 0 15px", md: "30px 30px 0 30px" } }} fontSize={{ xs: "14px", sm: "16px", md: "18px" }}>
          Top Products by Quantity
        </Typography>
        <Bar isDashbord products={metrics?.top_products} />
      </Paper>

      <Paper sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: "100%", md: "300px" }, width: { md: "32%", lg: "33%" }, p: { xs: 2, sm: 2.5, md: 3 } }}>
        <Typography color={theme.palette.secondary.main} variant="h6" fontWeight="600" mb={2} fontSize={{ xs: "14px", sm: "16px", md: "18px" }}>
          Sales by Category
        </Typography>
        {categories.length === 0 && <Typography color="text.secondary">No completed sales yet.</Typography>}
        <Stack gap={1.5}>
          {categories.slice(0, 6).map((category) => (
            <Box key={category.id}>
              <Stack direction="row" justifyContent="space-between" gap={1}>
                <Typography noWrap fontSize={{ xs: "12px", md: "13px" }}>{category.label}</Typography>
                <Typography fontWeight="bold" fontSize={{ xs: "12px", md: "13px" }}>{category.revenue.toFixed(2)} $</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={(category.revenue / maxCategoryValue) * 100} sx={{ mt: 0.5, height: 7, borderRadius: 4 }} />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Row3;
