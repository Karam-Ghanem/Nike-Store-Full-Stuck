import { useEffect, useState } from "react";
import { Alert, CircularProgress, Stack } from "@mui/material";
import Header from "../../components/Header/Header";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";
import { commerceApi, type AdminDashboardMetrics } from "@/api/commerce";

const Dashboard = () => {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    void commerceApi.getAdminDashboard()
      .then((data) => {
        if (active) setMetrics(data);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Header isDashboard={true} title="DASHBOARD" subTitle="Welcome to your dashboard" />
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>Unable to load dashboard data. Please refresh and try again.</Alert>}
      {!metrics && !error && <Stack alignItems="center" py={4}><CircularProgress /></Stack>}
      <Row1 metrics={metrics} />
      <Row2 metrics={metrics} />
      <Row3 metrics={metrics} />
    </div>
  );
};

export default Dashboard;
