import { Paper, Stack, Typography, useTheme } from "@mui/material";
import Pie from "../../page/pieChart/pie";
import Bar from "../../page/barChart/bar";
import Geo from "../../page/geography/geo";

const Row3 = () => {
  const theme = useTheme();

  return (
    <Stack
      gap={{ xs: 1.5, sm: 2, md: 2 }}
      direction={{ xs: "column", sm: "column", md: "row" }}
      flexWrap="wrap"
      mt={1.4}
      justifyContent="space-between"
      alignItems={{ xs: "center", md: "stretch" }}
    >
      {/* PIE CARD */}
      <Paper
        sx={{
          flexGrow: 1,
          minWidth: { xs: "100%", sm: "100%", md: "300px" },
          width: { md: "32%", lg: "30%" },
          p: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        <Typography
          color={theme.palette.secondary.main}
          sx={{ padding: { xs: "15px 15px 0 15px", md: "30px 30px 0 30px" } }}
          variant="h6"
          fontWeight="600"
          fontSize={{ xs: "14px", sm: "16px", md: "18px" }}
        >
          Campaign
        </Typography>

        <Pie isDashbord={true} />

        <Typography
          variant="h6"
          align="center"
          sx={{ mt: "15px" }}
          fontSize={{ xs: "13px", sm: "15px", md: "17px" }}
        >
          $48,352 revenue generated
        </Typography>

        <Typography
          variant="body2"
          px={0.7}
          pb={3}
          align="center"
          fontSize={{ xs: "11px", sm: "12px", md: "14px" }}
        >
          Includes extra misc expenditures and costs
        </Typography>
      </Paper>

      {/* BAR CARD */}
      <Paper
        sx={{
          flexGrow: 1,
          minWidth: { xs: "100%", sm: "100%", md: "300px" },
          width: { md: "32%", lg: "33%" },
          p: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        <Typography
          color={theme.palette.secondary.main}
          variant="h6"
          fontWeight="600"
          sx={{ padding: { xs: "15px 15px 0 15px", md: "30px 30px 0 30px" } }}
          fontSize={{ xs: "14px", sm: "16px", md: "18px" }}
        >
          Sales Quantity
        </Typography>

        <Bar isDashbord={true} />
      </Paper>

      {/* GEO CARD */}
      <Paper
        sx={{
          flexGrow: 1,
          minWidth: { xs: "100%", sm: "100%", md: "300px" },
          width: { md: "32%", lg: "33%" },
          p: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        <Geo isDashbord={true} />
      </Paper>
    </Stack>
  );
};

export default Row3;
