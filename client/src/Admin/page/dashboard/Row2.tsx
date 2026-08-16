import {
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DownloadOutlined } from "@mui/icons-material";
import Line from "../../page/lineChart/Line";
import type { AdminDashboardMetrics } from "@/api/commerce";

interface Props {
  metrics: AdminDashboardMetrics | null;
}

const Row2 = ({ metrics }: Props) => {
  const theme = useTheme();
  const transactions = metrics?.recent_transactions ?? [];

  return (
    <Stack
      direction={{ xs: "column", sm: "column", md: "row" }}
      flexWrap="wrap"
      gap={{ xs: 1.5, sm: 2, md: 2 }}
      mt={1.3}
      justifyContent="space-between"
      alignItems={{ xs: "center", md: "stretch" }}
    >
      <Paper
        sx={{
          flexGrow: 1,
          width: "100%",
          minWidth: { xs: "100%", sm: "100%", md: "380px" },
          maxWidth: { md: "900px" },
          p: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        <Stack alignItems="center" direction="row" flexWrap="wrap" justifyContent="space-between">
          <Box>
            <Typography
              color={theme.palette.secondary.main}
              mb={0.5}
              mt={1}
              ml={{ xs: 1, sm: 2, md: 4 }}
              variant="h6"
              fontSize={{ xs: "14px", sm: "16px", md: "18px" }}
              fontWeight="bold"
            >
              Revenue Generated
            </Typography>
            <Typography
              variant="body2"
              ml={{ xs: 1, sm: 2, md: 4 }}
              fontSize={{ xs: "12px", sm: "13px", md: "14px" }}
            >
              {metrics ? `${metrics.total_sales.toFixed(2)} $` : "Loading..."}
            </Typography>
          </Box>
          <IconButton sx={{ mr: { xs: 1, sm: 2, md: 3 } }} aria-label="Download revenue data">
            <DownloadOutlined />
          </IconButton>
        </Stack>
        <Line isDahboard points={metrics?.revenue_by_day} />
      </Paper>

      <Box
        sx={{
          borderRadius: "4px",
          minWidth: { xs: "100%", sm: "100%", md: "280px" },
          maxHeight: 355,
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        <Paper>
          <Typography
            color={theme.palette.secondary.main}
            fontWeight="bold"
            p={1.2}
            variant="h6"
            fontSize={{ xs: "14px", sm: "16px", md: "18px" }}
          >
            Recent Transactions
          </Typography>
        </Paper>

        {transactions.length === 0 && (
          <Paper sx={{ mt: 0.4, p: 2 }}>
            <Typography color="text.secondary">No transactions yet.</Typography>
          </Paper>
        )}

        {transactions.map((item) => (
          <Paper
            key={item.id}
            sx={{
              mt: 0.4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              p: { xs: 0.8, sm: 1 },
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap fontSize={{ xs: "11px", sm: "13px", md: "14px" }}>
                #{item.id} · {item.customer}
              </Typography>
              <Typography color="text.secondary" fontSize={{ xs: "10px", sm: "12px", md: "13px" }}>
                {new Date(item.date).toLocaleDateString()} · {item.items_count} items
              </Typography>
            </Box>
            <Typography
              borderRadius={1.4}
              p={{ xs: 0.6, sm: 0.8, md: 1 }}
              bgcolor={item.status === "completed" ? theme.palette.success.main : theme.palette.warning.main}
              color={theme.palette.getContrastText(item.status === "completed" ? theme.palette.success.main : theme.palette.warning.main)}
              fontSize={{ xs: "10px", sm: "12px", md: "13px" }}
              whiteSpace="nowrap"
            >
              ${item.amount.toFixed(2)}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Stack>
  );
};

export default Row2;
